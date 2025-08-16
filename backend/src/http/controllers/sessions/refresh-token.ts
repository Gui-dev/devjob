import { env } from '@/lib/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import {
  refreshTokenResponse,
  refreshTokenSchema,
} from '@/http/validations/sessions/refresh-token-schema'

export const refreshTokenRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/token/refresh',
    {
      schema: {
        summary: 'Refresh token',
        tags: ['sessions'],
        body: refreshTokenSchema,
        response: {
          200: refreshTokenResponse,
          401: { message: 'Refresh token not provided' },
        },
      },
    },
    async (request, reply) => {
      const { refreshToken } = request.body

      if (!refreshToken) {
        return reply.status(401).send({ message: 'Refresh token not provided' })
      }

      const decoded = app.jwt.verify<{ sub: string; role: string }>(
        refreshToken,
      )

      const accessToken = await reply.jwtSign(
        { role: decoded.role, sub: decoded.sub },
        { expiresIn: '10m' },
      )

      const newRefreshToken = await reply.jwtSign(
        { role: decoded.role, sub: decoded.sub },
        { expiresIn: '7d' },
      )

      console.log('access token', accessToken)
      console.log('refresh token', newRefreshToken)

      return reply
        .status(200)
        .send({ accessToken, refreshToken: newRefreshToken })
    },
  )
}
