'use server';

import { newProjectSchema } from '@/db/schemas';
import axiosInstance from '@/lib/axiosInstance';
import { NewProjectFormState } from '@/lib/custom-types';

export async function createNewProject(
    initialState: any,
    formData: FormData
): Promise<NewProjectFormState> {
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
        returnState.status = 400;
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

    if (response.status !== 200) {
        return { status: response.status, message: response.data.message };
    }

    return { status: 200, message: 'Project created successfully' };
}

export async function deleteProject(projectId: string) {
    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/projects/${projectId}`,
        'delete'
    );

    if (response.status !== 200) {
        return { status: response.status, message: response.data.message };
    }

    return { status: 200, message: 'Project deleted successfully' };
}
