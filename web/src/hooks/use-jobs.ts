import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { IJobProps } from '@/components/job-card'

interface IJobsResponse {
  jobs: IJobProps[]
  meta: {
    total: number
    page: number
    pages: number
  }
}

export interface IUseJobParams {
  page?: number
  technology?: string
  location?: string
  type?: 'REMOTE' | 'ONSITE' | 'HYBRID'
  level?: 'JUNIOR' | 'PLENO' | 'SENIOR'
  sortBy?: 'createdAt' | 'company'
}

export const useJobs = (filters: IUseJobParams) => {
  const response = useQuery<IJobsResponse>({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const { data } = await api.get('/jobs', { params: filters })
      return data
    },
  })

  return response
}
