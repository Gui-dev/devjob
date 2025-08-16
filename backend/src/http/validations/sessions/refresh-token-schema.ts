import { z } from 'zod'

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
})

export const refreshTokenResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})
