import { createBillSchema, homeParamSchema } from '@bill-splitter/shared'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { createBill, getBillsByHomeId } from '../services/bills.services'
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

billRoutes.get("/", 
  zValidator('param', homeParamSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Home id required' }, 400)
    }
  }),
  async (c) => {
    const { homeId } = c.req.valid('param')

    const bills = await getBillsByHomeId(c.env.DB, homeId)

    return c.json(bills, 200)

  }
)

export default billRoutes
