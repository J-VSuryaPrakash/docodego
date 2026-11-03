import { z } from 'zod'

export const createMemberSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Name is required',
  }),
})

export const homeParamSchema = z.object({
  homeId: z.string().trim().min(1, 'Home ID is required'),
})

export type createMemberInput = z.infer<typeof createMemberSchema>
