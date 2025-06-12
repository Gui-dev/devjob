import { z } from 'zod'

export const getJobApplicationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
})

export const getJobApplicationsParamsSchema = z.object({
  job_id: z.string().cuid(),
})
