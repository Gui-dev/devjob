import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { hash } from 'bcrypt'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { emailQueue } from '@/services/queues'

vi.mock('@/services/queues', () => {
  const emailQueue = {
    add: vi.fn(),
  }

  return {
    emailQueue,
    EMAIL_QUEUE_NAME: 'email',
  }
})

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

    jobApplicationId = jobApplication.id
  })

  afterAll(async () => {
    await prisma.jobApplication.deleteMany()
    await prisma.job.deleteMany()
    await prisma.user.deleteMany()
    await app.close()
  })

  it('should be able to update job application status', async () => {
    const recruiterLoginResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'clark@email.com',
        password: '123456',
      })

    const response = await request(app.server)
      .patch(`/jobs/applications/${jobApplicationId}/status`)
      .set('Authorization', `Bearer ${recruiterLoginResponse.body.accessToken}`)
      .send({ status: 'ACCEPTED' })

    expect(response.statusCode).toEqual(200)
    expect(response.body.jobApplicationId).toBeDefined()
    expect(emailQueue.add).toHaveBeenCalledTimes(1)
  })

  it('should not be able to update job application status if user is not recruiter', async () => {
    const candidateLoginResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'bruce@email.com',
        password: '123456',
      })

    const response = await request(app.server)
      .patch(`/jobs/applications/${jobApplicationId}/status`)
      .set('Authorization', `Bearer ${candidateLoginResponse.body.accessToken}`)
      .send({ status: 'ACCEPTED' })

    expect(response.statusCode).toEqual(403)
    expect(response.body).toHaveProperty('message', 'Access denied')
  })

  it('should be able to return 400 if application id is not cuid', async () => {
    const recruiterLoginResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'clark@email.com',
        password: '123456',
      })

    const response = await request(app.server)
      .patch('/jobs/applications/invalid-job-application-id/status')
      .set('Authorization', `Bearer ${recruiterLoginResponse.body.accessToken}`)
      .send({ status: 'ACCEPTED' })

    console.log('RESPONSE: ', response.statusCode)

    expect(response.statusCode).toEqual(400)
  })

  it('should be able to return 404 for invalid applications id', async () => {
    const recruiterLoginResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'clark@email.com',
        password: '123456',
      })

    const response = await request(app.server)
      .patch('/jobs/applications/cmc15oenz0005g5e8arypunlj/status')
      .set('Authorization', `Bearer ${recruiterLoginResponse.body.accessToken}`)
      .send({ status: 'ACCEPTED' })

    expect(response.statusCode).toEqual(404)
  })
})
