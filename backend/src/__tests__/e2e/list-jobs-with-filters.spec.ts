import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'

describe('List JObs Flow E2E', () => {
  beforeAll(async () => {
    await app.ready()

    const user = await prisma.user.create({
      data: {
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: await hash('123456', 8),
        role: 'RECRUITER',
      },
    })

    await prisma.job.create({
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

    await prisma.job.create({
      data: {
        recruiterId: user.id,
        title: 'Frontend',
        description: 'Vaga React para a empresa XYZ',
        company: 'XYZ',
        location: 'Rio de Janeiro',
        type: 'REMOTE',
        level: 'PLENO',
        technologies: ['React'],
      },
    })
  })

  afterAll(async () => {
    await prisma.job.deleteMany()
    await prisma.user.deleteMany()
    await app.close()
  })

  it('should be able to list jobs filtered by technology', async () => {
    const response = await request(app.server).get('/jobs').query({
      technology: 'React',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.jobs).toHaveLength(1)
    expect(response.body.jobs[0].title).toEqual('Frontend')
  })

  it('should be able to list jobs filtered by type', async () => {
    const response = await request(app.server).get('/jobs').query({
      type: 'REMOTE',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.jobs).toHaveLength(1)
    expect(response.body.jobs[0].title).toEqual('Frontend')
  })

  it('should be able to list jobs filtered by level', async () => {
    const response = await request(app.server).get('/jobs').query({
      level: 'PLENO',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.jobs).toHaveLength(1)
    expect(response.body.jobs[0].title).toEqual('Frontend')
  })
})
