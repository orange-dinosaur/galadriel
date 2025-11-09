'use server';

import { redirect } from 'next/navigation';
import { signupSchema } from '@/actions/schemas';
import { createAdminClient } from '@/appwrite/config';
import { AppwriteException, ID } from 'node-appwrite';
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
        const failedFields = [];

        const formattedErrors = validatedFields.error.format();
        if (formattedErrors.username?._errors) {
            failedFields.push(
                `username: ${formattedErrors.username._errors[0]}`
            );
        }
        if (formattedErrors.email?._errors)
            failedFields.push(`email: ${formattedErrors.email._errors[0]}`);
        if (formattedErrors.password?._errors)
            failedFields.push(
                `password: ${formattedErrors.password._errors[0]}`
            );
        if (formattedErrors.confirmPassword?._errors)
            failedFields.push(
                `confirm password: ${formattedErrors.confirmPassword._errors[0]}`
            );

        // return directly the fields taken from the formData
        returnState.username = formData.get('username') as string;
        returnState.email = formData.get('email') as string;
        returnState.password = formData.get('password') as string;
        returnState.confirmPassword = formData.get(
            'confirm-password'
        ) as string;

        returnState.status = 400;
        returnState.message = failedFields.join(', ');
        return returnState;
    }

    try {
        const { account } = await createAdminClient();

        /* TODO: force username to be unique */
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
    } catch (error: AppwriteException | any) {
        if (isRedirectError(error)) {
            redirect('/home');
        }

        if (error instanceof AppwriteException) {
            returnState.status = error.code;
            returnState.message = error.message;
            return returnState;
        }

        returnState.status = 500;
        returnState.message = 'Error while creating user';
        return returnState;
    }
}
