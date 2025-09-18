import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

export const SkeletonChart = () => {
  return (
    <Card>
      <CardHeader>
        {/* Skeleton para o título do Card */}
        <CardTitle>
          <Skeleton className="h-6 w-56" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Skeleton para a área do gráfico */}
        <div className="w-full h-[300px]">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
