import type { Share } from '../components/ShareCard'
import { api } from './api'

export type PayShareResponse = {
  id: string
  memberId: string
  amountCents: number
  paidAt: string
}

const getShares = async (homeId: string, billId: string) => {
  const response = await api.get<{ results: Share[] }>(`/homes/${homeId}/bills/${billId}/shares`)
  return response.data.results
}

export const payShare = async (
  billId: string,
  shareId: string,
  idempotencyKey: string,
): Promise<PayShareResponse> => {
  const response = await api.post<PayShareResponse>(
    `/bills/${billId}/shares/${shareId}/pay`,
    {},
    {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    },
  )

  return response.data
}

export { getShares }
