import type { JobApplication } from '@/hooks/use-get-job-applications'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { ApplicationStatus } from '../application-status'

interface ISeeMoreApplicationProps {
  jobApplication: JobApplication
}

export const SeeMoreApplication = ({
  jobApplication,
}: ISeeMoreApplicationProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Ver mais</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{jobApplication.job.title}</DialogTitle>
        </DialogHeader>
        <div className="spce-y-3">
          <p>
            <strong>Empresa: </strong> {jobApplication.job.company}
          </p>
          <p>
            <strong>Localização: </strong> {jobApplication.job.location}
          </p>
          <p>
            <strong>Tipo: </strong> {jobApplication.job.type}
          </p>
          <p>
            <strong>Status da candidatura: </strong>{' '}
            <ApplicationStatus status={jobApplication.status} />
          </p>
          <div>
            <strong>Descrição</strong>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
              {jobApplication.job.description}
            </p>
          </div>
          <div>
            <strong>Mensagem enviada:</strong>
            <p className="text-sm mt-1">{jobApplication.message}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
