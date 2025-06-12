import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { authenticate } from '@/middlewares/auth'
import { authorize } from '@/middlewares/authorize'
import {
  getJobApplicationsParamsSchema,
  getJobApplicationsQuerySchema,
} from '@/http/validations/job-applications/get-job-applications-schema'
import { JobApplicationRepository } from '@/repositories/job-application-repository'
import { GetJobApplicationsUseCase } from '@/use-cases/job-applications/get-job-applications'

export const getJobApplicationsRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/jobs/:job_id/applications',
    {
      preHandler: [authenticate, authorize(['RECRUITER'])],
      schema: {
        summary: 'Visualizar aplicações de uma vaga de emprego',
        tags: ['Job Applications'],
        querystring: getJobApplicationsQuerySchema,
        params: getJobApplicationsParamsSchema,
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query
      const { job_id } = request.params
      const userId = request.user.sub

      const jobApplicationRepository = new JobApplicationRepository()
      const getJobApplicationsUseCase = new GetJobApplicationsUseCase(
        jobApplicationRepository,
      )
      const { jobApplications, meta } = await getJobApplicationsUseCase.execute(
        {
          jobId: job_id,
          userId,
          page,
          limit,
        },
      )

      return reply.status(200).send({ jobApplications, meta })
    },
  )
}
