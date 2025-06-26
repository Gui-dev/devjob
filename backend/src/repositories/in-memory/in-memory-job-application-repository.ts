import { randomUUID } from 'node:crypto'

import type {
  FindByJobApplicationIdResponse,
  IFindJobByIDResponse,
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

  public async findByJobApplicationId(
    jobApplicationId: string,
  ): Promise<FindByJobApplicationIdResponse | null> {
    const jobApplication = this.items.find(
      jobApplication => jobApplication.id === jobApplicationId,
    )

    if (!jobApplication) {
      return null
    }

    const job = this.jobs.find(job => job.id === jobApplication.jobId)

    if (!job) {
      throw new Error('Job not found')
    }

    return {
      ...jobApplication,
      job,
    }
  }

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
    page: number,
    limit: number,
  ): Promise<IFindJobByIDResponse> {
    const allJobApplications = this.items.filter(
      jobApplication => jobApplication.jobId === jobId,
    )

    const total = allJobApplications.length
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = allJobApplications.slice(start, end)

    const result: JobApplicationWithUserAndJob[] = paginated.map(
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

    return {
      jobApplications: result,
      total,
    }
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
    status,
  }: ICreateJobApplicationDTO): Promise<JobApplicationWithUserAndJob> {
    const jobApplication: JobApplication = {
      id: randomUUID(),
      jobId,
      userId,
      message: message ?? null,
      githubUrl: githubUrl ?? null,
      linkedinUrl: linkedinUrl ?? null,
      status,
      createdAt: new Date(),
    }
    const user = this.users.find(user => user.id === jobApplication.userId)
    const job = this.jobs.find(job => job.id === jobApplication.jobId)

    if (!user || !job) {
      throw new Error('User or job not found')
    }

    this.items.push(jobApplication)
    return {
      ...jobApplication,
      user,
      job,
    }
  }

  public async updateStatus(
    jobApplicationId: string,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  ): Promise<JobApplication> {
    const jobApplication = this.items.find(
      jobApplication => jobApplication.id === jobApplicationId,
    )
    if (!jobApplication) {
      throw new Error('Job application not found')
    }
    jobApplication.status = status
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
