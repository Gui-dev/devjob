import { type Job, Worker } from 'bullmq'
import { NodemailerEmailService } from './nodemailer-email-service'

const emailService = new NodemailerEmailService()

export const emailWorker = new Worker(
  'email',
  async (job: Job) => {
    await emailService.sendEmail(job.data)
  },
  {
    connection: {
      host: 'localhost',
      port: 6379,
    },
  },
)
