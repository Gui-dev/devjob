import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

import { ApplyToJobForm } from './../apply-to-job-form'
import * as useApplyToJobModule from '@/hooks/use-apply-to-job'

const mockMutate = vi.fn()
let mockIsPending = false

vi.mock('@/hooks/use-apply-to-job', () => ({
  useApplyToJob: vi.fn(() => ({
    mutate: mockMutate,
    isPending: mockIsPending,
  })),
}))

vi.mock('lucide-react', () => ({
  LoaderCircle: () => <svg data-testid="icon-loader-circle" />,
}))

vi.mock('@lib/utils', () => ({
  cn: vi.fn((...args: string[]) => args.filter(Boolean).join(' ')),
}))

vi.mock('./../ui/button', () => ({
  Button: vi.fn(({ children, ...props }) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  )),
}))

vi.mock('./../ui/input', () => ({
  Input: vi.fn(({ ...props }) => <input data-testid="input" {...props} />),
}))

vi.mock('./../ui/textarea', () => ({
  Textarea: vi.fn(({ children, ...props }) => (
    <textarea data-testid="textarea" {...props}>
      {children}
    </textarea>
  )),
}))

vi.mock('./../ui/label', () => ({
  Label: vi.fn(({ children, ...props }) => (
    // biome-ignore lint: test
    <label data-testid="label" {...props}>
      {children}
    </label>
  )),
}))

let dialogIsOpen = false
let dialogOnOpenChange: ((open: boolean) => void) | undefined

vi.mock('./../ui/dialog', () => {
  const actual = vi.importActual(
    './../ui/dialog',
  ) as typeof import('./../ui/dialog')

  return {
    // biome-ignore lint/suspicious: test
    Dialog: ({ children, onOpenChange, open, ...props }: any) => {
      dialogOnOpenChange = onOpenChange
      dialogIsOpen = typeof open === 'boolean' ? open : dialogIsOpen
      return (
        <div data-testid="dialog" {...props}>
          {children}
        </div>
      )
    },
    // biome-ignore lint/suspicious: test
    DialogTrigger: ({ children, asChild, ...props }: any) => {
      const Child = asChild ? children : <button {...props}>{children}</button>
      return (
        <div
          data-testid="dialog-trigger"
          onClick={() => {
            dialogIsOpen = true
            dialogOnOpenChange?.(true)
          }}
          {...props}
        >
          {Child}
        </div>
      )
    },
    // biome-ignore lint/suspicious: test
    DialogContent: ({ children, ...props }: any) => {
      return dialogIsOpen ? (
        <div data-testid="dialog-content" {...props}>
          {children}
        </div>
      ) : null
    },
    DialogHeader: ({ children }: { children: ReactNode }) => {
      return <div data-testid="dialog-header">{children}</div>
    },
    DialogTitle: ({ children }: { children: ReactNode }) => {
      return <h2 data-testid="dialog-title">{children}</h2>
    },

    DialogDescription: ({ children }: { children: ReactNode }) => {
      return <p data-testid="dialog-description">{children}</p>
    },

    DialogFooter: ({ children }: { children: ReactNode }) => {
      return <div data-testid="dialog-footer">{children}</div>
    },
    // biome-ignore lint/suspicious: test
    DialogClose: ({ children, asChild, ...props }: any) => {
      const Child = asChild ? children : <button {...props}>{children}</button>
      return (
        <div
          data-testid="dialog-close"
          onClick={() => {
            dialogIsOpen = false
            dialogOnOpenChange?.(false)
          }}
          {...props}
        >
          {Child}
        </div>
      )
    },
  }
})

const MOCKED_JOB_ID = 'job-id-123'

describe('<ApplyToJobForm />', () => {
  beforeEach(() => {
    mockMutate.mockReset()
    mockIsPending = false
    dialogIsOpen = false
    dialogOnOpenChange = undefined

    vi.mocked(useApplyToJobModule.useApplyToJob).mockImplementation(() => ({
      mutate: mockMutate,
      isPending: mockIsPending,
    }))
  })

  it('should be able to render the "Me candidatar" button', async () => {
    render(<ApplyToJobForm jobId={MOCKED_JOB_ID} />)

    const triggerButton = screen.getByRole('button', { name: /me candidatar/i })
    expect(triggerButton).toBeInTheDocument()
  })
})
