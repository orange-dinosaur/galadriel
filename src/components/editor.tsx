'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import { ScrollArea } from '@/components/ui/scroll-area';
import EditorToolbar from '@/components/editor-toolbar';
import EditorBubbleMenu from './editor-menu-bubble';
import EditorFloatingMenu from './editor-menu-floating';

type EditorProps = {
    content: string;
};

/* TODO: Define better sheet measures and render for mobile */
/* TODO: Fix image resize */
const Editor = ({ content }: EditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            TableKit,
            Image,
            ImageResize,
        ],

        editorProps: {
            attributes: {
                class: 'w-[816px] min-h-[1054px] p-[56px] bg-white border border-primary text-black',
            },
        },

        content: content,

        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
    });

    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="sticky top-(--header-height,0px) z-40 w-full bg-background">
                <EditorToolbar editor={editor} />
            </div>

            {editor && editor.commands.focus() && (
                <EditorBubbleMenu editor={editor} />
            )}

            {editor && <EditorFloatingMenu editor={editor} />}

            <ScrollArea className="w-full flex-1">
                <div className="flex justify-center pt-2">
                    <EditorContent editor={editor} />
                </div>
            </ScrollArea>
        </div>
    );
};

export default Editor;
