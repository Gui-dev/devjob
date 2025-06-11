import { randomUUID } from 'node:crypto'

import type {
  IJobApplicationRepositoryContract,
  JobApplicationWithJob,
} from '@/contracts/job-application-repository-contract'
import type { Job, JobApplication } from '../../../prisma/generated/prisma'
import type { ICreateJobApplicationDTO } from '@/dtos/create-job-application-dto'

export class InMemoryJobApplicationRepository
  implements IJobApplicationRepositoryContract
{
  private items: JobApplication[] = []
  private jobs: Job[] = []

  public async findByUserId(userId: string): Promise<JobApplicationWithJob[]> {
    const jobApplications = this.items.filter(
      jobApplication => jobApplication.userId === userId,
    )

    const result: JobApplicationWithJob[] = jobApplications.map(
      jobApplication => {
        const job = this.jobs.find(job => job.id === jobApplication.jobId)

        if (!job) {
          throw new Error('Job not found')
        }

        return {
          ...jobApplication,
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
}
