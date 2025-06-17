import { z } from 'zod'

export const updateJobApplicationsStatusParamsSchema = z.object({
  job_application_id: z.string().cuid(),
})

export const updateJobApplicationsBodySchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
})

export const updateJoApplicationsResponseSchema = z.object({
  jobApplicationId: z.string().cuid(),
})
