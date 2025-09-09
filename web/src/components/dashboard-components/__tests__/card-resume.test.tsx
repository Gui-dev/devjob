import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { CardResume } from './../card-resume'

vi.mock('@/components/ui/card', () => ({
  Card: vi.fn(({ children, className }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  )),
  CardHeader: vi.fn(({ children }) => (
    <div data-testid="card-header">{children}</div>
  )),
  CardTitle: vi.fn(({ children, className }) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  )),
  CardContent: vi.fn(({ children }) => (
    <div data-testid="card-content">{children}</div>
  )),
}))

describe('<CardResume />', () => {
  it('should be able to render the title and resume number correctly', async () => {
    const testTitle = 'Test Title'
    const testResume = 42

    render(<CardResume title={testTitle} resume={testResume} />)

    expect(screen.getByTestId('card')).toBeInTheDocument()

    const renderedTitle = screen.getByText(testTitle)
    expect(renderedTitle).toBeInTheDocument()
    expect(renderedTitle).toHaveAttribute('data-testid', 'card-title')

    const renderedResume = screen.getByText(testResume)
    expect(renderedResume).toBeInTheDocument()
    expect(renderedResume).toHaveTextContent(String(testResume))
  })

  it('should be able to apply the correct class names to CardTitle', async () => {
    const testTitle = 'Test Title'
    const testResume = 42

    render(<CardResume title={testTitle} resume={testResume} />)

    const cardTitle = screen.getByTestId('card-title')

    expect(cardTitle).toHaveClass('capitalize')
    expect(cardTitle).toHaveClass('text-center')
  })

  it('should apply the correct class names to the main Card', () => {
    const testTitle = 'Test Title'
    const testResume = 42

    render(<CardResume title={testTitle} resume={testResume} />)

    const card = screen.getByTestId('card')
    expect(card).toHaveClass('flex')
    expect(card).toHaveClass('flex-col')
    expect(card).toHaveClass('justify-around')
    expect(card).toHaveClass('text-center')
  })
})
