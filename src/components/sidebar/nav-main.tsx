'use client';

import {
    ChevronRight,
    Edit3Icon,
    FilePlusIcon,
    Trash2Icon,
} from 'lucide-react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { usePathname, useRouter } from 'next/navigation';
import { deleteProject, updateProject } from '@/db/projects';
import { toast } from 'sonner';
import {
    customArraySeparator,
    NewProjectFormState,
    UserDataFull,
    UserDataFullObject,
} from '@/lib/custom-types';
import { useActionState, useEffect, useState } from 'react';
import { ProjectAction } from '@/components/projects/project-action';
import { DocumentActionSidebarMenuSubItem } from '../documents/document-action';

export function NavMain({ data }: { data: UserDataFullObject }) {
    const pathname = usePathname();

    const handleDeleteProject = async (projectUrl: string) => {
        const projectId = projectUrl.split('/')[1];

        const response = await deleteProject(projectId);

        if (response.status === 200) {
            window.location.reload();
            toast.success('Project deleted successfully');
        } else {
            toast.error('Something went wrong');
        }
    };

    const items = UserDataFull.fromUserDataFullObject(data).toNavMainItems();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.url}
                        asChild
                        defaultOpen={
                            pathname === item.url ||
                            pathname.startsWith(`${item.url}/`)
                        }>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={item.name}>
                                <span className="flex items-center justify-between">
                                    <a href={item.url}>
                                        {/* TODO: Make icon visible */}
                                        {/* <item.icon /> */}
                                        <span>{item.name}</span>
                                    </a>

                                    {/* action buttons */}
                                    <span className="flex items-center gap-1">
                                        <button>
                                            <FilePlusIcon className="max-w-3.5 max-h-3.5 hover:text-accent-foreground cursor-pointer" />
                                        </button>

                                        <ProjectAction
                                            action="update"
                                            project={{
                                                id: item.url.split('/')[1],
                                                name: item.name,
                                                private: item.private,
                                                image: item.image,
                                                type: item.type,
                                                tags: item.tags,
                                                description: item.description,
                                            }}>
                                            <Edit3Icon className="max-w-3.5 max-h-3.5 hover:text-accent-foreground cursor-pointer" />
                                        </ProjectAction>

                                        {/* TODO: add spinner while project is been deleted */}
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <Trash2Icon className="max-w-3.5 max-h-3.5 hover:text-destructive cursor-pointer" />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you absolutely sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be
                                                        undone. This will
                                                        permanently delete your
                                                        project and remove all
                                                        its related documents
                                                        from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="cursor-pointer">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            handleDeleteProject(
                                                                item.url
                                                            )
                                                        }>
                                                        Continue
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </span>
                                </span>
                            </SidebarMenuButton>
                            {item.items?.length ? (
                                <>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                                            <ChevronRight />
                                            <span className="sr-only">
                                                Toggle
                                            </span>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <DocumentActionSidebarMenuSubItem
                                                    key={subItem.title}
                                                    pathname={pathname}
                                                    projectId={
                                                        item.url.split('/')[1]
                                                    }
                                                    document={subItem}
                                                />
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            ) : null}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
