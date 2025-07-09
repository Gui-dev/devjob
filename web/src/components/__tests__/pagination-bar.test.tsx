import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

import { PaginationBar } from '../pagination-bar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams('page=2'),
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('', () => {
  it('should be able to show pagination links correctly', async () => {
    render(<PaginationBar currentPage={2} totalPages={5} />)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '2' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '3' })).toBeInTheDocument()
    })
  })
})
