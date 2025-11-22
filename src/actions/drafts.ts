'use server';

import {
    createNewDraft,
    DeleteDraftById,
    updateDraftById,
    mergeDraftById,
    getDraftById,
} from '@/db/drafts';
import { FullDraft } from '@/lib/custom-types';

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

    return { status: 200, message: 'File deleted' };
}

export async function mergeDraft(
    projectId: string,
    documentId: string,
    draftId: string
) {
    const response = await mergeDraftById(projectId, documentId, draftId);

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'Draft merged' };
}

export async function getDraft(
    projectId: string,
    documentId: string,
    draftId: string
) {
    const response = await getDraftById(projectId, documentId, draftId);

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    const draft = FullDraft.fromObject(response.data);
    const draftObject = draft.toObject();

    return { status: 200, data: draftObject };
}
