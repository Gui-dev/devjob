import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { hash } from 'bcrypt'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('Recruiter Permissions Flow', () => {
  let accessToken: string
  let jobId: string

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

    const loginResponse = await request(app.server).post('/users/login').send({
      email: 'bruce@email.com',
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

  it('should be able to return 403 if RECRUITER tries to apply to a job', async () => {
    const response = await request(app.server)
      .post(`/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        message: 'Gostaria de participar da vaga',
        githubUrl: 'https://github.com/brucewayne',
        linkedinUrl: 'https://linkedin.com/brucewayne',
      })

    console.log('RESPONSE: ', response.body)
    expect(response.statusCode).toEqual(403)
    expect(response.body.message).toEqual('Access denied')
  })
})
