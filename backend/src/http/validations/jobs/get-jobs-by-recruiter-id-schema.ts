import { z } from 'zod'

export const getJobsByRecruiterIdSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
})

export const getJobsByRecruiterIdSchemaResponse = z.object({
  jobs: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      company: z.string(),
      location: z.string(),
      type: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
      level: z.enum(['JUNIOR', 'PLENO', 'SENIOR']),
      technologies: z.array(z.string()),
      createdAt: z.date(),
    }),
  ),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pages: z.number(),
  }),
})

export type ListJobsSchema = z.infer<typeof getJobsByRecruiterIdSchema>
export type ListJobsSchemaResponse = z.infer<
  typeof getJobsByRecruiterIdSchemaResponse
>
