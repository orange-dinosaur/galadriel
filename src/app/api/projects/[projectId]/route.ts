import { user } from '@/auth/user';
import { DbDocumentRow, DbProjectRow, UserData } from '@/lib/custom-types';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { Query } from 'node-appwrite';
import { map } from 'zod';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const projectId = (await params).projectId;

        const { authenticatedUser, database } = await user.getUserAndDb();

        const queries: string[] = [];
        queries.push(Query.equal('$id', projectId));

        // get the user project
        const projectRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            queries: queries,
        });
        const projects = DbProjectRow.fromObject(projectRows.rows);

        if (projects.length === 0) {
            return Response.json({ status: 404, message: 'Project not found' });
        }

        if (projects[0].private) {
            if (authenticatedUser?.$id !== projects[0].userId) {
                return Response.json({
                    status: 403,
                    message: 'Access DENIED',
                });
            }
        }

        queries.length = 0;
        queries.push(Query.equal('projectId', projectId));
        queries.push(Query.orderDesc('$updatedAt'));

        // get all user documents
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromObject(docRows.rows);

        const userData: UserData = UserData.fromDbSearchResult(
            projects,
            documents
        );

        return Response.json({ userData });
    } catch (error) {
        return Response.json({ status: 403, message: 'Access DENIED' });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const projectId = (await params).projectId;

        const body: {
            name: string;
            private: boolean;
            image: string;
            type: string;
            tags: string[];
            description: string;
        } = await request.json();

        if (!body) {
            return Response.json({
                status: 400,
                message: 'No fields in request body',
            });
        }

        const { authenticatedUser, database } = await user.getUserAndDb();

        // get the user project and then update it
        const projectRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID as string,
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS as string,
            queries: [Query.equal('$id', projectId)],
        });
        const projects = DbProjectRow.fromObject(projectRows.rows);

        if (projects.length === 0) {
            return Response.json({ status: 404, message: 'Project not found' });
        }

        if (authenticatedUser?.$id !== projects[0].userId) {
            return Response.json({ status: 403, message: 'Access DENIED' });
        }

        await database.updateRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            rowId: projectId,
            data: {
                name: body.name ? body.name : projects[0].name,
                private: body.private ? body.private : projects[0].private,
                image: body.image ? body.image : projects[0].image,
                type: body.type ? body.type : projects[0].type,
                tags: body.tags ? body.tags : projects[0].tags,
                description: body.description
                    ? body.description
                    : projects[0].description,
            },
        });

        return Response.json({
            status: 200,
            message: 'Project updated successfully',
        });
    } catch (error) {
        return Response.json({
            status: 500,
            message: 'Error while updating project',
        });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const projectId = (await params).projectId;

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
            return Response.json({ status: 404, message: 'Project not found' });
        }

        if (authenticatedUser?.$id !== projects[0].userId) {
            return Response.json({ status: 403, message: 'Access DENIED' });
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

        return Response.json({
            status: 200,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        return Response.json({
            status: 500,
            message: 'Error while deleting project',
        });
    }
}
