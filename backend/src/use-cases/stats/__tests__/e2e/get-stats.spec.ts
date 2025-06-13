import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '@/app'

describe('Get stats (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able return system stats', async () => {
    const response = await request(app.server).get('/stats').send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.stats).toEqual(
      expect.objectContaining({
        totalJobs: expect.any(Number),
        totalCandidates: expect.any(Number),
        totalRecruiters: expect.any(Number),
        totalJobApplications: expect.any(Number),
      }),
    )
  })
})
