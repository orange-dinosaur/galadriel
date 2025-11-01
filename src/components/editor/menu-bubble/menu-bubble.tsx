import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Button } from '@/components/ui/button';

type EditorBubbleMenuProps = {
    editor: Editor | null;
};

const EditorBubbleMenu = ({ editor }: EditorBubbleMenuProps) => {
    return (
        <>
            <BubbleMenu
                editor={editor ?? undefined}
                options={{
                    placement: 'top',
                    offset: 8,
                    flip: true,
                }}>
                <Button
                    className="cursor-pointer font-bold"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() => editor?.chain().focus().toggleBold().run()}>
                    B
                </Button>
                <Button
                    className="cursor-pointer italic font-serif"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                    }>
                    I
                </Button>
                <Button
                    className="cursor-pointer font-serif"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleBlockquote().run()
                    }>
                    Q
                </Button>
            </BubbleMenu>
        </>
    );
};

export default EditorBubbleMenu;
