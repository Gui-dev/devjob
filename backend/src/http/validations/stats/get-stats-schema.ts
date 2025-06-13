import { z } from 'zod'

export const getStatsResponseSchema = z.object({
  stats: z.object({
    totalJobs: z.number(),
    totalCandidates: z.number(),
    totalRecruiters: z.number(),
    totalJobApplications: z.number(),
    applicationsPerJob: z.array(
      z.object({ jobId: z.string(), total: z.number() }),
    ),
  }),
})
