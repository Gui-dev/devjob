import type {
  IEmailServiceContract,
  ISendEmailParams,
} from '@/contracts/email-service-contract'
import { env } from '@/lib/env'
import nodemailer from 'nodemailer'

export class NodemailerEmailService implements IEmailServiceContract {
  private transporter: nodemailer.Transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  })

  public async sendEmail({
    to,
    subject,
    html,
  }: ISendEmailParams): Promise<void> {
    await this.transporter.sendMail({
      from: '"Devjob" <no-reply@devjov.com>',
      to,
      subject,
      html,
    })
  }
}
