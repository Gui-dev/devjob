import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { hash } from 'bcrypt'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('Get User Applications flow', () => {
  let accessToken: string
  let jobApplicationId: string

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
        location: 'Sao Paulo',
        type: 'ONSITE',
        level: 'JUNIOR',
        technologies: ['Node.js'],
      },
    })

    const jobApplication = await prisma.jobApplication.create({
      data: {
        jobId: job.id,
        userId: candidate.id,
        message: 'Gostaria de participar da vaga',
        githubUrl: 'https://github.com/brucewayne',
        linkedinUrl: 'https://linkedin.com/brucewayne',
      },
    })

    const loginResponse = await request(app.server).post('/users/login').send({
      email: 'clark@email.com',
      password: '123456',
    })

    accessToken = loginResponse.body.accessToken
    jobApplicationId = jobApplication.id
  })

  afterAll(async () => {
    await prisma.jobApplication.deleteMany()
    await prisma.job.deleteMany()
    await prisma.user.deleteMany()
    await app.close()
  })

  it('should be able to update job application status', async () => {
    const response = await request(app.server)
      .patch(`/jobs/applications/${jobApplicationId}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'ACCEPTED' })

    console.log('RESPONSE: ', response.body)

    expect(response.statusCode).toEqual(200)
    expect(response.body.jobApplicationId).toBeDefined()
  })
})
