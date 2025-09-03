import { api } from '@/lib/api'

export const updateStatus = async (
  status: string,
  jobApplicationId: string,
) => {
  await api.patch(`/jobs/applications/${jobApplicationId}/status`, { status })
}
