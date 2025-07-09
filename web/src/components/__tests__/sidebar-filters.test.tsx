import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import type * as useJobsFiltersModule from '@/hooks/use-jobs-filters'
import { SidebarFilters } from '../sidebar-filters'

const mockPush = vi.fn()
let currentSearchParams = new URLSearchParams('')

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => currentSearchParams,
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockUpdateFilters = vi.fn()
const mockResetFilters = vi.fn()
vi.mock('@/hooks/use-jobs-filters', async importOriginal => {
  const actual = await importOriginal<typeof useJobsFiltersModule>()
  return {
    ...actual,
    useJobsFilters: () => ({
      filters: {
        page: 1,
        technology: undefined,
        location: undefined,
        type: undefined,
        level: undefined,
        sortBy: 'createdAt',
      },
      updateFilters: mockUpdateFilters,
      resetFilters: mockResetFilters,
    }),
  }
})

describe('<SidebarFilters />', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockPush.mockClear()
    mockUpdateFilters.mockClear()
    mockResetFilters.mockClear()
    currentSearchParams = new URLSearchParams('')
  })

  it('should be able to render sidebar filters correctly', async () => {
    render(<SidebarFilters />)

    expect(screen.getByRole('button', { name: 'Filtros' })).toBeInTheDocument()
    expect(screen.getByTestId('sliders-icon')).toBeInTheDocument()
  })

  it('should be able to render all filter input fields and selects placeholders', async () => {
    render(<SidebarFilters />)

    await user.click(screen.getByRole('button', { name: 'Filtros' }))

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Filtrar vagas por:' }),
      ).toBeInTheDocument()

      expect(screen.getByPlaceholderText(/tecnologia/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/localização/i)).toBeInTheDocument()

      expect(screen.getByText(/tipo/i)).toBeInTheDocument()
      expect(screen.getByText(/nível/i)).toBeInTheDocument()
      expect(screen.getByText(/ordenar por/i)).toBeInTheDocument()

      expect(
        screen.getByRole('button', { name: /filtrar/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /limpar filtros/i }),
      ).toBeInTheDocument()
    })

    screen.debug()
  })
})
