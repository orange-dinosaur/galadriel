'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import { MoreHorizontalIcon, CheckIcon, ChevronRight } from 'lucide-react';
import {
    SidebarMenuAction,
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
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { deleteFile, updateFileName } from '@/actions/documents';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { NewFileFormState } from '@/lib/custom-types';
import { Spinner } from '@/components/ui/spinner';
import { createNewDraftFile } from '@/actions/drafts';

export function DocumentActionSidebarMenuSubItem({
    pathname,
    projectId,
    document: doc,
    hasDrafts = false,
}: {
    pathname: string;
    projectId: string;
    document: { title: string; url: string };
    hasDrafts?: boolean;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [fileName, setFileName] = useState(doc.title);
    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

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

    useEffect(() => {
        if (!isEditing) return;

        const handlePointerDown = (event: Event) => {
            const target = event.target as Node;
            if (formRef.current && !formRef.current.contains(target)) {
                setIsEditing(false);
                setFileName(doc.title);
            }
        };

        const domDocument = window.document;
        domDocument.addEventListener('pointerdown', handlePointerDown, true);
        return () =>
            domDocument.removeEventListener(
                'pointerdown',
                handlePointerDown,
                true
            );
    }, [isEditing, doc.title]);

    const handleOnSelectRename = (
        event: Event | React.SyntheticEvent<Element, Event>
    ) => {
        event.preventDefault();
        window.setTimeout(() => setIsEditing(true), 0);
    };

    const handleCreateDraft = async (projectId: string, documentId: string) => {
        const response = await createNewDraftFile(projectId, documentId);

        console.log('handleCreateDraft response');
        console.log(response);

        if (response.status === 200) {
            toast.success('Draft created successfully');
        } else {
            toast.error('Something went wrong');
        }
    };

    const handleDeleteDocument = async (
        projectId: string,
        documentId: string
    ) => {
        const response = await deleteFile(projectId, documentId);

        if (response.status === 200) {
            toast.success('Document deleted successfully');

            const docPath = `/${projectId}/${documentId}`;
            if (pathname === docPath) {
                window.location.replace('/home');
            }
        } else {
            toast.error('Something went wrong');
        }
    };

    return (
        <SidebarMenuSubItem key={doc.title}>
            <SidebarMenuSubButton
                asChild
                className={`${
                    pathname === doc.url || pathname.startsWith(`${doc.url}`)
                        ? 'bg-secondary'
                        : ''
                }`}>
                <span className="flex justify-between">
                    {!isEditing && (
                        <a href={doc.url}>
                            <span>{fileName}</span>
                        </a>
                    )}
                    {isEditing && (
                        <form
                            ref={formRef}
                            action={formAction}
                            className="flex-1">
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
                                value={doc.url.split('/')[2] ?? ''}
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
                                            setFileName(doc.title);
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
                                        className="cursor-pointer"
                                        onSelect={(event) =>
                                            handleOnSelectRename(event)
                                        }>
                                        Rename
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onSelect={() =>
                                            handleCreateDraft(
                                                projectId,
                                                doc.url.split('/')[2]
                                            )
                                        }>
                                        Create Draft
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground"
                                        onSelect={() =>
                                            handleDeleteDocument(
                                                projectId,
                                                doc.url.split('/')[2]
                                            )
                                        }>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {hasDrafts && (
                            <CollapsibleTrigger className="flex items-center justify-center transition-transform data-[state=open]:rotate-90">
                                <ChevronRight className="max-w-3.5 max-h-3.5 cursor-pointer" />
                            </CollapsibleTrigger>
                        )}
                    </span>
                </span>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
}
