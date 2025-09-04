import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import * as nextAuthReact from 'next-auth/react'

import RecruiterProfile from '@/app/(main)/(private)/dashboard/recruiter/page'
import { useGetStats } from '@/hooks/use-get-stats'
import { useGetJobApplications } from '@/hooks/use-get-job-applications'

vi.mock('@/hooks/use-get-stats')
vi.mock('@/hooks/use-get-job-applications')

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
  pendingApplications: 5,
  rejectedApplications: 5,
}

const MOCK_JOBS_DATA = {
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
      title: 'UI/UX Designer',
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

    vi.mocked(useGetJobApplications).mockReturnValue({
      data: undefined,
      isPending: true,
    })

    render(<WrapperRecruiterProfile />)

    expect(screen.getByTestId('skeleton-stats')).toBeInTheDocument()
    expect(
      screen.getByTestId('skeleton-job-application-resume'),
    ).toBeInTheDocument()
  })
})
