'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import { MoreHorizontalIcon, CheckIcon } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { deleteFile, updateFileName } from '@/actions/documents';
import { toast } from 'sonner';
import { redirect, RedirectType, useRouter } from 'next/navigation';
import { NewFileFormState } from '@/lib/custom-types';
import { Spinner } from '@/components/ui/spinner';

export function DocumentActionSidebarMenuSubItem({
    pathname,
    projectId,
    document: doc,
}: {
    pathname: string;
    projectId: string;
    document: { title: string; url: string };
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
                    </span>
                </span>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
}
