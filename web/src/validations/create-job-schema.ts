import { z } from 'zod'

export const createJobSchema = z.object({
  title: z.string().min(3, 'O titulo da vaga e obrigatorio'),
  description: z.string().min(3, 'A descricao da vaga e obrigatoria'),
  company: z.string().min(3, 'A empresa e obrigatoria'),
  location: z.string().min(3, 'A localizacao e obrigatoria'),
  level: z.enum(['JUNIOR', 'PLENO', 'SENIOR']),
  type: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
  technologies: z
    .array(z.string().min(1))
    .nonempty('Adicione pelo menos uma tecnologia'),
})

export type CreateJobSchemaData = z.infer<typeof createJobSchema>
