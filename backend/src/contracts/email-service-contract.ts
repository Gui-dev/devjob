export interface ISendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export interface IEmailServiceContract {
  sendEmail(params: ISendEmailParams): Promise<void>
}
