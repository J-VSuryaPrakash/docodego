import { createMemberSchema, homeParamSchema } from '@bill-splitter/shared'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { createMember } from '../services/member.services'
import type { AppEnv } from '../types/env'

const memberRoutes = new Hono<AppEnv>()

memberRoutes.post(
  '/',
  zValidator('param', homeParamSchema),
  zValidator('json', createMemberSchema),
  async (c) => {
    const { homeId } = c.req.valid('param')
    const data = c.req.valid('json')

    const member = await createMember(c.env.DB, { ...data, homeId })

    return c.json(member, 201)
  },
)

export default memberRoutes
