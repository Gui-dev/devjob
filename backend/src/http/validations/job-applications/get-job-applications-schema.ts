import { z } from 'zod'

export const getJobApplicationsParamsSchema = z.object({
  job_id: z.string().cuid(),
})
