'use server';

import axiosInstance from '@/lib/axiosInstance';
import { newFileSchema } from './schemas';
import { NewFileFormState } from '@/lib/custom-types';

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

    console.log('projectId: ', projectId);
    console.log('fileName: ', validatedFields.data.fileName);

    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/projects/${projectId}/documents`,
        'post',
        {
            title: validatedFields.data.fileName,
        }
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.data.message };
    }

    return { status: 200, message: 'File updated' };
}

export async function updateFileContent(
    projectId: string,
    documentId: string,
    editorContent: string
) {
    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/projects/${projectId}/documents/${documentId}`,
        'patch',
        {
            editorContent: editorContent,
        }
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.data.message };
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

    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/projects/${projectId}/documents/${documentId}`,
        'patch',
        {
            fileName: validatedFields?.data?.fileName ?? '',
        }
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.data.message };
    }

    return { status: 200, message: 'File updated' };
}

export async function deleteFile(projectId: string, documentId: string) {
    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/projects/${projectId}/documents/${documentId}`,
        'delete'
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.data.message };
    }

    return { status: 200, message: 'File saved' };
}
