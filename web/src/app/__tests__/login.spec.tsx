import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import LoginPage from '../(auth)/login/page'
import { AuthProvider } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('next-auth/react', async () => {
  const mod =
    await vi.importActual<typeof import('next-auth/react')>('next-auth/react')
  return {
    ...mod,
    signIn: vi.fn(),
  }
})

describe('Login Page', () => {
  const pushMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
    } as unknown as ReturnType<typeof useRouter>)
  })

  it('should be able to renders login page', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    )

    expect(screen.getByText(/faça login/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument()
  })

  it('should be able to shows validation errors when fields are empty', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    )

    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText(/o email é obrigatório/i)).toBeInTheDocument()
      expect(
        screen.getByText(/a senha deve ter no minimo 6 caracteres/i),
      ).toBeInTheDocument()
    })
  })
})
