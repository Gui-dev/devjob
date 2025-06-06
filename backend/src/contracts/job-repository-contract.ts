import type { ICreateJobDTO } from '@/dtos/create-job-dto'
import type { Job } from '../../prisma/generated/prisma'

export interface IJobRepositoryContract {
  create(job: ICreateJobDTO): Promise<Job>
}
