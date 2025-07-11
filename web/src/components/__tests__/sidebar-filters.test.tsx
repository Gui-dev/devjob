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
  })

  it('should be able to call updateFilters with correct data when a form is submitted', async () => {
    render(<SidebarFilters />)

    await user.click(screen.getByRole('button', { name: 'Filtros' }))

    await user.type(screen.getByPlaceholderText(/tecnologia/i), 'React')
    await user.type(screen.getByPlaceholderText(/localização/i), 'São Paulo')

    const selectedType = screen.getByTestId('select-type')
    await user.pointer({
      keys: '[MouseLeft]',
      target: selectedType,
    })

    const optionType = await screen.findByRole('option', { name: /remoto/i })
    await user.pointer({
      keys: '[MouseLeft]',
      target: optionType,
    })

    const selectedLevel = screen.getByTestId('select-level')
    await user.pointer({
      keys: '[MouseLeft]',
      target: selectedLevel,
    })

    const optionLevel = await screen.findByRole('option', { name: /junior/i })
    await user.pointer({
      keys: '[MouseLeft]',
      target: optionLevel,
    })

    const selectedOrder = screen.getByTestId('select-order')
    await user.pointer({
      keys: '[MouseLeft]',
      target: selectedOrder,
    })

    const optionOrder = await screen.findByRole('option', { name: /empresa/i })
    await user.pointer({
      keys: '[MouseLeft]',
      target: optionOrder,
    })
    await user.click(screen.getByRole('button', { name: /filtrar/i }))

    await waitFor(() => {
      expect(mockUpdateFilters).toHaveBeenCalledWith({
        technology: 'React',
        location: 'São Paulo',
        type: 'REMOTE',
        level: 'JUNIOR',
        sortBy: 'company',
        page: 1,
      })
    })
  })

  it('should be able to call resetFilters and clear form fields when reset button is clicked', async () => {
    render(<SidebarFilters />)

    await user.click(screen.getByRole('button', { name: 'Filtros' }))

    await user.type(screen.getByPlaceholderText(/tecnologia/i), 'React')
    await user.type(screen.getByPlaceholderText(/localização/i), 'São Paulo')

    const selectedType = screen.getByTestId('select-type')
    await user.pointer({
      keys: '[MouseLeft]',
      target: selectedType,
    })

    const optionType = await screen.findByRole('option', { name: /remoto/i })
    await user.pointer({
      keys: '[MouseLeft]',
      target: optionType,
    })

    const selectedLevel = screen.getByTestId('select-level')
    await user.pointer({
      keys: '[MouseLeft]',
      target: selectedLevel,
    })

    const optionLevel = await screen.findByRole('option', { name: /junior/i })
    await user.pointer({
      keys: '[MouseLeft]',
      target: optionLevel,
    })

    const selectedOrder = screen.getByTestId('select-order')
    await user.pointer({
      keys: '[MouseLeft]',
      target: selectedOrder,
    })

    const optionOrder = await screen.findByRole('option', { name: /empresa/i })
    await user.pointer({
      keys: '[MouseLeft]',
      target: optionOrder,
    })
    await user.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(mockResetFilters).toHaveBeenCalledTimes(1)
  })
})
