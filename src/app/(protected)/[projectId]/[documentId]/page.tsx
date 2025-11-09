import Editor from '@/components/editor/editor';
import { getDocumentById } from '@/db/documents';
import axiosInstance from '@/lib/axiosInstance';
import { FullDocument } from '@/lib/custom-types';
import { get } from 'http';

export default async function DocumentId({
    params,
}: {
    params: Promise<{ projectId: string; documentId: string }>;
}) {
    const projectId = (await params).projectId;
    const documentId = (await params).documentId;

    const response = await getDocumentById(projectId, documentId);

    if ((response.status && response.status !== 200) || !response.data) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-muted-foreground italic mb-8 text-5xl">
                    404 - Document not found
                </p>
            </div>
        );
    }

    const fullDocument = FullDocument.fromObject(response.data);

    let content = fullDocument.fileContentJson;
    if (typeof content === 'string') {
        content = JSON.parse(content);
    }

    return (
        <div className="min-h-screen w-full">
            <Editor
                projectId={projectId}
                documentId={documentId}
                content={content}
            />
        </div>
    );
}
