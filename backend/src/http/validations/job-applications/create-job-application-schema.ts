import { z } from 'zod'

export const createJobApplicationParamsSchema = z.object({
  job_id: z.string().cuid(),
})

export const createJobApplicationBodySchema = z.object({
  message: z.string().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
})

export const createJobApplicarionResponseSchema = z.object({
  jobApplicationId: z.string().cuid(),
})
