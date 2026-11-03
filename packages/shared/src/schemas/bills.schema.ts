import { z } from 'zod';

export const createBillSchema = z.object({
    title: z.string().trim().min(1, { message: 'Title is required' }),
    totalCents: z.number().int().min(1, { message: 'Total must be greater than 0' }),
});

export type createBillInput = z.infer<typeof createBillSchema>;