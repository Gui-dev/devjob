import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { authenticate } from '@/middlewares/auth'
import { authorize } from '@/middlewares/authorize'
import { JobApplicationRepository } from '@/repositories/job-application-repository'
import { GetAllJobApplicationsUseCase } from '@/use-cases/job-applications/get-all-job-applications'
import { getAllJobApplicationsQuerySchema } from '@/http/validations/job-applications/get-all-job-applications-schema'

export const getAllJobApplicationsRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/jobs/applications',
    {
      preHandler: [authenticate, authorize(['ADMIN'])],
      schema: {
        summary: 'Visualizar todas aplicacoes de uma vaga de emprego',
        tags: ['Job Applications'],
        querystring: getAllJobApplicationsQuerySchema,
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query

      const jobApplicationRepository = new JobApplicationRepository()
      const getAllJobApplicationsUseCase = new GetAllJobApplicationsUseCase(
        jobApplicationRepository,
      )
      const { jobApplications, meta } =
        await getAllJobApplicationsUseCase.execute({
          page,
          limit,
        })

      return reply.status(200).send({ jobApplications, meta })
    },
  )
}
