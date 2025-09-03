'use client'

import Link from 'next/link'

import { CardResume } from '@/components/dashboard-components/card-resume'
import { CreateJobForm } from '@/components/dashboard-components/create-job-form'
import { SkeletonJobApplicationResume } from '@/components/dashboard-components/skeleton-job-application-resume'
import { SkeletonStats } from '@/components/dashboard-components/skeleton-stats'
import { PaginationBar } from '@/components/pagination-bar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetStats } from '@/hooks/use-get-stats'
import { useGetUserApplications } from '@/hooks/use-get-user-applications'

const RecruiterProfile = () => {
  const { stats, isPending: isStatsPending } = useGetStats()
  const { data, isPending: isUserApplicationsPending } =
    useGetUserApplications()

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 space-y-6 pb-6">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold flex-1">Resumo</h1>
          <CreateJobForm />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isStatsPending && <SkeletonStats />}
          {stats && (
            <>
              <CardResume title="Vagas criadas" resume={stats.totalJobs} />
              <CardResume
                title="Total de candidaturas"
                resume={stats.totalApplications}
              />
              <CardResume
                title="Candidaturas aprovadas"
                resume={stats.acceptedApplications}
              />

              <CardResume
                title="Candidaturas pendentes"
                resume={stats.pendingApplications}
              />
              <CardResume
                title="Candidaturas rejeitadas"
                resume={stats.rejectedApplications}
              />
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Minhas vagas criadas</h2>
        {isUserApplicationsPending && <SkeletonJobApplicationResume />}

        {data && data.jobs.length === 0 && (
          <p className="text-muted-foreground">
            Você ainda não criou nenhuma vaga
          </p>
        )}

        {data && data.jobs.length > 0 && (
          <div className="space-y-4">
            {data.jobs.map(job => (
              <Card
                key={job.id}
                className="border border-muted transition-all hover:shadow-md"
              >
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <p>
                      {job.company} - {job.location}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text line-clamp-2 w-3/4 mb-4">
                    {job.description}
                  </p>

                  <Button asChild>
                    <Link href={`/dashboard/recruiter/job/${job.id}`}>
                      Ver detalhes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-10">
          <PaginationBar
            currentPage={data?.meta?.page ?? 1}
            totalPages={data?.meta?.pages || 1}
          />
        </div>
      </section>
    </div>
  )
}

export default RecruiterProfile
