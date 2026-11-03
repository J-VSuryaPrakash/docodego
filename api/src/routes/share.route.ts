import { paramsSchema } from '@bill-splitter/shared'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { payShare } from '../services/share.services'
import type { AppEnv } from '../types/env'

const shareRoutes = new Hono<AppEnv>()

shareRoutes.post(
  '/',
  zValidator('param', paramsSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid bill or share ID' }, 400)
    }
  }),
  async (c) => {
    const idempotencyKey = c.req.header('Idempotency-key')

    if (!idempotencyKey) {
      return c.json({ error: 'Idempotency-key is missing' }, 400)
    }

    const { billId, shareId } = c.req.valid('param')

    const result = await payShare(c.env.DB, billId, shareId, idempotencyKey)

    return c.json(result, 200)
  },
)

export default shareRoutes
