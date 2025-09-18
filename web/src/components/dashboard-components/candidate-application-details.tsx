import Link from 'next/link'
import { Eye, CheckIcon, X } from 'lucide-react'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Button } from '../ui/button'
import type { JobApplication } from '@/hooks/_types/job-application-type'
import { Separator } from '../ui/separator'
import { useUpdateStatus } from '@/hooks/use-update-status'

interface ICandidateApplicationDetailsProps {
  candidate: JobApplication
}

export const CandidateApplicationDetails = ({
  candidate,
}: ICandidateApplicationDetailsProps) => {
  const { isPending: isUpdatePending, mutateAsync } = useUpdateStatus()

  const handleUpdateStatus = async (
    status: string,
    jobApplicationId: string,
  ) => {
    try {
      await mutateAsync({ status, jobApplicationId })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Visualizar">
          <Eye />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do candidato</SheetTitle>
          <SheetDescription>
            Informações completas da candidatura
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-semibold">Nome</p>
            <p>{candidate.user.name}</p>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-semibold">
              E-mail
            </p>
            <p>{candidate.user.email}</p>
          </div>
          <Separator />

          {candidate.message && (
            <>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground font-semibold">
                  Mensagem
                </p>
                <p className="text-sm">{candidate.message}</p>
              </div>
              <Separator />
            </>
          )}

          {candidate.githubUrl && (
            <>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground font-semibold">
                  Github
                </p>
                <Link
                  href={candidate.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300 underline truncate"
                >
                  {candidate.githubUrl}
                </Link>
              </div>
              <Separator />
            </>
          )}

          {candidate.linkedinUrl && (
            <>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground font-semibold">
                  Linkedin
                </p>
                <Link
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300 underline truncate"
                >
                  {candidate.linkedinUrl}
                </Link>
              </div>
              <Separator />
            </>
          )}
        </div>

        <SheetFooter>
          <div className="flex items-center justify-center gap-2 w-full">
            <SheetClose asChild>
              <Button variant="outline">Fechar</Button>
            </SheetClose>
            <Button
              type="button"
              variant="secondary"
              title="Aceitar"
              disabled={isUpdatePending}
              onClick={() => handleUpdateStatus('ACCEPTED', candidate.id)}
            >
              <CheckIcon />
              Aprovar
            </Button>
            <Button
              type="button"
              variant="destructive"
              title="Rejeitar"
              disabled={isUpdatePending}
              onClick={() => handleUpdateStatus('REJECTED', candidate.id)}
            >
              <X />
              Rejeitar
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
