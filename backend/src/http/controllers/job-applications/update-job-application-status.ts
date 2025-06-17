import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import {
  updateJoApplicationsResponseSchema,
  updateJobApplicationsBodySchema,
  updateJobApplicationsStatusParamsSchema,
} from '@/http/validations/job-applications/update-job-applications-status-schema'
import { authenticate } from '@/middlewares/auth'
import { authorize } from '@/middlewares/authorize'
import { JobApplicationRepository } from '@/repositories/job-application-repository'
import { UpdateJobApplicationsStatusUseCase } from '@/use-cases/job-applications/update-job-applications-status'

export const updateJobApplicationStatusRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/jobs/applications/:job_application_id/status',
    {
      preHandler: [authenticate, authorize(['RECRUITER'])],
      schema: {
        summary: 'Atualizar status de uma aplicacao de emprego',
        tags: ['Job Applications', 'Update Status'],
        params: updateJobApplicationsStatusParamsSchema,
        body: updateJobApplicationsBodySchema,
        response: {
          200: updateJoApplicationsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { job_application_id } = request.params
      const { status } = request.body
      const userId = request.user.sub

      const jobApplicationRepository = new JobApplicationRepository()
      const updateJobApplicationStatusUseCase =
        new UpdateJobApplicationsStatusUseCase(jobApplicationRepository)
      const { jobApplicationId } =
        await updateJobApplicationStatusUseCase.execute({
          jobApplicationId: job_application_id,
          userId,
          status,
        })

      return reply.status(200).send({ jobApplicationId })
    },
  )
}
