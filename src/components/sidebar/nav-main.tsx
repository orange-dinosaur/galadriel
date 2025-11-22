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
import { deleteProject } from '@/actions/projects';
import { toast } from 'sonner';
import { UserDataFull, UserDataFullObject } from '@/lib/custom-types';
import { useEffect, useState } from 'react';
import { ProjectAction } from '@/components/projects/project-action';
import { DocumentActionSidebarMenuSubItem } from '@/components/documents/document-action';
import { AddDcoumentSidebarMenuSubItem } from '@/components/documents/add-document';
import { DraftActionSidebarMenuSubItem } from '@/components/drafts/draft-action';

export function NavMain({ data }: { data: UserDataFullObject }) {
    const pathname = usePathname();
    const [currentProjectFromPathname, setCurrentProjectFromPathname] =
        useState(pathname.split('/')[1]);

    useEffect(() => {
        setCurrentProjectFromPathname(pathname.split('/')[1]);
    }, [pathname]);

    const handleDeleteProject = async (projectUrl: string) => {
        const projectId = projectUrl.split('/')[1];

        const response = await deleteProject(projectId);

        if (response.status === 200) {
            const docPath = `/${projectId}`;
            if (pathname === docPath) {
                window.location.replace('/home');
            } else {
                window.location.reload();
            }
            toast.success('Project deleted successfully');
        } else {
            toast.error('Something went wrong');
        }
    };

    const getDefaultOpen = (projectUrl: string) =>
        pathname === projectUrl || pathname.startsWith(`${projectUrl}/`);

    const [openProjects, setOpenProjects] = useState<Record<string, boolean>>(
        {}
    );

    const isProjectOpen = (projectId: string, projectUrl: string) =>
        openProjects[projectId] ?? getDefaultOpen(projectUrl);

    const handleToggleProject = (projectId: string, nextOpen: boolean) => {
        setOpenProjects((prev) => ({ ...prev, [projectId]: nextOpen }));
        if (!nextOpen && projectToAddDocumentTo === projectId) {
            setProjectToAddDocumentTo('');
        }
    };

    const handleAddDocumentToProject = (projectId: string) => {
        setOpenProjects((prev) => ({ ...prev, [projectId]: true }));
        setProjectToAddDocumentTo(projectId);
    };

    const [projectToAddDocumentTo, setProjectToAddDocumentTo] = useState('');

    const handleDocumentSuccessfullyAdded = () => {
        setProjectToAddDocumentTo('');
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
                        }
                        open={isProjectOpen(item.url.split('/')[1], item.url)}
                        onOpenChange={(nextOpen) =>
                            handleToggleProject(
                                item.url.split('/')[1],
                                nextOpen
                            )
                        }>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={item.name}>
                                <span
                                    className={`flex items-center justify-between ${
                                        currentProjectFromPathname ===
                                        item.url.split('/')[1]
                                            ? 'bg-secondary'
                                            : ''
                                    }`}>
                                    <a href={item.url}>
                                        {/* TODO: Make icon visible */}
                                        {/* <item.icon /> */}
                                        <span>{item.name}</span>
                                    </a>

                                    {/* action buttons */}
                                    <span className="flex items-center gap-1">
                                        <button
                                            onClick={() =>
                                                handleAddDocumentToProject(
                                                    item.url.split('/')[1]
                                                )
                                            }>
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

                            <CollapsibleTrigger asChild>
                                <SidebarMenuAction className="data-[state=open]:rotate-90">
                                    <ChevronRight className="cursor-pointer" />
                                    <span className="sr-only">Toggle</span>
                                </SidebarMenuAction>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) =>
                                        subItem.subItems &&
                                        subItem.subItems.length > 0 ? (
                                            <Collapsible
                                                key={subItem.title}
                                                asChild
                                                defaultOpen={
                                                    pathname === subItem.url ||
                                                    pathname.startsWith(
                                                        `${subItem.url}/`
                                                    )
                                                }>
                                                <span>
                                                    <DocumentActionSidebarMenuSubItem
                                                        pathname={pathname}
                                                        projectId={
                                                            item.url.split(
                                                                '/'
                                                            )[1]
                                                        }
                                                        document={subItem}
                                                        hasDrafts={true}
                                                    />
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {subItem.subItems.map(
                                                                (
                                                                    subSubItem
                                                                ) => (
                                                                    <DraftActionSidebarMenuSubItem
                                                                        key={
                                                                            subSubItem.title
                                                                        }
                                                                        pathname={
                                                                            pathname
                                                                        }
                                                                        projectId={
                                                                            item.url.split(
                                                                                '/'
                                                                            )[1]
                                                                        }
                                                                        document={
                                                                            subItem
                                                                        }
                                                                        draft={
                                                                            subSubItem
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </span>
                                            </Collapsible>
                                        ) : (
                                            <DocumentActionSidebarMenuSubItem
                                                key={subItem.title}
                                                pathname={pathname}
                                                projectId={
                                                    item.url.split('/')[1]
                                                }
                                                document={subItem}
                                                hasDrafts={false}
                                            />
                                        )
                                    )}

                                    {projectToAddDocumentTo ===
                                        item.url.split('/')[1] && (
                                        <AddDcoumentSidebarMenuSubItem
                                            /* ref={boxRef} */
                                            projectId={item.url.split('/')[1]}
                                            onDocumentSuccessfullyAdded={
                                                handleDocumentSuccessfullyAdded
                                            }
                                        />
                                    )}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
