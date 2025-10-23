'use server';

import { createAdminClient } from '@/appwrite/config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { OAuthProvider } from 'node-appwrite';

export async function signupWithGoogle() {
    const { account } = await createAdminClient();

    const origin = (await headers()).get('origin');

    const redirectUrl = await account.createOAuth2Token({
        provider: OAuthProvider.Google,
        success: `${origin}/oauth`,
        failure: `${origin}/signup`,
    });

    return redirect(redirectUrl);
}
