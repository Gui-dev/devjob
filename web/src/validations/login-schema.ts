import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'O email é obrigatório' })
    .email({ message: 'Formato de e-mail invalido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no minimo 6 caracteres' }),
})

export type LoginSchemaData = z.infer<typeof loginSchema>
