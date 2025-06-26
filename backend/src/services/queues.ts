import { Queue } from 'bullmq'

import { redis } from '@/lib/redis'

export interface EmailJobData {
  to: string
  subject: string
  html: string
}

export const EMAIL_QUEUE_NAME = 'email'

export const emailQueue = new Queue<EmailJobData>(EMAIL_QUEUE_NAME, {
  connection: redis,
})
