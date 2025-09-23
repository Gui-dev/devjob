export type JobApplication = {
  id: string
  jobId: string
  userId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  message: string
  githubUrl: string
  linkedinUrl: string
  createdAt: Date

  job: {
    id: string
    recruiterId: string
    title: string
    description: string
    company: string
    location: string
    type: 'REMOTE' | 'ONSITE' | 'HYBRID'
    level: 'JUNIOR' | 'PLENO' | 'SENIOR'
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
