import z from 'zod';

export const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export const signupSchema = z
    .object({
        username: z.string(),
        email: z.email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export const newProjectSchema = z.object({
    name: z.string(),
    private: z.boolean(),
    image: z.string().optional(),
    type: z.string(),
    tags: z.string().optional(),
    description: z.string().optional(),
});

export const newFileSchema = z.object({
    fileName: z.string().nonempty(),
});
