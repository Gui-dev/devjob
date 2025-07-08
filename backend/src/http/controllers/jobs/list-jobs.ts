import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import {
  listJobsSchema,
  listJobsSchemaResponse,
} from '@/http/validations/jobs/list-jobs-schema'
import { JobRepository } from '@/repositories/job-repository'
import { ListJobsWithFiltersUseCase } from '@/use-cases/jobs/list-jobs-with-filter'

export const listJobsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/jobs',
    {
      schema: {
        summary: 'Listar vagas com filtros',
        tags: ['Jobs'],
        querystring: listJobsSchema,
        response: {
          200: listJobsSchemaResponse,
        },
      },
    },
    async (request, reply) => {
      const filters = request.query

      const jobRepository = new JobRepository()
      const listJobsUseCase = new ListJobsWithFiltersUseCase(jobRepository)

      const { jobs, meta } = await listJobsUseCase.execute(filters)

      return reply.status(200).send({ jobs, meta })
    },
  )
}
