'use server';

import { cookies } from 'next/headers';
import { createAdminClient, createSessionClient } from '@/appwrite/config';
import { redirect } from 'next/navigation';
import { AuthenticatedUser, user } from '@/auth/user';
import { loginSchema } from '@/auth/schemas';
import { LoginFormState } from '@/lib/custom-types';

export async function createSession(
    initialState: any,
    formData: FormData
): Promise<LoginFormState> {
    const validatedFields = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    const returnState: LoginFormState = {
        email: validatedFields.data?.email,
        password: validatedFields.data?.password,
    };

    if (!validatedFields.success) {
        // TODO: return only error message
        returnState.code = 400;
        returnState.message = validatedFields.error.message;
        return returnState;
    }

    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession({
            email: validatedFields.data.email,
            password: validatedFields.data.password,
        });

        (await cookies()).set('session', session.secret, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            expires: new Date(session.expire),
            path: '/',
        });
    } catch (error) {
        returnState.code = 401;
        returnState.message = 'Invalid email or password';
        return returnState;
    }

    redirect('/home');
}

export async function deleteSession() {
    user.sessionCookie = (await cookies()).get('session');

    try {
        const { account } = await createSessionClient(user.sessionCookie.value);
        await account.deleteSession({
            sessionId: 'current',
        });
    } catch (error) {}

    (await cookies()).delete('session');
    user.user = AuthenticatedUser.empty();
    user.sessionCookie = null;

    redirect('/login');
}
