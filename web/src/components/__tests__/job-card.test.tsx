import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { type IJobProps, JobCard } from '../job-card'

const mockJob: IJobProps = {
  id: '1',
  title: 'Fullstack Developer',
  company: 'Acme Inc.',
  location: 'São Paulo',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  technologies: ['React'],
  level: 'PLENO',
  type: 'REMOTE',
  createdAt: new Date(),
}

describe('<JobCard />', () => {
  it('should be able to render job card component correctly', async () => {
    render(<JobCard job={mockJob} />)

    expect(screen.getByText(/fullstack developer/i)).toBeInTheDocument()
    expect(screen.getByText(/acme inc./i)).toBeInTheDocument()
    expect(screen.getByText(/são paulo/i)).toBeInTheDocument()
    expect(
      screen.getByText(
        /lorem ipsum dolor sit amet, consectetur adipiscing elit./i,
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(/PLENO/i)).toBeInTheDocument()
    expect(screen.getByText(/REMOTE/i)).toBeInTheDocument()
  })
})
