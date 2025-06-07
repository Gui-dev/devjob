import type { JobLevel, JobType } from '../../prisma/generated/prisma'

export interface IFindManyJobsWithFiltersDTO {
  technology?: string
  location?: string
  type?: JobType
  level?: JobLevel
}
