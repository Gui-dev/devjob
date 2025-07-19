import { z } from 'zod'

export const applyToJobSchema = z.object({
  message: z.string().min(10, 'A mensagem deve ter no minimo 10 caracteres'),
  githubUrl: z
    .string()
    .url('Informe uma Url valida')
    .includes('github.com')
    .optional(),
  linkedinUrl: z
    .string()
    .url('Informe uma Url valida')
    .includes('linkedin.com')
    .optional(),
})

export type ApplyToJobRequest = z.infer<typeof applyToJobSchema>
