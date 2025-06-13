import type { IRecruiterStatsRepositoryContract } from '@/contracts/recruiter-stats-repository-contract'

interface IGetRecruiterRequest {
  userId: string
}

export class GetRecruiterStatsUseCase {
  constructor(
    private readonly recruiterStatsRepository: IRecruiterStatsRepositoryContract,
  ) {}

  public async execute({ userId }: IGetRecruiterRequest) {
    const recruiterStats =
      await this.recruiterStatsRepository.getRecruiterStats(userId)

    return { recruiterStats }
  }
}
