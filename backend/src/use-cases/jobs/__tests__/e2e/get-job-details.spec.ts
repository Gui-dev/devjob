import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { hash } from 'bcrypt'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('Get Job Details Flow E2E', () => {
  let jobId: string

  beforeAll(async () => {
    app.ready()

    const user = await prisma.user.create({
      data: {
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: await hash('123456', 8),
        role: 'RECRUITER',
      },
    })

    const job = await prisma.job.create({
      data: {
        recruiterId: user.id,
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
  })

  afterAll(async () => {
    await prisma.job.deleteMany()
    await prisma.user.deleteMany()
    await app.close()
  })

  it('should be able to return job details by id', async () => {
    const response = await request(app.server).get(`/jobs/${jobId}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.job.title).toEqual('Backend')
  })
})
