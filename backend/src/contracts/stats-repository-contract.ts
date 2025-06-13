export interface IStatsResponse {
  totalJobs: number
  totalCandidates: number
  totalRecruiters: number
  totalJobApplications: number
  applicationsPerJob: Array<{ jobId: string; total: number }>
}

export interface IStatsRepositoryContract {
  getStats(): Promise<IStatsResponse>
}
