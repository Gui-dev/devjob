import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryJobRepository } from '@/repositories/in-memory/in-memory-job-repository'
import { CreateJobUseCase } from '../create-job'

let jobRepository: InMemoryJobRepository
let sut: CreateJobUseCase

describe('Create job use case', () => {
  beforeEach(() => {
    jobRepository = new InMemoryJobRepository()
    sut = new CreateJobUseCase(jobRepository)
  })

  it('should be able to create a new job', async () => {
    const result = await sut.execute({
      recruiterId: 'recruiter-1',
      title: 'Vaga de desenvolvedor',
      description: 'Vaga de desenvolvedor para a empresa XYZ',
      company: 'XYZ',
      location: 'São Paulo',
      type: 'REMOTE',
      level: 'PLENO',
      technologies: ['Node.js', 'React'],
    })

    expect(result.jobId).toEqual(expect.any(String))
    expect(jobRepository.get()).toHaveLength(1)
    expect(jobRepository.get()[0]).toMatchObject({
      title: 'Vaga de desenvolvedor',
      description: 'Vaga de desenvolvedor para a empresa XYZ',
    })
  })
})
