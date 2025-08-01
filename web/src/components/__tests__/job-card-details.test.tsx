import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { JobCardDetails } from './../job-card-details'
import type { ReactElement, ReactNode } from 'react'
import type { IJobProps } from '../job-card'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

let currentUseSessionReturn: {
  // biome-ignore lint/suspicious: test
  data: any
  status: 'authenticated' | 'unauthenticated' | 'loading'
} = {
  data: null,
  status: 'unauthenticated',
}

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => currentUseSessionReturn),
  getSession: vi.fn(() => currentUseSessionReturn.data),
}))

vi.mock('next/link', () => ({
  // biome-ignore lint/suspicious: test
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <svg data-testid="icon-arrow-left" />,
  Briefcase: () => <svg data-testid="icon-briefcase" />,
  Calendar: () => <svg data-testid="icon-calendar" />,
  Layers: () => <svg data-testid="icon-layers" />,
  MapPin: () => <svg data-testid="icon-map-pin" />,
  Rocket: () => <svg data-testid="icon-rocket" />,
  Tag: () => <svg data-testid="icon-tag" />,
}))

vi.mock('./../ui/badge', () => ({
  Badge: ({ children }: { children: ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
}))

vi.mock('./../apply-to-job-form', () => ({
  ApplyToJobForm: ({ jobId }: { jobId: string }) => (
    <div data-testid="apply-to-job-form">Apply for {jobId}</div>
  ),
}))

const MOCKED_JOB: IJobProps = {
  id: 'job-123',
  title: 'Desenvolvedor Frontend',
  company: 'Awesome Tech',
  location: 'Remoto',
  description: 'Uma descrição detalhada da vaga de desenvolvedor frontend.',
  technologies: ['React', 'TypeScript', 'TailwindCSS'],
  level: 'PLENO',
  type: 'REMOTE',
  createdAt: new Date(),
}

describe('<JobCardDetails />', () => {
  const renderWithProviders = (ui: ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    )
  }

  beforeEach(() => {
    currentUseSessionReturn = { data: null, status: 'unauthenticated' }
    queryClient.clear()
  })

  it('should be able to render all job details correctly', async () => {
    currentUseSessionReturn = { data: null, status: 'unauthenticated' }

    renderWithProviders(<JobCardDetails job={MOCKED_JOB} />)

    expect(screen.getByText(MOCKED_JOB.title)).toBeInTheDocument()
    expect(screen.getByText(MOCKED_JOB.company)).toBeInTheDocument()
    expect(screen.getByText(MOCKED_JOB.location)).toBeInTheDocument()
    expect(screen.getByText(MOCKED_JOB.description)).toBeInTheDocument()

    for (const tech of MOCKED_JOB.technologies) {
      expect(screen.getByText(tech)).toBeInTheDocument()
      expect(screen.getByText(tech)).toHaveAttribute('data-testid', 'badge')
    }

    expect(screen.getByText(MOCKED_JOB.level)).toBeInTheDocument()
    expect(screen.getByText(MOCKED_JOB.type)).toBeInTheDocument()

    const formattedDate = new Date(MOCKED_JOB.createdAt).toLocaleDateString()
    expect(screen.getByText(/publicada em:/i)).toBeInTheDocument()
    expect(screen.getByText(`${formattedDate}`)).toBeInTheDocument()

    const backLink = screen.getByRole('link', { name: /voltar para vagas/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/')
    expect(screen.getByTestId('icon-arrow-left')).toBeInTheDocument()
  })

  it('should be able to render ApplyToJobForm when user is authenticated as a candidate', async () => {
    currentUseSessionReturn = {
      data: { user: { role: 'CANDIDATE' } },
      status: 'authenticated',
    }

    renderWithProviders(<JobCardDetails job={MOCKED_JOB} />)

    await waitFor(() => {
      expect(screen.getByTestId('apply-to-job-form')).toBeInTheDocument()
      expect(screen.getByText(`Apply for ${MOCKED_JOB.id}`)).toBeInTheDocument()
      expect(
        screen.queryByText(/você precisa estar logado com um candidato/i),
      ).not.toBeInTheDocument()
    })
  })

  it('should be able to render to login message when user is unauthenticated', async () => {
    currentUseSessionReturn = { data: null, status: 'unauthenticated' }

    renderWithProviders(<JobCardDetails job={MOCKED_JOB} />)

    await waitFor(() => {
      expect(screen.queryByTestId('apply-to-job-form')).not.toBeInTheDocument()
      expect(
        screen.getByText(/você precisa estar logado como um/i),
      ).toBeInTheDocument()
      expect(screen.getByText(/candidato/i)).toBeInTheDocument()
      expect(
        screen.getByText(/para se candidatar a uma vaga\./i),
      ).toBeInTheDocument()
      const loginLink = screen.getByRole('link', { name: /faça login/i })
      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toHaveAttribute('href', '/login')
    })
  })

  it('should be able to render to login message when user is authenticated but is not a candidate', async () => {
    currentUseSessionReturn = {
      data: { user: { role: 'RECRUITER' } },
      status: 'authenticated',
    }

    renderWithProviders(<JobCardDetails job={MOCKED_JOB} />)

    await waitFor(() => {
      expect(screen.queryByTestId('apply-to-job-form')).not.toBeInTheDocument()
      expect(
        screen.getByText(/você precisa estar logado como um/i),
      ).toBeInTheDocument()
      expect(screen.getByText(/candidato/i)).toBeInTheDocument()
      expect(
        screen.getByText(/para se candidatar a uma vaga\./i),
      ).toBeInTheDocument()
      const loginLink = screen.getByRole('link', { name: /faça login/i })
      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toHaveAttribute('href', '/login')
    })
  })
})
