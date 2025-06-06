import type { IJobRepositoryContract } from '@/contracts/job-repository-contract'
import type { JobLevel, JobType } from '../../../prisma/generated/prisma'

interface ICreateJobProps {
  recruiterId: string
  title: string
  description: string
  company: string
  location: string
  type: JobType
  level: JobLevel
  technologies: string[]
}

export class CreateJobUseCase {
  constructor(private jobRepository: IJobRepositoryContract) {}

  public async execute(data: ICreateJobProps) {
    const job = await this.jobRepository.create(data)

    if (!job) {
      throw new Error('Job not created')
    }

    return {
      jobId: job.id,
    }
  }
}
