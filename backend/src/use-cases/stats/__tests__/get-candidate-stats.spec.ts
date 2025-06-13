import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCandidateStatsRepository } from '@/repositories/in-memory/in-memory-candidate-stats-repository'
import { GetCandidateStatsUseCase } from '../get-candidate-stats'

let candidateStatsRepository: InMemoryCandidateStatsRepository
let sut: GetCandidateStatsUseCase

describe('Get Candidate Stats Use Case', () => {
  beforeEach(() => {
    candidateStatsRepository = new InMemoryCandidateStatsRepository()
    sut = new GetCandidateStatsUseCase(candidateStatsRepository)

    candidateStatsRepository.setJobApplications([
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
        jobId: 'job-2',
        userId: 'candidate-1',
        message: 'Tenho interesse na vaga',
        githubUrl: 'https://github.com/barryallen',
        linkedinUrl: 'https://linkedin.com/barryallen',
        status: 'ACCEPTED',
        createdAt: new Date(),
      },
      {
        id: 'job-application-3',
        jobId: 'job-3',
        userId: 'candidate-1',
        message: 'Tenho interesse na vaga',
        githubUrl: 'https://github.com/brucewayne',
        linkedinUrl: 'https://linkedin.com/brucewayne',
        status: 'REJECTED',
        createdAt: new Date(),
      },
    ])
  })

  it('should be able to counts applications per status', async () => {
    const { candidateStats } = await sut.execute({ userId: 'candidate-1' })

    console.log(candidateStats)
    expect(candidateStatsRepository.get()).toHaveLength(3)
    expect(candidateStats).toEqual({
      totalApplications: 3,
      pendingApplications: 1,
      acceptedApplications: 1,
      rejectedApplications: 1,
    })
  })
})
