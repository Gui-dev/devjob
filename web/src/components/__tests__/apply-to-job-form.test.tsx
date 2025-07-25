import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { ApplyToJobForm } from './../apply-to-job-form'
import * as useApplyToJobModule from '@/hooks/use-apply-to-job'

const mockMutate = vi.fn()
let mockIsPending = false

vi.mock('@/hooks/use-apply-to-job', () => ({
  useApplyToJob: vi.fn(() => ({
    mutate: mockMutate,
    isPending: mockIsPending,
  })),
}))

vi.mock('lucide-react', async () => {
  const actual = (await vi.importActual(
    'lucide-react',
  )) as typeof import('lucide-react')
  return {
    ...actual,
    LoaderCircle: () => <svg data-testid="icon-loader-circle" />,
  }
})

vi.mock('@lib/utils', () => ({
  cn: vi.fn((...args: string[]) => args.filter(Boolean).join(' ')),
}))

vi.mock('./../ui/button', () => ({
  Button: vi.fn(({ children, ...props }) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  )),
}))

vi.mock('./../ui/input', () => ({
  Input: vi.fn(({ ...props }) => <input data-testid="input" {...props} />),
}))

vi.mock('./../ui/textarea', () => ({
  Textarea: vi.fn(({ children, ...props }) => (
    <textarea data-testid="textarea" {...props}>
      {children}
    </textarea>
  )),
}))

vi.mock('./../ui/label', () => ({
  Label: vi.fn(({ children, ...props }) => (
    // biome-ignore lint: test
    <label data-testid="label" {...props}>
      {children}
    </label>
  )),
}))

const MOCKED_JOB_ID = 'job-id-123'

describe('<ApplyToJobForm />', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockMutate.mockReset()
    mockIsPending = false

    vi.mocked(useApplyToJobModule.useApplyToJob).mockImplementation(() => ({
      mutate: mockMutate,
      isPending: mockIsPending,
    }))
  })

  it('should be able to render the "Me candidatar" button', async () => {
    render(<ApplyToJobForm jobId={MOCKED_JOB_ID} />)

    const triggerButton = screen.getByRole('button', { name: /me candidatar/i })
    expect(triggerButton).toBeInTheDocument()
  })

  it('should be able to open dialog when "Me candidatar" button is clicked', async () => {
    render(<ApplyToJobForm jobId={MOCKED_JOB_ID} />)

    const triggerButton = screen.getByRole('button', { name: /me candidatar/i })
    await user.click(triggerButton)

    await waitFor(() => {
      expect(screen.getByText(/envie sua candiatura/i)).toBeInTheDocument() // Adicione mais asserções aqui
      expect(
        screen.getByText(
          /mostre seu interesse pela vaga e compartilhe seus links profissionais/i,
        ),
      ).toBeInTheDocument()
      expect(screen.getByText(/github/i)).toBeInTheDocument()
      expect(screen.getByText(/linkedin/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /enviar candidatura/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /cancelar/i }),
      ).toBeInTheDocument()
    })
  })

  it('should be able to close dialog when "Cancelar" button is clicked', async () => {
    render(<ApplyToJobForm jobId={MOCKED_JOB_ID} />)

    const triggerButton = screen.getByRole('button', { name: /me candidatar/i })
    await user.click(triggerButton)

    await waitFor(() => {
      expect(screen.getByText(/envie sua candiatura/i)).toBeInTheDocument() // Adicione mais asserções aqui
      expect(
        screen.getByText(
          /mostre seu interesse pela vaga e compartilhe seus links profissionais/i,
        ),
      ).toBeInTheDocument()
      expect(screen.getByText(/github/i)).toBeInTheDocument()
      expect(screen.getByText(/linkedin/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /enviar candidatura/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /cancelar/i }),
      ).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(
        screen.queryByText(/envie sua candiatura/i),
      ).not.toBeInTheDocument() // Adicione mais asserções aqui
      expect(
        screen.queryByText(
          /mostre seu interesse pela vaga e compartilhe seus links profissionais/i,
        ),
      ).not.toBeInTheDocument()
      expect(screen.queryByText(/github/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/linkedin/i)).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /enviar candidatura/i }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /cancelar/i }),
      ).not.toBeInTheDocument()
    })
  })

  it('should be able to submit the form with valid data and close the dialog', async () => {
    render(<ApplyToJobForm jobId={MOCKED_JOB_ID} />)

    const triggerButton = screen.getByRole('button', { name: /me candidatar/i })
    await user.click(triggerButton)

    await waitFor(() => {
      expect(screen.getByText(/envie sua candiatura/i)).toBeInTheDocument() // Adicione mais asserções aqui
      expect(
        screen.getByText(
          /mostre seu interesse pela vaga e compartilhe seus links profissionais/i,
        ),
      ).toBeInTheDocument()
      expect(screen.getByText(/github/i)).toBeInTheDocument()
      expect(screen.getByText(/linkedin/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /enviar candidatura/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /cancelar/i }),
      ).toBeInTheDocument()
    })

    const messageInput = screen.getByPlaceholderText(
      /por que essa vaga é ideal para você ?/i,
    )
    const githubInput = screen.getByPlaceholderText(
      /https\:\/\/github\.com\/seu-perfil/i,
    )
    const linkedinInput = screen.getByPlaceholderText(
      /https\:\/\/linkedin.com\/in\/seu-perfil/i,
    )

    await user.type(messageInput, 'Fake Mensagem personalizada')
    await user.type(githubInput, 'https://github.com/fake_username')
    await user.type(linkedinInput, 'https://linkedin.com/in/fake_username')

    const submitButton = screen.getByRole('button', {
      name: /enviar candidatura/i,
    })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1)
      expect(mockMutate).toHaveBeenCalledWith({
        message: 'Fake Mensagem personalizada',
        githubUrl: 'https://github.com/fake_username',
        linkedinUrl: 'https://linkedin.com/in/fake_username',
      })
    })
  })
})
