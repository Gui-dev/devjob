import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'

describe('Get Recruiter Stats (e2e)', () => {
  let accessToken: string

  beforeAll(async () => {
    await app.ready()

    const recruiter = await prisma.user.create({
      data: {
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: await hash('123456', 8),
        role: 'RECRUITER',
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

    const job = await prisma.job.create({
      data: {
        recruiterId: recruiter.id,
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
        status: 'PENDING',
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

  it('should be able to returns recruiter stats', async () => {
    const response = await request(app.server)
      .get('/me/recruiters/stats')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log('RESPONSE: ', response.body)
    expect(response.body.recruiterStats).toEqual({
      totalJobs: 1,
      totalApplications: 1,
      pendingApplications: 1,
      acceptedApplications: 0,
      rejectedApplications: 0,
    })
  })
})
