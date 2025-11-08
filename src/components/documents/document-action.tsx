'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import {
    ChevronRight,
    Edit3Icon,
    FilePlusIcon,
    Trash2Icon,
    MoreHorizontalIcon,
    CheckCheckIcon,
    CheckIcon,
} from 'lucide-react';
import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { deleteFile, updateFileName } from '@/db/documents';
import { toast } from 'sonner';
import { redirect, RedirectType, useRouter } from 'next/navigation';
import { NewFileFormState } from '@/lib/custom-types';
import { Spinner } from '@/components/ui/spinner';

export function DocumentActionSidebarMenuSubItem({
    pathname,
    projectId,
    document,
}: {
    pathname: string;
    projectId: string;
    document: { title: string; url: string };
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [fileName, setFileName] = useState(document.title);
    const inputRef = useRef<HTMLInputElement>(null);

    const initialState: NewFileFormState = {};
    const [state, formAction, pending] = useActionState(
        updateFileName,
        initialState
    );

    const router = useRouter();
    useEffect(() => {
        if (state && state.status && state.status === 200) {
            router.refresh();
            setIsEditing(false);
            toast.success('Document name updated successfully');
        } else if (state && state.status && state.status !== 200) {
            toast.error('Something went wrong');
        }
    }, [state]);

    useEffect(() => {
        if (!isEditing) return;

        const focusInput = () => {
            inputRef.current?.focus();
            inputRef.current?.select();
        };

        const frame = window.requestAnimationFrame(focusInput);
        const timeout = window.setTimeout(focusInput, 0);

        return () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(timeout);
        };
    }, [isEditing]);

    const handleOnSelectRename = (
        event: Event | React.SyntheticEvent<Element, Event>
    ) => {
        event.preventDefault();
        window.setTimeout(() => setIsEditing(true), 0);
    };

    const handleDeleteDocument = async (
        projectId: string,
        documentId: string
    ) => {
        const response = await deleteFile(projectId, documentId);

        if (response.status === 200) {
            window.location.reload();
            toast.success('Document deleted successfully');

            const docPath = `/${projectId}/${documentId}`;
            if (pathname === docPath) {
                redirect('/home', RedirectType.push);
            }
        } else {
            toast.error('Something went wrong');
        }
    };

    return (
        <SidebarMenuSubItem key={document.title}>
            <SidebarMenuSubButton
                asChild
                className={`${
                    pathname === document.url ||
                    pathname.startsWith(`${document.url}`)
                        ? 'bg-secondary'
                        : ''
                }`}>
                <span className="flex justify-between">
                    {!isEditing && (
                        <a href={document.url}>
                            <span>{document.title}</span>
                        </a>
                    )}
                    {isEditing && (
                        <form action={formAction} className="flex-1">
                            <input
                                type="hidden"
                                id="projectId"
                                name="projectId"
                                value={projectId ?? ''}
                            />
                            <input
                                type="hidden"
                                id="documentId"
                                name="documentId"
                                value={document.url.split('/')[2] ?? ''}
                            />
                            <div className="flex">
                                <Input
                                    id="fileName"
                                    type="text"
                                    name="fileName"
                                    value={fileName}
                                    ref={inputRef}
                                    onChange={(e) =>
                                        setFileName(e.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            event.currentTarget.form?.requestSubmit();
                                        }
                                        if (event.key === 'Escape') {
                                            event.preventDefault();
                                            setIsEditing(false);
                                            setFileName(document.title);
                                        }
                                    }}
                                    className="border-0 border-b border-transparent bg-transparent px-0 py-0 text-sm font-medium focus-visible:border-primary focus-visible:ring-0 rounded-none"
                                    required
                                />
                                <button type="submit" disabled={pending}>
                                    {pending ? (
                                        <Spinner />
                                    ) : (
                                        <CheckIcon className="max-w-3.5 max-h-3.5 hover:text-green-500 cursor-pointer" />
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    <span className="flex gap-1">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <MoreHorizontalIcon className="max-w-3.5 max-h-3.5 cursor-pointer" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-40"
                                align="center">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onSelect={(event) =>
                                            handleOnSelectRename(event)
                                        }>
                                        Rename
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onSelect={() =>
                                            handleDeleteDocument(
                                                projectId,
                                                document.url.split('/')[2]
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
