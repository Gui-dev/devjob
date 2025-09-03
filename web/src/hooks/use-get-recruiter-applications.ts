import { getRecruiterApplications } from '@/services/get-recruiter-applications'
import { useQuery } from '@tanstack/react-query'

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

  user: {
    id: string
    name: string
    email: string
    role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'
    createdAt: Date
  }
}

export interface IGetRecruiterApplicationsResponse {
  jobApplications: JobApplication[]
  meta: {
    total: number
    page: number
    pages: number
  }
}

interface IUseGetRecruiterApplicationsRequest {
  jobId: string
  page: number
}

export const useGetRecruiterApplications = ({
  jobId,
  page,
}: IUseGetRecruiterApplicationsRequest) => {
  const { data, isPending } = useQuery<IGetRecruiterApplicationsResponse>({
    queryKey: ['recruiter-applications', jobId, page],
    queryFn: async () => await getRecruiterApplications(jobId, page),
  })

  return {
    data,
    isPending,
  }
}
