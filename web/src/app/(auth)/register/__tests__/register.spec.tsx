import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useRouter } from 'next/navigation'

import { AuthProvider } from '@/components/auth-provider'
import RegisterPage from './../page'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}))

describe('Register Page', () => {
  const pushMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
    } as unknown as ReturnType<typeof useRouter>)
  })

  it('should be able to renders register page', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>,
    )

    expect(screen.getByPlaceholderText(/nome/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument()
    expect(screen.getByText(/selecione um tipo de conta/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /criar conta/i }),
    ).toBeInTheDocument()
  })
})
