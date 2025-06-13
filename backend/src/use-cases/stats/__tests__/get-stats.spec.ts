import { InMemoryStatsRepository } from '@/repositories/in-memory/in-memory-stats-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetStatsUseCase } from '../get-stats'

let statsRepository: InMemoryStatsRepository
let sut: GetStatsUseCase

describe('Get Stats Use Case', () => {
  beforeEach(() => {
    statsRepository = new InMemoryStatsRepository()
    sut = new GetStatsUseCase(statsRepository)

    statsRepository.setJobs([
      {
        id: 'job-1',
        recruiterId: 'recruiter-1',
        title: 'Backend',
        description: 'Vaga Node para a empresa XYZ',
        company: 'XYZ',
        location: 'São Paulo',
        type: 'ONSITE',
        level: 'JUNIOR',
        technologies: ['Node.js'],
        createdAt: new Date(),
      },
      {
        id: 'job-2',
        recruiterId: 'recruiter-2',
        title: 'Frontend',
        description: 'Vaga React para a empresa ABC',
        company: 'ABC',
        location: 'São Paulo',
        type: 'ONSITE',
        level: 'JUNIOR',
        technologies: ['React'],
        createdAt: new Date(),
      },
    ])
    statsRepository.setUsers([
      {
        id: 'candidate-1',
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: '123456',
        role: 'CANDIDATE',
        createdAt: new Date(),
      },
      {
        id: 'candidate-2',
        name: 'Barry Allen',
        email: 'barry@email.com',
        password: '123456',
        role: 'CANDIDATE',
        createdAt: new Date(),
      },
      {
        id: 'recruiter-1',
        name: 'Clark Kent',
        email: 'clark@email.com',
        password: '123456',
        role: 'RECRUITER',
        createdAt: new Date(),
      },
    ])

    statsRepository.setJobApplications([
      {
        id: 'job-application-1',
        jobId: 'job-1',
        userId: 'candidate-1',
        message: 'Tenho interesse na vaga',
        githubUrl: 'https://github.com/brucewayne',
        linkedinUrl: 'https://linkedin.com/brucewayne',
        createdAt: new Date(),
      },
      {
        id: 'job-application-2',
        jobId: 'job-1',
        userId: 'candidate-2',
        message: 'Tenho interesse na vaga',
        githubUrl: 'https://github.com/barryallen',
        linkedinUrl: 'https://linkedin.com/barryallen',
        createdAt: new Date(),
      },
      {
        id: 'job-application-3',
        jobId: 'job-2',
        userId: 'candidate-1',
        message: 'Tenho interesse na vaga',
        githubUrl: 'https://github.com/brucewayne',
        linkedinUrl: 'https://linkedin.com/brucewayne',
        createdAt: new Date(),
      },
    ])
  })

  it('should be able to return aggregated stats correctly', async () => {
    const { stats } = await sut.execute()

    expect(stats.totalCandidates).toBe(2)
    expect(stats.totalRecruiters).toBe(1)
    expect(stats.totalJobs).toBe(2)
    expect(stats.applicationsPerJob.length).toBe(2)
  })
})
