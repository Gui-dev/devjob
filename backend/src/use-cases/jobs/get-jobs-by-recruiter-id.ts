import type { IJobRepositoryContract } from '@/contracts/job-repository-contract'

interface IGetJobByRecruiterIdUseCaseRequest {
  userId: string
  page: number
  limit: number
}

export class GetJobsByRecruiterIdUsecase {
  constructor(private jobRepository: IJobRepositoryContract) {}

  public async execute({
    userId,
    page,
    limit,
  }: IGetJobByRecruiterIdUseCaseRequest) {
    const { jobs, total } = await this.jobRepository.findByRecruiterId({
      userId,
      page,
      limit,
    })

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
