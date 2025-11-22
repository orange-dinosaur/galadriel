'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getFile } from '@/actions/documents';
import { mergeDraft, getDraft } from '@/actions/drafts';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import * as Diff from 'diff';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DraftCompareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    documentId: string;
    draftId: string;

    draftTitle: string;
}

export function DraftCompareDialog({
    open,
    onOpenChange,
    projectId,
    documentId,
    draftId,
    draftTitle,
}: DraftCompareDialogProps) {
    const [mainFileContent, setMainFileContent] = useState<any>(null);
    const [draftContent, setDraftContent] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [merging, setMerging] = useState(false);
    const [diffs, setDiffs] = useState<Diff.Change[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            setLoading(true);

            Promise.all([
                getFile(projectId, documentId),
                getDraft(projectId, documentId, draftId),
            ])
                .then(([mainFileRes, draftRes]) => {
                    if (mainFileRes.status === 200 && mainFileRes.data) {
                        // @ts-ignore
                        let content = mainFileRes.data.fileContentJson;
                        if (typeof content === 'string') {
                            content = JSON.parse(content);
                        }
                        setMainFileContent(content);
                    } else {
                        toast.error('Failed to load main document');
                    }

                    if (draftRes.status === 200 && draftRes.data) {
                        // @ts-ignore
                        let content = draftRes.data.fileContentJson;
                        if (typeof content === 'string') {
                            content = JSON.parse(content);
                        }
                        setDraftContent(content);
                    } else {
                        toast.error('Failed to load draft');
                    }
                })
                .catch(() => {
                    toast.error('Failed to load documents');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open, projectId, documentId, draftId]);

    useEffect(() => {
        if (mainFileContent && draftContent) {
            const getText = (node: any): string => {
                if (node.type === 'text') {
                    return node.text || '';
                }
                if (node.content) {
                    return node.content.map(getText).join('');
                }
                if (node.type === 'paragraph') {
                    return '\n';
                }
                return '';
            };

            const mainText = getText({ content: mainFileContent.content });
            const draftText = getText({ content: draftContent.content });

            // const calculatedDiffs = Diff.diffLines(mainText, draftText);
            const calculatedDiffs = Diff.diffWords(mainText, draftText);
            setDiffs(calculatedDiffs);
        }
    }, [mainFileContent, draftContent]);

    const handleMerge = async () => {
        setMerging(true);
        try {
            const res = await mergeDraft(projectId, documentId, draftId);
            if (res.status === 200) {
                toast.success('Draft merged successfully');
                onOpenChange(false);
                router.push(`/${projectId}/${documentId}`);
                router.refresh();
            } else {
                toast.error(res.message || 'Failed to merge draft');
            }
        } catch (error) {
            toast.error('Failed to merge draft');
        } finally {
            setMerging(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[80vw] sm:max-w-[80vw] h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Compare Draft: {draftTitle}</DialogTitle>
                    <DialogDescription>
                        <b>Project:</b> ({projectId})
                    </DialogDescription>
                    <DialogDescription className="mb-1">
                        <b>Document:</b> ({documentId})
                    </DialogDescription>
                    <DialogDescription>
                        Review changes before merging into the main document.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden border rounded-md p-4 bg-muted/50">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            Loading...
                        </div>
                    ) : (
                        <ScrollArea className="h-full w-full">
                            <div className="font-mono text-sm whitespace-pre-wrap">
                                {diffs.map((part, index) => {
                                    const color = part.added
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : part.removed
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        : 'text-foreground';
                                    return (
                                        <span key={index} className={color}>
                                            {part.value}
                                        </span>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={merging}
                        className="cursor-pointer">
                        Cancel
                    </Button>

                    <Button
                        variant={'default'}
                        onClick={handleMerge}
                        disabled={merging || loading}
                        className="cursor-pointer">
                        {merging ? 'Merging...' : 'Merge Draft'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
