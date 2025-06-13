export interface IRecruiterStatsResponse {
  totalJobs: number
  totalApplications: number
  pendingApplications: number
  acceptedApplications: number
  rejectedApplications: number
}

export interface IRecruiterStatsRepositoryContract {
  getRecruiterStats(userId: string): Promise<IRecruiterStatsResponse>
}
