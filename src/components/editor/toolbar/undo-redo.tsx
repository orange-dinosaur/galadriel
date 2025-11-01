import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Redo2Icon, Undo2Icon } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';

type ToolbarUndoRedoProps = {
    editor: Editor | null;
};

const ToolbarUndoRedo = ({ editor }: ToolbarUndoRedoProps) => {
    return (
        <ButtonGroup>
            <Button
                className="cursor-pointer"
                variant={'ghost'}
                size={'sm'}
                onClick={() => editor?.chain().focus().undo().run()}>
                <Undo2Icon />
            </Button>
            <Button
                className="cursor-pointer"
                variant={'ghost'}
                size={'sm'}
                onClick={() => editor?.chain().focus().redo().run()}>
                <Redo2Icon />
            </Button>
        </ButtonGroup>
    );
};

export default ToolbarUndoRedo;
