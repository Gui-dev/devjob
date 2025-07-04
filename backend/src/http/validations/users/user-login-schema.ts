import { z } from 'zod'

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const userLoginResponse = z.object({
  accessToken: z.string(),
})
