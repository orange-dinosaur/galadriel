import z from 'zod';

export const newProjectSchema = z.object({
    name: z.string(),
    private: z.boolean(),
});
