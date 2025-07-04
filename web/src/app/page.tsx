import { Header } from '@/components/header'
import { type IJobProps, JobCard } from '@/components/job-card'
import { PaginationBar } from '@/components/pagination-bar'

const jobs: IJobProps[] = [
  {
    id: '1',
    title: 'Desenvolvedor Front-End',
    company: 'Tech Solutions',
    location: 'São Paulo, SP',
    type: 'HYBRID',
    description:
      'Buscamos um desenvolvedor com experiência em React e Next.js...',
  },
  {
    id: '2',
    title: 'Designer UI/UX',
    company: 'DesignPro',
    location: 'Remoto',
    type: 'REMOTE',
    description:
      'Estamos em busca de um designer criativo com foco em mobile...',
  },
  {
    id: '3',
    title: 'Desenvolvedor Back-End',
    company: 'Tech Solutions',
    location: 'São Paulo, SP',
    type: 'HYBRID',
    description:
      'Buscamos um desenvolvedor com experiência em Node.js e Express...',
  },
  {
    id: '4',
    title: 'Desenvolvedor Front-End',
    company: 'Tech Solutions',
    location: 'São Paulo, SP',
    type: 'HYBRID',
    description:
      'Buscamos um desenvolvedor com experiência em React e Next.js...',
  },
  {
    id: '5',
    title: 'Desenvolvedor Front-End',
    company: 'Tech Solutions',
    location: 'São Paulo, SP',
    type: 'HYBRID',
    description:
      'Buscamos um desenvolvedor com experiência em React e Next.js...',
  },
  {
    id: '6',
    title: 'Desenvolvedor Front-End',
    company: 'Tech Solutions',
    location: 'São Paulo, SP',
    type: 'HYBRID',
    description:
      'Buscamos um desenvolvedor com experiência em React e Next.js...',
  },
  {
    id: '7',
    title: 'Desenvolvedor Front-End',
    company: 'Tech Solutions',
    location: 'São Paulo, SP',
    type: 'HYBRID',
    description:
      'Buscamos um desenvolvedor com experiência em React e Next.js...',
  },
  {
    id: '8',
    title: 'Desenvolvedor Front-End',
    company: 'Tech Solutions',
    location: 'São Paulo, SP',
    type: 'HYBRID',
    description:
      'Buscamos um desenvolvedor com experiência em React e Next.js...',
  },
]

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Vagas em Destaque</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => {
            return <JobCard key={job.id} job={job} />
          })}
        </div>

        <div className="mt-6">
          <PaginationBar currentPage={6} totalPages={10} />
        </div>
      </main>
    </>
  )
}
