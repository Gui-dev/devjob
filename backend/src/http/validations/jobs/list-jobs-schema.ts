import { z } from 'zod'

export const listJobsSchema = z.object({
  technology: z.string().optional(),
  type: z.enum(['REMOTE', 'ONSITE', 'HYBRID']).optional(),
  level: z.enum(['JUNIOR', 'PLENO', 'SENIOR']).optional(),
  location: z.string().optional(),
})

export const listJobsSchemaResponse = z.object({
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
})

export type ListJobsSchema = z.infer<typeof listJobsSchema>
export type ListJobsSchemaResponse = z.infer<typeof listJobsSchemaResponse>
