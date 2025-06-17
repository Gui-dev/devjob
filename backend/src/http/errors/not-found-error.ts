export class NotFoundError extends Error {
  public statusCode: number

  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
    this.statusCode = 404
  }
}
