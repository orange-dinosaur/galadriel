import type { Metadata } from 'next';
import {
    Arsenal,
    Geist,
    Geist_Mono,
    IBM_Plex_Mono,
    IBM_Plex_Sans,
    IBM_Plex_Serif,
    Newsreader,
    Roboto,
} from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const arsenalSerif = Arsenal({
    variable: '--font-arsenal-serif',
    weight: ['400', '700'],
});

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
    variable: '--font-ibm-plex-mono',
    weight: ['400', '700'],
});

const ibmPlexSans = IBM_Plex_Sans({
    variable: '--font-ibm-plex-sans',
    subsets: ['latin'],
});

const ibmPlexSerif = IBM_Plex_Serif({
    variable: '--font-ibm-plex-serif',
    weight: ['400', '700'],
});

const newsreaderSerif = Newsreader({
    variable: '--font-newsreader-serif',
    subsets: ['latin'],
});

const robotoSans = Roboto({
    variable: '--font-roboto-sans',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Galadriel',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${arsenalSerif.variable} ${geistSans.variable} ${geistMono.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable} ${ibmPlexSerif.variable} ${newsreaderSerif.variable} ${robotoSans.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange>
                    {children}
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
}
