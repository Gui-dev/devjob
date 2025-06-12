import type { IJobApplicationRepositoryContract } from '@/contracts/job-application-repository-contract'

interface IGetUserApplicationRequest {
  userId: string
  page: number
  limit: number
}

export class GetUserApplicationUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepositoryContract,
  ) { }

  public async execute({ userId, page, limit }: IGetUserApplicationRequest) {
    const { jobApplications, total } = await this.jobApplicationRepository.findByUserId(
      userId,
      page,
      limit,
    )

    if (!jobApplications) {
      throw new Error('User not found')
    }

    const pages = Math.ceil(total / limit)

    return {
      jobApplications,
      meta: {
        total,
        page,
        pages,
      }
    }
  }
}
