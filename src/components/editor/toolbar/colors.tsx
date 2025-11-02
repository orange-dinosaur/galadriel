import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { HighlighterIcon, PaletteIcon } from 'lucide-react';
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from '@/components/ui/button-group';
import { ColorResult, CompactPicker, TwitterPicker } from 'react-color';
import {
    colorsArr,
    defaultFontColor,
} from '@/components/editor/text-style/colors';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from '@/components/ui/dropdown-menu';

type ToolbarColorsProps = {
    editor: Editor | null;
};

const ToolbarColors = ({ editor }: ToolbarColorsProps) => {
    const colorValue =
        editor?.getAttributes('textStyle').color || defaultFontColor;

    const onColorChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    };

    return (
        <ButtonGroup>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="cursor-pointer font-bold"
                        variant={'ghost'}
                        size={'sm'}>
                        <PaletteIcon
                            color={
                                colorValue == '#000000' ? 'white' : colorValue
                            }
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0">
                    {/* TODO: Fix how white is displayed */}
                    <TwitterPicker
                        colors={colorsArr}
                        color={colorValue}
                        onChange={onColorChange}
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                className="cursor-pointer font-bold"
                variant={
                    editor?.isActive('heading', { level: 2 })
                        ? 'outline'
                        : 'ghost'
                }
                size={'sm'}
                onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }>
                <HighlighterIcon />
            </Button>
        </ButtonGroup>
    );
};

export default ToolbarColors;
