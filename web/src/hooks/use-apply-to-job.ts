import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface IJobApplicationRequest {
  message: string
  githubUrl?: string
  linkedinUrl?: string
}

export const useApplyToJob = (jobId: string) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IJobApplicationRequest) => {
      const { data: result } = await api.post(`/jobs/${jobId}/apply`, data)
      return result
    },
    onSuccess: () => {
      toast.success('Candidatura enviada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao enviar candidatura')
    },
  })

  return {
    mutate,
    isPending,
  }
}
