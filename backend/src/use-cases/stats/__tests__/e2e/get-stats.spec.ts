import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'

describe('Get stats (e2e)', () => {
  let accessToken: string

  beforeAll(async () => {
    await app.ready()

    const admin = await prisma.user.create({
      data: {
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: await hash('123456', 8),
        role: 'ADMIN',
      },
    })

    const candidate = await prisma.user.create({
      data: {
        name: 'Clark Kent',
        email: 'clark@email.com',
        password: await hash('123456', 8),
        role: 'CANDIDATE',
      },
    })

    await prisma.user.createMany({
      data: [
        {
          name: 'Diana Prince',
          email: 'diana@email.com',
          password: await hash('123456', 8),
          role: 'RECRUITER',
        },
        {
          name: 'Barry Allen',
          email: 'barry@email.com',
          password: await hash('123456', 8),
          role: 'CANDIDATE',
        },
      ],
    })

    const job = await prisma.job.create({
      data: {
        recruiterId: admin.id,
        title: 'Backend',
        description: 'Vaga Node para a empresa XYZ',
        company: 'XYZ',
        location: 'São Paulo',
        type: 'ONSITE',
        level: 'JUNIOR',
        technologies: ['Node.js'],
      },
    })

    await prisma.jobApplication.create({
      data: {
        jobId: job.id,
        userId: candidate.id,
        message: 'Gostaria de participar da vaga',
        githubUrl: 'https://github.com/brucewayne',
        linkedinUrl: 'https://linkedin.com/brucewayne',
      },
    })

    const loginResponse = await request(app.server).post('/users/login').send({
      email: 'bruce@email.com',
      password: '123456',
    })

    accessToken = loginResponse.body.accessToken
  })

  afterAll(async () => {
    await prisma.jobApplication.deleteMany()
    await prisma.job.deleteMany()
    await prisma.user.deleteMany()
    await app.close()
  })

  it('should be able return system stats', async () => {
    const response = await request(app.server)
      .get('/stats')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.stats.totalCandidates).toBeGreaterThan(0)
    expect(response.body.stats.totalRecruiters).toBeGreaterThan(0)
    expect(response.body.stats.totalJobs).toBeGreaterThan(0)
    expect(Array.isArray(response.body.stats.applicationsPerJob)).toBe(true)
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
