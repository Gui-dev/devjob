import type { IStatsRepositoryContract } from '@/contracts/stats-repository-contract'

export class GetStatsUseCase {
  constructor(private readonly statsRepository: IStatsRepositoryContract) {}

  public async execute() {
    const stats = await this.statsRepository.getStats()

    return { stats }
  }
}
