import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { getRecruiterResponseSchema } from '@/http/validations/stats/get-recruiter-stats-schema'
import { authenticate } from '@/middlewares/auth'
import { authorize } from '@/middlewares/authorize'
import { RecruiterStatsRepository } from '@/repositories/recruiter-stats-repository'
import { GetRecruiterStatsUseCase } from '@/use-cases/stats/get-recruiter-stats'

export const getRecruiterStatsRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/me/recruiters/stats',
    {
      preHandler: [authenticate, authorize(['RECRUITER'])],
      schema: {
        summary: 'Exibir estatísticas do recruiter',
        tags: ['stats', 'dashboard', 'recruiter'],
        response: {
          200: getRecruiterResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const recruiterStatsRepository = new RecruiterStatsRepository()
      const getRecruiterStatsUseCase = new GetRecruiterStatsUseCase(
        recruiterStatsRepository,
      )
      const { recruiterStats } = await getRecruiterStatsUseCase.execute({
        userId,
      })

      return reply.status(200).send({ recruiterStats })
    },
  )
}
