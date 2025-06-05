import { z } from 'zod'

export const userRegisterSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['CANDIDATE', 'RECRUITER']).default('CANDIDATE'),
})

export const userRegisterResponse = z.object({
  id: z.string().cuid(),
})
