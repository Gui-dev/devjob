import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { hash } from 'bcrypt'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('/users/login POST', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to login and return tokens', async () => {
    await prisma.user.create({
      data: {
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.server).post('/users/login').send({
      email: 'bruce@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('accessToken')
    expect(response.body).toHaveProperty('refreshToken')
  })
})
