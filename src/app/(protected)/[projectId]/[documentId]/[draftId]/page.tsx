import Editor from '@/components/editor/editor';
import { getDocumentById } from '@/db/documents';
import { getDraftById } from '@/db/drafts';
import { FullDocument, FullDraft } from '@/lib/custom-types';

export default async function DocumentId({
    params,
}: {
    params: Promise<{ projectId: string; documentId: string; draftId: string }>;
}) {
    const projectId = (await params).projectId;
    const documentId = (await params).documentId;
    const draftId = (await params).draftId;

    const response = await getDraftById(projectId, documentId, draftId);

    if ((response.status && response.status !== 200) || !response.data) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-muted-foreground italic mb-8 text-5xl">
                    404 - Draft not found
                </p>
            </div>
        );
    }

    const fullDraft = FullDraft.fromObject(response.data);

    let content = fullDraft.fileContentJson;
    if (typeof content === 'string') {
        content = JSON.parse(content);
    }

    return (
        <div className="min-h-screen w-full">
            <Editor
                projectId={projectId}
                documentId={documentId}
                draftId={draftId}
                content={content}
            />
        </div>
    );
}
