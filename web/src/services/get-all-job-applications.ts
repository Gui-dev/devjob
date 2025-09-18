import { api } from '@/lib/api'

export const getAllJobApplications = async (page: number) => {
  const { data } = await api.get('/jobs/applications', {
    params: {
      page: page ?? 1,
      limit: 10,
    },
  })

  return data
}
