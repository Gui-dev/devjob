import { api } from '@/lib/api'

export const getRecruiterApplications = async (jobId: string, page: number) => {
  const { data } = await api.get(`/jobs/${jobId}/applications`, {
    params: {
      page: page ?? 1,
      limit: 10,
    },
  })

  return data
}
