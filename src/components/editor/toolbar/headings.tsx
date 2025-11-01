import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Heading1Icon, Heading2Icon, Heading3Icon } from 'lucide-react';
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from '@/components/ui/button-group';

type ToolbarHeadingsProps = {
    editor: Editor | null;
};

const ToolbarHeadings = ({ editor }: ToolbarHeadingsProps) => {
    return (
        <ButtonGroup>
            <Button
                className="cursor-pointer font-bold"
                variant={
                    editor?.isActive('heading', { level: 1 })
                        ? 'outline'
                        : 'ghost'
                }
                size={'sm'}
                onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }>
                <Heading1Icon />
            </Button>
            {editor?.isActive('heading', { level: 2 }) && (
                <ButtonGroupSeparator />
            )}
            <Button
                className="cursor-pointer font-bold"
                variant={
                    editor?.isActive('heading', { level: 2 })
                        ? 'outline'
                        : 'ghost'
                }
                size={'sm'}
                onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }>
                <Heading2Icon />
            </Button>
            {editor?.isActive('heading', { level: 3 }) && (
                <ButtonGroupSeparator />
            )}
            <Button
                className="cursor-pointer font-bold"
                variant={
                    editor?.isActive('heading', { level: 3 })
                        ? 'outline'
                        : 'ghost'
                }
                size={'sm'}
                onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }>
                <Heading3Icon />
            </Button>
        </ButtonGroup>
    );
};

export default ToolbarHeadings;
