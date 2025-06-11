import type {
  IJobApplicationRepositoryContract,
  JobApplicationWithJob,
} from '@/contracts/job-application-repository-contract'
import type { JobApplication } from '../../prisma/generated/prisma'
import type { ICreateJobApplicationDTO } from '@/dtos/create-job-application-dto'
import { prisma } from '@/lib/prisma'

export class JobApplicationRepository
  implements IJobApplicationRepositoryContract
{
  public async findByUserId(userId: string): Promise<JobApplicationWithJob[]> {
    const jobApplications = await prisma.jobApplication.findMany({
      where: {
        userId,
      },
      include: {
        job: true,
      },
    })

    return jobApplications
  }

  public async findByJobIdAndUserId(
    jobId: string,
    userId: string,
  ): Promise<JobApplication | null> {
    const jobApplication = await prisma.jobApplication.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId,
        },
      },
    })

    return jobApplication
  }

  public async create(data: ICreateJobApplicationDTO): Promise<JobApplication> {
    const jobApplication = await prisma.jobApplication.create({
      data,
    })

    return jobApplication
  }
}
