import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { hash } from 'bcrypt'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { JobApplicationError } from '@/http/errors/job-application-error'

describe('Create Job Application flow e2e', () => {
  let jobId: string
  let accessToken: string

  beforeAll(async () => {
    await app.ready()

    await prisma.user.create({
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
        location: 'São Paulo',
        type: 'ONSITE',
        level: 'JUNIOR',
        technologies: ['Node.js'],
      },
    })

    jobId = job.id

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

  it('should be able to apply for a job successfully', async () => {
    const response = await request(app.server)
      .post(`/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        message: 'Gostaria de participar da vaga',
        githubUrl: 'https://github.com/brucewayne',
        linkedinUrl: 'https://linkedin.com/brucewayne',
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body.jobApplicationId).toBeDefined()
  })

  it('should not be able to allow duplicate job applications', async () => {
    await request(app.server)
      .post(`/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        message: 'Gostaria de participar da vaga',
        githubUrl: 'https://github.com/brucewayne',
        linkedinUrl: 'https://linkedin.com/brucewayne',
      })

    const response = await request(app.server)
      .post(`/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        message: 'Gostaria de participar da vaga',
        githubUrl: 'https://github.com/brucewayne',
        linkedinUrl: 'https://linkedin.com/brucewayne',
      })

    expect(response.statusCode).toEqual(409)
    expect(response.body.message).toEqual(
      'You have already applied for this job',
    )
  })
})
