'use client';

import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { updateFileContent } from '@/actions/documents';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { updateDraftFileContent } from '@/actions/drafts';

type SaveProps = {
    projectId: string;
    documentId: string;
    draftId?: string;
    editor: Editor | null;
};

const ToolbarSave = ({ projectId, documentId, draftId, editor }: SaveProps) => {
    const [isPending, startTransition] = useTransition();

    const handleSave = () => {
        if (!editor) return;

        const editorContent = JSON.stringify(editor?.getJSON());

        startTransition(async () => {
            let response: { status?: number; message?: string } = {};
            if (!draftId) {
                response = await updateFileContent(
                    projectId,
                    documentId,
                    editorContent
                );
            } else {
                response = await updateDraftFileContent(
                    projectId,
                    documentId,
                    draftId,
                    editorContent
                );
            }

            if (response.status && response.status !== 200) {
                toast.error('Error saving document');
                return;
            } else {
                toast.success('Document saved successfully');
                return;
            }
        });
    };

    return (
        <Button
            className="cursor-pointer font-bold"
            variant={'ghost'}
            size={'sm'}
            onClick={handleSave}>
            <SaveIcon />
        </Button>
    );
};

export default ToolbarSave;
