import { useJobsFilters } from '@/hooks/use-jobs-filters'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'

interface IPaginationProps {
  currentPage: number
  totalPages: number
}

export const PaginationBar = ({
  currentPage,
  totalPages,
}: IPaginationProps) => {
  const { updateFilters } = useJobsFilters()
  const maxVisiblePages = 5

  const generatePages = () => {
    const pages = []
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const pages = generatePages()

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              title="Página anterior"
              aria-label="Página anterior"
              onClick={() => updateFilters({ page: currentPage - 1 })}
            />
          </PaginationItem>
        )}

        {pages[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => updateFilters({ page: 1 })}>
                1
              </PaginationLink>
            </PaginationItem>
            {pages[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pages.map(page => {
          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => updateFilters({ page })}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                onClick={() => updateFilters({ page: totalPages })}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              title="Próxima página"
              aria-label="Próxima página"
              onClick={() => updateFilters({ page: currentPage + 1 })}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
