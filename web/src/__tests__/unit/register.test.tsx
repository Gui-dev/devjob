import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { AuthProvider } from '@/components/auth-provider'
import RegisterPage from '@/app/(auth)/register/page'
import { api } from '@/lib/api'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Register Page', () => {
  const user = userEvent.setup()
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

  it('should be able to display errors when fields are empty', async () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>,
    )

    await user.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText(/o nome é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/o e-mail é obrigatório/i)).toBeInTheDocument()
      expect(
        screen.getByText(/a senha deve ter no minimo 6 caracteres/i),
      ).toBeInTheDocument()
      expect(screen.getByTestId('role-error')).toHaveTextContent(
        /selecione um tipo de conta/i,
      )
    })
  })

  it('should be able to submit registration and redirect to login', async () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>,
    )

    vi.mocked(api.post).mockResolvedValue({
      data: { userId: 'user-id' },
      status: 201,
    })

    await user.type(screen.getByPlaceholderText(/nome/i), 'Bruce Wayne')
    await user.type(screen.getByPlaceholderText(/email/i), 'bruce@email.com')
    await user.type(screen.getByPlaceholderText(/senha/i), '123456')

    const select = await screen.findByTestId('select-trigger')
    await user.pointer({
      keys: '[MouseLeft]',
      target: select,
    })

    const option = await screen.findByRole('option', { name: /candidato/i })
    await user.pointer({
      keys: '[MouseLeft]',
      target: option,
    })

    await user.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/users/register', {
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: '123456',
        role: 'CANDIDATE',
      })

      expect(toast.success).toHaveBeenCalledWith(
        'Cadastro realizado com sucesso!',
      )
      expect(pushMock).toHaveBeenCalledWith('/login')
    })
  })
})
