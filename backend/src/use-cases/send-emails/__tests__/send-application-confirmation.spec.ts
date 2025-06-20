import { describe, expect, it, vi } from 'vitest'
import { emailQueue } from '@/services/queues'
import { SendApplicationConfirmationUseCase } from '../send-applications-confirmatin'

vi.mock('@/services/queues', () => ({
  emailQueue: {
    add: vi.fn(),
  },
}))

let sut: SendApplicationConfirmationUseCase

describe('Send Application Confirmation Use Case', () => {
  it('should be able to enqueue an email job when email service is not provided', async () => {
    sut = new SendApplicationConfirmationUseCase()
    await sut.execute({
      to: 'bruce@example.com',
      subject: 'test',
      html: '<p>I am Batman</p>',
    })

    expect(emailQueue.add).toHaveBeenCalledTimes(1)
    expect(emailQueue.add).toHaveBeenCalledWith(
      'sendEmail',
      expect.objectContaining({
        to: 'bruce@example.com',
        subject: 'test',
        html: '<p>I am Batman</p>',
      }),
    )
  })
})
