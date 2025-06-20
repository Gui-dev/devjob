import type {
  IEmailServiceContract,
  ISendEmailParams,
} from '@/contracts/email-service-contract'
import { emailQueue } from '@/services/queues'

export class SendApplicationConfirmationUseCase {
  constructor(
    private readonly emailService: IEmailServiceContract | null = null,
  ) {}

  public async execute(params: ISendEmailParams) {
    if (this.emailService) {
      await this.emailService.sendEmail(params)
    } else {
      await emailQueue.add('sendEmail', params)
    }
  }
}
