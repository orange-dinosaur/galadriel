import Editor from '@/components/editor/editor';
import axiosInstance from '@/lib/axiosInstance';
import { FullDocument } from '@/lib/custom-types';

export default async function DocumentId({
    params,
}: {
    params: Promise<{ projectId: string; documentId: string }>;
}) {
    const projectId = (await params).projectId;
    const documentId = (await params).documentId;

    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/projects/${projectId}/documents/${documentId}`,
        'get'
    );

    if (response.data.status && response.data.status !== 200) {
        return (
            <div>
                <div>DOCUMENT {documentId} NOT FOUND</div>
            </div>
        );
    }

    const fullDocument = FullDocument.fromObject(response.data.fullDocument);

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
