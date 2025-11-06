'use client';

import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { updateFileContent } from '@/db/files';
import { toast } from 'sonner';
import { useTransition } from 'react';

type SaveProps = {
    projectId: string;
    documentId: string;
    editor: Editor | null;
};

const ToolbarSave = ({ projectId, documentId, editor }: SaveProps) => {
    const [isPending, startTransition] = useTransition();

    const handleSave = () => {
        if (!editor) return;

        const editorContent = JSON.stringify(editor?.getJSON());

        startTransition(async () => {
            const response = await updateFileContent(
                projectId,
                documentId,
                editorContent
            );

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
