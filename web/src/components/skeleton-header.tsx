import { Skeleton } from './ui/skeleton'

export const SkeletonHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md">
      {/* Skeleton para a logo/título */}
      <Skeleton className="h-8 w-28" />

      {/* Skeleton para os links de navegação */}
      <nav className="flex items-center gap-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />

        {/* Skeleton para os botões ou avatar do usuário */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </nav>
    </header>
  )
}
