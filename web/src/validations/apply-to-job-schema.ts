import { z } from 'zod'

export const applyToJobSchema = z.object({
  message: z.string().min(10, 'A mensagem deve ter no minimo 10 caracteres'),
  githubUrl: z
    .string()
    .url('Informe uma Url do github válida')
    .includes('github.com')
    .optional(),
  linkedinUrl: z
    .string()
    .url('Informe uma Url do linkedin válida')
    .includes('linkedin.com')
    .optional(),
})

export type ApplyToJobRequest = z.infer<typeof applyToJobSchema>
