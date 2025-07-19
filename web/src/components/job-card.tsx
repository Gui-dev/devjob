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
  return (
    <Link href={`/job/${job.id}/details`} className="group">
      <Card className="transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold group-hover:text-primary">
            {job.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {job.company} - {job.location}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-sm space-y-3">
          <p className="text-muted-foreground line-clamp-3">
            {job.description.slice(0, 100)}...
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-foreground">
            <span className="px-2 py-1 bg-muted rounded-full">{job.type}</span>
            <span className="px-2 py-1 bg-muted rounded-full">{job.level}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
