import type { FastifyReply, FastifyRequest } from 'fastify'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    await request.jwtVerify()
    console.log('HEREEEE')
  } catch {
    console.log('HEREEEEE 2')
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
