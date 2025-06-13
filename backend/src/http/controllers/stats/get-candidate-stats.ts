import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { getCandidateResponseSchema } from '@/http/validations/stats/get-candidate-stats-schema'
import { authenticate } from '@/middlewares/auth'
import { authorize } from '@/middlewares/authorize'
import { CandidateStatsRepository } from '@/repositories/candidate-stats-repository'
import { GetCandidateStatsUseCase } from '@/use-cases/stats/get-candidate-stats'

export const getCandidateStatsRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/me/stats',
    {
      preHandler: [authenticate, authorize(['CANDIDATE'])],
      schema: {
        summary: 'Exibir estatísticas do candidato',
        tags: ['stats', 'dashboard'],
        response: {
          200: getCandidateResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const candidateStatsRepository = new CandidateStatsRepository()
      const getCandidateStatsUseCase = new GetCandidateStatsUseCase(
        candidateStatsRepository,
      )
      const { candidateStats } = await getCandidateStatsUseCase.execute({
        userId,
      })

      return reply.status(200).send({ candidateStats })
    },
  )
}
