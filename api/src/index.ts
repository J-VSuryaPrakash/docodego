import { Hono } from 'hono'
import type { AppEnv } from './types/env'

const app = new Hono<AppEnv>()

import { errorHandler } from './errorHandler'
import homeRoutes from './routes/home.route'
import memberRoutes from './routes/member.route'

app.route('api/homes', homeRoutes)
app.route('api/homes/:homeId/members', memberRoutes)

app.onError(errorHandler);

export default app
