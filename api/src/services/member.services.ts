import type { createMemberInput } from '@bill-splitter/shared'
import { HTTPException } from 'hono/http-exception'

type MemberData = createMemberInput & {
  homeId: string
}

export async function createMember(db: D1Database, data: MemberData) {
  const id = crypto.randomUUID()

  const home = await db.prepare('SELECT id FROM homes WHERE id = ?').bind(data.homeId).first()

  if (!home) {
    throw new HTTPException(404, {
      message: 'Home not found',
    })
  }

  await db
    .prepare('INSERT INTO members (id, name, home_id) VALUES (?, ?, ?)')
    .bind(id, data.name, data.homeId)
    .run()

  return {
    id,
    name: data.name,
    homeId: data.homeId,
  }
}
