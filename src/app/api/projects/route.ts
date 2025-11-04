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

        const body: { name: string; private: boolean } = await request.json();

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        // create project in the db
        const project = await database.createRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            rowId: ID.unique(),
            data: {
                userId: authenticatedUser.$id,
                name: body.name,
                public: !body.private,
            },
        });

        defaultProjectDocs.map(async (docName) => {
            // create file
            const createdFile = await storage.createFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: ID.unique(),
                file: new File(
                    [
                        new Blob([JSON.stringify({})], {
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
            const document = await database.createRow({
                databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
                tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
                rowId: ID.unique(),
                data: {
                    userId: authenticatedUser.$id,
                    projectId: project.$id,
                    title: docName,
                    fileId: createdFile.$id,
                    version: 1,
                },
            });
        });

        return Response.json({
            message: 'Project created successfully',
            status: 200,
        });
    } catch (error) {
        return Response.json({
            message: 'Error while creating project',
            status: 500,
        });
    }
}
