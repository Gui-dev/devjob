export interface IStatsResponse {
  totalJobs: number
  totalCandidates: number
  totalRecruiters: number
  totalJobApplications: number
}

export interface IStatsRepositoryContract {
  getStats(): Promise<IStatsResponse>
}
