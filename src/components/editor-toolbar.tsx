import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
    BoldIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ItalicIcon,
    ListIcon,
    ListOrderedIcon,
    ListTodoIcon,
    LucideIcon,
    QuoteIcon,
    Redo2Icon,
    RemoveFormattingIcon,
    UnderlineIcon,
    Undo2Icon,
} from 'lucide-react';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';

type EditorToolbarProps = {
    editor: Editor | null;
};

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
    return (
        <div className="mx-auto flex w-full max-w-[816px] justify-center items-center gap-3 px-6 py-2">
            {/* TODO: Add tooltips */}
            {/* <Tooltip>
                <TooltipTrigger>
                    <Button
                        className="cursor-pointer"
                        variant={'ghost'}
                        size={'sm'}
                        onClick={() => editor?.chain().focus().undo().run()}>
                        <Undo2Icon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>undo</TooltipContent>
            </Tooltip> */}
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

            <div className="border border-muted-foreground h-6 mx-2"></div>

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

            <div className="border border-muted-foreground h-6 mx-2"></div>

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
                onClick={() => editor?.chain().focus().toggleItalic().run()}>
                <ItalicIcon />
            </Button>
            <Button
                className="cursor-pointer italic"
                variant={editor?.isActive('underline') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon />
            </Button>
            <Button
                className="cursor-pointer"
                variant={editor?.isActive('blockquote') ? 'outline' : 'ghost'}
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
                onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                <RemoveFormattingIcon />
            </Button>

            <div className="border border-muted-foreground h-6 mx-2"></div>

            <Button
                className="cursor-pointer font-bold"
                variant={editor?.isActive('bulletList') ? 'outline' : 'ghost'}
                size={'sm'}
                onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                }>
                <ListIcon />
            </Button>
            <Button
                className="cursor-pointer font-bold"
                variant={editor?.isActive('orderedList') ? 'outline' : 'ghost'}
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
                onClick={() => editor?.chain().focus().toggleTaskList().run()}>
                <ListTodoIcon />
            </Button>
        </div>
    );
};

export default EditorToolbar;
