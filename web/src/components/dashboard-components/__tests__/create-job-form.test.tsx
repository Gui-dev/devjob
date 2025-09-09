import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as reactHookForm from 'react-hook-form'

import { CreateJobForm } from '@/components/dashboard-components/create-job-form'
import { useCreateJob } from '@/hooks/use-create-job'
import { CreateJobSchemaData } from '@/validations/create-job-schema'

vi.mock('@/hooks/use-create-job', () => ({
  useCreateJob: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(() => vi.fn()),
}))

vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react')
  return {
    ...actual,
    LoaderCircle: () => <svg data-testid="loader-circle" />,
    X: () => <svg data-testid="x-icon" />,
  }
})

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, asChild, ...props }) => {
    if (asChild) {
      return children
    }

    return (
      <button data-testid="button" {...props}>
        {children}
      </button>
    )
  }),
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: vi.fn(({ children }) => (
    <div data-testid="dialog-mock">{children}</div>
  )),
  DialogTrigger: vi.fn(({ children }) => children),
  DialogContent: vi.fn(({ children }) => <div>{children}</div>),
  DialogHeader: vi.fn(({ children }) => <div>{children}</div>),
  DialogTitle: vi.fn(({ children }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  )),
  DialogFooter: vi.fn(({ children }) => <footer>{children}</footer>),
  DialogClose: vi.fn(({ children }) => children),
}))

vi.mock('@/components/ui/label', () => ({
  // biome-ignore lint/a11y/noLabelWithoutControl: tests
  Label: vi.fn(({ children }) => <label data-testid="label">{children}</label>),
}))

vi.mock('@/components/ui/textarea', () => ({
  Textarea: vi.fn(({ onChange, ...props }) => (
    <textarea onChange={onChange} {...props} />
  )),
}))

vi.mock('@/components/ui/select', () => ({
  Select: vi.fn(({ onValueChange, ...props }) => (
    <select onChange={event => onValueChange(event.target.value)} {...props} />
  )),
  SelectTrigger: vi.fn(({ children }) => (
    <button type="button" aria-expanded="false">
      {children}
    </button>
  )),
  SelectValue: vi.fn(({ placeholder }) => (
    <span data-testid="select-value">{placeholder}</span>
  )),
  SelectContent: vi.fn(({ children }) => <>{children}</>),
  SelectItem: vi.fn(({ value, children }) => (
    <option value={value}>{children}</option>
  )),
}))

const mockUseForm = vi.fn()
const mockHandleSubmit = vi.fn()
const mockRegister = vi.fn()
const mockSetValue = vi.fn()
const mockWatch = vi.fn()
const mockReset = vi.fn()

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form')
  return {
    ...actual,
    useForm: () => ({
      formState: { errors: {} },
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      setValue: mockSetValue,
      watch: mockWatch,
      reset: mockReset,
    }),
  }
})

const queryClient = new QueryClient()
const WrapperCreateJobForm = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CreateJobForm />
    </QueryClientProvider>
  )
}

describe('<CreateJobForm />', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
    // @ts-expect-error
    mockHandleSubmit.mockImplementation(callback => event => {
      event?.preventDefault()
      return callback(mockWatch())
    })

    vi.mocked(useCreateJob).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    })
    mockWatch.mockReturnValue([])
  })

  it('should be able to render the trigger button and open the dialog', async () => {
    render(<WrapperCreateJobForm />)

    screen.debug()

    const triggerButton = screen.getByRole('button', {
      name: /criar nova vaga/i,
    })

    expect(triggerButton).toBeInTheDocument()

    await user.click(triggerButton)

    const dialogTitle = screen.getByRole('heading', {
      name: /criar nova vaga/i,
    })

    expect(dialogTitle).toBeInTheDocument()
  })
})
