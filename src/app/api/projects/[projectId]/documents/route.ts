import { user } from '@/auth/user';
import { DbProjectRow } from '@/lib/custom-types';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { ID, Query } from 'node-appwrite';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const projectId = (await params).projectId;

        const body: { title: string } = await request.json();

        if (!body.title) {
            return Response.json({
                status: 400,
                message: 'Title is required',
            });
        }

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
            return Response.json({
                status: 404,
                message: 'Project not found',
            });
        }
        if (authenticatedUser?.$id !== projects[0].userId) {
            return Response.json({
                status: 403,
                message: 'Access DENIED',
            });
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
                body.title + '.json',
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
                title: body.title,
                fileId: createdFile.$id,
            },
        });

        return Response.json({
            status: 200,
            message: 'Project created successfully',
        });
    } catch (error) {
        return Response.json({
            status: 500,
            message: 'Error while creating project',
        });
    }
}
