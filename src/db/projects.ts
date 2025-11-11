import { user } from '@/auth/user';
import { cookies } from 'next/headers';
import { ID, Query } from 'node-appwrite';
import { DbResponse } from '@/db/response';
import {
    DbDocumentRow,
    DbProjectRow,
    Project,
    UserData,
} from '@/lib/custom-types';
import { getDocumentTemplate } from '@/db/document-templates';

export type NewProjectProps = {
    userId?: string;
    name: string;
    private: boolean;
    image: string;
    type: string;
    tags?: string[];
    description?: string;
};

export type UpdateProjectProps = {
    name?: string;
    private?: boolean;
    image?: string;
    type?: string;
    tags?: string[];
    description?: string;
};

const defaultProjectDocs = ['Document'];

/**
 * Returns the appropriate document templates based on project type
 */
const getProjectDocsByType = (projectType: string): string[] => {
    switch (projectType.toLowerCase()) {
        case 'novel':
            return [
                'Title page',
                'Synopsis',
                'Text',
                'Characters',
                'World building',
                'Plot outline',
                'Research notes',
            ];

        case 'screenplay':
            return [
                'Title page',
                'Logline',
                'Treatment',
                'Act 1',
                'Act 2',
                'Act 3',
                'Characters',
                'Scene breakdown',
            ];

        case 'article':
            return [
                'Title',
                'Abstract',
                'Introduction',
                'Body',
                'Conclusion',
                'References',
                'Notes',
            ];

        case 'other':
        default:
            return defaultProjectDocs;
    }
};

/**
 * Sorts documents to display default project documents in their template order first,
 * followed by user-added documents sorted by creation date (oldest first)
 */
const sortDocumentsByTemplateOrder = (
    documents: DbDocumentRow[],
    projectType: string
): DbDocumentRow[] => {
    const templateDocs = getProjectDocsByType(projectType);
    const templateMap = new Map<string, number>();
    templateDocs.forEach((docName, index) => {
        templateMap.set(docName, index);
    });

    // Separate template documents from user-added documents
    const templateDocuments: DbDocumentRow[] = [];
    const userAddedDocuments: DbDocumentRow[] = [];

    documents.forEach((doc) => {
        if (templateMap.has(doc.title)) {
            templateDocuments.push(doc);
        } else {
            userAddedDocuments.push(doc);
        }
    });

    // Sort template documents by their order in the template
    templateDocuments.sort((a, b) => {
        const indexA = templateMap.get(a.title) ?? Number.MAX_SAFE_INTEGER;
        const indexB = templateMap.get(b.title) ?? Number.MAX_SAFE_INTEGER;
        return indexA - indexB;
    });

    // Sort user-added documents by creation date (oldest first)
    userAddedDocuments.sort(
        (a, b) => a.$createdAt.getTime() - b.$createdAt.getTime()
    );

    return [...templateDocuments, ...userAddedDocuments];
};

export const createNewProject = async (
    props: NewProjectProps
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        // create project in the db
        const projectToCreate: NewProjectProps = {
            userId: authenticatedUser.$id,
            name: props.name,
            private: props.private,
            image: props.image,
            type: props.type,
        };
        if (props.tags) projectToCreate.tags = props.tags;
        if (props.description) projectToCreate.description = props.description;

        const project = await database.createRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            rowId: ID.unique(),
            data: projectToCreate,
        });

        const projectDocs = getProjectDocsByType(props.type);

        await Promise.all(
            projectDocs.map(async (docName) => {
                // Get template content for this document
                const templateContent = getDocumentTemplate(
                    docName,
                    props.type
                );

                // create file
                const fileId = ID.unique();
                const createdFile = await storage.createFile({
                    bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                    fileId: fileId,
                    file: new File(
                        [
                            new Blob([JSON.stringify(templateContent)], {
                                type: 'application/json',
                            }),
                        ],
                        docName + '.json',
                        {
                            type: 'application/json',
                        }
                    ),
                });

                // create document in the db
                await database.createRow({
                    databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
                    tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
                    rowId: ID.unique(),
                    data: {
                        userId: authenticatedUser.$id,
                        projectId: project.$id,
                        title: docName,
                        fileId: createdFile.$id,
                    },
                });
            })
        );

        return new DbResponse(200, 'Project created successfully');
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const getProjectById = async (
    projectId: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database } = await user.getUserAndDb();

        const queries: string[] = [];
        queries.push(Query.equal('$id', projectId));

        const projectRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            queries: queries,
        });
        const projects = DbProjectRow.fromObject(projectRows.rows);

        if (projects.length === 0) {
            return new DbResponse(404, 'Project not found');
        }

        if (projects[0].private) {
            if (authenticatedUser?.$id !== projects[0].userId) {
                return new DbResponse(403, 'Access DENIED');
            }
        }

        queries.length = 0;
        queries.push(Query.equal('projectId', projectId));

        // get all user documents
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromObject(docRows.rows);

        // Sort documents by template order
        const sortedDocuments = sortDocumentsByTemplateOrder(
            documents,
            projects[0].type
        );

        const project = new Project(projects[0], sortedDocuments);

        return new DbResponse(200, 'OK', project);
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const updateProjectById = async (
    projectId: string,
    newProjectData: UpdateProjectProps
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database } = await user.getUserAndDb();

        // get the user project and then update it
        const projectRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID as string,
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS as string,
            queries: [Query.equal('$id', projectId)],
        });
        const projects = DbProjectRow.fromObject(projectRows.rows);

        if (projects.length === 0) {
            return new DbResponse(404, 'Project not found');
        }

        if (authenticatedUser?.$id !== projects[0].userId) {
            return new DbResponse(403, 'Access DENIED');
        }

        const calculatedPrivateValue =
            'private' in newProjectData
                ? newProjectData.private
                : projects[0].private;

        await database.updateRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            rowId: projectId,
            data: {
                name: newProjectData.name
                    ? newProjectData.name
                    : projects[0].name,
                private: calculatedPrivateValue,
                image: newProjectData.image
                    ? newProjectData.image
                    : projects[0].image,
                type: newProjectData.type
                    ? newProjectData.type
                    : projects[0].type,
                tags: newProjectData.tags
                    ? newProjectData.tags
                    : projects[0].tags,
                description: newProjectData.description
                    ? newProjectData.description
                    : projects[0].description,
            },
        });

        return new DbResponse(200, 'Project updated successfully');
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const DeleteProjectById = async (
    projectId: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        // get the user project and then update it
        const projectRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID as string,
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS as string,
            queries: [Query.equal('$id', projectId)],
        });
        const projects = DbProjectRow.fromObject(projectRows.rows);

        if (projects.length === 0) {
            return new DbResponse(404, 'Project not found');
        }

        if (authenticatedUser?.$id !== projects[0].userId) {
            return new DbResponse(403, 'Access DENIED');
        }

        const queries: string[] = [];
        queries.push(Query.equal('projectId', projectId));
        queries.push(Query.equal('userId', authenticatedUser.$id));

        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromObject(docRows.rows);

        // delete the project
        await database.deleteRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            rowId: projectId,
        });

        /* TODO: try to understand why batch delete does not work */
        documents.map(async (document) => {
            await database.deleteRow({
                databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
                tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
                rowId: document.$id,
            });

            await storage.deleteFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: document.fileId || '',
            });
        });

        return new DbResponse(200, 'Project deleted successfully');
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const getAllProjectsOfUser = async (
    userId: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database } = await user.getUserAndDb();

        const queries: string[] = [];
        queries.push(Query.equal('userId', userId));
        queries.push(Query.orderDesc('$updatedAt'));
        if (authenticatedUser?.$id !== userId) {
            queries.push(Query.equal('public', true));
        }

        // get the user projects
        const projectRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            queries: queries,
        });
        const projects = DbProjectRow.fromObject(projectRows.rows);

        if (projects.length === 0) {
            return new DbResponse(404, 'No projects found');
        }

        queries.length = 0;
        queries.push(
            Query.contains(
                'projectId',
                projects.map((project) => project.$id)
            )
        );
        queries.push(Query.equal('userId', userId));

        // get all user documents
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromObject(docRows.rows);

        const projectsObject: Project[] = [];
        projects.map((project) => {
            const projectDocuments = documents.filter(
                (doc) => doc.projectId === project.$id
            );

            // Sort documents by template order
            const sortedDocuments = sortDocumentsByTemplateOrder(
                projectDocuments,
                project.type
            );

            projectsObject.push(new Project(project, sortedDocuments));
        });

        return new DbResponse(200, 'OK', projectsObject);
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};
