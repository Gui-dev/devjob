import { useQuery } from '@tanstack/react-query'

import { getRecruiterApplications } from '@/services/get-recruiter-applications'
import type { JobApplication } from './_types/job-application-type'

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
