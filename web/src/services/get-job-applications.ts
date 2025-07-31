import { api } from '@/lib/api'

export const getJobApplications = async () => {
  const { data } = await api.get('/jobs/me/applications')

  return data
}
