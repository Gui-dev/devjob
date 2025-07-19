import type { IJobProps } from './job-card'
import { Badge } from './ui/badge'
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Layers,
  MapPin,
  Rocket,
  Tag,
} from 'lucide-react'
import Link from 'next/link'
import { ApplyToJobForm } from './apply-to-job-form'
import { useSession } from 'next-auth/react'

export interface IJobCardDetailsProps {
  job: IJobProps
}

export const JobCardDetails = ({ job }: IJobCardDetailsProps) => {
  const { data, status } = useSession()
  const user = data?.user
  const canApply = status === 'authenticated' && user?.role === 'CANDIDATE'

  return (
    <>
      <div className="relative bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6 space-y-6 border border-border">
        <Link
          href="/"
          className="absolute top-4 right-4 flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span className="inline-block text-sm mb-1">Voltar para vagas</span>
        </Link>
        <div className="spce-y-1">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            <span>{job.company}</span>
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">
          <p>{job.description}</p>

          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold mb-2">
              <Tag className="w-4 h-4" /> Tecnologias
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.technologies.map(tech => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm mt-4">
          <div className="flex items-center gap-1">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span>{job.level}</span>
          </div>

          <div className="flex items-center gap-1">
            <Rocket className="w-4 h-4 text-muted-foreground" />
            <span>{job.type}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              Publicada em:{' '}
              <strong>{new Date(job.createdAt).toLocaleDateString()}</strong>
            </span>
          </div>
        </div>

        <div className="mt-1">
          {canApply && <ApplyToJobForm jobId={job.id} />}
          {!canApply && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Você precisa estar logado com um <strong>candidato</strong> para
              se candidatar a uma vaga.{' '}
              <Link
                href="/login"
                className="text-sm text-primary hover:underline"
              >
                Faça login
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  )
}
