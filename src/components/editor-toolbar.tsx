import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    BoldIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ItalicIcon,
    ListIcon,
    ListOrderedIcon,
    ListTodoIcon,
    QuoteIcon,
    Redo2Icon,
    RemoveFormattingIcon,
    UnderlineIcon,
    Undo2Icon,
    CheckIcon,
    ChevronsUpDownIcon,
} from 'lucide-react';
import { defaultFontFamily } from '@/components/editor';
import { ButtonGroup } from '@/components/ui/button-group';

type EditorToolbarProps = {
    editor: Editor | null;
};

/* TODO: Add other fonts */
const fonts: { label: string; value: string }[] = [
    { label: 'Arsenal', value: 'Arsenal' },
    { label: 'Geist', value: 'Geist' },
    { label: 'Geist Mono', value: 'Geist Mono' },
    { label: 'IBM Plex Mono', value: 'IBM Plex Mono' },
    { label: 'IBM Plex Sans', value: 'IBM Plex Sans' },
    { label: 'IBM Plex Serif', value: 'IBM Plex Serif' },
    { label: 'Newsreader', value: 'Newsreader' },
    { label: 'Roboto', value: 'Roboto' },
];

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
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
        <div className="mx-auto flex w-full max-w-[816px] justify-center items-center gap-3 px-6 py-2">
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

            <div className="border border-muted-foreground h-6 mx-2"></div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[150px] justify-between">
                        {fonts.find((font) => font.value === currentFont)
                            ?.label ?? 'Select font...'}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search font..." />
                        <CommandList>
                            <CommandEmpty>No font found.</CommandEmpty>
                            <CommandGroup>
                                {fonts.map((font) => (
                                    <CommandItem
                                        key={font.value}
                                        value={font.value}
                                        onSelect={() =>
                                            handleSelect(font.value)
                                        }>
                                        <CheckIcon
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                currentFont === font.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {font.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <div className="border border-muted-foreground h-6 mx-2"></div>

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
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                    }>
                    <Heading1Icon />
                </Button>
                <Button
                    className="cursor-pointer font-bold"
                    variant={
                        editor?.isActive('heading', { level: 2 })
                            ? 'outline'
                            : 'ghost'
                    }
                    size={'sm'}
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                    }>
                    <Heading2Icon />
                </Button>
                <Button
                    className="cursor-pointer font-bold"
                    variant={
                        editor?.isActive('heading', { level: 3 })
                            ? 'outline'
                            : 'ghost'
                    }
                    size={'sm'}
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run()
                    }>
                    <Heading3Icon />
                </Button>
            </ButtonGroup>

            <div className="border border-muted-foreground h-6 mx-2"></div>

            <ButtonGroup>
                <Button
                    className="cursor-pointer font-bold"
                    variant={editor?.isActive('bold') ? 'outline' : 'ghost'}
                    size={'sm'}
                    onClick={() => editor?.chain().focus().toggleBold().run()}>
                    <BoldIcon />
                </Button>
                <Button
                    className="cursor-pointer italic"
                    variant={editor?.isActive('italic') ? 'outline' : 'ghost'}
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                    }>
                    <ItalicIcon />
                </Button>
                <Button
                    className="cursor-pointer italic"
                    variant={
                        editor?.isActive('underline') ? 'outline' : 'ghost'
                    }
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleUnderline().run()
                    }>
                    <UnderlineIcon />
                </Button>
                <Button
                    className="cursor-pointer"
                    variant={
                        editor?.isActive('blockquote') ? 'outline' : 'ghost'
                    }
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleBlockquote().run()
                    }>
                    <QuoteIcon />
                </Button>
                <Button
                    className="cursor-pointer"
                    variant={'ghost'}
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().unsetAllMarks().run()
                    }>
                    <RemoveFormattingIcon />
                </Button>
            </ButtonGroup>

            <div className="border border-muted-foreground h-6 mx-2"></div>

            <ButtonGroup>
                <Button
                    className="cursor-pointer font-bold"
                    variant={
                        editor?.isActive('bulletList') ? 'outline' : 'ghost'
                    }
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                    }>
                    <ListIcon />
                </Button>
                <Button
                    className="cursor-pointer font-bold"
                    variant={
                        editor?.isActive('orderedList') ? 'outline' : 'ghost'
                    }
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                    }>
                    <ListOrderedIcon />
                </Button>
                <Button
                    className="cursor-pointer font-bold"
                    variant={editor?.isActive('taskList') ? 'outline' : 'ghost'}
                    size={'sm'}
                    onClick={() =>
                        editor?.chain().focus().toggleTaskList().run()
                    }>
                    <ListTodoIcon />
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default EditorToolbar;
