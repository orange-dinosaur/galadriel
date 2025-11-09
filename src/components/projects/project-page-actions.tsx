'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { MoreHorizontalIcon } from 'lucide-react';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';
import { deleteProject } from '@/actions/projects';
import { useRef, useState } from 'react';
import { ProjectAction } from '@/components/projects/project-action';

export function ProjectPageActions({
    project,
}: {
    project: {
        userId: string;
        name: string;
        private: boolean;
        image: string;
        type: string;
        tags?: string[];
        description?: string;
        $id: string;
        $createdAt: Date;
        $updatedAt: Date;
    };
}) {
    const router = useRouter();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const projectActionTriggerRef = useRef<HTMLButtonElement>(null);
    const handleDeleteProject = async (projectId: string) => {
        const response = await deleteProject(projectId);

        if (response.status === 200) {
            router.refresh();
            toast.success('Project deleted successfully');
            window.location.replace('/home');
        } else {
            toast.error('Something went wrong');
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <MoreHorizontalIcon className="cursor-pointer" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40" align="center">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            key="rename-project"
                            className="cursor-pointer border-0 hover:rounded-sm p-1 hover:bg-secondary hover:border-0"
                            onSelect={() =>
                                projectActionTriggerRef.current?.click()
                            }>
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            key="delete-project"
                            className="cursor-pointer border-0 hover:rounded-sm p-1 hover:bg-destructive hover:border-0"
                            onSelect={() => setIsDeleteDialogOpen(true)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProjectAction
                action="update"
                project={{
                    id: project.$id,
                    image: project.image,
                    name: project.name,
                    private: project.private,
                    type: project.type,
                    description: project.description,
                    tags: project.tags,
                }}>
                <button
                    ref={projectActionTriggerRef}
                    type="button"
                    className="hidden"
                />
            </ProjectAction>

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your project and remove all its related
                            documents from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="cursor-pointer"
                            onClick={() => handleDeleteProject(project.$id)}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
