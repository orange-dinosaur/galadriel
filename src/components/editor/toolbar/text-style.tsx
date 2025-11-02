import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
    BoldIcon,
    ItalicIcon,
    QuoteIcon,
    RemoveFormattingIcon,
    UnderlineIcon,
    StrikethroughIcon,
    LinkIcon,
} from 'lucide-react';
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from '@/components/ui/button-group';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

type ToolbarTextStyleProps = {
    editor: Editor | null;
};

const ToolbarTextStyle = ({ editor }: ToolbarTextStyleProps) => {
    const [link, setLink] = useState(editor?.getAttributes('link').href || '');

    const onLinkChange = (value: string) => {
        editor
            ?.chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: value })
            .run();
        /* setLink(''); */
    };

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

            {editor?.isActive('strike') && <ButtonGroupSeparator />}

            <Button
                className="cursor-pointer"
                variant={editor?.isActive('strike') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() => editor?.chain().focus().toggleStrike().run()}>
                <StrikethroughIcon />
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

            {(editor?.getAttributes('link').href || '') !== '' && (
                <ButtonGroupSeparator />
            )}

            <DropdownMenu
                onOpenChange={(open) => {
                    if (open) {
                        setLink(editor?.getAttributes('link').href || '');
                    }
                }}>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="cursor-pointer font-bold"
                        variant={
                            editor?.getAttributes('link').href || '' !== ''
                                ? 'outline'
                                : 'ghost'
                        }
                        size={'sm'}>
                        <LinkIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex w-full max-w-sm items-center gap-1">
                    <Input
                        placeholder="https://example.com"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onLinkChange(link);
                            }
                        }}
                    />
                    <Button
                        className="cursor-pointer font-bold"
                        variant={'ghost'}
                        onClick={() => onLinkChange(link)}>
                        Apply
                    </Button>
                </DropdownMenuContent>
            </DropdownMenu>

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
