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
import { SquarePenIcon } from 'lucide-react';
import { NewProjectFormState } from '@/lib/custom-types';
import { useActionState, useEffect, useState } from 'react';
import { createNewProject } from '@/db/projects';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

export function NavActions() {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const initialState: NewProjectFormState = {};
    const [state, formAction, pending] = useActionState(
        createNewProject,
        initialState
    );

    useEffect(() => {
        if (state && state.code === 200 && isOpen) {
            router.refresh();
            setIsOpen(false);
            toast.success('Project created successfully');
        }
    }, [state]);

    return (
        <SidebarGroup className="pt-8">
            <SidebarMenu>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip="Create new project"
                                className="cursor-pointer">
                                <span>
                                    <SquarePenIcon />
                                    <span>Create new project</span>
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form action={formAction}>
                            <DialogHeader>
                                <DialogTitle>Create new project</DialogTitle>
                                <DialogDescription>
                                    Choose your project name
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={state?.name}
                                        disabled={pending}
                                        placeholder="my project"
                                    />
                                </div>
                                <div className="gap-3 flex items-center space-x-2">
                                    <Label htmlFor="private">Private</Label>
                                    <Switch
                                        id="private"
                                        name="private"
                                        checked={state?.private}
                                        disabled={pending}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
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
                                {state &&
                                    state.code !== 200 &&
                                    state?.message && (
                                        <p className="text-red-500 text-sm">
                                            {state?.message}
                                        </p>
                                    )}
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </SidebarMenu>
        </SidebarGroup>
    );
}
