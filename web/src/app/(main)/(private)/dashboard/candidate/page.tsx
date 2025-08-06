'use client'

import { CardResume } from '@/components/dashboard-components/card-resume'
import { SeeMoreApplication } from '@/components/dashboard-components/see-more-application'
import { SkeletonJobApplicationResume } from '@/components/dashboard-components/skeleton-job-application-resume'
import { SkeletonStats } from '@/components/dashboard-components/skeleton-stats'
import { PaginationBar } from '@/components/pagination-bar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useGetJobApplications } from '@/hooks/use-get-job-applications'
import { useGetStats } from '@/hooks/use-get-stats'

const UserProfile = () => {
  const { stats, isPending: isStatsPending } = useGetStats()
  const { data, isPending: isJobApplicationsPending } = useGetJobApplications()

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 space-y-6 pb-6">
      <section>
        <h1 className="text-2xl font-semibold mb-4">Resumo</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isStatsPending && <SkeletonStats />}
          {stats && (
            <>
              <CardResume
                title="Vagas aplicadas"
                resume={stats.totalApplications}
              />
              <CardResume
                title="Vagas aceitas"
                resume={stats.acceptedApplications}
              />
              <CardResume
                title="Vagas pendentes"
                resume={stats.pendingApplications}
              />
              <CardResume
                title="Vagas rejeitadas"
                resume={stats.rejectedApplications}
              />
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Minhas candidaturas</h2>
        {isJobApplicationsPending && <SkeletonJobApplicationResume />}

        {data && data.jobApplications.length === 0 && (
          <p className="text-muted-foreground">Voce nao possui candidaturas</p>
        )}

        {data && data.jobApplications.length > 0 && (
          <div className="space-y-4">
            {data.jobApplications.map(jobApplication => (
              <Card
                key={jobApplication.id}
                className="border border-muted transition-all hover:shadow-md"
              >
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>{jobApplication.job.title}</CardTitle>
                    <p>
                      {jobApplication.job.company} -{' '}
                      {jobApplication.job.location}
                    </p>
                  </div>
                  <Badge className="uppercase">{jobApplication.status}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text line-clamp-2 w-3/4 mb-4">
                    {jobApplication.job.description}
                  </p>
                  <SeeMoreApplication jobApplication={jobApplication} />
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

export default UserProfile
