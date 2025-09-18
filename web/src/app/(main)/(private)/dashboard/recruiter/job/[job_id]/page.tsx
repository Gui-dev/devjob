'use client'

import { ApplicationStatus } from '@/components/application-status'
import { CandidateApplicationDetails } from '@/components/dashboard-components/candidate-application-details'
import { PaginationBar } from '@/components/pagination-bar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetRecruiterApplications } from '@/hooks/use-get-recruiter-applications'
import { useJobDetails } from '@/hooks/use-job-details'
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

const RecruiterJobDetails = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { job_id } = useParams<{ job_id: string }>()
  const { job, isLoading } = useJobDetails({ job_id })
  const { data, isPending } = useGetRecruiterApplications({
    jobId: job_id,
    page: currentPage,
  })

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 space-y-6">
      <Card className="relative">
        <CardHeader>
          <CardTitle>{job?.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{job?.description}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <strong>Empresa:</strong> {job?.company}
          </p>
          <p className="text-sm">
            <strong>Localizacao:</strong> {job?.location}
          </p>
          <p className="text-sm">
            <strong>Tipo:</strong> {job?.type}
          </p>
          <p className="text-sm">
            <strong>Nível:</strong> {job?.level}
          </p>
          <p className="text-sm">
            <strong>Tecnologias:</strong> {job?.technologies.join(', ')}
          </p>
        </CardContent>
        <Button asChild variant="outline">
          <Link
            href="/dashboard/recruiter"
            title="Voltar"
            className="absolute top-4 right-6"
          >
            <MoveLeft />
          </Link>
        </Button>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.jobApplications.map(jobApplication => (
                <TableRow key={jobApplication.id}>
                  <TableCell>{jobApplication.user.name}</TableCell>
                  <TableCell>{jobApplication.user.email}</TableCell>
                  <TableCell>
                    <ApplicationStatus status={jobApplication.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(
                      jobApplication.user.createdAt,
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <CandidateApplicationDetails candidate={jobApplication} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaginationBar
        currentPage={data?.meta.page || 1}
        totalPages={data?.meta.pages || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default RecruiterJobDetails
