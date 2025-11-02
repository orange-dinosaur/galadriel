export const defaultFontColor: string =
    process.env.NEXT_PUBLIC_DEFAULT_FONT_COLOR || '#000000';

export const colorsObj: { label: string; value: string }[] = [
    { label: 'Black', value: '#000000' },
    { label: 'White', value: '#FFFFFF' },
    { label: 'Red', value: '#FF0000' },
    { label: 'Green', value: '#00FF00' },
    { label: 'Blue', value: '#0000FF' },
    { label: 'Yellow', value: '#FFFF00' },
    { label: 'Orange', value: '#FFA500' },
];

export const colorsArr: string[] = colorsObj.map((color) => color.value);

export const colorsHighlightObj: { label: string; value: string }[] = [
    { label: 'Black', value: '#000000' },
    { label: 'White', value: '#FFFFFF' },
    { label: 'Red', value: '#FF0000' },
    { label: 'Green', value: '#00FF00' },
    { label: 'Blue', value: '#0000FF' },
    { label: 'Yellow', value: '#FFFF00' },
    { label: 'Orange', value: '#FFA500' },
];

export const ccolorsHighlightArr: string[] = colorsHighlightObj.map(
    (color) => color.value
);
