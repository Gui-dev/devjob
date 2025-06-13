import { z } from 'zod'

export const getCandidateResponseSchema = z.object({
  candidateStats: z.object({
    totalApplications: z.number(),
    pendingApplications: z.number(),
    acceptedApplications: z.number(),
    rejectedApplications: z.number(),
  }),
})
