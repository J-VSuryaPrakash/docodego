import { z } from 'zod'

export const shareParamSchema = z.object({
  shareId: z.string().trim().min(1, 'Share ID is required'),
})
