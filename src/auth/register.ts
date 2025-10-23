'use server';

import { redirect } from 'next/navigation';
import { signupSchema } from '@/auth/schemas';
import { createAdminClient } from '@/appwrite/config';
import { ID } from 'node-appwrite';
import { cookies } from 'next/headers';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { RegisterFormState } from '@/lib/custom-types';

// TODO: Add account verification after registration
export async function registerUser(
    initialState: RegisterFormState,
    formData: FormData
): Promise<RegisterFormState> {
    const validatedFields = signupSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirm-password'),
    });

    const returnState: RegisterFormState = {
        username: validatedFields.data?.username,
        email: validatedFields.data?.email,
        password: validatedFields.data?.password,
        confirmPassword: validatedFields.data?.confirmPassword,
    };

    if (!validatedFields.success) {
        // TODO: return only error message
        returnState.code = 400;
        returnState.message = validatedFields.error.message;
        return returnState;
    }

    if (
        validatedFields.data.password !== validatedFields.data.confirmPassword
    ) {
        returnState.code = 400;
        returnState.message = 'Passwords do not match';
        return returnState;
    }

    try {
        const { account } = await createAdminClient();

        await account.create({
            userId: ID.unique(),
            email: validatedFields.data.email,
            password: validatedFields.data.password,
            name: validatedFields.data.username,
        });

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

        redirect('/home');
    } catch (error) {
        if (isRedirectError(error)) {
            redirect('/home');
        }

        returnState.code = 500;
        returnState.message = 'Error while creating user';
        return returnState;
    }
}
