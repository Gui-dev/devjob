import Fastify from 'fastify'
import {
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
import { env } from './lib/env'

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
