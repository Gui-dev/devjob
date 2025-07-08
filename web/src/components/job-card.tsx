import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

export interface IJobProps {
  id: string
  title: string
  description: string
  company: string
  location: string
  level: 'JUNIOR' | 'PLENO' | 'SENIOR'
  type: 'ONSITE' | 'REMOTE' | 'HYBRID'
  technologies: string[]
  createdAt: Date
}

interface IJobCardProps {
  job: IJobProps
}

export const JobCard = ({ job }: IJobCardProps) => {
  console.log('JOB: ', job)
  return (
    <Link href={`/job/${job.id}/details`}>
      <Card className="hover:bg-gray-950 transition">
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>
            {job.company} - {job.location}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p>{job.description.slice(0, 100)}...</p>

          <span>
            {job.type} - {job.level}
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
