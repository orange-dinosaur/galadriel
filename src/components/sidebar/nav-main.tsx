'use client';

import {
    ChevronRight,
    FilePlusIcon,
    Trash2Icon,
    type LucideIcon,
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
import { usePathname } from 'next/navigation';
import { deleteProject } from '@/db/projects';
import { toast } from 'sonner';

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: string | LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
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
                            <SidebarMenuButton asChild tooltip={item.title}>
                                <span className="flex items-center justify-between">
                                    <a href={item.url}>
                                        {/* TODO: Make icon visible */}
                                        {/* <item.icon /> */}
                                        <span>{item.title}</span>
                                    </a>
                                    <span className="flex items-center gap-1">
                                        <button>
                                            <FilePlusIcon className="max-w-3.5 max-h-3.5 hover:text-accent-foreground cursor-pointer" />
                                        </button>

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
                                                <SidebarMenuSubItem
                                                    key={subItem.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className={`${
                                                            pathname ===
                                                                subItem.url ||
                                                            pathname.startsWith(
                                                                `${subItem.url}`
                                                            )
                                                                ? 'bg-secondary'
                                                                : ''
                                                        }`}>
                                                        <a
                                                            href={`${subItem.url}`}>
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
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
