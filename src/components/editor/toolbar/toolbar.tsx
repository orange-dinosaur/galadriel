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
        <div className="mx-auto flex w-full justify-center items-center gap-3 px-6 py-2">
            <ToolbarSave
                projectId={projectId}
                documentId={documentId}
                editor={editor}
            />

            <ToolbarUndoRedo editor={editor} />

            <div className="border border-muted-foreground h-6 mx-2"></div>

            <FontFamilySelection editor={editor} />

            <div className="border border-muted-foreground h-6 mx-2"></div>

            <ToolbarColors editor={editor} />

            <div className="border border-muted-foreground h-6 mx-2"></div>

            <ToolbarHeadings editor={editor} />

            <div className="border border-muted-foreground h-6 mx-2"></div>

            <ToolbarTextStyle editor={editor} />

            <div className="border border-muted-foreground h-6 mx-2"></div>

            <ToolbarLists editor={editor} />
        </div>
    );
};

export default EditorToolbar;
