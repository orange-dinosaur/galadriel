'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { createNewFile } from '@/actions/documents';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { NewFileFormState } from '@/lib/custom-types';
import { Spinner } from '@/components/ui/spinner';

export function AddDcoumentSidebarMenuSubItem({
    projectId,
    onDocumentSuccessfullyAdded,
}: {
    projectId: string;
    onDocumentSuccessfullyAdded: () => void;
}) {
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

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (
                formRef.current &&
                !formRef.current.contains(event.target as Node)
            ) {
                onDocumentSuccessfullyAdded(); // clears projectToAddDocumentTo
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        return () =>
            document.removeEventListener('mousedown', handlePointerDown);
    }, [onDocumentSuccessfullyAdded]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

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
                    className="border-0 border-b border-transparent bg-transparent py-0 text-sm font-medium focus-visible:border-primary focus-visible:ring-0 rounded-none"
                    required
                />
                <button type="submit" disabled={pending} className="mr-2 pl-2">
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
