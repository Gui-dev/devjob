import type { Job } from '../../prisma/generated/prisma'

import type { IJobRepositoryContract } from '@/contracts/job-repository-contract'
import type { ICreateJobDTO } from '@/dtos/create-job-dto'
import type { IFindManyJobsWithFiltersDTO } from '@/dtos/find-many-jobs-with-filters-dto'

import { prisma } from '@/lib/prisma'

export class JobRepository implements IJobRepositoryContract {
  public async create(data: ICreateJobDTO): Promise<Job> {
    const job = await prisma.job.create({
      data,
    })

    return job
  }

  public async findById(jobId: string): Promise<Job | null> {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    })

    return job
  }

  public async findManyWithFilters(
    filters: IFindManyJobsWithFiltersDTO,
  ): Promise<Job[]> {
    const jobs = await prisma.job.findMany({
      where: {
        ...(filters.technology && {
          technologies: {
            has: filters.technology,
          },
        }),
        ...(filters.type && {
          type: filters.type,
        }),
        ...(filters.level && {
          level: filters.level,
        }),
        ...(filters.location && {
          location: {
            contains: filters.location,
            mode: 'insensitive',
          },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return jobs
  }
}
