import type { IJobRepositoryContract } from '@/contracts/job-repository-contract'
import type { JobLevel, JobType } from '../../../prisma/generated/prisma'

interface IListJobsFiltersProps {
  type?: JobType
  level?: JobLevel
  technology?: string
  location?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'company'
}

export class ListJobsWithFiltersUseCase {
  constructor(private jobsRepository: IJobRepositoryContract) {}

  public async execute({
    type,
    level,
    technology,
    location,
    page = 1,
    limit = 10,
    sortBy,
  }: IListJobsFiltersProps) {
    const { jobs, total } = await this.jobsRepository.findManyWithFilters({
      type,
      level,
      technology,
      location,
      page,
      limit,
      sortBy,
    })

    if (!jobs) {
      throw new Error('Jobs not found')
    }

    const pages = Math.ceil(total / limit)

    return {
      jobs,
      meta: {
        total,
        page,
        pages,
      },
    }
  }
}
