import type { FastifyReply, FastifyRequest } from 'fastify'

export const authorize = (roles: string[]) => {
  return (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user.role

    if (!roles.includes(userRole)) {
      return reply.status(403).send({ message: 'Access denied' })
    }
  }
}
