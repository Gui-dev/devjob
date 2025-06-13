import type {
  IRecruiterStatsRepositoryContract,
  IRecruiterStatsResponse,
} from '@/contracts/recruiter-stats-repository-contract'
import type { Job, JobApplication } from '../../../prisma/generated/prisma'

export class InMemoryRecruiterStatsRepository
  implements IRecruiterStatsRepositoryContract
{
  private jobs: Job[] = []
  private jobApplications: JobApplication[] = []

  public async getRecruiterStats(
    userId: string,
  ): Promise<IRecruiterStatsResponse> {
    const recruiterJobs = this.jobs.filter(job => job.recruiterId === userId)
    const jobIds = recruiterJobs.map(job => job.id)
    const jobApplications = this.jobApplications.filter(jobApplication =>
      jobIds.includes(jobApplication.jobId),
    )

    return {
      totalJobs: recruiterJobs.length,
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

  public setJobs(jobs: Job[]) {
    this.jobs = jobs
  }

  public setJobApplications(jobApplications: JobApplication[]) {
    this.jobApplications = jobApplications
  }
}
