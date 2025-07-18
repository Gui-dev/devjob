import type { IJobRepositoryContract } from '@/contracts/job-repository-contract'
import type { Job } from '../../../prisma/generated/prisma'
import type { ICreateJobDTO } from '@/dtos/create-job-dto'
import { randomUUID } from 'node:crypto'
import type { IFindManyJobsWithFiltersDTO } from '@/dtos/find-many-jobs-with-filters-dto'

export class InMemoryJobRepository implements IJobRepositoryContract {
  private items: Job[] = []

  public async create(data: ICreateJobDTO): Promise<Job> {
    const job: Job = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
    }

    this.items.push(job)
    return job
  }

  public async findById(jobId: string): Promise<Job | null> {
    const job = this.items.find(job => job.id === jobId) ?? null
    return job
  }

  public async findManyWithFilters(
    filters: IFindManyJobsWithFiltersDTO,
  ): Promise<Job[]> {
    return this.items.filter(job => {
      if (
        filters.technology &&
        !job.technologies.includes(filters.technology)
      ) {
        return false
      }

      if (filters.type && job.type !== filters.type) {
        return false
      }

      if (filters.level && job.level !== filters.level) {
        return false
      }

      if (
        filters.location &&
        !job.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }

  public get() {
    return this.items
  }
}
