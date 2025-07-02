import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import LoginPage from './../page'
import { AuthProvider } from '@/components/auth-provider'

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

  it('sould be able to calls signIn when form is valid', async () => {
    const mockedSignIn = signIn as unknown as Mock
    mockedSignIn.mockResolvedValue({ ok: true })

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    )

    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      'bruce@email.com',
    )
    await userEvent.type(screen.getByPlaceholderText(/senha/i), '123456')

    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'bruce@email.com',
        password: '123456',
        redirect: false,
      })
    })
  })
})
