import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { CandidateApplicationDetails } from '@/components/dashboard-components/candidate-application-details'
import { useUpdateStatus } from '@/hooks/use-update-status'
import type { JobApplication } from '@/hooks/use-get-recruiter-applications'
import type React from 'react'

vi.mock('@/hooks/use-update-status', () => ({
  useUpdateStatus: vi.fn(),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, ...props }) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/sheet', () => {
  const actual = vi.importActual('@/components/ui/sheet')
  return {
    ...actual,
    Sheet: vi.fn(({ children }) => <div>{children}</div>),
    SheetTrigger: vi.fn(({ children, ...props }) => (
      <button data-testid="sheet-trigger" {...props}>
        {children}
      </button>
    )),
    SheetHeader: vi.fn(({ children }) => (
      <header data-testid="sheet-header">{children}</header>
    )),
    SheetTitle: vi.fn(({ children }) => (
      <h2 data-testid="sheet-title">{children}</h2>
    )),
    SheetDescription: vi.fn(({ children }) => (
      <p data-testid="sheet-description">{children}</p>
    )),
    SheetContent: vi.fn(({ children }) => <div>{children}</div>),
    SheetFooter: vi.fn(({ children }) => (
      <footer data-testid="sheet-footer">{children}</footer>
    )),
    SheetClose: vi.fn(({ children, ...props }) => (
      <button data-testid="sheet-close" {...props}>
        {children}
      </button>
    )),
  }
})

vi.mock('@/components/ui/separator', () => ({
  Separator: vi.fn(({ className }) => (
    <hr data-testid="separator" className={className} />
  )),
}))

vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react')
  return {
    ...actual,
    Eye: () => <svg data-testid="eye" />,
    CheckIcon: () => <svg data-testid="check-icon" />,
    X: () => <svg data-testid="x" />,
  }
})

vi.mock('next-link', () => ({
  default: vi.fn(({ children, ...props }) => <a {...props}>{children}</a>),
}))

const queryClient = new QueryClient()
const WrapperCandidateApplicationDetails = ({
  children,
}: {
  children: React.ReactNode
}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

const MOCK_CANDIDATE: JobApplication = {
  id: 'app-123',
  jobId: 'job-123',
  userId: 'user-123',
  status: 'PENDING',
  message: 'Olá, sou um candidato motivado.',
  githubUrl: 'https://github.com/candidato',
  linkedinUrl: 'https://linkedin.com/in/candidato',
  createdAt: new Date(),
  job: {
    id: 'job-123',
    recruiterId: 'recruiter-123',
    title: 'Desenvolvedor Front-end',
    description: 'Vaga de desenvolvimento de front-end',
    company: 'Empresa XYZ',
    location: 'São Paulo, Brasil',
    type: 'REMOTE',
    level: 'PLENO',
    createdAt: new Date(),
  },
  user: {
    id: 'user-123',
    name: 'João da Silva',
    email: 'joao@example.com',
    role: 'CANDIDATE',
    createdAt: new Date(),
  },
}

describe('<CandidateApplicationDetails />', () => {
  const user = userEvent.setup()
  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUpdateStatus).mockReturnValue({
      mutateAsync: mockMutate.mockResolvedValue({}),
      isPending: false,
    })
  })

  it('should be able to render the sheet trigger button', async () => {
    render(<CandidateApplicationDetails candidate={MOCK_CANDIDATE} />, {
      wrapper: WrapperCandidateApplicationDetails,
    })

    const triggerButton = screen.getByRole('button', { name: /visualizar/i })
    expect(triggerButton).toBeInTheDocument()

    expect(screen.getByTestId('eye')).toBeInTheDocument()
  })
})
