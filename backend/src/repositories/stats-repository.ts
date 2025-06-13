import type {
  IStatsRepositoryContract,
  IStatsResponse,
} from '@/contracts/stats-repository-contract'
import { prisma } from '@/lib/prisma'

export class StatsRepository implements IStatsRepositoryContract {
  public async getStats(): Promise<IStatsResponse> {
    const [totalJobs, totalJobApplications, totalCandidates, totalRecruiters] =
      await Promise.all([
        prisma.job.count(),
        prisma.jobApplication.count(),
        prisma.user.count({ where: { role: 'CANDIDATE' } }),
        prisma.user.count({ where: { role: 'RECRUITER' } }),
      ])

    return {
      totalJobs,
      totalCandidates,
      totalRecruiters,
      totalJobApplications,
    }
  }
}
