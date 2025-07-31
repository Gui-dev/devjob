import { api } from '@/lib/api'

export const getStats = async (endpoint: string) => {
  const { data } = await api.get(endpoint)

  return data
}
