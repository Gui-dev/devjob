import { useQuery } from '@tanstack/react-query'

import { getJobApplications } from '@/services/get-job-applications'

export type JobApplication = {
  id: string
  jobId: string
  userId: string
  message: string
  githubUrl: string
  linkedinUrl: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: Date
  job: {
    id: string
    recruiterId: string
    title: string
    description: string
    company: string
    location: string
    type: 'REMOTE' | 'ONSITE' | 'HYBRID'
    createdAt: Date
  }
}

interface IGetJobApplicationsResponse {
  jobApplications: JobApplication[]
  meta: {
    total: number
    page: number
    pages: number
  }
}

export const useGetJobApplications = () => {
  const { data, isPending } = useQuery<IGetJobApplicationsResponse>({
    queryKey: ['job-applications'],
    queryFn: async () => await getJobApplications(),
  })

  return {
    data,
    isPending,
  }
}
