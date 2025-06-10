import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryJobRepository } from '@/repositories/in-memory/in-memory-job-repository'
import { GetJobDetailsUsecase } from '../get-job-details'

let jobRepository: InMemoryJobRepository
let sut: GetJobDetailsUsecase

describe('Get Job Details Use Case', () => {
  beforeEach(async () => {
    jobRepository = new InMemoryJobRepository()
    sut = new GetJobDetailsUsecase(jobRepository)
  })

  it('should be able to return job details if job exists', async () => {
    const job = await jobRepository.create({
      recruiterId: 'recruiter-1',
      title: 'Vaga de desenvolvedor',
      description: 'Vaga de desenvolvedor para a empresa XYZ',
      company: 'XYZ',
      location: 'São Paulo',
      type: 'REMOTE',
      level: 'PLENO',
      technologies: ['Node.js', 'React'],
    })

    const { job: jobResult } = await sut.execute({ jobId: job.id })

    expect(jobResult).toEqual(
      expect.objectContaining({ title: 'Vaga de desenvolvedor' }),
    )
  })
})
