import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import {
  createJobApplicarionResponseSchema,
  createJobApplicationBodySchema,
  createJobApplicationParamsSchema,
} from '@/http/validations/job-applications/create-job-application-schema'
import { authenticate } from '@/middlewares/auth'
import { authorize } from '@/middlewares/authorize'
import { JobApplicationRepository } from '@/repositories/job-application-repository'
import { CreateJobApplicationUseCase } from '@/use-cases/job-applications/create-job-application'

export const createJobApplicationRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/jobs/:job_id/apply',
    {
      preHandler: [authenticate, authorize(['CANDIDATE'])],
      schema: {
        summary: 'Apply for a job',
        tags: ['Job Applications'],
        params: createJobApplicationParamsSchema,
        body: createJobApplicationBodySchema,
        response: {
          201: createJobApplicarionResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { job_id } = request.params
      const { message, githubUrl, linkedinUrl } = request.body
      const userId = request.user.sub

      const jobApplicationRepository = new JobApplicationRepository()
      const createJobApplicationUseCase = new CreateJobApplicationUseCase(
        jobApplicationRepository,
      )

      const { jobApplication } = await createJobApplicationUseCase.execute({
        jobId: job_id,
        userId,
        message,
        githubUrl,
        linkedinUrl,
      })

      await app.bullmq.emailQueue.add('sendEmail', {
        to: `${jobApplication.user.email}`,
        subject: `Candidatura recebida com sucesso - para a vaga ${jobApplication.job.title}`,
        html: `<p>Olá test, sua candidatura foi enviada com sucesso para a vaga ${jobApplication.job.title}</p>`,
      })

      return reply.status(201).send({ jobApplicationId: jobApplication.id })
    },
  )
}
