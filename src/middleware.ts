import { user } from '@/auth/user';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const u = await user.getUser();

    if (u.$id === '') {
        if (
            request.nextUrl.pathname === '/login' ||
            request.nextUrl.pathname === '/register'
        ) {
            request.cookies.delete('session');
        } else {
            request.cookies.delete('session');
            return NextResponse.redirect(new URL('/login', request.url));
        }
    } else {
        if (
            request.nextUrl.pathname === '/' ||
            request.nextUrl.pathname === '/login' ||
            request.nextUrl.pathname === '/register'
        ) {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         *  Match all request paths except for the ones starting with:
         *  - api (API routes)
         *  - _next/static (static files)
         *  - _next/image (image optimization files)
         *  - any path containing a dot (static files like .png, .svg, .ico)
         */
        '/((?!api|_next/static|_next/image|.*\\..*).*)',
    ],
};
