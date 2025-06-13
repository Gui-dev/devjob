import type {
  ICandidateStatsRepositoryContract,
  ICandidateStatsResponse,
} from '@/contracts/candidate-stats-repository-contract'
import { prisma } from '@/lib/prisma'

export class CandidateStatsRepository
  implements ICandidateStatsRepositoryContract
{
  public async getCandidateStats(
    userId: string,
  ): Promise<ICandidateStatsResponse> {
    const [
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
    ] = await Promise.all([
      prisma.jobApplication.count({
        where: {
          userId,
        },
      }),
      prisma.jobApplication.count({
        where: {
          userId,
          status: 'PENDING',
        },
      }),
      prisma.jobApplication.count({
        where: {
          userId,
          status: 'ACCEPTED',
        },
      }),
      prisma.jobApplication.count({
        where: {
          userId,
          status: 'REJECTED',
        },
      }),
    ])

    return {
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
    }
  }
}
