import { z } from 'zod'

export const getUserApplicationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
})

export const getUserApplicationsResponseSchema = z.object({
  jobApplications: z.array(
    z.object({
      id: z.string().cuid(),
      jobId: z.string().cuid(),
      userId: z.string().cuid(),
      message: z.string().nullable(),
      githubUrl: z.string().url().nullable(),
      linkedinUrl: z.string().url().nullable(),
      status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
      createdAt: z.date(),
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
    }),
  ),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pages: z.number(),
  }),
})
