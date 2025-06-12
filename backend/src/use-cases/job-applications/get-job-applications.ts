import type { IJobApplicationRepositoryContract } from '@/contracts/job-application-repository-contract'
import { UnauthorizedError } from '@/http/errors/unauthorized-error'

interface IGetJobApplicationsRequest {
  jobId: string
  userId: string
  page: number
  limit: number
}

export class GetJobApplicationsUseCase {
  constructor(
    private jobApplicationsRepository: IJobApplicationRepositoryContract,
  ) {}

  public async execute({
    jobId,
    userId,
    page,
    limit,
  }: IGetJobApplicationsRequest) {
    const { jobApplications, total } =
      await this.jobApplicationsRepository.findByJobId(jobId, page, limit)

    const isRecruiter = jobApplications[0].job.recruiterId === userId

    if (!isRecruiter) {
      throw new UnauthorizedError('Unauthorized to access these applications')
    }

    const pages = Math.ceil(total / limit)

    return {
      jobApplications,
      meta: {
        total,
        page,
        pages,
      },
    }
  }
}
