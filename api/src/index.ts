import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { AppEnv } from './types/env'

const app = new Hono<AppEnv>()


import { errorHandler } from './errorHandler'
import billRoutes from './routes/bills.route'
import homeRoutes from './routes/home.route'
import memberRoutes from './routes/member.route'
import shareRoutes from './routes/share.route'

app.use('/api/*', cors({
  origin: (origin, c) => {
    const configuredOrigins = c.env.CORS_ORIGIN
      ?.split(',')
      .map((value: string) => value.trim())
      .filter(Boolean) ?? []

    const allowedOrigins = new Set([
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      ...configuredOrigins,
    ])

    return allowedOrigins.has(origin) ? origin : undefined
  },
  allowHeaders: ['Content-Type', 'Idempotency-Key'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  maxAge: 86400,
}))

app.route('api/homes', homeRoutes)
app.route('api/homes/:homeId/members', memberRoutes)
app.route('api/homes/:homeId/bills', billRoutes)
app.route('api/bills/:billId/shares/:shareId', shareRoutes)
app.route('api/homes/:homeId/bills/:billId/shares', shareRoutes)

app.onError(errorHandler)

export default app
