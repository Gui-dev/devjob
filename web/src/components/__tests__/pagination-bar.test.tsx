import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { PaginationBar } from '../pagination-bar'

describe('', () => {
  const user = userEvent.setup()
  const mockOnPageChange = vi.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  it('should be able to show pagination links correctly', async () => {
    render(
      <PaginationBar
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  it('should be able to call onPageChange with the correct page number when a page link is clicked', async () => {
    render(
      <PaginationBar
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    )

    await user.click(screen.getByText('3'))

    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })
})
