import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { authenticate } from '@/middlewares/auth'
import { JobApplicationRepository } from '@/repositories/job-application-repository'
import { GetUserApplicationUseCase } from '@/use-cases/job-applications/get-user-applications'
import {
  getUserApplicationsQuerySchema,
  getUserApplicationsResponseSchema,
} from '@/http/validations/job-applications/get-user-applications-schema'

export const getUserApplicationsRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/me/applications',
    {
      preHandler: [authenticate],
      schema: {
        summary: 'Visualizar aplicações do usuário',
        tags: ['Job Applications'],
        querystring: getUserApplicationsQuerySchema,
        response: {
          200: getUserApplicationsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { page, limit } = request.query

      const jobApplicationRepository = new JobApplicationRepository()
      const getUserApplicationsUseCase = new GetUserApplicationUseCase(
        jobApplicationRepository,
      )

      const { userApplications } = await getUserApplicationsUseCase.execute({
        userId,
        page,
        limit,
      })

      return reply.status(200).send({ userApplications })
    },
  )
}
