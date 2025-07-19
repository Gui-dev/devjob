import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { IJobProps } from '@/components/job-card'

interface IUseJobDetails {
  job_id: string
}

interface IJobDetailsResponse {
  job: IJobProps
}

export const useJobDetails = ({ job_id }: IUseJobDetails) => {
  const { data, isError, isLoading } = useQuery<IJobDetailsResponse>({
    queryKey: ['job', job_id],
    queryFn: async () => {
      const { data } = await api.get(`/jobs/${job_id}`)
      return data
    },
  })

  return {
    job: data?.job,
    isError,
    isLoading,
  }
}
