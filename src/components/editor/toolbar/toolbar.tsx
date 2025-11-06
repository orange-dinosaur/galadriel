import { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { defaultFontFamily, fonts } from '@/components/editor/text-style/fonts';
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
    const [open, setOpen] = useState(false);
    const [, forceUpdate] = useState(0); // used only to trigger re-render

    useEffect(() => {
        if (!editor) return;

        const refresh = () => {
            // advance a dummy counter so React re-renders
            forceUpdate((count) => count + 1);
        };

        editor.on('selectionUpdate', refresh);
        editor.on('transaction', refresh);

        return () => {
            editor.off('selectionUpdate', refresh);
            editor.off('transaction', refresh);
        };
    }, [editor]);

    const currentFont =
        editor?.getAttributes('textStyle').fontFamily ?? defaultFontFamily;

    const handleSelect = (fontValue: string) => {
        const fontToApply =
            fonts.find((font) => font.value === fontValue)?.value ??
            defaultFontFamily;

        editor?.chain().focus().setFontFamily(fontToApply).run();
        setOpen(false);
        forceUpdate((count) => count + 1); // immediate update for the label/check
    };

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
