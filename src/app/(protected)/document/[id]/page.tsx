import Editor from '@/components/editor/editor';
import axiosInstance from '@/lib/axiosInstance';
import { FullDocument } from '@/lib/custom-types';

export default async function DocumentId({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const documentId = (await params).id;

    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/documents/${documentId}`,
        'get'
    );

    if (response.data.status && response.data.status !== 200) {
        return (
            <div>
                <div>DOCUMENT {documentId} NOT FOUND</div>
            </div>
        );
    }

    const fullDocument = FullDocument.fromApiResponse(
        response.data.fullDocument
    );

    let content = fullDocument.fileContentJson;
    if (typeof content === 'string') {
        content = JSON.parse(content);
    }

    return (
        <div className="min-h-screen w-full">
            <Editor documentId={documentId} content={content} />
        </div>
    );
}
