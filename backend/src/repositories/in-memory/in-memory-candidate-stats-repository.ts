import type {
  ICandidateStatsRepositoryContract,
  ICandidateStatsResponse,
} from '@/contracts/candidate-stats-repository-contract'
import type { JobApplication } from '../../../prisma/generated/prisma'

export class InMemoryCandidateStatsRepository
  implements ICandidateStatsRepositoryContract
{
  private items: JobApplication[] = []

  public async getCandidateStats(
    userId: string,
  ): Promise<ICandidateStatsResponse> {
    const jobApplications = this.items.filter(
      jobApplication => jobApplication.userId === userId,
    )

    return {
      totalApplications: jobApplications.length,
      pendingApplications: jobApplications.filter(
        jobApplication => jobApplication.status === 'PENDING',
      ).length,
      acceptedApplications: jobApplications.filter(
        jobApplication => jobApplication.status === 'ACCEPTED',
      ).length,
      rejectedApplications: jobApplications.filter(
        jobApplication => jobApplication.status === 'REJECTED',
      ).length,
    }
  }

  public get() {
    return this.items
  }

  public setJobApplications(jobApplications: JobApplication[]) {
    this.items = jobApplications
  }
}
