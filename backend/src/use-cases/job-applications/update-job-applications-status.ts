import type { IJobApplicationRepositoryContract } from '@/contracts/job-application-repository-contract'
import { UnauthorizedError } from '@/http/errors/unauthorized-error'

interface IUpdateJobApplicationsStatusRequest {
  jobApplicationId: string
  userId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
}

export class UpdateJobApplicationsStatusUseCase {
  constructor(
    private readonly jobApplicationRepository: IJobApplicationRepositoryContract,
  ) {}

  public async execute({
    jobApplicationId,
    userId,
    status,
  }: IUpdateJobApplicationsStatusRequest) {
    const jobApplicationExists =
      await this.jobApplicationRepository.findByJobApplicationId(
        jobApplicationId,
      )

    if (!jobApplicationExists) {
      throw new Error('Job application not found')
    }

    if (jobApplicationExists.job.recruiterId !== userId) {
      throw new UnauthorizedError('Unauthorized to update this job application')
    }

    const jobApplication = await this.jobApplicationRepository.updateStatus(
      jobApplicationId,
      status,
    )

    return {
      jobApplicationId: jobApplication.id,
    }
  }
}
