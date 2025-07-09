import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import type * as useJobsFiltersModule from '@/hooks/use-jobs-filters'
import { PaginationBar } from '../pagination-bar'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: vi.fn(),
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockUpdateFilters = vi.fn()
vi.mock('@/hooks/use-jobs-filters', async importOriginal => {
  const actual = await importOriginal<typeof useJobsFiltersModule>()
  return {
    ...actual,
    useJobsFilters: () => ({
      filters: {}, // Pode ser ajustado para simular diferentes estados de filtro
      updateFilters: mockUpdateFilters,
      resetFilters: vi.fn(),
    }),
  }
})

describe('', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockPush.mockClear()
    mockUpdateFilters.mockClear()
  })

  it('should be able to show pagination links correctly', async () => {
    render(<PaginationBar currentPage={2} totalPages={5} />)

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('should be able to render pagination correctly in an intermediate page with many pages', async () => {
    render(<PaginationBar currentPage={5} totalPages={10} />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()

    expect(screen.getAllByText('More pages')).toHaveLength(2)

    // Verifica a presença dos botões "Anterior" e "Próximo"
    expect(screen.getByLabelText('Página anterior')).toBeInTheDocument()
    expect(screen.getByLabelText('Próxima página')).toBeInTheDocument()
  })

  it('should be able to call updateFilters when a page link is clicked', async () => {
    render(<PaginationBar currentPage={1} totalPages={5} />)

    await user.click(screen.getByText('3'))

    expect(mockUpdateFilters).toHaveBeenCalledWith({ page: 3 })
  })
})
