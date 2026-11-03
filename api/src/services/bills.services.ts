import type { createBillInput } from '@bill-splitter/shared'
import { HTTPException } from 'hono/http-exception'

type BillData = createBillInput & {
  homeId: string
}

type ShareRow = {
  id: string
  bill_id: string
  member_id: string
  amount_cents: number
  paid_at: string | null
}

export type BillRow = {
  id: string
  home_id: string
  title: string
  total_cents: number
  created_at: string
}

export async function createBill(db: D1Database, data: BillData) {
  const id = crypto.randomUUID()

  const home = await db.prepare('SELECT id FROM homes WHERE id = ?').bind(data.homeId).first()

  if (!home) {
    throw new HTTPException(404, {
      message: 'Home not found',
    })
  }

  const { results } = await db
    .prepare('SELECT * FROM members WHERE home_id = ? ORDER BY created_at ASC, rowid ASC')
    .bind(data.homeId)
    .all()

  if (!results || results.length === 0) {
    throw new HTTPException(422, {
      message: 'Home has no members',
    })
  }

  const totalMembers = results.length
  const extraCents = data.totalCents % totalMembers
  const baseShare = Math.floor(data.totalCents / totalMembers)

  const shares = results.map((member, index) => {
    const shareAmount = baseShare + (index < extraCents ? 1 : 0)
    return {
      memberId: member.id,
      amountCents: shareAmount,
    }
  })

  const insertBill = db
    .prepare(`INSERT INTO bills (id, home_id, title, total_cents) VALUES (?, ?, ?, ?)`)
    .bind(id, data.homeId, data.title, data.totalCents)

  const insertShares = shares.map((share) => {
    const shareId = crypto.randomUUID()

    return db
      .prepare(
        `INSERT INTO shares (id, bill_id, member_id, amount_cents) VALUES (?, ?, ?, ?) RETURNING id, member_id, amount_cents, paid_at`,
      )
      .bind(shareId, id, share.memberId, share.amountCents)
  })

  const batchResult = await db.batch<ShareRow | BillRow>([insertBill, ...insertShares])

  const insertedShares = batchResult.slice(1).map((item) => {
    const share = item.results[0] as ShareRow

    return {
      id: share.id,
      memberId: share.member_id,
      amountCents: share.amount_cents,
      paidAt: share.paid_at,
    }
  })

  return {
    id,
    homeId: data.homeId,
    title: data.title,
    totalCents: data.totalCents,
    shares: insertedShares,
  }
}
