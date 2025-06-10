import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { authenticate } from '@/middlewares/auth'
import { JobApplicationRepository } from '@/repositories/job-application-repository'
import { GetUserApplicationUseCase } from '@/use-cases/job-applications/get-user-applications'

export const getUserApplicationsRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/me/applications',
    {
      preHandler: [authenticate],
      schema: {
        summary: 'Visualizar aplicações do usuário',
        tags: ['Job Applications'],
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const jobApplicationRepository = new JobApplicationRepository()
      const getUserApplicationsUseCase = new GetUserApplicationUseCase(
        jobApplicationRepository,
      )

      const { userApplications } = await getUserApplicationsUseCase.execute({
        userId,
      })

      return reply.status(200).send({ userApplications })
    },
  )
}
