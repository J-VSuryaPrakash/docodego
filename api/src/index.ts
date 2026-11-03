import { Hono } from 'hono'
import type { AppEnv } from './types/env'

const app = new Hono<AppEnv>()

import { errorHandler } from './errorHandler'
import homeRoutes from './routes/home.route'
import memberRoutes from './routes/member.route'
import billRoutes from './routes/bills.route'
import shareRoutes from './routes/share.route'

app.route('api/homes', homeRoutes)
app.route('api/homes/:homeId/members', memberRoutes)
app.route('api/homes/:homeId/bills', billRoutes)
app.route('api/bills/:billId/shares/:shareId/pay', shareRoutes)

app.onError(errorHandler);

export default app
