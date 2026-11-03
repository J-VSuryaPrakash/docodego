import { z } from 'zod'

export const createHomeSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
})

export type createHomeInput = z.infer<typeof createHomeSchema>
