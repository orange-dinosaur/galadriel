'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DbDocumentRow, NewFileFormState } from '@/lib/custom-types';
import { Edit3Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { createNewFile, deleteFile, updateFileName } from '@/actions/documents';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { set } from 'zod';

export function DocumentCard({
    document,
    type,
}: {
    document: {
        userId: string;
        projectId: string;
        title: string;
        fileId: string;
        drafts?: string[];
        $id: string;
        $createdAt: Date;
        $updatedAt: Date;
    };
    type: 'display' | 'add';
}) {
    const router = useRouter();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [fileNameToCreate, setFileNameToCreate] = useState('');
    const initialStateCreateDocument: NewFileFormState = {};
    const [
        stateCreateDocument,
        formActionCreateDocument,
        pendingCreateDocument,
    ] = useActionState(createNewFile, initialStateCreateDocument);
    useEffect(() => {
        if (stateCreateDocument && stateCreateDocument.status === 200) {
            setFileNameToCreate('');
            setIsCreateDialogOpen(false);
            toast.success('Document created successfully');
            router.refresh();
        }
    }, [stateCreateDocument]);

    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [fileNameToUpdate, setFileNameToUpdate] = useState('');
    const initialStateUpdateDocument: NewFileFormState = {};
    const [
        stateUpdateDocument,
        formActionUpdateDocument,
        pendingUpdateDocument,
    ] = useActionState(updateFileName, initialStateUpdateDocument);
    useEffect(() => {
        if (stateUpdateDocument && stateUpdateDocument.status === 200) {
            setFileNameToUpdate('');
            setIsUpdateDialogOpen(false);
            toast.success('Document updated successfully');
            router.refresh();
        }
    }, [stateUpdateDocument]);

    const handleDeleteDocument = async () => {
        const response = await deleteFile(document.projectId, document.$id);

        if (response.status === 200) {
            toast.success('Document deleted successfully');
            router.refresh();
        } else {
            toast.error('Something went wrong');
        }
    };

    return (
        <Card className="w-max-[250px] w-[250px] h-max-[350px] h-[350px] p-0 bg-secondary rounded-lg shadow-lg gap-0 ">
            {type === 'display' ? (
                <span>
                    <Link href={`/${document.projectId}/${document.$id}`}>
                        <CardHeader className="p-0">
                            <img
                                className="w-max-[250px] w-[250px] h-max-[200px] h-[200px] object-cover rounded-t-lg shadow-lg"
                                alt="project cover"
                                src={
                                    process.env
                                        .NEXT_PUBLIC_DOCUMENT_IMAGE_ENDPOINT
                                }
                            />
                        </CardHeader>
                        <CardContent className="pt-3">
                            <CardTitle>{document.title}</CardTitle>
                            <CardDescription className="pt-3 pb-4">
                                Last modified:{' '}
                                {document.$updatedAt.toLocaleDateString()}
                            </CardDescription>
                        </CardContent>
                    </Link>
                    <CardFooter className="flex justify-end items-baseline pt-6 gap-4">
                        <Dialog
                            open={isUpdateDialogOpen}
                            onOpenChange={(open) => {
                                setIsUpdateDialogOpen(open);
                                if (!open) {
                                    setFileNameToUpdate('');
                                }
                            }}>
                            <DialogTrigger asChild>
                                <div className="">
                                    <Edit3Icon className="max-w-4.5 max-h-4.5 cursor-pointer" />
                                </div>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[425px]">
                                <form
                                    action={formActionUpdateDocument}
                                    className="flex flex-col gap-4">
                                    <DialogHeader className="pb-1">
                                        <DialogTitle>
                                            Update document
                                        </DialogTitle>
                                        <DialogDescription>
                                            Enter the new name of the document
                                        </DialogDescription>
                                    </DialogHeader>
                                    <input
                                        type="hidden"
                                        id="projectId"
                                        name="projectId"
                                        value={document.projectId}
                                    />
                                    <input
                                        type="hidden"
                                        id="documentId"
                                        name="documentId"
                                        value={document.$id}
                                    />
                                    <div className="grid gap-4">
                                        <Input
                                            id="fileName"
                                            name="fileName"
                                            value={fileNameToUpdate}
                                            required
                                            onChange={(e) =>
                                                setFileNameToUpdate(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <DialogFooter className="pt-3">
                                        <DialogClose asChild>
                                            <Button
                                                variant="outline"
                                                className="cursor-pointer"
                                                disabled={
                                                    pendingUpdateDocument
                                                }>
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            type="submit"
                                            disabled={pendingUpdateDocument}
                                            className="cursor-pointer">
                                            {pendingUpdateDocument && (
                                                <Spinner />
                                            )}
                                            Update document
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <button onClick={handleDeleteDocument}>
                            <Trash2Icon className="max-w-4.5 max-h-4.5 hover:text-destructive cursor-pointer" />
                        </button>
                    </CardFooter>
                </span>
            ) : (
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={(open) => {
                        setIsCreateDialogOpen(open);
                        if (!open) {
                            setFileNameToCreate('');
                        }
                    }}>
                    <DialogTrigger asChild>
                        <div className="flex items-center justify-center w-full h-full">
                            <PlusIcon className="max-w-32 w-32 max-h-32 h-32 text-muted-foreground cursor-pointer hover:text-primary" />
                        </div>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <form
                            action={formActionCreateDocument}
                            className="flex flex-col gap-4">
                            <DialogHeader className="pb-1">
                                <DialogTitle>Create document</DialogTitle>
                                <DialogDescription>
                                    Enter the name of the document you want to
                                    create
                                </DialogDescription>
                            </DialogHeader>
                            <input
                                type="hidden"
                                id="projectId"
                                name="projectId"
                                value={document.projectId}
                            />
                            <div className="grid gap-4">
                                <Input
                                    id="fileName"
                                    name="fileName"
                                    value={fileNameToCreate}
                                    required
                                    onChange={(e) =>
                                        setFileNameToCreate(e.target.value)
                                    }
                                />
                            </div>
                            <DialogFooter className="pt-3">
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        disabled={pendingCreateDocument}>
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button
                                    type="submit"
                                    disabled={pendingCreateDocument}
                                    className="cursor-pointer">
                                    {pendingCreateDocument && <Spinner />}
                                    Create document
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
}
