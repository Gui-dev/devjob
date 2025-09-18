'use client'

import { Header } from '@/components/header'
import { JobCard } from '@/components/job-card'
import { PaginationBar } from '@/components/pagination-bar'
import { SidebarFilters } from '@/components/sidebar-filters'
import { JobCardSkeleton } from '@/components/skeleton-job-card'
import { useJobs } from '@/hooks/use-jobs'
import { useJobsFilters } from '@/hooks/use-jobs-filters'

export default function Home() {
  const { filters, updateFilters } = useJobsFilters()
  const { data, isPending } = useJobs(filters)

  return (
    <main className="w-full px-4 sm:px-6 md:px-10 py-10 bg-background min-h-screen">
      <div className="max-w-7xl gap-8">
        <section className="w-full">
          <div className="flex sm:flex-col lg:flex-row items-center lg:justify-between sm:justify-center flex-wrap gap-2 mb-6">
            <h1 className="text-3xl font-bold mb-6">Vagas em Destaque</h1>
            <div className="">
              <SidebarFilters />
            </div>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isPending &&
              Array.from({ length: 6 }).map((_, index) => (
                <JobCardSkeleton key={String(index)} />
              ))}
            {data?.jobs.map(job => {
              return <JobCard key={job.id} job={job} />
            })}
          </div>

          <div className="mt-10">
            <PaginationBar
              currentPage={filters.page ?? 1}
              totalPages={data?.meta.pages || 1}
              onPageChange={page => updateFilters({ ...filters, page })}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
