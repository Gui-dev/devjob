import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryJobApplicationRepository } from '@/repositories/in-memory/in-memory-job-application-repository'
import { GetJobApplicationsUseCase } from '../get-job-applications'
import { UnauthorizedError } from '@/http/errors/unauthorized-error'

let jobApplicationRepository: InMemoryJobApplicationRepository
let sut: GetJobApplicationsUseCase

describe('Get Job Applications Use Case', () => {
  beforeEach(async () => {
    jobApplicationRepository = new InMemoryJobApplicationRepository()
    sut = new GetJobApplicationsUseCase(jobApplicationRepository)

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
      {
        id: 'job-02',
        recruiterId: 'recruiter-01',
        title: 'Frontend',
        description: 'Vaga React',
        company: 'Empresa B',
        location: 'Rio de Janeiro',
        type: 'HYBRID',
        level: 'PLENO',
        technologies: ['React'],
        createdAt: new Date(),
      },
    ])

    jobApplicationRepository.setUsers([
      {
        id: 'user-01',
        name: 'Bruce Wayne',
        email: 'bruce@example.com',
        password: '123456',
        role: 'CANDIDATE',
        createdAt: new Date(),
      },
      {
        id: 'recruiter-01',
        name: 'Clark Kent',
        email: 'clark@example.com',
        password: '123456',
        role: 'RECRUITER',
        createdAt: new Date(),
      },
    ])
  })

  it('should be able to return all applications for a job', async () => {
    await jobApplicationRepository.create({
      jobId: 'job-01',
      userId: 'user-01',
      message: 'Olá, tenho interesse',
      githubUrl: 'https://github.com/dracarys',
      linkedinUrl: 'https://linkedin.com/dracarys',
    })

    const { jobApplications, meta } = await sut.execute({
      jobId: 'job-01',
      userId: 'recruiter-01',
      page: 1,
      limit: 10,
    })

    expect(jobApplications).toHaveLength(1)
    expect(meta).toEqual({
      total: 1,
      page: 1,
      pages: 1,
    })
  })

  it('should not be able to return all applications for a job if user is not recruiter', async () => {
    await jobApplicationRepository.create({
      jobId: 'job-01',
      userId: 'user-01',
      message: 'Olá, tenho interesse',
      githubUrl: 'https://github.com/dracarys',
      linkedinUrl: 'https://linkedin.com/dracarys',
    })

    await expect(() =>
      sut.execute({
        jobId: 'job-01',
        userId: 'user-01',
        page: 1,
        limit: 10,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
