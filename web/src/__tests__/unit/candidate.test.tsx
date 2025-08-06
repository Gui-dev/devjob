import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as nextAuthReact from 'next-auth/react'

import UserProfile from '@/app/(main)/(private)/dashboard/candidate/page'
import { useGetStats } from '@/hooks/use-get-stats'
import { useGetJobApplications } from '@/hooks/use-get-job-applications'

vi.mock('@/hooks/use-get-stats')
vi.mock('@/hooks/use-get-job-applications')

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

vi.mock('@/components/dashboard-components/card-resume', () => ({
  CardResume: vi.fn(({ title, resume }) => (
    <div data-testid="card-resume">
      <h2>{title}</h2>
      <p>{resume}</p>
    </div>
  )),
}))

vi.mock('@/components/dashboard-components/see-more-application', () => ({
  SeeMoreApplication: vi.fn(({ jobApplication }) => (
    <button type="button" data-testid="see-more-button" onClick={() => vi.fn()}>
      Ver mais: {jobApplication.id}
    </button>
  )),
}))

vi.mock('@/components/pagination-bar', () => ({
  PaginationBar: vi.fn(({ currentPage, totalPages }) => (
    <div data-testid="pagination-bar">
      <span>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  )),
}))

vi.mock('@/components/ui/card', () => ({
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

vi.mock('@/components/ui/badge', () => ({
  Badge: vi.fn(({ children }) => <span data-testid="badge">{children}</span>),
}))

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: { user: { role: 'CANDIDATE' } },
    status: 'authenticated',
  })),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const WrapperUserProfile = () => (
  <QueryClientProvider client={queryClient}>
    <UserProfile />
  </QueryClientProvider>
)

// --- Dados Mockados ---
const MOCK_STATS_DATA_RAW = {
  // O que getStats retornaria
  candidateStats: {
    totalApplications: 10,
    acceptedApplications: 5,
    pendingApplications: 3,
    rejectedApplications: 2,
  },
  recruiterStats: null,
  stats: null,
}

const MOCK_JOB_APPLICATIONS_DATA = {
  jobApplications: [
    {
      id: 'app-1',
      job: {
        id: 'job-1',
        title: 'Desenvolvedor Frontend',
        company: 'Google',
        location: 'São Paulo',
        description: 'Descrição da vaga',
        type: 'REMOTE',
        createdAt: new Date(),
        recruiterId: 'rec-1',
      },
      status: 'ACCEPTED',
      message: 'Olá, me interessei pela vaga...',
      githubUrl: 'https://github.com/teste',
      linkedinUrl: 'https://linkedin.com/in/teste',
      userId: 'user-1',
      createdAt: new Date(),
    },
  ],
  meta: { total: 1, page: 1, pages: 1 },
}

describe('Dashboard candidate profile', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('should be able to render sketon components while loadings', async () => {
    vi.mocked(useGetStats).mockReturnValue({
      stats: undefined,
      isPending: true,
    })

    vi.mocked(useGetJobApplications).mockReturnValue({
      data: undefined,
      isPending: true,
    })

    render(<WrapperUserProfile />)

    screen.debug()

    expect(screen.getByTestId('skeleton-stats')).toBeInTheDocument()
    expect(
      screen.getByTestId('skeleton-job-application-resume'),
    ).toBeInTheDocument()
  })
})
