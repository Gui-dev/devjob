import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AdminProfile from '@/app/(main)/(private)/dashboard/admin/page'
import { useGetStats } from '@/hooks/use-get-stats'
import {
  type IGetAllJobApplicationsResponse,
  useGetAllJobApplications,
} from '@/hooks/use-get-all-job-applications'
import type { ReactNode } from 'react'

vi.mock('@/hooks/use-get-stats', () => ({
  useGetStats: vi.fn(),
}))
vi.mock('@/hooks/use-get-all-job-applications', () => ({
  useGetAllJobApplications: vi.fn(),
}))

vi.mock('@/components/dashboard-components/skeleton-stats', () => ({
  SkeletonStats: vi.fn(({ children }) => (
    <div data-testid="skeleton-stats">{children}</div>
  )),
}))

vi.mock('@/components/skeleton-table', () => ({
  SkeletonTable: vi.fn(({ children }) => (
    <div data-testid="skeleton-table">{children}</div>
  )),
}))

vi.mock('@/components/skeleton-chart', () => ({
  SkeletonChart: vi.fn(({ children }) => (
    <div data-testid="skeleton-chart">{children}</div>
  )),
}))

vi.mock('@/components/dashboard-components/card-resume', () => ({
  CardResume: vi.fn(({ title, resume }) => (
    <div data-testid="card-resume">
      <h2 data-testid="card-resume-title">{title}</h2>
      <p data-testid="card-resume-value">{resume}</p>
    </div>
  )),
}))

vi.mock(
  '@/components/dashboard-components/candidate-application-details',
  () => ({
    CandidateApplicationDetails: vi.fn(({ children }) => (
      <div data-testid="candidate-application-details">{children}</div>
    )),
  }),
)

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

vi.mock('@/components/ui/table', () => ({
  Table: vi.fn(({ children }) => <table data-testid="table">{children}</table>),
  TableHeader: vi.fn(({ children }) => (
    <thead data-testid="table-header">{children}</thead>
  )),
  TableRow: vi.fn(({ children }) => (
    <tr data-testid="table-row">{children}</tr>
  )),
  TableHead: vi.fn(({ children }) => (
    <th data-testid="table-head">{children}</th>
  )),
  TableBody: vi.fn(({ children }) => (
    <tbody data-testid="table-body">{children}</tbody>
  )),
  TableCell: vi.fn(({ children }) => (
    <td data-testid="table-cell">{children}</td>
  )),
}))

vi.mock('@/components/application-status', () => ({
  ApplicationStatus: vi.fn(({ status }) => (
    <span data-testid="application-status">{status}</span>
  )),
}))

vi.mock('@/components/pagination-bar', () => ({
  PaginationBar: vi.fn(() => <div data-testid="pagination-bar" />),
}))

vi.mock('recharts', () => ({
  BarChart: vi.fn(() => null),
  Bar: vi.fn(() => null),
  XAxis: vi.fn(() => null),
  YAxis: vi.fn(() => null),
  Tooltip: vi.fn(() => null),
  ResponsiveContainer: vi.fn(({ children }) => (
    <div data-testid="bar-chart">{children}</div>
  )),
}))

const queryClient = new QueryClient()
const Wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('<AdminProfile />', () => {
  const MOCK_STATS = {
    totalJobs: 50,
    totalJobApplications: 200,
    totalCandidates: 150,
    totalRecruiters: 40,
    applicationsPerJob: [
      { jobId: 'job-1', total: 10 },
      { jobId: 'job-2', total: 20 },
    ],
  }

  const MOCK_JOB_APPLICATIONS: IGetAllJobApplicationsResponse = {
    jobApplications: [
      {
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
      },
    ],
    meta: {
      total: 1,
      page: 1,
      pages: 1,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGetStats).mockReturnValue({
      stats: MOCK_STATS,
      isPending: false,
    })
    vi.mocked(useGetAllJobApplications).mockReturnValue({
      data: MOCK_JOB_APPLICATIONS,
      isPending: false,
    })
  })

  it('should be able to render skeletons components when data is loading', async () => {
    vi.mocked(useGetStats).mockReturnValue({
      stats: null,
      isPending: true,
    })
    vi.mocked(useGetAllJobApplications).mockReturnValue({
      data: undefined,
      isPending: true,
    })

    render(<AdminProfile />, { wrapper: Wrapper })

    screen.debug()

    await waitFor(() => {
      expect(screen.getByTestId('skeleton-stats')).toBeInTheDocument()
      expect(screen.getAllByTestId('skeleton-chart')).toHaveLength(1)
      expect(screen.getAllByTestId('skeleton-table')).toHaveLength(5)

      expect(screen.queryByTestId('card-resume')).not.toBeInTheDocument()
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument()
      expect(
        screen.queryByText(/nenhuma candidatura encontrada ainda/i),
      ).not.toBeInTheDocument()
    })
  })

  it('should be able to render stats and chart when stats data is loaded', async () => {
    render(<AdminProfile />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getAllByTestId('card-resume')).toHaveLength(4)
      expect(screen.getByText(/total de empregos/i)).toBeInTheDocument()
      expect(screen.getByText(MOCK_STATS.totalJobs)).toBeInTheDocument()

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByText(/candidatura por vagas/i)).toBeInTheDocument()
    })
  })

  it('should be able to render job aplications table when data is loaded', async () => {
    render(<AdminProfile />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(
        screen.getByRole('columnheader', { name: /vaga/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /candidato/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /e-mail/i }),
      ).toBeInTheDocument()

      const rows = screen.getAllByTestId('table-row')

      expect(rows).toHaveLength(2)
      expect(
        screen.getByText(MOCK_JOB_APPLICATIONS.jobApplications[0].user.name),
      ).toBeInTheDocument()
      expect(screen.getByTestId('application-status')).toHaveTextContent(
        'PENDING',
      )
      expect(
        screen.getByTestId('candidate-application-details'),
      ).toBeInTheDocument()
    })
  })
})
