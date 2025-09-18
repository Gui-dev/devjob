import { useQuery } from '@tanstack/react-query'

import { getAllJobApplications } from '@/services/get-all-job-applications'
import type { JobApplication } from './_types/job-application-type'

export interface IGetAllJobApplicationsResponse {
  jobApplications: JobApplication[]
  meta: {
    total: number
    page: number
    pages: number
  }
}

interface IUseGetAllJobApplicationsRequest {
  page: number
}

export const useGetAllJobApplications = ({
  page,
}: IUseGetAllJobApplicationsRequest) => {
  const { data, isPending } = useQuery<IGetAllJobApplicationsResponse>({
    queryKey: ['all-job-applications', page],
    queryFn: async () => await getAllJobApplications(page),
  })

  return {
    data,
    isPending,
  }
}
