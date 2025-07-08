import type { ICreateJobDTO } from '@/dtos/create-job-dto'
import type { Job } from '../../prisma/generated/prisma'
import type { IFindManyJobsWithFiltersDTO } from '@/dtos/find-many-jobs-with-filters-dto'

export interface IFindManyWithFiltersResponse {
  jobs: Job[]
  total: number
}

export interface IJobRepositoryContract {
  create(job: ICreateJobDTO): Promise<Job>
  findById(jobId: string): Promise<Job | null>
  findManyWithFilters(
    filters: IFindManyJobsWithFiltersDTO,
  ): Promise<IFindManyWithFiltersResponse>
}
