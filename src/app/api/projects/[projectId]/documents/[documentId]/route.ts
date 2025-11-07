import { user } from '@/auth/user';
import {
    DbDocumentRow,
    DbProjectRow,
    FileMetadata,
    FullDocument,
} from '@/lib/custom-types';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { ID, Query } from 'node-appwrite';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string; documentId: string }> }
) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const projectId = (await params).projectId;
        const documentId = (await params).documentId;

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
            return Response.json({
                status: 404,
                message: 'Document not found',
            });
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
                return Response.json({
                    status: 404,
                    message: 'Document not found',
                });
            }
            if (projects[0].private) {
                return Response.json({
                    status: 403,
                    message: 'Access DENIED',
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
            FileMetadata.fromObject(fileMetadata),
            fileContentJson
        );

        return Response.json({ fullDocument });
    } catch (error) {
        return Response.json({ status: 403, message: 'Access DENIED' });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string; documentId: string }> }
) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const projectId = (await params).projectId;
        const documentId = (await params).documentId;

        const body: { fileName: string; editorContent: string } =
            await request.json();

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
            return Response.json({
                status: 404,
                message: 'Document not found',
            });
        }

        if (authenticatedUser?.$id !== documents[0].userId) {
            return Response.json({
                status: 403,
                message: 'Access DENIED',
            });
        }

        if (body.editorContent) {
            // delete the previous version of the file and create a new one with the same fileId
            await storage.deleteFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: documents[0].fileId || '',
            });

            let documentTitle = documents[0].title;
            if (body.fileName) {
                documentTitle = body.fileName;

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
                        new Blob([JSON.stringify(body.editorContent)], {
                            type: 'application/json',
                        }),
                    ],
                    documentTitle + '.json',
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

            // update the document title in the db
            await database.updateRow({
                databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
                tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
                rowId: documentId,
                data: {
                    title: body.fileName,
                },
            });
        }

        return Response.json({
            status: 200,
            message: 'File updated successfully',
        });
    } catch (error) {
        return Response.json({ status: 500, message: 'Something went wrong' });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string; documentId: string }> }
) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const projectId = (await params).projectId;
        const documentId = (await params).documentId;

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
            return Response.json({
                status: 404,
                message: 'Document not found',
            });
        }

        if (authenticatedUser?.$id !== documents[0].userId) {
            return Response.json({
                status: 403,
                message: 'Access DENIED',
            });
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

        return Response.json({
            status: 200,
            message: 'Document delete successfully',
        });
    } catch (error) {
        return Response.json({
            status: 500,
            message: 'Error while deleting document',
        });
    }
}
