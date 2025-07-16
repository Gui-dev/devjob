'use client'

import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import {
  type ApplyToJobRequest,
  applyToJobSchema,
} from '@/validations/apply-to-job-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApplyToJob } from '@/hooks/use-apply-to-job'
import { Label } from './ui/label'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IApplyToJobFormProps {
  jobId: string
}

export const ApplyToJobForm = ({ jobId }: IApplyToJobFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ApplyToJobRequest>({
    resolver: zodResolver(applyToJobSchema),
  })
  const { mutate, isPending } = useApplyToJob(jobId)

  const handleApplyToJob = (data: ApplyToJobRequest) => {
    mutate(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="mt-4">
          Me candidatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={handleSubmit(handleApplyToJob)}
          className="space-y-4 mt-4"
        >
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Envie sua candiatura
            </DialogTitle>
            <DialogDescription>
              Mostre seu interesse pela vaga e compartilhe seus links
              profissionais
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Mensagem personalizada</Label>
            <Textarea
              placeholder="Por que essa vaga é ideal para você ?"
              {...register('message')}
              className={cn(
                'min-h-[100px] resize-y',
                errors.message && 'border-red-500 focus-visible:ring-red-400',
              )}
            />
            {errors.message && (
              <span className="text-sm text-red-500">
                {errors.message.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground block">
              Github
            </Label>
            <Input
              type="url"
              placeholder="https://github.com/seu-perfil"
              {...register('githubUrl')}
              className={cn(
                errors.githubUrl && 'border-red-500 focus-visible:ring-red-400',
              )}
            />
            {errors.githubUrl && (
              <p className="text-sm text-red-500">{errors.githubUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground block">
              Linkedin
            </Label>
            <Input
              type="url"
              placeholder="https://linkedin.com/in/seu-perfil"
              {...register('linkedinUrl')}
              className={cn(
                errors.linkedinUrl &&
                  'border-red-500 focus-visible:ring-red-400',
              )}
            />
            {errors.linkedinUrl && (
              <p className="text-sm text-red-500">
                {errors.linkedinUrl.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="w-auto"
            >
              {isPending && <LoaderCircle className="animate-spin" />}
              {!isPending && 'Enviar candidatura'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
