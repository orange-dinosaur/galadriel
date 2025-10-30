import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';

type EditorToolbarProps = {
    editor: Editor | null;
};

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
    return (
        <div className="mx-auto flex w-full max-w-[816px] justify-center items-center gap-3 px-6 pb-2">
            <Button
                className="cursor-pointer font-bold"
                variant={'outline'}
                size={'sm'}
                onClick={() => editor?.chain().focus().toggleBold().run()}>
                B
            </Button>
            <Button
                className="cursor-pointer italic font-serif"
                variant={'outline'}
                size={'sm'}
                onClick={() => editor?.chain().focus().toggleItalic().run()}>
                I
            </Button>
        </div>
    );
};

export default EditorToolbar;
