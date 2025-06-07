import type { IJobRepositoryContract } from '@/contracts/job-repository-contract'
import type { Job } from '../../../prisma/generated/prisma'
import type { ICreateJobDTO } from '@/dtos/create-job-dto'
import { randomUUID } from 'node:crypto'

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

  public get() {
    return this.items
  }
}
