import { HTTPException } from 'hono/http-exception'

export async function payShare(
  db: D1Database,
  billId: string,
  shareId: string,
  idempotencyKey: string,
) {
  const updated = await db
    .prepare(`
      UPDATE shares
      SET paid_at = CURRENT_TIMESTAMP,
          idempotency_key = ?
      WHERE id = ?
        AND bill_id = ?
        AND paid_at IS NULL
      RETURNING *
    `)
    .bind(idempotencyKey, shareId, billId)
    .first()

  if (updated) {
    return {
      id: updated.id,
      memberId: updated.member_id,
      amountCents: updated.amount_cents,
      paidAt: updated.paid_at,
    }
  }

  const existing = await db
    .prepare(`
      SELECT *
      FROM shares
      WHERE id = ? AND bill_id = ?
    `)
    .bind(shareId, billId)
    .first()

  if (!existing) {
    throw new HTTPException(404, {
      message: 'Share or bill not found',
    })
  }

  if (existing.idempotency_key !== idempotencyKey) {
    throw new HTTPException(409, {
      message: 'Share already paid with a different key',
    })
  }

  return {
    id: existing.id,
    memberId: existing.member_id,
    amountCents: existing.amount_cents,
    paidAt: existing.paid_at,
  }
}

export async function getShares(db: D1Database, homeId: string, billId: string) {

  const { results } = await db.prepare(`
    SELECT
      s.id,
      m.name AS memberName,
      s.amount_cents AS amountCents,
      s.paid_at AS paidAt
    FROM shares s
    JOIN members m ON m.id = s.member_id
    JOIN bills b ON b.id = s.bill_id
    WHERE b.home_id = ? AND b.id = ?
    ORDER BY m.created_at ASC, m.rowid ASC
  `)
    .bind(homeId, billId)
    .all();

  if (!results || results.length === 0) {
    throw new HTTPException(404, { message: 'No shares found for this bill' })
  }

  return { results };

}

