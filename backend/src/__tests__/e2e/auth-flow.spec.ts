import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'

describe('Authentication flow', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to login, access /me, refresh token and access /me again', async () => {
    await prisma.user.create({
      data: {
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: await hash('123456', 8),
      },
    })

    const loginResponse = await request(app.server).post('/users/login').send({
      email: 'bruce@email.com',
      password: '123456',
    })

    const { accessToken } = loginResponse.body
    const cookies = loginResponse.get('Set-Cookie') as string[]

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
      }),
    )

    const refreshResponse = await request(app.server)
      .post('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(refreshResponse.statusCode).toEqual(200)
    expect(refreshResponse.body.token).toEqual(expect.any(String))

    const newAccessToken = refreshResponse.body.token

    const newProfileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${newAccessToken}`)

    expect(newProfileResponse.statusCode).toEqual(200)
    expect(newProfileResponse.body.user).toEqual(
      expect.objectContaining({
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
      }),
    )
  })
})
