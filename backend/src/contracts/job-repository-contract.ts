import type { ICreateJobDTO } from '@/dtos/create-job-dto'
import type { Job } from '../../prisma/generated/prisma'
import type { IFindManyWithFiltersDTO } from '@/dtos/find-many-with-filters-dto'

export interface IJobRepositoryContract {
  create(job: ICreateJobDTO): Promise<Job>
  findManyWithFilters(filters: IFindManyWithFiltersDTO): Promise<Job[]>
}
