'use client';

import React, {
    forwardRef,
    useActionState,
    useEffect,
    useRef,
    useState,
} from 'react';
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
import { createNewFile, deleteFile, updateFileName } from '@/db/documents';
import { toast } from 'sonner';
import { redirect, RedirectType, useRouter } from 'next/navigation';
import { NewFileFormState } from '@/lib/custom-types';
import { Spinner } from '@/components/ui/spinner';
import { set } from 'zod';

type AddDocumentProps = {
    pathname: string;
    projectId: string;
    onDocumentSuccessfullyAdded: () => void;
};

export const AddDcoumentSidebarMenuSubItem = forwardRef<
    HTMLDivElement,
    AddDocumentProps
>(
    (
        {
            pathname,
            projectId,
            onDocumentSuccessfullyAdded,
        }: {
            pathname: string;
            projectId: string;
            onDocumentSuccessfullyAdded: () => void;
        },
        ref
    ) => {
        const [fileName, setFileName] = useState('');
        const inputRef = useRef<HTMLInputElement>(null);
        const formRef = useRef<HTMLFormElement>(null);

        const initialState: NewFileFormState = {};
        const [state, formAction, pending] = useActionState(
            createNewFile,
            initialState
        );

        const router = useRouter();
        useEffect(() => {
            if (state && state.status && state.status === 200) {
                setFileName('');
                onDocumentSuccessfullyAdded();
                router.refresh();
                toast.success('Document created successfully');
            } else if (state && state.status && state.status !== 200) {
                toast.error('Something went wrong');
            }
        }, [state]);

        return (
            <form ref={formRef} action={formAction} className="flex-1">
                <input
                    type="hidden"
                    id="projectId"
                    name="projectId"
                    value={projectId ?? ''}
                />
                <div className="flex">
                    <Input
                        id="fileName"
                        type="text"
                        name="fileName"
                        value={fileName}
                        ref={inputRef}
                        onChange={(e) => setFileName(e.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                event.currentTarget.form?.requestSubmit();
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
        );
    }
);
AddDcoumentSidebarMenuSubItem.displayName = 'AddDcoumentSidebarMenuSubItem';
