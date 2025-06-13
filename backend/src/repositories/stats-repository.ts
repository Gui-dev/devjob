import type {
  IStatsRepositoryContract,
  IStatsResponse,
} from '@/contracts/stats-repository-contract'
import { prisma } from '@/lib/prisma'

export class StatsRepository implements IStatsRepositoryContract {
  public async getStats(): Promise<IStatsResponse> {
    const [
      totalJobs,
      totalJobApplications,
      totalCandidates,
      totalRecruiters,
      appsPerJob,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.jobApplication.count(),
      prisma.user.count({ where: { role: 'CANDIDATE' } }),
      prisma.user.count({ where: { role: 'RECRUITER' } }),
      prisma.jobApplication.groupBy({
        by: ['jobId'],
        _count: {
          jobId: true,
        },
      }),
    ])

    const applicationsPerJob = appsPerJob.map(app => ({
      jobId: app.jobId,
      total: app._count.jobId,
    }))

    return {
      totalJobs,
      totalCandidates,
      totalRecruiters,
      totalJobApplications,
      applicationsPerJob,
    }
  }
}
