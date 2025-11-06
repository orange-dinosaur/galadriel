'use server';

import axiosInstance from '@/lib/axiosInstance';

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

export async function updateFileName(
    projectId: string,
    documentId: string,
    fileName: string
) {
    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/projects/${projectId}/documents/${documentId}`,
        'update',
        {
            fileName: fileName,
        }
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.data.message };
    }

    return { status: 200, message: 'File saved' };
}
