import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Button } from '@/components/ui/button';

type EditorBubbleMenuProps = {
    editor: Editor | undefined;
};

const EditorBubbleMenu = ({ editor }: EditorBubbleMenuProps) => {
    return (
        <>
            <BubbleMenu
                editor={editor}
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
            </BubbleMenu>
        </>
    );
};

export default EditorBubbleMenu;
