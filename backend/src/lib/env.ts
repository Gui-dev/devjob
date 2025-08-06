import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
})

export const env = envSchema.parse(process.env)
