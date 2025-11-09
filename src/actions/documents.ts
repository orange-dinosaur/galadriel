'use server';

import { newFileSchema } from '@/actions/schemas';
import { NewFileFormState } from '@/lib/custom-types';
import {
    createNewDocument,
    DeleteDocumentById,
    updateDocumentById,
} from '@/db/documents';

export async function createNewFile(initialState: any, formData: FormData) {
    const validatedFields = newFileSchema.safeParse({
        fileName: formData.get('fileName'),
    });

    const returnState: NewFileFormState = {
        fileName: validatedFields.data?.fileName,
    };

    if (!validatedFields.success) {
        // TODO: return only error message
        returnState.status = 400;
        returnState.message = validatedFields.error.message;
        return returnState;
    }

    const projectId = formData.get('projectId');
    if (!projectId) {
        returnState.status = 400;
        returnState.message = 'projectId and documentId are mandatory';
        return returnState;
    }

    const response = await createNewDocument(
        projectId as string,
        validatedFields.data.fileName as string
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'File updated' };
}

export async function updateFileContent(
    projectId: string,
    documentId: string,
    editorContent: string
) {
    const response = await updateDocumentById(
        projectId,
        documentId,
        undefined,
        editorContent
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'File saved' };
}

export async function updateFileName(initialState: any, formData: FormData) {
    const validatedFields = newFileSchema.safeParse({
        fileName: formData.get('fileName'),
    });

    const returnState: NewFileFormState = {
        fileName: validatedFields.data?.fileName,
    };

    const projectId = formData.get('projectId');
    const documentId = formData.get('documentId');
    if (!projectId || !documentId) {
        returnState.status = 400;
        returnState.message = 'projectId and documentId are mandatory';
        return returnState;
    }

    if (!validatedFields.success) {
        // TODO: return only error message
        returnState.status = 400;
        returnState.message = validatedFields.error.message;
        return returnState;
    }

    const response = await updateDocumentById(
        projectId as string,
        documentId as string,
        validatedFields.data.fileName as string
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'File updated' };
}

export async function deleteFile(projectId: string, documentId: string) {
    const response = await DeleteDocumentById(projectId, documentId);

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'File saved' };
}
