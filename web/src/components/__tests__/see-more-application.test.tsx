import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { SeeMoreApplication } from './../dashboard-components/see-more-application'
import type { JobApplication } from '@/hooks/use-get-job-applications'

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, ...props }) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: vi.fn(({ children, className, ...props }) => (
    <span data-testid="badge" className={className} {...props}>
      {children}
    </span>
  )),
}))

const MOCKED_JOB_APPLICATION: JobApplication = {
  id: 'app-abc-123',
  jobId: 'job-xyz-456',
  userId: 'user-789',
  message:
    'Olá, me interessei muito pela vaga de Desenvolvedor Frontend e acredito que minhas habilidades se alinham perfeitamente com os requisitos. Tenho experiência em React e TypeScript.',
  githubUrl: 'https://github.com/candidato-teste',
  linkedinUrl: 'https://linkedin.com/in/candidato-teste',
  status: 'PENDING',
  createdAt: new Date('2025-08-01T10:00:00Z'),
  job: {
    id: 'job-xyz-456',
    recruiterId: 'rec-abc',
    title: 'Desenvolvedor Frontend Sênior',
    description:
      'Buscamos um desenvolvedor frontend sênior com experiência em grandes projetos e paixão por novas tecnologias. Ambiente dinâmico e desafios constantes.',
    company: 'Tech Solutions Inc.',
    location: 'Remoto (Europa)',
    type: 'REMOTE',
    createdAt: new Date('2025-07-15T09:00:00Z'),
  },
}

describe('<SeeMoreApplication />', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should be able to render the "Ver mais" button', async () => {
    render(<SeeMoreApplication jobApplication={MOCKED_JOB_APPLICATION} />)

    const triggerButton = screen.getByRole('button', { name: /ver mais/i })
    expect(triggerButton).toBeInTheDocument()
    expect(triggerButton).toHaveAttribute('data-testid', 'button')
  })
})
