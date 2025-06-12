import type { IJobApplicationRepositoryContract } from '@/contracts/job-application-repository-contract'

interface IGetUserApplicationRequest {
  userId: string
  page: number
  limit: number
}

export class GetUserApplicationUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepositoryContract,
  ) {}

  public async execute({ userId, page, limit }: IGetUserApplicationRequest) {
    const userApplications = await this.jobApplicationRepository.findByUserId(
      userId,
      page,
      limit,
    )

    if (!userApplications) {
      throw new Error('User not found')
    }

    return { userApplications }
  }
}
