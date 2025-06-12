import { randomUUID } from 'node:crypto'

import type {
  IFindUserByIDResponse,
  IJobApplicationRepositoryContract,
  JobApplicationWithJob,
  JobApplicationWithUserAndJob,
} from '@/contracts/job-application-repository-contract'
import type {
  Job,
  JobApplication,
  User,
} from '../../../prisma/generated/prisma'
import type { ICreateJobApplicationDTO } from '@/dtos/create-job-application-dto'

export class InMemoryJobApplicationRepository
  implements IJobApplicationRepositoryContract
{
  private items: JobApplication[] = []
  private jobs: Job[] = []
  private users: User[] = []

  public async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IFindUserByIDResponse> {
    const allJobApplications = this.items.filter(
      jobApplication => jobApplication.userId === userId,
    )

    const total = allJobApplications.length
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = allJobApplications.slice(start, end)

    const result: JobApplicationWithJob[] = paginated.map(jobApplication => {
      const job = this.jobs.find(job => job.id === jobApplication.jobId)

      if (!job) {
        throw new Error('Job not found')
      }

      return {
        ...jobApplication,
        job,
      }
    })

    return {
      jobApplications: result,
      total,
    }
  }

  public async findByJobId(
    jobId: string,
  ): Promise<JobApplicationWithUserAndJob[]> {
    const jobApplications = this.items.filter(
      jobApplication => jobApplication.jobId === jobId,
    )

    const result: JobApplicationWithUserAndJob[] = jobApplications.map(
      jobApplication => {
        const user = this.users.find(user => user.id === jobApplication.userId)
        const job = this.jobs.find(job => job.id === jobApplication.jobId)

        if (!user || !job) {
          throw new Error('User or job not found')
        }

        return {
          ...jobApplication,
          user,
          job,
        }
      },
    )

    return result
  }

  public async findByJobIdAndUserId(
    jobId: string,
    userId: string,
  ): Promise<JobApplication | null> {
    const jobApplication =
      this.items.find(
        jobApplication =>
          jobApplication.jobId === jobId && jobApplication.userId === userId,
      ) ?? null

    return jobApplication
  }

  public async create({
    jobId,
    userId,
    message,
    githubUrl,
    linkedinUrl,
  }: ICreateJobApplicationDTO): Promise<JobApplication> {
    const jobApplication: JobApplication = {
      id: randomUUID(),
      jobId,
      userId,
      message: message ?? null,
      githubUrl: githubUrl ?? null,
      linkedinUrl: linkedinUrl ?? null,
      createdAt: new Date(),
    }
    this.items.push(jobApplication)
    return jobApplication
  }

  public get() {
    return this.items
  }

  public setJobs(jobs: Job[]) {
    this.jobs = jobs
  }

  public setUsers(users: User[]) {
    this.users = users
  }
}
