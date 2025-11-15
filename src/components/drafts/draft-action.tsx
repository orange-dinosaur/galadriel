'use client';

import { MoreHorizontalIcon } from 'lucide-react';
import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteDraftFile } from '@/actions/drafts';

export function DraftActionSidebarMenuSubItem({
    pathname,
    projectId,
    document: doc,
    draft,
}: {
    pathname: string;
    projectId: string;
    document: { title: string; url: string };
    draft: { title: string; url: string };
}) {
    const router = useRouter();

    const handleDeleteDraft = async (
        projectId: string,
        documentId: string,
        draftId: string
    ) => {
        const response = await deleteDraftFile(projectId, documentId, draftId);

        if (response.status === 200) {
            toast.success('Draft deleted successfully');

            const docPath = `/${projectId}/${documentId}/${draftId}`;
            if (pathname === docPath) {
                window.location.replace('/home');
            }
            router.refresh();
        } else {
            toast.error('Something went wrong');
        }
    };

    return (
        <SidebarMenuSubItem key={doc.title}>
            <SidebarMenuSubButton
                asChild
                className={`${
                    pathname === draft.url ||
                    pathname.startsWith(`${draft.url}`)
                        ? 'bg-secondary'
                        : ''
                }`}>
                <span className="flex justify-between items-center gap-2">
                    <a href={draft.url} className="min-w-0 flex-1">
                        <p className="text-xs truncate">{draft.title}</p>
                    </a>

                    <span className="flex gap-1 shrink-0">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-center">
                                    <MoreHorizontalIcon className="max-w-3.5 max-h-3.5 cursor-pointer" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-40"
                                align="center">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground"
                                        onSelect={() =>
                                            handleDeleteDraft(
                                                projectId,
                                                doc.url.split('/')[2],
                                                draft.url.split('/')[3]
                                            )
                                        }>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </span>
                </span>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
}
