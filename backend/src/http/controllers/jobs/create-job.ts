import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import {
  createJobResponseSchema,
  createJobSchema,
} from '@/http/validations/jobs/create-job-schema'
import { authenticate } from '@/middlewares/auth'
import { authorize } from '@/middlewares/authorize'
import { JobRepository } from '@/repositories/job-repository'
import { CreateJobUseCase } from '@/use-cases/jobs/create-job'

export const createJobRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/jobs',
    {
      preHandler: [authenticate, authorize(['RECRUITER', 'ADMIN'])],
      schema: {
        summary: 'Criar vaga de emprego',
        tags: ['Jobs'],
        body: createJobSchema,
        response: {
          201: createJobResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const {
        title,
        description,
        company,
        location,
        type,
        level,
        technologies,
      } = request.body

      const jobRepository = new JobRepository()
      const createJobUseCase = new CreateJobUseCase(jobRepository)

      const { jobId } = await createJobUseCase.execute({
        recruiterId: request.user.sub,
        title,
        description,
        company,
        location,
        type,
        level,
        technologies,
      })

      return reply.status(201).send({ jobId })
    },
  )
}
