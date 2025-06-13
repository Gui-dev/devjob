import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryRecruiterStatsRepository } from '@/repositories/in-memory/in-memory-recruiter-stats-repository'
import { GetRecruiterStatsUseCase } from '../get-recruiter-stats'

let recruiterStatsRepository: InMemoryRecruiterStatsRepository
let sut: GetRecruiterStatsUseCase

describe('Get Recruiter Stats Use Case', () => {
  beforeEach(() => {
    recruiterStatsRepository = new InMemoryRecruiterStatsRepository()
    sut = new GetRecruiterStatsUseCase(recruiterStatsRepository)

    recruiterStatsRepository.setJobs([
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
    ])

    recruiterStatsRepository.setJobApplications([
      {
        id: 'job-application-1',
        jobId: 'job-1',
        userId: 'candidate-1',
        message: 'Tenho interesse na vaga',
        githubUrl: 'https://github.com/brucewayne',
        linkedinUrl: 'https://linkedin.com/brucewayne',
        status: 'PENDING',
        createdAt: new Date(),
      },
      {
        id: 'job-application-2',
        jobId: 'job-1',
        userId: 'candidate-2',
        message: 'Tenho interesse na vaga',
        githubUrl: 'https://github.com/barryallen',
        linkedinUrl: 'https://linkedin.com/barryallen',
        status: 'ACCEPTED',
        createdAt: new Date(),
      },
    ])
  })

  it('should be able to returns recruiter stats', async () => {
    const { recruiterStats } = await sut.execute({ userId: 'recruiter-1' })

    expect(recruiterStats).toEqual({
      totalJobs: 1,
      totalApplications: 2,
      pendingApplications: 1,
      acceptedApplications: 1,
      rejectedApplications: 0,
    })
  })
})
