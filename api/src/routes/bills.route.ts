import { createBillSchema, homeParamSchema } from '@bill-splitter/shared'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { createBill } from '../services/bills.services'
import type { AppEnv } from '../types/env'

const billRoutes = new Hono<AppEnv>()

billRoutes.post(
  '/',
  zValidator('param', homeParamSchema),
  zValidator('json', createBillSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Total is not a positive whole number' }, 422)
    }
  }),
  async (c) => {
    const { homeId } = c.req.valid('param')
    const data = c.req.valid('json')

    const bill = await createBill(c.env.DB, { ...data, homeId })

    return c.json(bill, 201)
  },
)

export default billRoutes
