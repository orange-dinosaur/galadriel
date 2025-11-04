'use server';

import { newProjectSchema } from '@/db/schemas';
import axiosInstance from '@/lib/axiosInstance';
import { NewProjectFormState } from '@/lib/custom-types';

export async function createNewProject(
    initialState: any,
    formData: FormData
): Promise<NewProjectFormState> {
    console.log('formData: ', formData);

    const validatedFields = newProjectSchema.safeParse({
        name: formData.get('name'),
        private: formData.get('private') === 'on' ? true : false,
    });

    const returnState: NewProjectFormState = {
        name: validatedFields.data?.name,
        private: validatedFields.data?.private,
    };

    if (!validatedFields.success) {
        // TODO: return only error message
        returnState.code = 400;
        returnState.message = validatedFields.error.message;
        return returnState;
    }

    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/projects/`,
        'post',
        {
            name: validatedFields.data.name,
            private: validatedFields.data.private,
        }
    );

    console.log('response: ', response);

    return { code: 200, message: 'Project created successfully' };

    /* const validatedFields = loginSchema.safeParse({
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

    redirect('/home'); */
}
