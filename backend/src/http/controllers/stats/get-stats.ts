import { getStatsResponseSchema } from '@/http/validations/stats/get-stats-schema'
import { authenticate } from '@/middlewares/auth'
import { authorize } from '@/middlewares/authorize'
import { StatsRepository } from '@/repositories/stats-repository'
import { GetStatsUseCase } from '@/use-cases/stats/get-stats'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export const getStatsRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/stats',
    {
      preHandler: [authenticate, authorize(['ADMIN'])],
      schema: {
        summary: 'Exibir estatísticas do sistema',
        tags: ['Stats'],
        response: {
          200: getStatsResponseSchema,
        },
      },
    },
    async (_, reply) => {
      const statsRepository = new StatsRepository()
      const getStatsUseCase = new GetStatsUseCase(statsRepository)
      const { stats } = await getStatsUseCase.execute()

      return reply.status(200).send({ stats })
    },
  )
}
