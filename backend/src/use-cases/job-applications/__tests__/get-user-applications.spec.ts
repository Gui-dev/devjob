import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryJobApplicationRepository } from '@/repositories/in-memory/in-memory-job-application-repository'
import { GetUserApplicationUseCase } from '../get-user-applications'

let jobApplicationRepository: InMemoryJobApplicationRepository
let sut: GetUserApplicationUseCase

describe('Get User Applications Use Case', () => {
  beforeEach(() => {
    jobApplicationRepository = new InMemoryJobApplicationRepository()
    sut = new GetUserApplicationUseCase(jobApplicationRepository)

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
  })

  it('should be able to return all job applications for a user', async () => {
    await jobApplicationRepository.create({
      jobId: 'job-01',
      userId: 'user-01',
      message: 'Olá, tenho interesse',
      githubUrl: 'https://github.com/dracarys',
      linkedinUrl: 'https://linkedin.com/dracarys',
    })

    await jobApplicationRepository.create({
      jobId: 'job-02',
      userId: 'user-01',
      message: 'Olá, tenho interesse',
      githubUrl: 'https://github.com/dracarys',
      linkedinUrl: 'https://linkedin.com/dracarys',
    })

    const { jobApplications, meta } = await sut.execute({
      userId: 'user-01',
      page: 1,
      limit: 10,
    })

    expect(jobApplications).toHaveLength(2)
    expect(jobApplications).toEqual([
      expect.objectContaining({ jobId: 'job-01' }),
      expect.objectContaining({ jobId: 'job-02' }),
    ])
    expect(jobApplications).toEqual([
      expect.objectContaining({
        jobId: 'job-01',
        job: expect.objectContaining({
          title: 'Backend',
          company: 'Empresa A',
        }),
      }),
      expect.objectContaining({
        jobId: 'job-02',
        job: expect.objectContaining({
          title: 'Frontend',
          company: 'Empresa B',
        }),
      }),
    ])

    expect(meta).toEqual({
      total: 2,
      page: 1,
      pages: 1,
    })
  })
})
