import { user } from '@/auth/user';
import {
    DbDocumentRow,
    DbProjectRow,
    FileMetadata,
    FullDocument,
} from '@/lib/custom-types';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const documentId = (await params).id;

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        const queries: string[] = [];
        queries.push(Query.equal('$id', documentId));
        queries.push(Query.limit(1));

        // get the document
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromApiResponse(docRows.rows);
        if (documents.length === 0) {
            return Response.json({
                message: 'Document not found',
                status: 404,
            });
        }

        // if the user is not the document owner check if the project is public
        if (authenticatedUser?.$id !== documents[0].userId) {
            queries.length = 0;
            queries.push(Query.equal('$id', documents[0].projectId));
            queries.push(Query.limit(1));

            const projectRows = await database.listRows({
                databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
                tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
                queries: queries,
            });
            const projects = DbProjectRow.fromApiResponse(projectRows.rows);
            if (projects.length === 0) {
                return Response.json({
                    message: 'Document not found',
                    status: 404,
                });
            }
            if (!projects[0].public) {
                return Response.json({
                    message: 'Access DENIED',
                    status: 403,
                });
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
            FileMetadata.fromApiResponse(fileMetadata),
            fileContentJson
        );

        return Response.json({ fullDocument });
    } catch (error) {
        return Response.json({ message: 'Access DENIED', status: 403 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const documentId = (await params).id;
        const body: { fileName: string; editorContent: string } =
            await request.json();

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        const queries: string[] = [];
        queries.push(Query.equal('$id', documentId));
        queries.push(Query.limit(1));

        // get the document
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromApiResponse(docRows.rows);
        if (documents.length === 0) {
            return Response.json({
                message: 'Document not found',
                status: 404,
            });
        }

        if (authenticatedUser?.$id !== documents[0].userId) {
            return Response.json({
                message: 'Access DENIED',
                status: 403,
            });
        }

        if (body.editorContent) {
            // delete the previous version of the file and create a new one with the same fileId
            await storage.deleteFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: documents[0].fileId || '',
            });
            await storage.createFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: documents[0].fileId || '',
                file: new File(
                    [
                        new Blob([JSON.stringify(body.editorContent)], {
                            type: 'application/json',
                        }),
                    ],
                    body.fileName
                        ? body.fileName + '.json'
                        : documents[0].title + '.json',
                    {
                        type: 'application/json',
                    }
                ),
            });
        } else if (body.fileName) {
            await storage.updateFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: documents[0].fileId || '',
                name: body.fileName,
            });
        }

        return Response.json({
            message: 'File updated successfully',
            status: 200,
        });
    } catch (error) {
        return Response.json({ message: 'Something went wrong', status: 500 });
    }
}
