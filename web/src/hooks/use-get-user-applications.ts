import { useQuery } from '@tanstack/react-query'

import { getRecruiterJobs } from '@/services/get-recruiter-jobs'

export type Job = {
  id: string
  recruiterId: string
  title: string
  description: string
  company: string
  location: string
  type: 'REMOTE' | 'ONSITE' | 'HYBRID'
  level: 'JUNIOR' | 'PLENO' | 'SENIOR'
  createdAt: Date
}

export interface IGetRecruiterJobsResponse {
  jobs: Job[]
  meta: {
    total: number
    page: number
    pages: number
  }
}

export const useGetUserApplications = () => {
  const { data, isPending } = useQuery<IGetRecruiterJobsResponse>({
    queryKey: ['jobs'],
    queryFn: async () => await getRecruiterJobs(),
  })

  return {
    data,
    isPending,
  }
}
