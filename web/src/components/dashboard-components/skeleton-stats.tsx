import { Skeleton } from '../ui/skeleton'

export const SkeletonStats = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Skeleton className="size-20" />
      <Skeleton className="size-20" />
      <Skeleton className="size-20" />
      <Skeleton className="size-20" />
    </div>
  )
}
