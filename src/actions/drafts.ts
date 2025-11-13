'use server';

import { createNewDraft, DeleteDraftById, updateDraftById } from '@/db/drafts';

export async function createNewDraftFile(
    projectId: string,
    documentId: string
) {
    const response = await createNewDraft(
        projectId as string,
        documentId as string
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'File updated' };
}

export async function updateDraftFileContent(
    projectId: string,
    documentId: string,
    draftId: string,
    editorContent: string
) {
    const response = await updateDraftById(
        projectId,
        documentId,
        draftId,
        editorContent
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'File saved' };
}

export async function deleteDraftFile(
    projectId: string,
    documentId: string,
    draftId: string
) {
    const response = await DeleteDraftById(projectId, documentId, draftId);

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'File saved' };
}
