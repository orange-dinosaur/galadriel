'use server';

import { newProjectSchema } from '@/actions/schemas';
import axiosInstance from '@/lib/axiosInstance';
import {
    createNewProject as createNewP,
    DeleteProjectById,
    updateProjectById,
} from '@/db/projects';
import { customArraySeparator, NewProjectFormState } from '@/lib/custom-types';

export async function createNewProject(
    initialState: any,
    formData: FormData
): Promise<NewProjectFormState> {
    const validatedFields = newProjectSchema.safeParse({
        name: formData.get('name'),
        private: formData.get('private') === 'on' ? true : false,
        image: formData.get('image'),
        type: formData.get('type'),
        tags: formData.get('tags'),
        description: formData.get('description'),
    });

    const returnState: NewProjectFormState = {
        name: validatedFields.data?.name,
        private: validatedFields.data?.private,
        image: validatedFields.data?.image,
        type: validatedFields.data?.type,
        description: validatedFields.data?.description,
    };
    if (validatedFields.data?.tags) {
        returnState.tags =
            validatedFields.data.tags.split(customArraySeparator);
    }

    if (!validatedFields.success) {
        // TODO: return only error message
        returnState.status = 400;
        returnState.message = validatedFields.error.message;
        return returnState;
    }

    if (validatedFields.data?.type === '') {
        // TODO: return only error message
        returnState.status = 400;
        returnState.message = 'type is mandatory';
        return returnState;
    }

    const body: {
        name: string;
        private: boolean;
        image: string;
        type: string;
        tags?: string[];
        description?: string;
    } = {
        name: validatedFields.data.name,
        private: validatedFields.data.private,
        image:
            process.env.NEXT_PUBLIC_PROJECT_IMAGE_ENDPOINT +
            validatedFields.data.name,
        type: validatedFields.data.type,
    };
    if (validatedFields.data.image) {
        body.image = validatedFields.data.image;
    }
    if (validatedFields.data.tags)
        body.tags = validatedFields.data.tags.split(customArraySeparator);
    if (validatedFields.data.description)
        body.description = validatedFields.data.description;

    const response = await createNewP(body);

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'Project created successfully' };
}

export async function updateProject(
    initialState: any,
    formData: FormData
): Promise<NewProjectFormState> {
    const validatedFields = newProjectSchema.safeParse({
        name: formData.get('name'),
        private: formData.get('private') === 'on' ? true : false,
        image: formData.get('image'),
        type: formData.get('type'),
        tags: formData.get('tags'),
        description: formData.get('description'),
    });

    const returnState: NewProjectFormState = {
        name: validatedFields.data?.name,
        private: validatedFields.data?.private,
        image: validatedFields.data?.image,
        type: validatedFields.data?.type,
        description: validatedFields.data?.description,
    };
    if (validatedFields.data?.tags) {
        returnState.tags =
            validatedFields.data.tags.split(customArraySeparator);
    }

    const projectId = formData.get('projectId');
    if (!projectId) {
        returnState.status = 400;
        returnState.message = 'projectId is mandatory';
        return returnState;
    }

    if (!validatedFields.success) {
        // TODO: return only error message
        returnState.status = 400;
        returnState.message = validatedFields.error.message;
        return returnState;
    }

    if (validatedFields.data?.type === '') {
        // TODO: return only error message
        returnState.status = 400;
        returnState.message = 'type is mandatory';
        return returnState;
    }

    const body: {
        name: string;
        private: boolean;
        image: string;
        type: string;
        tags?: string[];
        description?: string;
    } = {
        name: validatedFields.data.name,
        private: validatedFields.data.private,
        image:
            process.env.NEXT_PUBLIC_PROJECT_IMAGE_ENDPOINT +
            validatedFields.data.name,
        type: validatedFields.data.type,
    };
    if (validatedFields.data.image) {
        body.image = validatedFields.data.image;
    }
    if (validatedFields.data.tags)
        body.tags = validatedFields.data.tags.split(customArraySeparator);
    if (validatedFields.data.description)
        body.description = validatedFields.data.description;

    const response = await updateProjectById(projectId as string, body);

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'Project created successfully' };
}

export async function deleteProject(projectId: string) {
    const response = await DeleteProjectById(projectId);

    if (response.status !== 200) {
        return { status: response.status, message: response.message };
    }

    return { status: 200, message: 'Project deleted successfully' };
}
