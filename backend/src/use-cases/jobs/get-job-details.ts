import type { IJobRepositoryContract } from '@/contracts/job-repository-contract'

interface IGetJobDetailsUseCaseRequest {
  jobId: string
}

export class GetJobDetailsUsecase {
  constructor(private jobRepository: IJobRepositoryContract) {}

  public async execute({ jobId }: IGetJobDetailsUseCaseRequest) {
    const job = await this.jobRepository.findById(jobId)

    if (!job) {
      throw new Error('Job not found')
    }

    return {
      job,
    }
  }
}
