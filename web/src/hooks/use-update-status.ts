import { updateStatus } from '@/services/update-status'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface IUseUpdateStatusRequest {
  status: string
  jobApplicationId: string
}

export const useUpdateStatus = () => {
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({
      status,
      jobApplicationId,
    }: IUseUpdateStatusRequest) => {
      await updateStatus(status, jobApplicationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job-applications'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['recruiter-applications'] })
      toast.success('Status atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar status')
    },
  })

  return {
    isPending,
    mutateAsync,
  }
}
