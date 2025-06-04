import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { authenticate } from '@/middlewares/auth'
import { UserRepository } from '@/repositories/user-repository'
import { UserProfileUseCase } from '@/use-cases/users/user-profile'
import { userProfileSchema } from '@/http/validations/users/user-profile-schema'

export const userProfileRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/me',
    {
      preHandler: authenticate,
      schema: {
        summary: 'Informações do usuário',
        tags: ['users'],
        response: {
          200: userProfileSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const userRepository = new UserRepository()
      const userProfileUseCase = new UserProfileUseCase(userRepository)
      const { user } = await userProfileUseCase.execute({ userId })

      return reply.status(200).send({ user })
    },
  )
}
