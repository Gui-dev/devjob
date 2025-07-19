import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import * as nextNavigation from 'next/navigation'
import * as nextAuthReact from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import JobDetails from '@/app/(main)/job/[job_id]/details/page'
import * as useJobDetailsModule from '@/hooks/use-job-details'
import type { IJobProps } from '@/components/job-card'
import type { IJobCardDetailsProps } from '@/components/job-card-details'
import { AuthProvider } from '@/components/auth-provider'

let currentSearchParams = new URLSearchParams('')
let currentUseParamsValue: { [key: string]: string | string[] } = {}

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useParams: () => currentUseParamsValue,
  useSearchParams: () => currentSearchParams,
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}))

let currentUseJobDetailsReturn: {
  job?: IJobProps
  isError: boolean
  isLoading: boolean
} = {
  job: undefined,
  isError: false,
  isLoading: false,
}
vi.mock('@/hooks/use-job-details', () => ({
  useJobDetails: vi.fn(() => currentUseJobDetailsReturn),
}))

const mockUseSession = vi.fn()
vi.mock('next-auth/react', () => ({
  useSession: mockUseSession,
}))

vi.mock('@/components/ui/skeleton', () => ({
  // biome-ignore lint/suspicious: test
  Skeleton: ({ className }: any) => (
    <div data-testid="skeleton" className={className} />
  ),
}))

vi.mock('@/components/ui/alert', () => ({
  Alert: ({ children }: { children: ReactNode }) => (
    <div data-testid="alert">{children}</div>
  ),
  AlertTitle: ({ children }: { children: ReactNode }) => (
    <h3 data-testid="alert-title">{children}</h3>
  ),
  AlertDescription: ({ children }: { children: ReactNode }) => (
    <div data-testid="alert-description">{children}</div>
  ),
}))

vi.mock('next/link', () => ({
  // biome-ignore lint/suspicious: test
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('@/components/job-card-details', () => ({
  JobCardDetails: ({ job }: IJobCardDetailsProps) => (
    <div data-testid="job-card-details">{job.title}</div>
  ),
}))

vi.mock('@/components/apply-to-job-form', () => ({
  ApplyToJobForm: ({ jobId }: { jobId: string }) => (
    <div data-testid="apply-to-job-form">Apply for {jobId}</div>
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

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

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

describe('<JobDetailsPage />', () => {
  beforeEach(() => {
    mockUseSession.mockClear()
    queryClient.clear()
    currentUseJobDetailsReturn = {
      job: undefined,
      isError: false,
      isLoading: false,
    }
    currentUseParamsValue = {}
    currentSearchParams = new URLSearchParams('')
  })

  it('should be able to render Skeleton component when loading job details page', async () => {
    currentUseParamsValue = { job_id: 'job-123' }
    currentUseJobDetailsReturn = {
      job: undefined,
      isError: false,
      isLoading: true,
    }
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })

    render(
      <QueryClientProvider client={queryClient}>
        <JobDetails />
      </QueryClientProvider>,
    )

    expect(screen.getAllByTestId('skeleton')).toHaveLength(4)
    expect(screen.queryByTestId('job-card-details')).not.toBeInTheDocument()
    expect(screen.queryByTestId('alert')).not.toBeInTheDocument()
  })

  it('should be able to render an error when there is an error fetching job details', async () => {
    currentUseParamsValue = { job_id: 'job-error' }
    currentUseJobDetailsReturn = {
      job: undefined,
      isError: true,
      isLoading: false,
    }
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })

    render(
      <QueryClientProvider client={queryClient}>
        <JobDetails />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('alert')).toBeInTheDocument()
      expect(screen.getByTestId('alert-title')).toHaveTextContent(
        'Erro ao carregar vaga',
      )
      expect(
        screen.getByText(
          /não foi possível encontrar essa vaga. Verifique o link ou tente/i,
        ),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('link', { name: /Voltar para vagas/i }),
      ).toBeInTheDocument()
    })
  })

  it('should be able to render job details when job data is successfully fetched', async () => {
    currentUseParamsValue = { job_id: 'job-123' }
    currentUseJobDetailsReturn = {
      job: MOCKED_JOB,
      isError: false,
      isLoading: false,
    }
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })

    render(
      <QueryClientProvider client={queryClient}>
        <JobDetails />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('job-card-details')).toBeInTheDocument()
      expect(screen.getByTestId('job-card-details')).toHaveTextContent(
        MOCKED_JOB.title,
      )
    })

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
    expect(screen.queryByTestId('alert')).not.toBeInTheDocument()
  })
})
