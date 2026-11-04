import { api } from "./api";

type share = {
  id: string,
  memberId: string,
  amountCents: number,
  paidAt: string | null
}

type  Bill = {
  id: string,
  homeId: string,
  title: string,
  totalCents: number,
  shares: share[]
}


const getBills = async (homeId: string) => {
    const response = await api.get<{results: Bill[]}>(`/homes/${homeId}/bills`)
    return response.data.results
}

const createBill = async (homeId: string, data: { title: string, totalCents: number }) => {
    const response = await api.post<Bill>(`/homes/${homeId}/bills`, data)
    return response.data
}

export {
    getBills,
    createBill
}