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
    const {
      technology,
      location,
      type,
      level,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
    } = filters

    const jobs = await prisma.job.findMany({
      where: {
        ...(technology && {
          technologies: {
            has: technology,
          },
        }),
        ...(type && {
          type,
        }),
        ...(level && {
          level: level,
        }),
        ...(location && {
          location: {
            contains: location,
            mode: 'insensitive',
          },
        }),
      },
      orderBy: {
        [sortBy]: 'asc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return jobs
  }
}
