import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { HighlighterIcon, PaletteIcon } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';
import {
    ColorResult,
    CompactPicker,
    TwitterPicker,
    SketchPicker,
} from 'react-color';
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

    const colorHighlightValue = editor?.getAttributes('highlight').color;

    const onColorChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    };

    const onHighlightColorChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({ color: color.hex }).run();
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
                    <SketchPicker
                        /* colors={colorsArr} */
                        color={colorValue}
                        onChange={onColorChange}
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="cursor-pointer font-bold"
                        variant={'ghost'}
                        size={'sm'}>
                        <HighlighterIcon
                            color={
                                colorHighlightValue == undefined
                                    ? 'white'
                                    : colorHighlightValue
                            }
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0">
                    <SketchPicker
                        /* colors={colorsArr} */
                        color={colorHighlightValue}
                        onChange={onHighlightColorChange}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </ButtonGroup>
    );
};

export default ToolbarColors;
