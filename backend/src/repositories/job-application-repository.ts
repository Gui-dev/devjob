import type {
  IFindJobByIDResponse,
  IFindUserByIDResponse,
  IJobApplicationRepositoryContract,
} from '@/contracts/job-application-repository-contract'
import type { JobApplication } from '../../prisma/generated/prisma'
import type { ICreateJobApplicationDTO } from '@/dtos/create-job-application-dto'
import { prisma } from '@/lib/prisma'

export class JobApplicationRepository
  implements IJobApplicationRepositoryContract
{
  public async findByJobApplicationId(
    jobApplicationId: string,
  ): Promise<JobApplication | null> {
    const jobApplication = await prisma.jobApplication.findUnique({
      where: {
        id: jobApplicationId,
      },
    })

    return jobApplication
  }

  public async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IFindUserByIDResponse> {
    const [jobApplications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where: {
          userId,
        },
        include: {
          job: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.jobApplication.count({
        where: {
          userId,
        },
      }),
    ])

    return {
      jobApplications,
      total,
    }
  }

  public async findByJobId(
    jobId: string,
    page: number,
    limit: number,
  ): Promise<IFindJobByIDResponse> {
    const [jobApplications, total] = await Promise.all([
      await prisma.jobApplication.findMany({
        where: {
          jobId,
        },
        include: {
          user: true,
          job: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      await prisma.jobApplication.count({
        where: {
          jobId,
        },
      }),
    ])

    return {
      jobApplications,
      total,
    }
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

  public async updateStatus(
    jobApplicationId: string,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  ): Promise<JobApplication> {
    const jobApplication = await prisma.jobApplication.update({
      where: {
        id: jobApplicationId,
      },
      data: {
        status,
      },
    })

    return jobApplication
  }
}
