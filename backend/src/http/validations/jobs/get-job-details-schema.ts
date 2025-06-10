import { z } from 'zod'

export const getJobDetailsParamsSchema = z.object({
  jobId: z.string().cuid(),
})

export const getJobDetailsResponseSchema = z.object({
  job: z.object({
    id: z.string().cuid(),
    recruiterId: z.string().cuid(),
    title: z.string(),
    description: z.string(),
    company: z.string(),
    location: z.string(),
    type: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
    level: z.enum(['JUNIOR', 'PLENO', 'SENIOR']),
    technologies: z.array(z.string()),
    createdAt: z.date(),
  }),
})
