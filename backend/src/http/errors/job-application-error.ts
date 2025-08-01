export class JobApplicationError extends Error {
  public message: string
  public statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }
}
