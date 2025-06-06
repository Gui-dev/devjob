import { z } from 'zod'

export const createJobSchema = z.object({
  title: z.string(),
  description: z.string(),
  company: z.string(),
  location: z.string(),
  type: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
  level: z.enum(['JUNIOR', 'PLENO', 'SENIOR']),
  technologies: z.array(z.string()).min(1),
})

export const createJobResponseSchema = z.object({
  jobId: z.string().cuid(),
})
