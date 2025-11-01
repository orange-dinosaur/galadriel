import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
    BoldIcon,
    ItalicIcon,
    QuoteIcon,
    RemoveFormattingIcon,
    UnderlineIcon,
    StrikethroughIcon,
} from 'lucide-react';
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from '@/components/ui/button-group';

type ToolbarTextStyleProps = {
    editor: Editor | null;
};

const ToolbarTextStyle = ({ editor }: ToolbarTextStyleProps) => {
    return (
        <ButtonGroup>
            <Button
                className="cursor-pointer font-bold"
                variant={editor?.isActive('bold') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() => editor?.chain().focus().toggleBold().run()}>
                <BoldIcon />
            </Button>
            {editor?.isActive('italic') && <ButtonGroupSeparator />}
            <Button
                className="cursor-pointer italic"
                variant={editor?.isActive('italic') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() => editor?.chain().focus().toggleItalic().run()}>
                <ItalicIcon />
            </Button>
            {editor?.isActive('underline') && <ButtonGroupSeparator />}
            <Button
                className="cursor-pointer italic"
                variant={editor?.isActive('underline') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon />
            </Button>
            {editor?.isActive('blockquote') && <ButtonGroupSeparator />}
            <Button
                className="cursor-pointer"
                variant={editor?.isActive('blockquote') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                }>
                <QuoteIcon />
            </Button>
            {editor?.isActive('strike') && <ButtonGroupSeparator />}
            <Button
                className="cursor-pointer"
                variant={editor?.isActive('strike') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() => editor?.chain().focus().toggleStrike().run()}>
                <StrikethroughIcon />
            </Button>
            <Button
                className="cursor-pointer"
                variant={'ghost'}
                size={'sm'}
                onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                <RemoveFormattingIcon />
            </Button>
        </ButtonGroup>
    );
};

export default ToolbarTextStyle;
