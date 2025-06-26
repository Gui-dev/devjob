import { env } from '@/lib/env'
import type { EmailJobData } from '@/services/queues'
import nodemailer from 'nodemailer'

export const transporter: nodemailer.Transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
})

export const sendEmail = async ({ to, subject, html }: EmailJobData) => {
  await transporter.sendMail({
    from: '"Devjob" <no-reply@devjob.com>',
    to,
    subject,
    html,
  })
}
