import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import UserProfile from '@/app/(main)/(private)/dashboard/candidate/page'
import { useGetStats } from '@/hooks/use-get-stats'
import {
  type IGetJobApplicationsResponse,
  useGetJobApplications,
} from '@/hooks/use-get-job-applications'

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
const MOCK_STATS_DATA = {
  totalApplications: 10,
  acceptedApplications: 5,
  pendingApplications: 3,
  rejectedApplications: 2,
}

const MOCK_JOB_APPLICATIONS_DATA: IGetJobApplicationsResponse = {
  jobApplications: [
    {
      id: 'app-1',
      jobId: 'job-1',
      userId: 'user-1',
      status: 'ACCEPTED',
      message: 'Olá, me interessei pela vaga...',
      githubUrl: 'https://github.com/teste',
      linkedinUrl: 'https://linkedin.com/in/teste',
      createdAt: new Date(),
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

  it('should be able to render stats and job applications when data is available', async () => {
    vi.mocked(useGetStats).mockReturnValue({
      stats: MOCK_STATS_DATA,
      isPending: false,
    })

    vi.mocked(useGetJobApplications).mockReturnValue({
      data: MOCK_JOB_APPLICATIONS_DATA,
      isPending: false,
    })

    render(<WrapperUserProfile />)

    await waitFor(() => {
      expect(screen.queryByTestId('skeleton-stats')).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('skeleton-job-application-resume'),
      ).not.toBeInTheDocument()

      expect(screen.getByText(/vagas aplicadas/i)).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText(/vagas aceitas/i)).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText(/vagas pendentes/i)).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText(/vagas rejeitadas/i)).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()

      expect(screen.getByText(/desenvolvedor frontend/i)).toBeInTheDocument()
      expect(screen.getByText(/google - são paulo/i)).toBeInTheDocument()
      expect(screen.getByText(/ACCEPTED/i)).toBeInTheDocument()
      expect(screen.getByText(/descrição da vaga/i)).toBeInTheDocument()
    })
  })

  it('should be able to render when there are no job applications', async () => {
    vi.mocked(useGetStats).mockReturnValue({
      stats: MOCK_STATS_DATA,
      isPending: false,
    })

    vi.mocked(useGetJobApplications).mockReturnValue({
      data: {
        jobApplications: [],
        meta: { total: 0, page: 1, pages: 1 },
      },
      isPending: false,
    })

    render(<WrapperUserProfile />)

    await waitFor(() => {
      expect(
        screen.getByText(/você nao possui candidaturas/i),
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/desenvolvedor frontend/i),
      ).not.toBeInTheDocument()
    })
  })

  it('should be able to see more application', async () => {
    vi.mocked(useGetStats).mockReturnValue({
      stats: MOCK_STATS_DATA,
      isPending: false,
    })

    vi.mocked(useGetJobApplications).mockReturnValue({
      data: MOCK_JOB_APPLICATIONS_DATA,
      isPending: false,
    })

    render(<WrapperUserProfile />)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /ver mais/i }),
      ).toBeInTheDocument()
    })

    const seeMore = screen.getByRole('button', { name: /ver mais/i })
    await user.click(seeMore)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })
  })
})
