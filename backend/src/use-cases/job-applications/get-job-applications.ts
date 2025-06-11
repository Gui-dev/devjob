import type { IJobApplicationRepositoryContract } from '@/contracts/job-application-repository-contract'
import { UnauthorizedError } from '@/http/errors/unauthorized-error'

interface IGetJobApplicationsRequest {
  jobId: string
  userId: string
}

export class GetJobApplicationsUseCase {
  constructor(
    private jobApplicationsRepository: IJobApplicationRepositoryContract,
  ) {}

  public async execute({ jobId, userId }: IGetJobApplicationsRequest) {
    const jobApplications =
      await this.jobApplicationsRepository.findByJobId(jobId)

    const isRecruiter = jobApplications[0].job.recruiterId === userId

    if (!isRecruiter) {
      throw new UnauthorizedError('Unauthorized to access these applications')
    }

    return {
      jobApplications,
    }
  }
}
