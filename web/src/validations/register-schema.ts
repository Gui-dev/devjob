import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, { message: 'O nome e obrigatorio' }),
  email: z
    .string()
    .min(1, { message: 'O e-mail e obrigatorio' })
    .email({ message: 'E-mail invalido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no minimo 6 caracteres' }),
  role: z.enum(['CANDIDATE', 'RECRUITER'], {
    message: 'Selecione um tipo de conta',
  }),
})

export type RegisterSchemaData = z.infer<typeof registerSchema>
