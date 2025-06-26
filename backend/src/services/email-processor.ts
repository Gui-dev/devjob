import { type Job, Worker } from 'bullmq'
import { redis } from '@/lib/redis'
import { EMAIL_QUEUE_NAME, type EmailJobData } from './queues'
import { sendEmail } from '@/lib/nodemailer'

export const emailWorker = new Worker<EmailJobData>(
  EMAIL_QUEUE_NAME,
  async (job: Job) => {
    try {
      console.log(`Processing email job ${job.id}`)
      await sendEmail(job.data)
    } catch (error) {
      console.error(`Error processing email job ${job.id}`, error)
      throw error
    }
  },
  {
    connection: redis,
  },
)

emailWorker.on('completed', job => {
  console.log(`Email Job ${job.id} completed`)
})

emailWorker.on('failed', (job, err) => {
  console.log(`Email Job ${job?.id} failed`, err)
})
