import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { hash } from 'bcrypt'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('Get Job Applications Flow', () => {
  let accessToken: string
  let jobId: string

  beforeAll(async () => {
    await app.ready()

    const candidate = await prisma.user.create({
      data: {
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: await hash('123456', 8),
        role: 'CANDIDATE',
      },
    })

    const candidate2 = await prisma.user.create({
      data: {
        name: 'Barry Allen',
        email: 'barry@email.com',
        password: await hash('123456', 8),
        role: 'CANDIDATE',
      },
    })

    const recruiter = await prisma.user.create({
      data: {
        name: 'Clark Kent',
        email: 'clark@email.com',
        password: await hash('123456', 8),
        role: 'RECRUITER',
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
      },
    })

    await prisma.jobApplication.create({
      data: {
        jobId: job.id,
        userId: candidate2.id,
        message: 'Tenho interesse na vaga',
        githubUrl: 'https://github.com/barryallen',
        linkedinUrl: 'https://linkedin.com/barryallen',
      },
    })

    const loginResponse = await request(app.server).post('/users/login').send({
      email: 'clark@email.com',
      password: '123456',
    })

    jobId = job.id
    accessToken = loginResponse.body.accessToken
  })

  afterAll(async () => {
    await prisma.jobApplication.deleteMany()
    await prisma.job.deleteMany()
    await prisma.user.deleteMany()
    await app.close()
  })

  it('should be able to return all candidates for a job', async () => {
    const response = await request(app.server)
      .get(`/jobs/${jobId}/applications`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.jobApplications).toHaveLength(2)
  })
})
