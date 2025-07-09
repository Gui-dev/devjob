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
})
