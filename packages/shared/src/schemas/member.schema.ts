import { z } from 'zod';

export const createMemberSchema = z.object({
    name: z.string().trim().min(1, {
        message: 'Name is required'
    })
});

export type createMemberInput = z.infer<typeof createMemberSchema>;