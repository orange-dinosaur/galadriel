export const defaultFontFamily: string =
    process.env.NEXT_PUBLIC_DEFAULT_FONT_FAMILY || 'Geist';

export const fonts: { label: string; value: string }[] = [
    { label: 'Arsenal', value: 'Arsenal' },
    { label: 'Geist', value: 'Geist' },
    { label: 'Geist Mono', value: 'Geist Mono' },
    { label: 'IBM Plex Mono', value: 'IBM Plex Mono' },
    { label: 'IBM Plex Sans', value: 'IBM Plex Sans' },
    { label: 'IBM Plex Serif', value: 'IBM Plex Serif' },
    { label: 'Newsreader', value: 'Newsreader' },
    { label: 'Roboto', value: 'Roboto' },
];
