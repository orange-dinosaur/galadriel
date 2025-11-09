import {
    Dialog,
    DialogClose,
    DialogContent,
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
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import {
    customArraySeparator,
    NewProjectFormState,
    projectTypes,
} from '@/lib/custom-types';
import { useActionState, useEffect, useState, KeyboardEvent } from 'react';
import { createNewProject, updateProject } from '@/actions/projects';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function ProjectAction({
    children,
    action,
    project,
}: {
    children: React.ReactNode;
    action: 'create' | 'update';
    project?: {
        id: string;
        name: string;
        private: boolean;
        image: string;
        type: string;
        tags?: string[];
        description?: string;
    };
}) {
    const router = useRouter();

    const [isOpenProjectType, setIsOpenProjectType] = useState(false);
    const [projectTypeValue, setprojectTypeValue] = useState(
        project?.type ?? ''
    );

    const initialStateCreate: NewProjectFormState = {};
    const [stateCreate, formActionCreate, pendingCreate] = useActionState(
        createNewProject,
        initialStateCreate
    );

    const initialStateUpdate: NewProjectFormState =
        project && action === 'update' ? { ...project } : {};
    const [stateUpdate, formActionUpdate, pendingUpdate] = useActionState(
        updateProject,
        initialStateUpdate
    );

    const state = action === 'create' ? stateCreate : stateUpdate;
    const formAction =
        action === 'create' ? formActionCreate : formActionUpdate;
    const pending = action === 'create' ? pendingCreate : pendingUpdate;

    /* tags section */
    const [tags, setTags] = useState(
        project?.tags?.join(customArraySeparator) ?? ''
    );
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

    const [name, setName] = useState(project?.name ?? '');
    const [image, setImage] = useState(project?.image ?? '');
    const [description, setDescription] = useState(project?.description ?? '');
    const [isPrivate, setIsPrivate] = useState(project?.private ?? false);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        if (action === 'update' && project) {
            const tagsChanged =
                tags !== (project.tags?.join(customArraySeparator) ?? '');
            const nameChanged = name !== project.name;
            const imageChanged = image !== project.image;
            const typeChanged = projectTypeValue !== project.type;
            const descriptionChanged = description !== project.description;
            const privateChanged = isPrivate !== project.private;

            if (
                tagsChanged ||
                nameChanged ||
                imageChanged ||
                typeChanged ||
                descriptionChanged ||
                privateChanged
            ) {
                setIsChanged(true);
            } else {
                setIsChanged(false);
            }
        }
    }, [
        name,
        image,
        projectTypeValue,
        description,
        tags,
        isPrivate,
        project,
        action,
    ]);

    useEffect(() => {
        if (state && state.status === 200 && isOpen) {
            if (action === 'create') {
                setTags('');
            }
            router.refresh();
            setIsOpen(false);
            toast.success(
                `Project ${
                    action === 'create' ? 'created' : 'updated'
                } successfully`
            );
        }
    }, [state]);

    function handleDialogChange(nextOpen: boolean) {
        setIsOpen(nextOpen);
        if (!nextOpen) {
            if (action === 'create') {
                setprojectTypeValue('');
                setTags('');
                setName('');
                setImage('');
                setDescription('');
                setIsPrivate(false);
            } else if (project) {
                setprojectTypeValue(project.type);
                setTags(project.tags?.join(customArraySeparator) ?? '');
                setName(project.name);
                setImage(project.image);
                setDescription(project.description ?? '');
                setIsPrivate(project.private);
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form action={formAction}>
                    {action === 'update' && project && (
                        <input
                            type="hidden"
                            id="projectId"
                            name="projectId"
                            value={project?.id ?? ''}
                        />
                    )}

                    <DialogHeader className="pb-6">
                        <DialogTitle>
                            {action === 'create'
                                ? 'Create new project'
                                : 'Update project'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-start gap-4">
                        <div className="flex flex-col items-start gap-3 w-full">
                            <Label htmlFor="name">name*</Label>
                            <Input
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={pending}
                                placeholder="my project"
                                required
                            />
                        </div>

                        <Input
                            hidden
                            id="image"
                            name="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            disabled={pending}
                            placeholder="https://project-cover.png"
                        />

                        <div className="flex flex-col items-start gap-3 w-full">
                            <Label htmlFor="type">type*</Label>
                            <input
                                type="hidden"
                                id="type"
                                name="type"
                                value={projectTypeValue ?? ''}
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
                                        aria-expanded={isOpenProjectType}
                                        className="w-full justify-between">
                                        {projectTypeValue
                                            ? projectTypes.find(
                                                  (projectType) =>
                                                      projectType.value ===
                                                      projectTypeValue
                                              )?.label
                                            : 'Select project type...'}
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
                                                            {projectType.label}
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
                            <Label htmlFor="description">description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                disabled={pending}
                                required
                            />
                            <div className="flex flex-col w-full gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="type and press Enter..."
                                    disabled={pending}
                                />

                                <div className="w-full flex flex-wrap gap-2">
                                    {tags
                                        .split(customArraySeparator)
                                        .map((tag) => (
                                            <span key={tag}>
                                                {tag !== '' && (
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
                                                )}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="ml-1 gap-3 flex items-center space-x-2 pt-4">
                            <Label htmlFor="private">Private</Label>
                            <Switch
                                id="private"
                                name="private"
                                checked={isPrivate}
                                onCheckedChange={setIsPrivate}
                                disabled={pending}
                                className="cursor-pointer"
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
                                    className="cursor-pointer"
                                    disabled={
                                        pending ||
                                        (action === 'update' && !isChanged)
                                    }>
                                    {pending && <Spinner />}
                                    {action === 'create' ? 'Create' : 'Update'}
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
    );
}
