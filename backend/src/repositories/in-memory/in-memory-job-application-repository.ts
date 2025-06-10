import { randomUUID } from 'node:crypto'

import type { IJobApplicationRepositoryContract } from '@/contracts/job-application-repository-contract'
import type { JobApplication } from '../../../prisma/generated/prisma'
import type { ICreateJobApplicationDTO } from '@/dtos/create-job-application-dto'

export class InMemoryJobApplicationRepository
  implements IJobApplicationRepositoryContract
{
  private items: JobApplication[] = []

  public async findByUserId(userId: string): Promise<JobApplication[]> {
    const jobApplications = this.items.filter(
      jobApplication => jobApplication.userId === userId,
    )

    return jobApplications
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
}
