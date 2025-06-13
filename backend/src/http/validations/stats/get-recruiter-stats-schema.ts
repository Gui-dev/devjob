import { z } from 'zod'

export const getRecruiterResponseSchema = z.object({
  recruiterStats: z.object({
    totalJobs: z.number(),
    totalApplications: z.number(),
    pendingApplications: z.number(),
    acceptedApplications: z.number(),
    rejectedApplications: z.number(),
  }),
})
