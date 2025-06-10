import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryJobApplicationRepository } from '@/repositories/in-memory/in-memory-job-application-repository'
import { CreateJobApplicationUseCase } from '../create-job-application'

let jobApplicationRepository: InMemoryJobApplicationRepository
let sut: CreateJobApplicationUseCase

describe('Create job application use case', () => {
  beforeEach(() => {
    jobApplicationRepository = new InMemoryJobApplicationRepository()
    sut = new CreateJobApplicationUseCase(jobApplicationRepository)
  })

  it('should be able to allow a candidate to apply for a job', async () => {
    const { jobApplicationId } = await sut.execute({
      jobId: 'job-01',
      userId: 'user-01',
      message: 'Olá, tenho interesse',
      githubUrl: 'https://github.com/dracarys',
      linkedinUrl: 'https://linkedin.com/dracarys',
    })

    expect(jobApplicationId).toEqual(expect.any(String))
    expect(jobApplicationRepository.get()).toHaveLength(1)
  })

  it('should not be able to allow a candidate to apply for a job twice', async () => {
    await sut.execute({
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
        message: 'Olá, tenho interesse',
        githubUrl: 'https://github.com/dracarys',
        linkedinUrl: 'https://linkedin.com/dracarys',
      }),
    ).rejects.toThrow(new Error('You have already applied for this job'))
  })
})
