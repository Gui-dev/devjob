import type { ICreateJobApplicationDTO } from '@/dtos/create-job-application-dto'
import type { JobApplication, Prisma } from '../../prisma/generated/prisma'

export type JobApplicationWithJob = Prisma.JobApplicationGetPayload<{
  include: {
    job: true
  }
}>

export type JobApplicationWithUserAndJob = Prisma.JobApplicationGetPayload<{
  include: {
    user: true
    job: true
  }
}>

export interface IFindUserByIDResponse {
  jobApplications: JobApplicationWithJob[]
  total: number
}

export interface IJobApplicationRepositoryContract {
  create(data: ICreateJobApplicationDTO): Promise<JobApplication>
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IFindUserByIDResponse>
  findByJobId(jobId: string): Promise<JobApplicationWithUserAndJob[]>
  findByJobIdAndUserId(
    jobId: string,
    userId: string,
  ): Promise<JobApplication | null>
}
