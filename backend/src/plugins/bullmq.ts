import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'

import { emailQueue } from '@/services/queues'

const bullMQPlugin = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) => {
  fastify.decorate('bullmq', { emailQueue })
}

export default fp(bullMQPlugin)
