import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryJobApplicationRepository } from '@/repositories/in-memory/in-memory-job-application-repository'
import { GetUserApplicationUseCase } from '../get-user-applications'

let jobApplicationRepository: InMemoryJobApplicationRepository
let sut: GetUserApplicationUseCase

describe('Get User Applications Use Case', () => {
  beforeEach(() => {
    jobApplicationRepository = new InMemoryJobApplicationRepository()
    sut = new GetUserApplicationUseCase(jobApplicationRepository)
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

    const { userApplications } = await sut.execute({ userId: 'user-01' })

    expect(userApplications).toHaveLength(2)
    expect(userApplications).toEqual([
      expect.objectContaining({ jobId: 'job-01' }),
      expect.objectContaining({ jobId: 'job-02' }),
    ])
  })
})
