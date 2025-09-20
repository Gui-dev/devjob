import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryJobApplicationRepository } from '@/repositories/in-memory/in-memory-job-application-repository'
import { GetAllJobApplicationsUseCase } from '@/use-cases/job-applications/get-all-job-applications'

let inMemoryJobApplicationRepository: InMemoryJobApplicationRepository
let sut: GetAllJobApplicationsUseCase

describe('Get All Job Application Use Case', () => {
  beforeEach(async () => {
    inMemoryJobApplicationRepository = new InMemoryJobApplicationRepository()
    sut = new GetAllJobApplicationsUseCase(inMemoryJobApplicationRepository)

    inMemoryJobApplicationRepository.setUsers([
      {
        id: 'user-01',
        name: 'Peter Parker',
        email: 'peter@example.com',
        password: '123',
        role: 'CANDIDATE',
        createdAt: new Date(),
      },
    ])

    inMemoryJobApplicationRepository.setJobs([
      {
        id: 'job-01',
        recruiterId: 'recruiter-01',
        title: 'Software Engineer',
        description: 'Vaga para engenheiro de software',
        company: 'Stark Industries',
        location: 'New York',
        type: 'REMOTE',
        level: 'SENIOR',
        technologies: ['TypeScript'],
        createdAt: new Date(),
      },
    ])

    for (let i = 1; i <= 22; i++) {
      await inMemoryJobApplicationRepository.create({
        jobId: 'job-01',
        userId: 'user-01',
        message: `Interesse na vaga ${i}`,
        githubUrl: 'https://github.com/user-01',
        linkedinUrl: 'https://linkedin.com/user-01',
        status: 'PENDING',
      })
    }
  })

  it('should be able to fetch paginated job applications', async () => {
    const { jobApplications, meta } = await sut.execute({
      page: 1,
      limit: 10,
    })

    console.log({ jobApplications, meta })
    expect(jobApplications).toHaveLength(10)
    expect(meta).toEqual({
      total: 22,
      page: 1,
      pages: 3,
    })
  })

  it('should be able to fetch the second page of job applications', async () => {
    const { jobApplications, meta } = await sut.execute({
      page: 2,
      limit: 10,
    })

    console.log({ jobApplications, meta })
    expect(jobApplications).toHaveLength(10)
    expect(meta).toEqual({
      total: 22,
      page: 2,
      pages: 3,
    })
  })
})
