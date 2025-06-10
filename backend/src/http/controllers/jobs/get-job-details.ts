import {
  getJobDetailsParamsSchema,
  getJobDetailsResponseSchema,
} from '@/http/validations/jobs/get-job-details-schema'
import { JobRepository } from '@/repositories/job-repository'
import { GetJobDetailsUsecase } from '@/use-cases/jobs/get-job-details'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export const getJobDetailsRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/jobs/:jobId',
    {
      schema: {
        summary: 'Detalhar vaga de emprego',
        tags: ['Jobs'],
        params: getJobDetailsParamsSchema,
        response: {
          200: getJobDetailsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { jobId } = request.params

      const jobRepository = new JobRepository()
      const getJobDetailsUseCase = new GetJobDetailsUsecase(jobRepository)

      const { job } = await getJobDetailsUseCase.execute({ jobId })

      return reply.status(200).send({ job })
    },
  )
}
