import type { ICreateJobApplicationDTO } from '@/dtos/create-job-application-dto'
import type { JobApplication } from '../../prisma/generated/prisma'

export interface IJobApplicationRepositoryContract {
  create(data: ICreateJobApplicationDTO): Promise<JobApplication>
  findByJobIdAndUserId(
    jobId: string,
    userId: string,
  ): Promise<JobApplication | null>
}
