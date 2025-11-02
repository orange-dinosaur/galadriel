'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import {
    TextStyle,
    FontFamily,
    TextStyleKit,
    Color,
} from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import { ScrollArea } from '@/components/ui/scroll-area';
import EditorToolbar from '@/components/editor/toolbar/toolbar';
import EditorBubbleMenu from '@/components/editor/menu-bubble/menu-bubble';
import EditorFloatingMenu from '@/components/editor/menu-floating/menu-floating';
import { defaultFontFamily } from '@/components/editor/text-style/fonts';
import { defaultFontColor } from '@/components/editor/text-style/colors';
import { useEffect } from 'react';

type EditorProps = {
    content: string;
};

/* TODO: Define better sheet measures and render for mobile */
/* TODO: Fix image resize */
const Editor = ({ content }: EditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            TextStyleKit,
            FontFamily.configure({
                types: ['textStyle'],
            }),
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            TableKit,
            Image,
            ImageResize,
            /* TODO: Extend link configuration */
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
            }),
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

    /* Set default font and color */
    useEffect(() => {
        if (editor) {
            editor.chain().setFontFamily(defaultFontFamily).run();
            editor.chain().setColor(defaultFontColor).run();
        }
    }, [editor, defaultFontFamily, defaultFontColor]);

    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="sticky top-(--header-height,0px) z-40 w-full bg-background">
                <EditorToolbar editor={editor} />
            </div>

            {editor && <EditorBubbleMenu editor={editor} />}

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
