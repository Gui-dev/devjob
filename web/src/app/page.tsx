'use client'

import { Header } from '@/components/header'
import { JobCard } from '@/components/job-card'
import { PaginationBar } from '@/components/pagination-bar'
import { SidebarFilters } from '@/components/sidebar-filters'
import { useJobs } from '@/hooks/use-jobs'
import { useJobsFilters } from '@/hooks/use-jobs-filters'

export default function Home() {
  const { filters } = useJobsFilters()
  const { data } = useJobs(filters)

  return (
    <>
      <Header />
      <main className="w-full px-6 py-10">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold mb-6">Vagas em Destaque</h1>
          <SidebarFilters />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.jobs.map(job => {
            return <JobCard key={job.id} job={job} />
          })}
        </div>

        <div className="mt-6">
          <PaginationBar
            currentPage={filters.page ?? 1}
            totalPages={data?.meta.pages || 1}
          />
        </div>
      </main>
    </>
  )
}
