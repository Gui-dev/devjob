import type { ICreateJobDTO } from '@/dtos/create-job-dto'
import type { Job } from '../../prisma/generated/prisma'
import type { IFindManyJobsWithFiltersDTO } from '@/dtos/find-many-jobs-with-filters-dto'

export interface IJobRepositoryContract {
  create(job: ICreateJobDTO): Promise<Job>
  findManyWithFilters(filters: IFindManyJobsWithFiltersDTO): Promise<Job[]>
}
