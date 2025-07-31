import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ICardResumeProps {
  title: string
  resume: number
}

export const CardResume = ({ title, resume }: ICardResumeProps) => {
  return (
    <Card className="flex flex-col justify-around text-center">
      <CardHeader>
        <CardTitle className="capitalize text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-center">{resume}</p>
      </CardContent>
    </Card>
  )
}
