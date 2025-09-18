'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { CardResume } from '@/components/dashboard-components/card-resume'
import { SkeletonStats } from '@/components/dashboard-components/skeleton-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAllJobApplications } from '@/hooks/use-get-all-job-applications'
import { useGetStats } from '@/hooks/use-get-stats'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ApplicationStatus } from '@/components/application-status'
import { PaginationBar } from '@/components/pagination-bar'
import { CandidateApplicationDetails } from '@/components/dashboard-components/candidate-application-details'
import { useState } from 'react'
import { SkeletonTable } from '@/components/skeleton-table'
import { SkeletonChart } from '@/components/skeleton-chart'

const AdminProfile = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { stats, isPending: isStatsPending } = useGetStats()
  const { data, isPending: isGetAllJobApplicationsPending } =
    useGetAllJobApplications({ page: currentPage })

  console.log('STATS: ', stats)
  console.log('JOBS: ', data)

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 space-y-6 pb-6">
      <section>
        <h1 className="text-2xl font-semibold flex-1 mb-4">
          Dashboard do administrador
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isStatsPending && <SkeletonStats />}

          {stats && (
            <>
              <CardResume title="Total de empregos" resume={stats.totalJobs} />

              <CardResume
                title="Total de aplicações"
                resume={stats.totalJobApplications}
              />
              <CardResume
                title="Total de candidatos"
                resume={stats.totalCandidates}
              />
              <CardResume
                title="Total de recrutadores"
                resume={stats.totalRecruiters}
              />
            </>
          )}
        </div>
      </section>

      <section>
        {isStatsPending && <SkeletonChart />}
        {!isStatsPending && (
          <Card>
            <CardHeader>
              <CardTitle>Candidatura por vagas</CardTitle>
            </CardHeader>
            <CardContent>
              {stats && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.applicationsPerJob}>
                    <XAxis
                      dataKey="jobId"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Todas as candidaturas</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.jobApplications.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma candidatura encontrada ainda
              </p>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Vaga</TableHead>
                  <TableHead className="w-[100px]">Candidato</TableHead>
                  <TableHead className="w-[100px]">E-mail</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isGetAllJobApplicationsPending &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonTable key={String(index)} columns={5} />
                  ))}

                {data?.jobApplications.map(jobApplication => {
                  return (
                    <TableRow key={jobApplication.id}>
                      <TableCell>{jobApplication.id}</TableCell>
                      <TableCell>{jobApplication.user.name}</TableCell>
                      <TableCell>{jobApplication.user.email}</TableCell>
                      <TableCell>
                        <ApplicationStatus status={jobApplication.status} />
                      </TableCell>
                      <TableCell>
                        <CandidateApplicationDetails
                          candidate={jobApplication}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-6">
          <PaginationBar
            currentPage={data?.meta.page || 1}
            totalPages={data?.meta.pages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </div>
  )
}

export default AdminProfile
