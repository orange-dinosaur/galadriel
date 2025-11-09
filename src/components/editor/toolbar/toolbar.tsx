import { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import ToolbarUndoRedo from '@/components/editor/toolbar/undo-redo';
import FontFamilySelection from '@/components/editor/toolbar/font-selection';
import ToolbarColors from '@/components/editor/toolbar/colors';
import ToolbarHeadings from '@/components/editor/toolbar/headings';
import ToolbarTextStyle from '@/components/editor/toolbar/text-style';
import ToolbarLists from '@/components/editor/toolbar/lists';
import ToolbarSave from '@/components/editor/toolbar/save';

type EditorToolbarProps = {
    projectId: string;
    documentId: string;
    editor: Editor | null;
};

const EditorToolbar = ({
    projectId,
    documentId,
    editor,
}: EditorToolbarProps) => {
    const [, setRenderTick] = useState(0); // used only to trigger re-render

    useEffect(() => {
        if (!editor) return;

        let frame: number | null = null;
        const scheduleRefresh = () => {
            if (frame !== null) return;

            frame = window.requestAnimationFrame(() => {
                frame = null;
                setRenderTick((count) => count + 1);
            });
        };

        const events: Array<Parameters<Editor['on']>[0]> = [
            'selectionUpdate',
            'transaction',
            'focus',
            'blur',
        ];

        events.forEach((event) => editor.on(event, scheduleRefresh));

        return () => {
            if (frame !== null) {
                window.cancelAnimationFrame(frame);
            }

            events.forEach((event) => editor.off(event, scheduleRefresh));
        };
    }, [editor]);

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-start gap-2 gap-y-2 px-3 py-2 sm:justify-center sm:gap-3 sm:px-6 md:flex-nowrap md:gap-3">
            <ToolbarSave
                projectId={projectId}
                documentId={documentId}
                editor={editor}
            />

            <ToolbarUndoRedo editor={editor} />

            <div className="mx-2 hidden h-6 border border-muted-foreground sm:block"></div>

            <FontFamilySelection editor={editor} />

            <div className="mx-2 hidden h-6 border border-muted-foreground sm:block"></div>

            <ToolbarColors editor={editor} />

            <div className="mx-2 hidden h-6 border border-muted-foreground sm:block"></div>

            <ToolbarHeadings editor={editor} />

            <div className="mx-2 hidden h-6 border border-muted-foreground sm:block"></div>

            <ToolbarTextStyle editor={editor} />

            <div className="mx-2 hidden h-6 border border-muted-foreground sm:block"></div>

            <ToolbarLists editor={editor} />
        </div>
    );
};

export default EditorToolbar;
