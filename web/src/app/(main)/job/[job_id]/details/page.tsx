'use client'

import { useParams } from 'next/navigation'

import { useJobDetails } from '@/hooks/use-job-details'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { JobCardDetails } from '@/components/job-card-details'

const JobDetails = () => {
  const { job_id } = useParams<{ job_id: string }>()
  const { job, isError, isLoading } = useJobDetails({ job_id })

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
      </div>
    )
  }

  if (isError || !job) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <Alert variant="destructive" className="m-6 max-w-3/4">
          <AlertTitle>Erro ao carregar vaga</AlertTitle>
          <AlertDescription>
            <p>
              Não foi possível encontrar essa vaga. Verifique o link ou tente
            </p>
            <Link
              href="/"
              className="text-sm text-yellow-200 font-bold hover:text-yellow-400 hover:underline"
            >
              Voltar para vagas
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <JobCardDetails job={job} />
    </div>
  )
}

export default JobDetails
