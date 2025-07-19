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
    <main className="w-full px-4 sm:px-6 md:px-10 py-10 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        <aside className="hidden lg:block border-r pr-4">
          <SidebarFilters />
        </aside>

        <section className="w-full">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <h1 className="text-3xl font-bold mb-6">Vagas em Destaque</h1>
            <div className="lg:hidden">
              <SidebarFilters />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {data?.jobs.map(job => {
              return <JobCard key={job.id} job={job} />
            })}
          </div>

          <div className="mt-10">
            <PaginationBar
              currentPage={filters.page ?? 1}
              totalPages={data?.meta.pages || 1}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
