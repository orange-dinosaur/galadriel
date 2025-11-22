'use server';

import { user } from '@/auth/user';
import { cookies } from 'next/headers';
import { DbResponse } from '@/db/response';
import { ID, Query } from 'node-appwrite';
import {
    DbDocumentRow,
    DbProjectRow,
    FileMetadata,
    FullDocument,
    DbDraftRow,
    FullDraft,
} from '@/lib/custom-types';
import { ulid } from 'ulid';

export const createNewDraft = async (
    projectId: string,
    documentId: string
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

        // check that the document exists and that the user owns it
        queries.length = 0;
        queries.push(Query.equal('$id', documentId));
        queries.push(Query.equal('projectId', projectId));
        queries.push(Query.limit(1));

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

        // create file
        const fileId = ID.unique();
        const draftTitle = 'draft_' + fileId + '_' + ulid();
        const createdFile = await storage.createFile({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: fileId,
            file: new File(
                [
                    new Blob([JSON.stringify(fileContentJson)], {
                        type: 'application/json',
                    }),
                ],
                draftTitle + '.json',
                {
                    type: 'application/json',
                }
            ),
        });

        // create draft in the db
        const createdDraft = await database.createRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DRAFTS || '',
            rowId: ID.unique(),
            data: {
                userId: authenticatedUser.$id,
                documentId: documentId,
                fileIdMain: documents[0].fileId || '',
                fileIdDraft: createdFile.$id,
            },
        });

        // update drafts inside the document
        const drafts = documents[0].drafts ?? [];
        drafts.push(createdDraft.$id);
        await database.updateRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            rowId: documentId,
            data: {
                drafts: drafts,
            },
        });

        return new DbResponse(200, 'Draft created successfully');
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const getDraftById = async (
    projectId: string,
    documentId: string,
    draftId: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        const queries: string[] = [];
        queries.push(Query.equal('$id', draftId));
        queries.push(Query.equal('documentId', documentId));
        queries.push(Query.limit(1));

        // get the draft
        const draftRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DRAFTS || '',
            queries: queries,
        });
        const drafts = DbDraftRow.fromObject(draftRows.rows);

        if (drafts.length === 0) {
            return new DbResponse(404, 'Draft not found');
        }

        // if the user is not the document owner check if the project is public
        if (authenticatedUser?.$id !== drafts[0].userId) {
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
            fileId: drafts[0].fileIdDraft || '',
        });
        const fileContent = await storage.getFileView({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: drafts[0].fileIdDraft || '',
        });

        const fileContentJson = JSON.parse(
            new TextDecoder().decode(fileContent)
        );

        const fullDraft = new FullDraft(
            drafts[0],
            FileMetadata.fromObject(fileMetadata),
            fileContentJson
        );

        return new DbResponse(200, 'OK', fullDraft);
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const updateDraftById = async (
    projectId: string,
    documentId: string,
    draftId: string,
    editorContent: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        const queries: string[] = [];
        queries.push(Query.equal('$id', draftId));
        queries.push(Query.equal('documentId', documentId));
        queries.push(Query.limit(1));

        // get the draft
        const draftRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DRAFTS || '',
            queries: queries,
        });
        const drafts = DbDraftRow.fromObject(draftRows.rows);
        if (drafts.length === 0) {
            return new DbResponse(404, 'Document not found');
        }

        if (authenticatedUser?.$id !== drafts[0].userId) {
            return new DbResponse(403, 'Access DENIED');
        }

        if (editorContent) {
            // get the name of the draft to delete
            const fileMetadata = await storage.getFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: drafts[0].fileIdDraft || '',
            });
            const draftTitle = fileMetadata.name.split('.')[0];

            // delete the previous version of the file and create a new one with the same fileId
            await storage.deleteFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: drafts[0].fileIdDraft || '',
            });

            await storage.createFile({
                bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
                fileId: drafts[0].fileIdDraft || '',
                file: new File(
                    [
                        new Blob([JSON.stringify(editorContent)], {
                            type: 'application/json',
                        }),
                    ],
                    draftTitle + '.json',
                    {
                        type: 'application/json',
                    }
                ),
            });
        }

        return new DbResponse(200, 'Draft updated successfully');
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const DeleteDraftById = async (
    projectId: string,
    documentId: string,
    draftId: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        const queries: string[] = [];
        queries.push(Query.equal('$id', draftId));
        queries.push(Query.equal('documentId', documentId));
        queries.push(Query.limit(1));

        // get the document
        const draftRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DRAFTS || '',
            queries: queries,
        });
        const drafts = DbDraftRow.fromObject(draftRows.rows);

        if (drafts.length === 0) {
            return new DbResponse(404, 'Draft not found');
        }

        if (authenticatedUser?.$id !== drafts[0].userId) {
            return new DbResponse(403, 'Access DENIED');
        }

        // delete the file
        await storage.deleteFile({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: drafts[0].fileIdDraft || '',
        });

        // delete the document
        await database.deleteRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DRAFTS || '',
            rowId: draftId,
        });

        return new DbResponse(200, 'Draft deleted successfully');
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};

export const mergeDraftById = async (
    projectId: string,
    documentId: string,
    draftId: string
): Promise<DbResponse> => {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database, storage } =
            await user.getUserAndDbAndStorage();

        const queries: string[] = [];
        queries.push(Query.equal('$id', draftId));
        queries.push(Query.equal('documentId', documentId));
        queries.push(Query.limit(1));

        // get the draft
        const draftRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DRAFTS || '',
            queries: queries,
        });
        const drafts = DbDraftRow.fromObject(draftRows.rows);

        if (drafts.length === 0) {
            return new DbResponse(404, 'Draft not found');
        }

        if (authenticatedUser?.$id !== drafts[0].userId) {
            return new DbResponse(403, 'Access DENIED');
        }

        // get the draft content
        const draftContent = await storage.getFileView({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: drafts[0].fileIdDraft || '',
        });

        // get the document
        queries.length = 0;
        queries.push(Query.equal('$id', documentId));
        queries.push(Query.limit(1));
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromObject(docRows.rows);
        if (documents.length === 0) {
            return new DbResponse(404, 'Document not found');
        }

        // Delete old main file
        await storage.deleteFile({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: documents[0].fileId || '',
        });

        const draftFileMetadata = await storage.getFile({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: drafts[0].fileIdDraft || '',
        });

        await storage.createFile({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: documents[0].fileId || '',
            file: new File([draftContent], draftFileMetadata.name, {
                type: 'application/json',
            }),
        });

        // Now delete the draft
        await storage.deleteFile({
            bucketId: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID || '',
            fileId: drafts[0].fileIdDraft || '',
        });

        // Delete draft row
        await database.deleteRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DRAFTS || '',
            rowId: draftId,
        });

        // Update document drafts list
        const newDraftsList =
            documents[0].drafts?.filter((d) => d !== draftId) || [];
        await database.updateRow({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            rowId: documentId,
            data: {
                drafts: newDraftsList,
            },
        });

        return new DbResponse(200, 'Draft merged successfully');
    } catch {
        return new DbResponse(500, 'Internal server error');
    }
};
