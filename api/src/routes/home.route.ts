import { createHomeSchema, homeParamSchema } from '@bill-splitter/shared'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { createHome, getBalances, getHomes } from '../services/home.services'
import type { AppEnv } from '../types/env'

const homeRoutes = new Hono<AppEnv>()

homeRoutes.post(
  '/',
  zValidator('json', createHomeSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid home data' }, 400)
    }
  }),
  async (c) => {
    const data = c.req.valid('json')

    const home = await createHome(c.env.DB, data)

    return c.json(home, 201)
  },
)

homeRoutes.get(
  '/:homeId/balances',
  zValidator('param', homeParamSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Home id is required' }, 400)
    }
  }),
  async (c) => {
    const { homeId } = c.req.valid('param')

    const balances = await getBalances(c.env.DB, homeId)

    return c.json(balances, 200)
  },
)

homeRoutes.get("/",
  async (c) => {

    const homes = await getHomes(c.env.DB);

    return c.json(homes, 200);

  }
)

export default homeRoutes
