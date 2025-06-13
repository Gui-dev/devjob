export interface ICandidateStatsResponse {
  totalApplications: number
  pendingApplications: number
  acceptedApplications: number
  rejectedApplications: number
}

export interface ICandidateStatsRepositoryContract {
  getCandidateStats(userId: string): Promise<ICandidateStatsResponse>
}
