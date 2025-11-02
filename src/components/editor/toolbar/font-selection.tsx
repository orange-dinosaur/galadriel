import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { defaultFontFamily, fonts } from '@/components/editor/text-style/fonts';

type FontFamilySelectionProps = {
    editor: Editor | null;
};

const FontFamilySelection = ({ editor }: FontFamilySelectionProps) => {
    const [open, setOpen] = useState(false);
    const [, forceUpdate] = useState(0); // used only to trigger re-render

    useEffect(() => {
        if (!editor) return;

        const refresh = () => {
            // advance a dummy counter so React re-renders
            forceUpdate((count) => count + 1);
        };

        editor.on('selectionUpdate', refresh);
        editor.on('transaction', refresh);

        return () => {
            editor.off('selectionUpdate', refresh);
            editor.off('transaction', refresh);
        };
    }, [editor]);

    const currentFont =
        editor?.getAttributes('textStyle').fontFamily ?? defaultFontFamily;

    const handleSelect = (fontValue: string) => {
        const fontToApply =
            fonts.find((font) => font.value === fontValue)?.value ??
            defaultFontFamily;

        editor?.chain().focus().setFontFamily(fontToApply).run();
        setOpen(false);
        forceUpdate((count) => count + 1); // immediate update for the label/check
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[150px] justify-between">
                    {fonts.find((font) => font.value === currentFont)?.label ??
                        'Select font...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search font..." />
                    <CommandList>
                        <CommandEmpty>No font found.</CommandEmpty>
                        <CommandGroup>
                            {fonts.map((font) => (
                                <CommandItem
                                    key={font.value}
                                    value={font.value}
                                    onSelect={() => handleSelect(font.value)}>
                                    <CheckIcon
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            currentFont === font.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    <span style={{ fontFamily: font.value }}>
                                        {font.label}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default FontFamilySelection;
