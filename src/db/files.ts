'use server';

import axiosInstance from '@/lib/axiosInstance';

export async function updateFileContent(
    documentId: string,
    editorContent: string
) {
    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/documents/${documentId}`,
        'put',
        {
            editorContent: editorContent,
        }
    );

    if (response.status !== 200) {
        return { code: response.status, message: response.data.message };
    }

    return { code: 200, message: 'File saved' };
}

export async function updateFileName(documentId: string, fileName: string) {
    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/documents/${documentId}`,
        'update',
        {
            fileName: fileName,
        }
    );

    if (response.status !== 200) {
        return { code: response.status, message: response.data.message };
    }

    return { code: 200, message: 'File saved' };
}
