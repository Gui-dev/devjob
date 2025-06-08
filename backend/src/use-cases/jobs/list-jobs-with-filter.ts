import type { IJobRepositoryContract } from '@/contracts/job-repository-contract'
import type { JobLevel, JobType } from '../../../prisma/generated/prisma'

interface IListJobsFiltersProps {
  type?: JobType
  level?: JobLevel
  technology?: string
  location?: string
}

export class ListJobsWithFiltersUseCase {
  constructor(private jobsRepository: IJobRepositoryContract) {}

  public async execute({
    type,
    level,
    technology,
    location,
  }: IListJobsFiltersProps) {
    const jobs = await this.jobsRepository.findManyWithFilters({
      type,
      level,
      technology,
      location,
    })

    if (!jobs || jobs.length === 0) {
      throw new Error('Jobs not found')
    }

    return { jobs }
  }
}
