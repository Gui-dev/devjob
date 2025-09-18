import { Skeleton } from './ui/skeleton'
import { TableCell, TableRow } from './ui/table'

interface ISkeletonTableProps {
  columns: number
}

export const SkeletonTable = ({ columns }: ISkeletonTableProps) => {
  return (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={String(index)}>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      ))}
    </TableRow>
  )
}
