import { Editor } from '@tiptap/react';
import { FloatingMenu } from '@tiptap/react/menus';
import { Button } from '@/components/ui/button';

type EditorFloatingMenuProps = {
    editor: Editor | null;
};

const EditorFloatingMenu = ({ editor }: EditorFloatingMenuProps) => {
    return (
        <>
            <FloatingMenu className="floating-menu bg-red-500" editor={editor}>
                <Button
                    className="cursor-pointer font-bold"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                    }>
                    H1
                </Button>
                <Button
                    className="cursor-pointer font-bold"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                    }>
                    H2
                </Button>
                <Button
                    className="cursor-pointer font-bold"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run()
                    }>
                    H3
                </Button>
                <Button
                    className="cursor-pointer font-bold"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleBlockquote().run()
                    }>
                    Q
                </Button>
                <Button
                    className="cursor-pointer font-bold"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                    }>
                    Bullet List
                </Button>
                <Button
                    className="cursor-pointer font-bold"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                    }>
                    Ordered List
                </Button>
                <Button
                    className="cursor-pointer font-bold"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleTaskList().run()
                    }>
                    Task List
                </Button>
            </FloatingMenu>
        </>
    );
};

export default EditorFloatingMenu;
