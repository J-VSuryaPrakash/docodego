import { HTTPException } from "hono/http-exception";

export async function payShare(db: D1Database, billId: string, shareId: string, idempotencyKey: string) {

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
        .first();

    if (updated) {
        return {
            id: updated.id,
            memberId: updated.member_id,
            amountCents: updated.amount_cents,
            paidAt: updated.paid_at,
        };
    }

    const existing = await db
        .prepare(`
      SELECT *
      FROM shares
      WHERE id = ? AND bill_id = ?
    `)
        .bind(shareId, billId)
        .first();

    if (!existing) {
        throw new HTTPException(404, {
            message: "Share or bill not found",
        });
    }

    if (existing.idempotency_key !== idempotencyKey) {
        throw new HTTPException(409, {
            message: "Share already paid with a different key",
        });
    }

    return {
        id: existing.id,
        memberId: existing.member_id,
        amountCents: existing.amount_cents,
        paidAt: existing.paid_at,
    };

}
