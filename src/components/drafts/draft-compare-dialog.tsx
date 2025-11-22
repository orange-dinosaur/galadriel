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
            const mainTokens = flattenDocument(mainFileContent);
            const draftTokens = flattenDocument(draftContent);

            const mainText = mainTokens.map(serializeToken).join('\n');
            const draftText = draftTokens.map(serializeToken).join('\n');

            const calculatedDiffs = Diff.diffLines(mainText, draftText);
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

    // Token-based diffing implementation

    interface BlockContext {
        type: string;
        attrs?: Record<string, any>;
    }

    interface Token {
        text: string;
        marks: string[];
        blockStack: BlockContext[];
        isSeparator?: boolean;
    }

    function flattenDocument(
        node: any,
        blockStack: BlockContext[] = []
    ): Token[] {
        if (!node) return [];

        if (node.type === 'text') {
            const text = node.text || '';
            if (!text) return [];

            const marks = (node.marks || []).map((m: any) => m.type).sort();

            // Split by whitespace to allow word-level diffing, but preserve whitespace tokens
            return text
                .split(/(\s+)/)
                .map((part: string) => {
                    if (part.length === 0) return null;
                    return {
                        text: part,
                        marks,
                        blockStack: [...blockStack],
                    };
                })
                .filter((t: any) => t !== null) as Token[];
        }

        if (node.content) {
            const currentBlock: BlockContext = {
                type: node.type,
                attrs: node.attrs,
            };

            // Don't add 'doc' to the stack
            const newStack =
                node.type === 'doc'
                    ? blockStack
                    : [...blockStack, currentBlock];

            const tokens = node.content.flatMap((child: any) =>
                flattenDocument(child, newStack)
            );

            // If block has no content (empty paragraph), emit a placeholder token
            if (tokens.length === 0 && node.type !== 'doc') {
                return [
                    {
                        text: '', // Empty text
                        marks: [],
                        blockStack: [...newStack],
                    },
                    {
                        text: '',
                        marks: [],
                        blockStack: [...newStack],
                        isSeparator: true,
                    },
                ];
            }

            // Add a separator token at the end of the block content
            // This ensures that adjacent blocks are separated
            if (node.type !== 'doc') {
                tokens.push({
                    text: '',
                    marks: [],
                    blockStack: [...newStack],
                    isSeparator: true,
                });
            }

            return tokens;
        }

        // Handle image as a special token
        if (node.type === 'image') {
            const currentBlock: BlockContext = {
                type: node.type,
                attrs: node.attrs,
            };
            return [
                {
                    text: '📷', // Placeholder for image
                    marks: [],
                    blockStack: [...blockStack, currentBlock],
                },
                {
                    text: '',
                    marks: [],
                    blockStack: [...blockStack, currentBlock],
                    isSeparator: true,
                },
            ];
        }

        return [];
    }

    function serializeToken(token: Token): string {
        if (token.isSeparator) {
            return '<<<SEPARATOR>>>';
        }
        // Delimiter that is unlikely to appear in text
        const SEP = '|||';
        const marksStr = token.marks.join(',');
        const stackStr = JSON.stringify(token.blockStack);
        return `${token.text}${SEP}${marksStr}${SEP}${stackStr}`;
    }

    function deserializeToken(str: string): Token {
        if (str === '<<<SEPARATOR>>>') {
            return {
                text: '',
                marks: [],
                blockStack: [],
                isSeparator: true,
            };
        }

        const SEP = '|||';
        const parts = str.split(SEP);

        const stackStr = parts.pop()!;
        const marksStr = parts.pop()!;
        const text = parts.join(SEP);

        return {
            text,
            marks: marksStr ? marksStr.split(',') : [],
            blockStack: JSON.parse(stackStr),
        };
    }

    function RenderDiff({ diffs }: { diffs: Diff.Change[] }) {
        // Flatten the diff changes into a single list of tokens with status
        const tokens: {
            token: Token;
            status: 'added' | 'removed' | 'unchanged';
        }[] = [];

        diffs.forEach((part) => {
            const status = part.added
                ? 'added'
                : part.removed
                ? 'removed'
                : 'unchanged';

            const lines = part.value.split('\n');
            lines.forEach((line) => {
                if (!line) return;
                tokens.push({
                    token: deserializeToken(line),
                    status,
                });
            });
        });

        if (tokens.length === 0) return null;

        // Grouping logic
        const groups: React.ReactNode[] = [];
        let currentGroup: {
            token: Token;
            status: 'added' | 'removed' | 'unchanged';
        }[] = [];

        // Helper to check if stacks are equal
        const stacksEqual = (s1: BlockContext[], s2: BlockContext[]) => {
            if (!s1 || !s2) return false;
            if (s1.length !== s2.length) return false;
            for (let i = 0; i < s1.length; i++) {
                if (s1[i].type !== s2[i].type) return false;
                if (JSON.stringify(s1[i].attrs) !== JSON.stringify(s2[i].attrs))
                    return false;
            }
            return true;
        };

        for (let i = 0; i < tokens.length; i++) {
            const item = tokens[i];

            // If it's a separator, we finish the current group and start a new one
            if (item.token.isSeparator) {
                if (currentGroup.length > 0) {
                    groups.push(renderGroup(currentGroup, groups.length));
                    currentGroup = [];
                }
                continue;
            }

            if (currentGroup.length === 0) {
                currentGroup.push(item);
                continue;
            }

            const prevItem = currentGroup[currentGroup.length - 1];

            // We group by block stack.
            if (stacksEqual(prevItem.token.blockStack, item.token.blockStack)) {
                currentGroup.push(item);
            } else {
                groups.push(renderGroup(currentGroup, groups.length));
                currentGroup = [item];
            }
        }

        if (currentGroup.length > 0) {
            groups.push(renderGroup(currentGroup, groups.length));
        }

        function renderGroup(
            group: {
                token: Token;
                status: 'added' | 'removed' | 'unchanged';
            }[],
            key: number
        ) {
            if (group.length === 0) return null;

            const stack = group[0].token.blockStack;

            // Recursive rendering of the stack
            const renderContent = () => (
                <>
                    {group.map((item, idx) => {
                        let content: React.ReactNode = item.token.text;

                        // Handle empty tokens (e.g. empty paragraph)
                        if (item.token.text === '') {
                            content = <br />;
                        }

                        // Apply marks
                        if (item.token.marks.includes('bold'))
                            content = <strong>{content}</strong>;
                        if (item.token.marks.includes('italic'))
                            content = <em>{content}</em>;
                        if (item.token.marks.includes('strike'))
                            content = <s>{content}</s>;
                        if (item.token.marks.includes('underline'))
                            content = <u>{content}</u>;
                        if (item.token.marks.includes('highlight'))
                            content = <mark>{content}</mark>;
                        if (item.token.marks.includes('code'))
                            content = (
                                <code className="bg-muted px-1 rounded">
                                    {content}
                                </code>
                            );

                        // Apply diff color
                        let className = '';
                        if (item.status === 'added')
                            className =
                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
                        if (item.status === 'removed')
                            className =
                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';

                        return (
                            <span key={idx} className={className}>
                                {content}
                            </span>
                        );
                    })}
                </>
            );

            // Wrap content in stack elements
            let result = renderContent();

            // Iterate stack in reverse to wrap from inside out
            for (let i = stack.length - 1; i >= 0; i--) {
                const block = stack[i];
                switch (block.type) {
                    case 'paragraph':
                        result = <p className="mb-2 min-h-[1.5em]">{result}</p>;
                        break;
                    case 'heading':
                        const Level = `h${block.attrs?.level || 1}` as any;
                        result = (
                            <Level className="font-bold mb-2 mt-4">
                                {result}
                            </Level>
                        );
                        break;
                    case 'bulletList':
                        result = (
                            <ul className="list-disc ml-4 mb-2">{result}</ul>
                        );
                        break;
                    case 'orderedList':
                        result = (
                            <ol className="list-decimal ml-4 mb-2">{result}</ol>
                        );
                        break;
                    case 'listItem':
                        result = <li>{result}</li>;
                        break;
                    case 'blockquote':
                        result = (
                            <blockquote className="border-l-4 pl-4 italic mb-2">
                                {result}
                            </blockquote>
                        );
                        break;
                    case 'codeBlock':
                        result = (
                            <pre className="bg-muted p-2 rounded mb-2 overflow-x-auto">
                                <code>{result}</code>
                            </pre>
                        );
                        break;
                }
            }

            return <div key={key}>{result}</div>;
        }

        return <div className="font-sans">{groups}</div>;
    }

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
                            <RenderDiff diffs={diffs} />
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
