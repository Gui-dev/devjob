export type JobApplication = {
  id: string
  jobId: string
  userId: string
  message: string
  githubUrl: string
  linkedinUrl: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: Date

  job: {
    id: string
    recruiterId: string
    title: string
    description: string
    company: string
    location: string
    type: 'REMOTE' | 'ONSITE' | 'HYBRID'
    createdAt: Date
  }

  user: {
    id: string
    name: string
    email: string
    role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'
    createdAt: Date
  }
}
