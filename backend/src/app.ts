import Fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import fastifyCookie from '@fastify/cookie'

import { userRegisterRoute } from './http/controllers/users/user-register'
import { userLoginRoute } from './http/controllers/users/user-login'
import { refreshTokenRoute } from './http/controllers/sessions/refresh-token'
import { userProfileRoute } from './http/controllers/users/me'
import { createJobRoute } from './http/controllers/jobs/create-job'
import { listJobsRoute } from './http/controllers/jobs/list-jobs'
import { getJobDetailsRoute } from './http/controllers/jobs/get-job-details'
import { env } from './lib/env'
import { createJobApplicationRoute } from './http/controllers/job-applications/create-job-application'
import { JobApplicationError } from './http/errors/job-application-error'
import { ZodError } from 'zod/v4'

export const app = Fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCookie)
app.register(cors)
app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '15m',
  },
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(swagger, {
  openapi: {
    info: {
      title: 'Devjob',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
})
app.register(swaggerUI)

app.register(userRegisterRoute)
app.register(userLoginRoute)
app.register(refreshTokenRoute)
app.register(userProfileRoute)
app.register(createJobRoute)
app.register(listJobsRoute)
app.register(getJobDetailsRoute)
app.register(createJobApplicationRoute)

app.setErrorHandler((error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: 'Request does not match schema',
      details: error.validation,
    })
  }

  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
    return reply.status(401).send({ message: 'Token not provided.' })
  }

  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
    return reply.status(401).send({ message: 'Invalid token.' })
  }

  if (error instanceof JobApplicationError) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

  console.log('APP_ERROR: ', error)
  return reply.status(500).send({ message: 'Internal server error.' })
})
