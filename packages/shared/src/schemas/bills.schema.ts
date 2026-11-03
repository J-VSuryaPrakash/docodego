import { z } from 'zod';

export const createBillSchema = z.object({
    title: z.string().trim().min(1, { message: 'Title is required' }),
    totalCents: z.number().int().min(1, { message: 'Total must be greater than 0' }),
});

export const billParamSchema = z.object({
    billId: z.string().trim().min(1, "Bill ID is required")
})

export type createBillInput = z.infer<typeof createBillSchema>;