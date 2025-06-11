import type { ICreateJobApplicationDTO } from '@/dtos/create-job-application-dto'
import type { JobApplication, Prisma } from '../../prisma/generated/prisma'

export type JobApplicationWithJob = Prisma.JobApplicationGetPayload<{
  include: {
    job: true
  }
}>

export interface IJobApplicationRepositoryContract {
  create(data: ICreateJobApplicationDTO): Promise<JobApplication>
  findByUserId(userId: string): Promise<JobApplicationWithJob[]>
  findByJobIdAndUserId(
    jobId: string,
    userId: string,
  ): Promise<JobApplication | null>
}
