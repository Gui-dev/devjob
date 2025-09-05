import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import * as nextAuthReact from 'next-auth/react'

import RecruiterProfile from '@/app/(main)/(private)/dashboard/recruiter/page'
import { useGetStats } from '@/hooks/use-get-stats'
import {
  useGetUserApplications,
  type IGetRecruiterJobsResponse,
} from '@/hooks/use-get-user-applications'

vi.mock('@/hooks/use-get-stats')
vi.mock('@/hooks/use-get-user-applications')

vi.mock('@/components/dashboard-components/card-resume', () => ({
  CardResume: vi.fn(({ title, resume }) => (
    <div data-testid="card-resume">
      <h2>{title}</h2>
      <p>{resume}</p>
    </div>
  )),
}))

vi.mock('@/components/dashboard-components/create-job-form', () => ({
  CreateJobForm: vi.fn(({ children }) => (
    <div data-testid="create-job-form">{children}</div>
  )),
}))

vi.mock('@/components/dashboard-components/skeleton-stats', () => ({
  SkeletonStats: () => <div data-testid="skeleton-stats" />,
}))

vi.mock(
  '@/components/dashboard-components/skeleton-job-application-resume',
  () => ({
    SkeletonJobApplicationResume: () => (
      <div data-testid="skeleton-job-application-resume" />
    ),
  }),
)

vi.mock('@/components/pagination-bar', () => ({
  PaginationBar: vi.fn(({ currentPage, totalPages }) => (
    <div data-testid="pagination-bar">
      <span>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  )),
}))

vi.mock('@components/ui/card', () => ({
  Card: vi.fn(({ children }) => <div data-testid="card">{children}</div>),
  CardHeader: vi.fn(({ children }) => (
    <div data-testid="card-header">{children}</div>
  )),
  CardTitle: vi.fn(({ children }) => (
    <h3 data-testid="card-title">{children}</h3>
  )),
  CardContent: vi.fn(({ children }) => (
    <div data-testid="card-content">{children}</div>
  )),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, asChild }) => {
    if (asChild) {
      return children
    }

    return <div data-testid="button">{children}</div>
  }),
}))

vi.mock('next/link', () => ({
  default: vi.fn(({ children, href }) => (
    <a data-testid="link" href={href}>
      {children}
    </a>
  )),
}))

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        role: 'RECRUITER',
      },
    },
    status: 'authenticated',
  })),
}))

const queryClient = new QueryClient()

const WrapperRecruiterProfile = () => (
  <QueryClientProvider client={queryClient}>
    <RecruiterProfile />
  </QueryClientProvider>
)

const MOCK_STATS_DATA = {
  totalJobs: 5,
  totalApplications: 20,
  acceptedApplications: 10,
  pendingApplications: 6,
  rejectedApplications: 4,
}

const MOCK_JOBS_DATA: IGetRecruiterJobsResponse = {
  jobs: [
    {
      id: 'job-1',
      title: 'Desenvolvedor Backend',
      description: 'Responsável por desenvolver a API REST.',
      company: 'TechCorp',
      location: 'Remoto',
      type: 'REMOTE',
      level: 'SENIOR',
      recruiterId: 'rec-1',
      createdAt: new Date(),
    },
    {
      id: 'job-2',
      title: 'Desenvolvedor Frontend',
      description: 'Responsável por criar interfaces amigáveis.',
      company: 'DesignWorks',
      location: 'Híbrido',
      type: 'HYBRID',
      level: 'PLENO',
      recruiterId: 'rec-1',
      createdAt: new Date(),
    },
  ],
  meta: { total: 2, page: 1, pages: 1 },
}

describe('<RecruiterProfile />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('should be able to render skeleton components while loading', async () => {
    vi.mocked(useGetStats).mockReturnValue({
      stats: undefined,
      isPending: true,
    })

    vi.mocked(useGetUserApplications).mockReturnValue({
      data: undefined,
      isPending: true,
    })

    render(<WrapperRecruiterProfile />)

    expect(screen.getByTestId('skeleton-stats')).toBeInTheDocument()
    expect(
      screen.getByTestId('skeleton-job-application-resume'),
    ).toBeInTheDocument()
  })

  it('should be able to render stats and jobs when data is available', async () => {
    vi.mocked(useGetStats).mockReturnValue({
      stats: MOCK_STATS_DATA,
      isPending: false,
    })

    vi.mocked(useGetUserApplications).mockReturnValue({
      data: MOCK_JOBS_DATA,
      isPending: false,
    })

    render(<WrapperRecruiterProfile />)

    await waitFor(() => {
      expect(screen.getByText(/minhas vagas criadas/i)).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText(/total de candidaturas/i)).toBeInTheDocument()
      expect(screen.getByText('20')).toBeInTheDocument()

      expect(screen.getByTestId('create-job-form')).toBeInTheDocument()

      expect(screen.getByText(/desenvolvedor backend/i)).toBeInTheDocument()
      expect(screen.getByText(/desenvolvedor frontend/i)).toBeInTheDocument()

      const link = screen.getAllByRole('link', { name: /ver detalhes/i })
      expect(link[0]).toHaveAttribute('href', '/dashboard/recruiter/job/job-1')

      expect(screen.getByTestId('pagination-bar')).toBeInTheDocument()
    })
  })

  it('should be able to render a message when there are no jobs created', async () => {
    vi.mocked(useGetStats).mockReturnValue({
      stats: MOCK_STATS_DATA,
      isPending: false,
    })

    vi.mocked(useGetUserApplications).mockReturnValue({
      data: {
        jobs: [],
        meta: { total: 0, page: 1, pages: 1 },
      },
      isPending: false,
    })

    render(<WrapperRecruiterProfile />)

    await waitFor(() => {
      expect(
        screen.getByText(/você ainda não criou nenhuma vaga/i),
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/desenvolvedor frontend/i),
      ).not.toBeInTheDocument()
    })
  })
})
