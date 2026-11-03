import type { D1Database } from '@cloudflare/workers-types'

export type AppEnv = {
  Bindings: {
    DB: D1Database
  }
}
