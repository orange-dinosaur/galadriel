import { user } from '@/auth/user';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { ID } from 'node-appwrite';

const defaultProjectDocs = [
    'Title page',
    'Synopsis',
    'Text',
    'Notes',
    'Characters',
];

export async function POST(request: NextRequest) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const body: {
            name: string;
            private: boolean;
            image: string;
            type: string;
            tags?: string[];
            description?: string;
        } = await request.json();

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        // create project in the db
        const projectToCreate: {
            userId: string;
            name: string;
            private: boolean;
            image: string;
            type: string;
            tags?: string[];
            description?: string;
        } = {
            userId: authenticatedUser.$id,
            name: body.name,
            private: body.private,
            image: body.image,
            type: body.type,
        };
        if (body.tags) projectToCreate.tags = body.tags;
        if (body.description) projectToCreate.description = body.description;
        const project = await database.createRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            rowId: ID.unique(),
            data: projectToCreate,
        });

        defaultProjectDocs.map(async (docName) => {
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
        });

        return Response.json({
            status: 200,
            message: 'Project created successfully',
        });
    } catch {
        return Response.json({
            status: 500,
            message: 'Error while creating project',
        });
    }
}
