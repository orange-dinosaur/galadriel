import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { ListIcon, ListOrderedIcon, ListTodoIcon } from 'lucide-react';
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from '@/components/ui/button-group';

type ToolbarListsProps = {
    editor: Editor | null;
};

const ToolbarLists = ({ editor }: ToolbarListsProps) => {
    return (
        <ButtonGroup>
            <Button
                className="cursor-pointer font-bold"
                variant={editor?.isActive('bulletList') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                }>
                <ListIcon />
            </Button>
            {editor?.isActive('orderedList') && <ButtonGroupSeparator />}
            <Button
                className="cursor-pointer font-bold"
                variant={editor?.isActive('orderedList') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                }>
                <ListOrderedIcon />
            </Button>
            {editor?.isActive('taskList') && <ButtonGroupSeparator />}
            <Button
                className="cursor-pointer font-bold"
                variant={editor?.isActive('taskList') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() => editor?.chain().focus().toggleTaskList().run()}>
                <ListTodoIcon />
            </Button>
        </ButtonGroup>
    );
};

export default ToolbarLists;
