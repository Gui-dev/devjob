export interface ICreateJobApplicationDTO {
  jobId: string
  userId: string
  message?: string
  githubUrl?: string
  linkedinUrl?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
}
