import { z } from 'zod'

export const userProfileSchema = z.object({
  user: z.object({
    id: z.string().cuid(),
    name: z.string().min(3),
    email: z.string().email(),
    role: z.enum(['CANDIDATE', 'RECRUITER', 'ADMIN']),
  }),
})
