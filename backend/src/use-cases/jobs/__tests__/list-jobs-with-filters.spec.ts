import { InMemoryJobRepository } from '@/repositories/in-memory/in-memory-job-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ListJobsWithFilters } from '../list-jobs-with-filter'

let jobRepository: InMemoryJobRepository
let sut: ListJobsWithFilters

describe('List Jobs With Filters', () => {
  beforeEach(async () => {
    jobRepository = new InMemoryJobRepository()
    sut = new ListJobsWithFilters(jobRepository)

    await jobRepository.create({
      recruiterId: 'recruiter-1',
      title: 'Backend',
      description: 'Vaga Node para a empresa XYZ',
      company: 'XYZ',
      location: 'São Paulo',
      type: 'ONSITE',
      level: 'PLENO',
      technologies: ['Node.js'],
    })

    await jobRepository.create({
      recruiterId: 'recruiter-2',
      title: 'Frontend',
      description: 'Vaga React para a empresa XYZ',
      company: 'XYZ',
      location: 'São Paulo',
      type: 'REMOTE',
      level: 'PLENO',
      technologies: ['React'],
    })
  })

  it('should be able to list jobs filtered by technology', async () => {
    const { jobs } = await sut.execute({ technology: 'Node.js' })

    expect(jobs).toHaveLength(1)
    expect(jobs[0].title).toEqual('Backend')
  })
})
