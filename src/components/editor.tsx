'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { TextStyle, FontFamily } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import { ScrollArea } from '@/components/ui/scroll-area';
import EditorToolbar from '@/components/editor-toolbar';
import EditorBubbleMenu from './editor-menu-bubble';
import EditorFloatingMenu from './editor-menu-floating';
import { useEditorState } from '@tiptap/react';

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
            FontFamily,
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

    const editorState = useEditorState({
        editor,

        // the selector function is used to select the state you want to react to
        selector: ({ editor }) => {
            if (!editor) return null;

            return {
                isEditable: editor.isEditable,
                currentSelection: editor.state.selection,
                currentContent: editor.getJSON(),

                isHeader1: editor.isActive('heading', { level: 1 }),
                isHeader2: editor.isActive('heading', { level: 2 }),
                isHeader3: editor.isActive('heading', { level: 3 }),

                isBold: editor.isActive('bold'),
                isItalic: editor.isActive('italic'),
                isUnderlined: editor.isActive('underline'),
                isBlockquote: editor.isActive('blockquote'),

                isBulletList: editor.isActive('bulletList'),
                isOrderedList: editor.isActive('orderedList'),
                isTaskList: editor.isActive('taskList'),
            };
        },
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
