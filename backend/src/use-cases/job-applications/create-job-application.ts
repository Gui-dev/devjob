import type { IJobApplicationRepositoryContract } from '@/contracts/job-application-repository-contract'
import { JobApplicationError } from '@/http/errors/job-application-error'

interface ICreateJobApplicationRequest {
  jobId: string
  userId: string
  message?: string
  githubUrl?: string
  linkedinUrl?: string
}

export class CreateJobApplicationUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepositoryContract,
  ) {}

  public async execute({
    jobId,
    userId,
    message,
    githubUrl,
    linkedinUrl,
  }: ICreateJobApplicationRequest) {
    const jobApplicationExists =
      await this.jobApplicationRepository.findByJobIdAndUserId(jobId, userId)

    if (jobApplicationExists) {
      throw new JobApplicationError(
        'You have already applied for this job',
        409,
      )
    }

    const jobApplication = await this.jobApplicationRepository.create({
      jobId,
      userId,
      message,
      githubUrl,
      linkedinUrl,
    })

    return {
      jobApplicationId: jobApplication.id,
    }
  }
}
