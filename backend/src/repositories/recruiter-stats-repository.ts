import type {
  IRecruiterStatsRepositoryContract,
  IRecruiterStatsResponse,
} from '@/contracts/recruiter-stats-repository-contract'
import { prisma } from '@/lib/prisma'

export class RecruiterStatsRepository
  implements IRecruiterStatsRepositoryContract
{
  public async getRecruiterStats(
    userId: string,
  ): Promise<IRecruiterStatsResponse> {
    const jobs = await prisma.job.findMany({ where: { recruiterId: userId } })
    const jobIds = jobs.map(job => job.id)

    const [
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
    ] = await Promise.all([
      prisma.jobApplication.count({ where: { jobId: { in: jobIds } } }),
      prisma.jobApplication.count({
        where: { jobId: { in: jobIds }, status: 'PENDING' },
      }),
      prisma.jobApplication.count({
        where: { jobId: { in: jobIds }, status: 'ACCEPTED' },
      }),
      prisma.jobApplication.count({
        where: { jobId: { in: jobIds }, status: 'REJECTED' },
      }),
    ])

    return {
      totalJobs: jobs.length,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
    }
  }
}
