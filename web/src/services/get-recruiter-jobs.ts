import { api } from '@/lib/api'

export const getRecruiterJobs = async () => {
  const { data } = await api.get('/jobs/recruiter/list')

  return data
}
