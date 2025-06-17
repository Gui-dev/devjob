import { InMemoryJobApplicationRepository } from '@/repositories/in-memory/in-memory-job-application-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateJobApplicationsStatusUseCase } from '../update-job-applications-status'

let jobApplicationRepository: InMemoryJobApplicationRepository
let sut: UpdateJobApplicationsStatusUseCase

describe('Update Job Application Status Use Case', () => {
  beforeEach(async () => {
    jobApplicationRepository = new InMemoryJobApplicationRepository()
    sut = new UpdateJobApplicationsStatusUseCase(jobApplicationRepository)

    jobApplicationRepository.setUsers([
      {
        id: 'recruiter-01',
        name: 'Bruce Wayne',
        email: 'bruce@example.com',
        password: '123456',
        role: 'RECRUITER',
        createdAt: new Date(),
      },
      {
        id: 'candidate-01',
        name: 'Clark Kent',
        email: 'clark@example.com',
        password: '123456',
        role: 'CANDIDATE',
        createdAt: new Date(),
      },
    ])

    jobApplicationRepository.setJobs([
      {
        id: 'job-01',
        recruiterId: 'recruiter-01',
        title: 'Backend',
        description: 'Vaga Node',
        company: 'Empresa A',
        location: 'São Paulo',
        type: 'REMOTE',
        level: 'JUNIOR',
        technologies: ['Node.js'],
        createdAt: new Date(),
      },
    ])
  })

  it('should be able to update job application status', async () => {
    const jobApplication = await jobApplicationRepository.create({
      jobId: 'job-01',
      userId: 'candidate-01',
      message: 'Olá, tenho interesse',
      githubUrl: 'https://github.com/dracarys',
      linkedinUrl: 'https://linkedin.com/dracarys',
      status: 'PENDING',
    })

    const { jobApplicationId } = await sut.execute({
      jobApplicationId: jobApplication.id,
      userId: 'recruiter-01',
      status: 'ACCEPTED',
    })

    expect(jobApplicationId).toEqual(expect.any(String))
  })
})
