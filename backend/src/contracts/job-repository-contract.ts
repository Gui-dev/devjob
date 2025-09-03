import type { ICreateJobDTO } from '@/dtos/create-job-dto'
import type { Job } from '../../prisma/generated/prisma'
import type { IFindManyJobsWithFiltersDTO } from '@/dtos/find-many-jobs-with-filters-dto'
import type { IGetJobsByRecruiterIdDto } from '@/dtos/get-jobs-by-recruiter-id-dto'

export interface IJobsResponse {
  jobs: Job[]
  total: number
}

export interface IJobRepositoryContract {
  create(job: ICreateJobDTO): Promise<Job>
  findById(jobId: string): Promise<Job | null>
  findByRecruiterId(data: IGetJobsByRecruiterIdDto): Promise<IJobsResponse>
  findManyWithFilters(
    filters: IFindManyJobsWithFiltersDTO,
  ): Promise<IJobsResponse>
}
