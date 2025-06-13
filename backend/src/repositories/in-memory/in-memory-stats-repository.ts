import type {
  IStatsRepositoryContract,
  IStatsResponse,
} from '@/contracts/stats-repository-contract'
import type {
  Job,
  JobApplication,
  User,
} from '../../../prisma/generated/prisma'

export class InMemoryStatsRepository implements IStatsRepositoryContract {
  private jobs: Job[] = []
  private users: User[] = []
  private jobApplications: JobApplication[] = []

  public async getStats(): Promise<IStatsResponse> {
    const totalJobs = this.jobs.length
    const totalCandidates = this.users.filter(
      user => user.role === 'CANDIDATE',
    ).length
    const totalRecruiters = this.users.filter(
      user => user.role === 'RECRUITER',
    ).length
    const totalJobApplications = this.jobApplications.length

    const applicationsPerJob = this.jobs.map(job => ({
      jobId: job.id,
      total: this.jobApplications.filter(
        jobApplication => jobApplication.jobId === job.id,
      ).length,
    }))

    return {
      totalJobs,
      totalCandidates,
      totalRecruiters,
      totalJobApplications,
      applicationsPerJob,
    }
  }

  public setJobs(jobs: Job[]) {
    this.jobs = jobs
  }

  public setUsers(users: User[]) {
    this.users = users
  }

  public setJobApplications(jobApplications: JobApplication[]) {
    this.jobApplications = jobApplications
  }
}
