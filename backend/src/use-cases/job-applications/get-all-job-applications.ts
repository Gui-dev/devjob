import type { IJobApplicationRepositoryContract } from '@/contracts/job-application-repository-contract'

interface IGetAllJobApplicationsParams {
  page: number
  limit: number
}

export class GetAllJobApplicationsUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepositoryContract,
  ) {}

  public async execute({ page, limit }: IGetAllJobApplicationsParams) {
    const { jobApplications, total } =
      await this.jobApplicationRepository.findAll(page, limit)

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
