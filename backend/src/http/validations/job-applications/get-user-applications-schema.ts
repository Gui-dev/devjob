import { z } from 'zod'

export const getUserApplicationsSchema = z.object({
  userApplications: z.array(
    z.object({
      id: z.string().cuid(),
      jobId: z.string().cuid(),
      userId: z.string().cuid(),
      message: z.string().nullable(),
      githubUrl: z.string().url().nullable(),
      linkedinUrl: z.string().url().nullable(),
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
})
