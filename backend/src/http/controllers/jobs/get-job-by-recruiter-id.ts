import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { JobRepository } from '@/repositories/job-repository'
import { authenticate } from '@/middlewares/auth'
import { authorize } from '@/middlewares/authorize'
import {
  getJobsByRecruiterIdSchema,
  getJobsByRecruiterIdSchemaResponse,
} from '@/http/validations/jobs/get-jobs-by-recruiter-id-schema'
import { GetJobsByRecruiterIdUsecase } from '@/use-cases/jobs/get-jobs-by-recruiter-id'

export const getJobsByRecruiterIdRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/jobs/recruiter/list',
    {
      preHandler: [authenticate, authorize(['RECRUITER', 'ADMIN'])],
      schema: {
        summary: 'Listar vagas de um recrutador',
        tags: ['Jobs'],
        querystring: getJobsByRecruiterIdSchema,
        response: {
          200: getJobsByRecruiterIdSchemaResponse,
        },
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query
      const userId = request.user.sub

      const jobRepository = new JobRepository()
      const getJobsByRecruiterIdUseCase = new GetJobsByRecruiterIdUsecase(
        jobRepository,
      )
      const { jobs, meta } = await getJobsByRecruiterIdUseCase.execute({
        userId,
        page,
        limit,
      })

      return reply.status(200).send({ jobs, meta })
    },
  )
}
