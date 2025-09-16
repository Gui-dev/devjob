import type { ICreateJobApplicationDTO } from '@/dtos/create-job-application-dto'
import type { JobApplication, Prisma } from '../../prisma/generated/prisma'

export type FindByJobApplicationIdResponse = Prisma.JobApplicationGetPayload<{
  include: {
    job: true
  }
}>

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

export interface IFindJobByIDResponse {
  jobApplications: JobApplicationWithUserAndJob[]
  total: number
}

export interface IFindAllResponse {
  jobApplications: JobApplicationWithUserAndJob[]
  total: number
}

export interface IJobApplicationRepositoryContract {
  findAll(page: number, limit: number): Promise<IFindAllResponse>
  findByJobApplicationId(
    jobApplicationId: string,
  ): Promise<FindByJobApplicationIdResponse | null>
  create(data: ICreateJobApplicationDTO): Promise<JobApplicationWithUserAndJob>
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IFindUserByIDResponse>
  findByJobId(
    jobId: string,
    page: number,
    limit: number,
  ): Promise<IFindJobByIDResponse>
  findByJobIdAndUserId(
    jobId: string,
    userId: string,
  ): Promise<JobApplication | null>
  updateStatus(
    jobApplicationId: string,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  ): Promise<JobApplicationWithUserAndJob>
}
