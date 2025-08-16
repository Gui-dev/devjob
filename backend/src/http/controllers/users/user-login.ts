import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  userLoginResponse,
  userLoginSchema,
} from '../../validations/users/user-login-schema'
import { UserRepository } from '../../../repositories/user-repository'
import { UserLoginUseCase } from '../../../use-cases/users/user-login'

export const userLoginRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/login',
    {
      schema: {
        summary: 'Logar usuario',
        tags: ['users'],
        body: userLoginSchema,
        response: {
          200: userLoginResponse,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userRepository = new UserRepository()
      const userLoginUseCase = new UserLoginUseCase(userRepository)

      const { user } = await userLoginUseCase.execute({
        email,
        password,
      })

      const accessToken = await reply.jwtSign(
        { role: user.role, sub: user.id },
        { expiresIn: '10m' },
      )

      const refreshToken = await reply.jwtSign(
        { role: user.role, sub: user.id },
        { expiresIn: '7d' },
      )

      return reply.status(200).send({ accessToken, refreshToken })
    },
  )
}
