import type { IJobApplicationRepositoryContract } from '@/contracts/job-application-repository-contract'

interface IGetUserApplicationRequest {
  userId: string
}

export class GetUserApplicationUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepositoryContract,
  ) {}

  public async execute({ userId }: IGetUserApplicationRequest) {
    const userApplications =
      await this.jobApplicationRepository.findByUserId(userId)

    if (!userApplications) {
      throw new Error('User not found')
    }

    return { userApplications }
  }
}
