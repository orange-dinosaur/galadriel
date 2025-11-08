import { user } from '@/auth/user';
import { cookies } from 'next/headers';
import { DbResponse } from '@/db/response';
import { ID, Query } from 'node-appwrite';
import {
    DbDocumentRow,
    DbProjectRow,
    FileMetadata,
    FullDocument,
} from '@/lib/custom-types';

export const createNewDocument = async (
    projectId: string,
    title: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        // check that the project exists and that the user owns it
        const queries: string[] = [];
        queries.push(Query.equal('$id', projectId));
        queries.push(Query.limit(1));

        const projectRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            queries: queries,
        });
        const projects = DbProjectRow.fromObject(projectRows.rows);
        if (projects.length === 0) {
            return new DbResponse(404, 'Project not found');
        }
        if (authenticatedUser?.$id !== projects[0].userId) {
            return new DbResponse(403, 'Access DENIED');
        }

        // create file
        const fileId = ID.unique();
        const createdFile = await storage.createFile({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: fileId,
            file: new File(
                [
                    new Blob(
                        [
                            JSON.stringify({
                                type: 'doc',
                                content: [{ type: 'paragraph' }],
                            }),
                        ],
                        {
                            type: 'application/json',
                        }
                    ),
                ],
                title + '.json',
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
                projectId: projectId,
                title: title,
                fileId: createdFile.$id,
            },
        });

        return new DbResponse(200, 'Document created successfully');
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const getDocumentById = async (
    projectId: string,
    documentId: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        const queries: string[] = [];
        queries.push(Query.equal('$id', documentId));
        queries.push(Query.equal('projectId', projectId));
        queries.push(Query.limit(1));

        // get the document
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromObject(docRows.rows);

        if (documents.length === 0) {
            return new DbResponse(404, 'Document not found');
        }

        // if the user is not the document owner check if the project is public
        if (authenticatedUser?.$id !== documents[0].userId) {
            queries.length = 0;
            queries.push(Query.equal('$id', projectId));
            queries.push(Query.limit(1));

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
                return new DbResponse(403, 'Access DENIED');
            }
        }

        // get the file metadata and file content
        const fileMetadata = await storage.getFile({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: documents[0].fileId || '',
        });
        const fileContent = await storage.getFileView({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: documents[0].fileId || '',
        });

        const fileContentJson = JSON.parse(
            new TextDecoder().decode(fileContent)
        );

        const fullDocument = new FullDocument(
            documents[0],
            FileMetadata.fromObject(fileMetadata),
            fileContentJson
        );

        return new DbResponse(200, 'OK', fullDocument);
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const updateDocumentById = async (
    projectId: string,
    documentId: string,
    fileName?: string,
    editorContent?: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        const queries: string[] = [];
        queries.push(Query.equal('$id', documentId));
        queries.push(Query.equal('projectId', projectId));
        queries.push(Query.limit(1));

        // get the document
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromObject(docRows.rows);
        if (documents.length === 0) {
            return new DbResponse(404, 'Document not found');
        }

        if (authenticatedUser?.$id !== documents[0].userId) {
            return new DbResponse(403, 'Access DENIED');
        }

        if (editorContent) {
            // delete the previous version of the file and create a new one with the same fileId
            await storage.deleteFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: documents[0].fileId || '',
            });

            let documentTitle = documents[0].title;
            if (fileName) {
                documentTitle = fileName;

                // update the document title in the db
                await database.updateRow({
                    databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
                    tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
                    rowId: documentId,
                    data: {
                        title: documentTitle,
                    },
                });
            }

            await storage.createFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: documents[0].fileId || '',
                file: new File(
                    [
                        new Blob([JSON.stringify(editorContent)], {
                            type: 'application/json',
                        }),
                    ],
                    documentTitle + '.json',
                    {
                        type: 'application/json',
                    }
                ),
            });
        } else if (fileName) {
            await storage.updateFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: documents[0].fileId || '',
                name: fileName,
            });

            // update the document title in the db
            await database.updateRow({
                databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
                tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
                rowId: documentId,
                data: {
                    title: fileName,
                },
            });
        }

        return new DbResponse(200, 'Document updated successfully');
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const DeleteDocumentById = async (
    projectId: string,
    documentId: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        const queries: string[] = [];
        queries.push(Query.equal('$id', documentId));
        queries.push(Query.equal('projectId', projectId));
        queries.push(Query.limit(1));

        // get the document
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromObject(docRows.rows);

        if (documents.length === 0) {
            return new DbResponse(404, 'Document not found');
        }

        if (authenticatedUser?.$id !== documents[0].userId) {
            return new DbResponse(403, 'Access DENIED');
        }

        // delete the file
        await storage.deleteFile({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: documents[0].fileId || '',
        });

        // delete the document
        await database.deleteRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            rowId: documentId,
        });

        return new DbResponse(200, 'Document deleted successfully');
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};
