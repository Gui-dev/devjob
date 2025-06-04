import type { FastifyInstance } from 'fastify'

export const refreshTokenRoute = async (app: FastifyInstance) => {
  app.post('/token/refresh', async (request, reply) => {
    await request.jwtVerify({ onlyCookie: true })

    const token = await reply.jwtSign(
      { sub: request.user.sub },
      { expiresIn: '15m' },
    )

    const refreshToken = await reply.jwtSign(
      { sub: request.user.sub },
      { expiresIn: '7d' },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
      .status(200)
      .send({ token })
  })
}
