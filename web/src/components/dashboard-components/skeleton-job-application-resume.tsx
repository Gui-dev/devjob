import { Skeleton } from '../ui/skeleton'

export const SkeletonJobApplicationResume = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <Skeleton className="h-[150px] w-[200px]" />
      <Skeleton className="h-[150px] w-[200px]" />
      <Skeleton className="h-[150px] w-[200px]" />
      <Skeleton className="h-[150px] w-[200px]" />
    </div>
  )
}
