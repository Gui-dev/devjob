import { z } from 'zod'

export const filtersSchema = z.object({
  technology: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(['REMOTE', 'ONSITE', 'HYBRID']).optional(),
  level: z.enum(['JUNIOR', 'PLENO', 'SENIOR']).optional(),
  sortBy: z.enum(['createdAt', 'company']).optional(),
})

export type FiltersSchemaData = z.infer<typeof filtersSchema>
