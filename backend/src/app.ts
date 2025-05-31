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
import { userRegisterRoute } from './http/controllers/users/user-register'
import { userLoginRoute } from './http/controllers/users/user-login'

export const app = Fastify().withTypeProvider<ZodTypeProvider>()

app.register(cors)
app.register(jwt, {
  secret: String(process.env.JWT_SECRET),
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(swagger, {
  openapi: {
    info: {
      title: 'Devjob',
      version: '1.0.0',
    },
  },
})
app.register(swaggerUI)

app.register(userRegisterRoute)
app.register(userLoginRoute)
