import { createAdminClient } from '@/appwrite/config';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('userId') || '';
    const secret = request.nextUrl.searchParams.get('secret') || '';

    const { account } = await createAdminClient();
    const session = await account.createSession({
        userId,
        secret,
    });

    if (!session || !session.secret) {
        return new NextResponse('Failed to create session from token', {
            status: 400,
        });
    }

    (await cookies()).set('session', session.secret, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        expires: new Date(session.expire),
        path: '/',
    });

    return NextResponse.redirect(`${request.nextUrl.origin}/home`);
}
