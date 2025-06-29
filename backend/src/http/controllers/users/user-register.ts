import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import {
  userRegisterResponse,
  userRegisterSchema,
} from '../../validations/users/user-register-schema'
import { UserRegisterUseCase } from '../../../use-cases/users/user-register'
import { UserRepository } from '../../../repositories/user-repository'

export const userRegisterRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/register',
    {
      schema: {
        summary: 'Cadastrar usuario',
        tags: ['users'],
        body: userRegisterSchema,
        response: {
          201: userRegisterResponse,
        },
      },
    },
    async (request, reply) => {
      const { name, email, password, role } = request.body

      const userRepository = new UserRepository()
      const userRegisterUseCase = new UserRegisterUseCase(userRepository)

      const user = await userRegisterUseCase.execute({
        name,
        email,
        password,
        role,
      })

      return reply.status(201).send({ id: user.id })
    },
  )
}
