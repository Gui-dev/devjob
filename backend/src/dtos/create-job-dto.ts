import type { JobLevel, JobType } from '../../prisma/generated/prisma'

export interface ICreateJobDTO {
  recruiterId: string
  title: string
  description: string
  company: string
  location: string
  type: JobType
  level: JobLevel
  technologies: string[]
}
