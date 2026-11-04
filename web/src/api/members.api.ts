import { api } from './api'

type CreateMemberResponse = {
  id: string
  homeId: string
  name: string
}

const getMembers = async (homeId: string) => {
  const response = await api.get(`homes/${homeId}/balances`)
  return response.data
}

const createMember = async (homeId: string, data: { name: string }) => {
  const response = await api.post<CreateMemberResponse>(`homes/${homeId}/members`, data)
  return response.data
}

export { createMember, getMembers }
