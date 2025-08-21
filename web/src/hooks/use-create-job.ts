import { api } from '@/lib/api'
import type { CreateJobSchemaData } from '@/validations/create-job-schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateJob = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: CreateJobSchemaData) => {
      const { data: result } = await api.post('/jobs', data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job-applications'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  return {
    mutateAsync,
    isPending,
  }
}
