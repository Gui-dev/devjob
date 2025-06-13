import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'

describe('Get stats (e2e)', () => {
  let accessToken: string

  beforeAll(async () => {
    await app.ready()

    await prisma.user.create({
      data: {
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: await hash('123456', 8),
        role: 'ADMIN',
      },
    })

    const loginResponse = await request(app.server).post('/users/login').send({
      email: 'bruce@email.com',
      password: '123456',
    })

    accessToken = loginResponse.body.accessToken
  })

  afterAll(async () => {
    await prisma.user.deleteMany()
    await app.close()
  })

  it('should be able return system stats', async () => {
    const response = await request(app.server)
      .get('/stats')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

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

  it('should not be able to allow candidate to access stats', async () => {
    await prisma.user.create({
      data: {
        name: 'Clark Kent',
        email: 'clark@email.com',
        password: await hash('123456', 8),
        role: 'CANDIDATE',
      },
    })

    const loginResponse = await request(app.server).post('/users/login').send({
      email: 'clark@email.com',
      password: '123456',
    })

    const response = await request(app.server)
      .get('/stats')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .send()

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Access denied')
  })
})
