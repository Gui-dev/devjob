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
        company: 'ABC',
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

  it('should be able to list jobs filtered by location', async () => {
    const response = await request(app.server).get('/jobs').query({
      location: 'São Paulo',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.jobs).toHaveLength(1)
    expect(response.body.jobs[0].title).toEqual('Backend')
  })

  it('should be able to support pagination', async () => {
    const recruiter = await prisma.user.findFirstOrThrow({
      where: {
        role: 'RECRUITER',
      },
    })

    for (let i = 1; i <= 15; i++) {
      await prisma.job.create({
        data: {
          recruiterId: recruiter.id,
          title: `Backend ${i}`,
          description: 'Vaga Node para a empresa XYZ',
          company: 'XYZ',
          location: 'São Paulo',
          type: 'ONSITE',
          level: 'JUNIOR',
          technologies: ['Node.js'],
        },
      })
    }

    const response = await request(app.server).get('/jobs').query({
      page: 2,
      limit: 10,
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.jobs).toHaveLength(7) // Total 15 + 2 no beforeEach, página 2: sobram 7
  })

  it('should be able to order by company', async () => {
    const response = await request(app.server).get('/jobs').query({
      sortBy: 'company',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.jobs[0].company).toEqual('ABC')
  })
})
