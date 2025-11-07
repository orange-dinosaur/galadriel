import z from 'zod';

export const newProjectSchema = z.object({
    name: z.string(),
    private: z.boolean(),
    image: z.string().optional(),
    type: z.string(),
    tags: z.string().optional(),
    description: z.string().optional(),
});
