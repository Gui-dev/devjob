import type { ICandidateStatsRepositoryContract } from '@/contracts/candidate-stats-repository-contract'

interface IGetCandidateRequest {
  userId: string
}

export class GetCandidateStatsUseCase {
  constructor(
    private readonly candidateStatsRepository: ICandidateStatsRepositoryContract,
  ) {}

  public async execute({ userId }: IGetCandidateRequest) {
    const candidateStats =
      await this.candidateStatsRepository.getCandidateStats(userId)

    return { candidateStats }
  }
}
