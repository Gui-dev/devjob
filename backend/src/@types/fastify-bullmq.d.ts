import type { emailQueue } from '@/services/queues'

declare module 'fastify' {
  export interface FastifyInstance {
    bullmq: {
      emailQueue: typeof emailQueue
    }
  }
}
