import type { createHomeInput } from '@bill-splitter/shared'
import { HTTPException } from 'hono/http-exception'

export async function createHome(db: D1Database, data: createHomeInput) {
  const id = crypto.randomUUID()

  await db.prepare('INSERT INTO homes (id, name) VALUES (?, ?)').bind(id, data.name).run()

  return {
    id,
    name: data.name,
  }
}

export async function getBalances(db: D1Database, homeId: string) {
  const home = await db
    .prepare('SELECT COUNT(*) as count FROM homes WHERE id = ?')
    .bind(homeId)
    .first<{ count: number }>()

  if (!home || home?.count === 0) {
    throw new HTTPException(404, { message: 'Home does not exist' })
  }

  const { results } = await db
    .prepare(`
        SELECT
            m.id AS member_id,
            m.name,
            COALESCE(
                SUM(
                    CASE
                        WHEN s.paid_at IS NULL THEN s.amount_cents
                        ELSE 0
                    END
                ),
                0
            ) AS outstanding_cents
        FROM members m
        LEFT JOIN shares s ON s.member_id = m.id
        WHERE m.home_id = ?
        GROUP BY m.id, m.name
        ORDER BY m.created_at ASC, m.rowid ASC
    `)
    .bind(homeId)
    .all()

  if (!results || results.length === 0) {
    throw new HTTPException(404, { message: 'No Members for this home' })
  }

  const balances = results.map((row) => ({
    memberId: row.member_id,
    name: row.name,
    outstandingCents: row.outstanding_cents,
  }))

  return {
    balances,
  }
}

export async function getHomes(db: D1Database) {
  const results = await db
    .prepare(`
        SELECT id, name FROM homes
        ORDER BY created_at ASC, rowid ASC
    `)
    .all()

  if (!results.results) {
    throw new HTTPException(404, { message: 'No homes found' })
  }

  return { results: results.results }
}
