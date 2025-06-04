import { beforeAll, afterAll, describe, expect, it, beforeEach } from 'vitest'

import { app } from '@/app'
import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'

describe('User Profile', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return profile data for authenticated user', async () => {
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

    const { accessToken } = response.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual({
      id: expect.any(String),
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
    })
  })
})
