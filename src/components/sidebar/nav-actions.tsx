import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, SquarePenIcon, X } from 'lucide-react';
import { customArraySeparator, NewProjectFormState } from '@/lib/custom-types';
import { useActionState, useEffect, useState, KeyboardEvent } from 'react';
import { createNewProject } from '@/db/projects';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const projectTypes = [
    {
        value: 'novel',
        label: 'novel',
    },
    {
        value: 'screenplay',
        label: 'screenplay',
    },
    {
        value: 'article',
        label: 'article',
    },
    {
        value: 'other',
        label: 'other',
    },
];

export function NavActions() {
    const router = useRouter();

    const [isOpenProjectType, setIsOpenProjectType] = useState(false);
    const [projectTypeValue, setprojectTypeValue] = useState('');

    const initialState: NewProjectFormState = {};
    const [state, formAction, pending] = useActionState(
        createNewProject,
        initialState
    );

    /* tags section */
    const [tags, setTags] = useState('');
    const [input, setInput] = useState('');

    const addTag = (tag: string) => {
        const trimmed = tag.trim();

        if (trimmed && !tags.includes(trimmed)) {
            if (tags.length === 0) {
                setTags(trimmed);
            } else {
                setTags(tags + customArraySeparator + trimmed);
            }
        }
    };

    const removeTag = (tag: string) => {
        if (tags.startsWith(tag)) {
            setTags(tags.replace(tag + customArraySeparator, ''));
        } else {
            setTags(tags.replace(customArraySeparator + tag, ''));
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
            setInput('');
        }
        if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (state && state.status === 200 && isOpen) {
            setTags('');
            router.refresh();
            setIsOpen(false);
            toast.success('Project created successfully');
        }
    }, [state]);

    function handleDialogChange(nextOpen: boolean) {
        setIsOpen(nextOpen);
        setprojectTypeValue('');
        setTags('');
    }

    return (
        <SidebarGroup className="pt-8">
            <SidebarMenu>
                <Dialog open={isOpen} onOpenChange={handleDialogChange}>
                    <DialogTrigger asChild>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip="Create new project"
                                className="cursor-pointer">
                                <span>
                                    <SquarePenIcon className="max-w-3.5 max-h-3.5" />
                                    <span className="text-sm">
                                        Create new project
                                    </span>
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <form action={formAction}>
                            <DialogHeader className="pb-6">
                                <DialogTitle>Create new project</DialogTitle>
                                {/* <DialogDescription>
                                    Choose your project name
                                </DialogDescription> */}
                            </DialogHeader>

                            <div className="flex flex-col items-start gap-4">
                                <div className="flex flex-col items-start gap-3 w-full">
                                    <Label htmlFor="name">name*</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={state?.name}
                                        disabled={pending}
                                        placeholder="my project"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col items-start gap-3 w-full">
                                    <Label htmlFor="image">image</Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        defaultValue={state?.image}
                                        disabled={pending}
                                        placeholder="https://project-cover.png"
                                    />
                                </div>

                                <div className="flex flex-col items-start gap-3 w-full">
                                    <Label htmlFor="type">type*</Label>
                                    <input
                                        type="hidden"
                                        id="type"
                                        name="type"
                                        value={projectTypeValue ?? ''}
                                        defaultValue={state?.type}
                                        disabled={pending}
                                        required
                                    />
                                    <Popover
                                        open={isOpenProjectType}
                                        onOpenChange={setIsOpenProjectType}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={
                                                    isOpenProjectType
                                                }
                                                className="w-full justify-between">
                                                {projectTypeValue
                                                    ? projectTypes.find(
                                                          (projectType) =>
                                                              projectType.value ===
                                                              projectTypeValue
                                                      )?.label
                                                    : 'Select framework...'}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                                            <Command>
                                                {/* <CommandInput
                                                    placeholder="Search framework..."
                                                    className="h-9"
                                                /> */}
                                                <CommandList className="w-full">
                                                    {/* <CommandEmpty>
                                                        No framework found.
                                                    </CommandEmpty> */}
                                                    <CommandGroup>
                                                        {projectTypes.map(
                                                            (projectType) => (
                                                                <CommandItem
                                                                    key={
                                                                        projectType.value
                                                                    }
                                                                    value={
                                                                        projectType.value
                                                                    }
                                                                    onSelect={(
                                                                        currentValue
                                                                    ) => {
                                                                        setprojectTypeValue(
                                                                            currentValue ===
                                                                                projectTypeValue
                                                                                ? ''
                                                                                : currentValue
                                                                        );
                                                                        setIsOpenProjectType(
                                                                            false
                                                                        );
                                                                    }}>
                                                                    {
                                                                        projectType.label
                                                                    }
                                                                    <Check
                                                                        className={cn(
                                                                            'ml-auto',
                                                                            projectTypeValue ===
                                                                                projectType.value
                                                                                ? 'opacity-100'
                                                                                : 'opacity-0'
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex flex-col items-start gap-3 w-full">
                                    <Label htmlFor="description">
                                        description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        defaultValue={state?.description}
                                        disabled={pending}
                                        placeholder="description"
                                    />
                                </div>

                                <div className="flex flex-col items-start gap-3 w-full">
                                    <Label htmlFor="tags">tags</Label>
                                    <input
                                        type="hidden"
                                        id="tags"
                                        name="tags"
                                        value={tags ?? ''}
                                        defaultValue={state?.tags}
                                        disabled={pending}
                                        required
                                    />
                                    <div className="flex flex-col w-full gap-2">
                                        <Input
                                            value={input}
                                            onChange={(e) =>
                                                setInput(e.target.value)
                                            }
                                            onKeyDown={handleKeyDown}
                                            placeholder="type and press Enter..."
                                            disabled={pending}
                                        />

                                        <div className="w-full flex flex-wrap gap-2">
                                            {/* {tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="flex items-center gap-1">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTag(tag)
                                                        }
                                                        className="focus:outline-none">
                                                        <X className="w-3 h-3 text-muted-foreground cursor-pointer" />
                                                    </button>
                                                </Badge>
                                            ))} */}
                                            {tags
                                                .split(customArraySeparator)
                                                .map((tag) => (
                                                    <>
                                                        {tag !== '' && (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className="flex items-center gap-1">
                                                                {tag}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeTag(
                                                                            tag
                                                                        )
                                                                    }
                                                                    className="focus:outline-none">
                                                                    <X className="w-3 h-3 text-muted-foreground cursor-pointer" />
                                                                </button>
                                                            </Badge>
                                                        )}
                                                    </>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-1 gap-3 flex items-center space-x-2 pt-4">
                                    <Label htmlFor="private">Private</Label>
                                    <Switch
                                        id="private"
                                        name="private"
                                        checked={state?.private}
                                        disabled={pending}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-6 flex flex-col">
                                <div>
                                    <div className="flex gap-3 w-full justify-end mb-4">
                                        <DialogClose asChild>
                                            <Button
                                                variant="outline"
                                                className="cursor-pointer">
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            type="submit"
                                            className="cursor-pointer">
                                            {pending && <Spinner />}
                                            Create
                                        </Button>
                                    </div>
                                    {state &&
                                        state.status !== 200 &&
                                        state?.message && (
                                            <p className="text-red-500 text-sm">
                                                {state?.message}
                                            </p>
                                        )}
                                </div>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </SidebarMenu>
        </SidebarGroup>
    );
}
