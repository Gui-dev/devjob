'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  createJobSchema,
  type CreateJobSchemaData,
} from '@/validations/create-job-schema'
import { useCreateJob } from '@/hooks/use-create-job'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

export const CreateJobForm = () => {
  const { mutateAsync, isPending } = useCreateJob()
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<CreateJobSchemaData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      technologies: [],
    },
  })
  const [tech, setTech] = useState('')
  const technologies = watch('technologies')

  const handleAddTech = () => {
    if (tech.trim() && !technologies.includes(tech)) {
      setValue('technologies', [...technologies, tech])
      setTech('')
    }
  }

  const handleCreateJob = async (data: CreateJobSchemaData) => {
    await mutateAsync(data)
    toast.success('Vaga criada com sucesso!')
    reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold">Criar nova vaga</Button>
      </DialogTrigger>

      <DialogContent className="lg:min-w-[1024px] h-screen overflow-y-scroll sm:min-w-[600px] md:min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Criar nova vaga</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleCreateJob)}>
          <div className="lg:grid lg:grid-cols-2 lg:gap-4 sm:flex sm:flex-col sm:gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titulo</Label>
                <Input
                  placeholder="Ex: Desenvolvedor Fullstack"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  placeholder="Uma descrição da vaga"
                  className="min-h-[110px] resize-none"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input placeholder="Ex: OpenAI" {...register('company')} />
                {errors.company && (
                  <p className="text-sm text-red-500">
                    {errors.company.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input placeholder="Ex: São Paulo" {...register('location')} />
                {errors.location && (
                  <p className="text-sm text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Tipo</Label>
                <Select
                  onValueChange={value =>
                    setValue('type', value as CreateJobSchemaData['type'])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um tipo. Ex: Remoto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REMOTE">Remoto</SelectItem>
                    <SelectItem value="ONSITE">Presencial</SelectItem>
                    <SelectItem value="HYBRID">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Nível</Label>
                <Select
                  onValueChange={value =>
                    setValue('level', value as CreateJobSchemaData['level'])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um nível. Ex: Pleno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JUNIOR">Júnior</SelectItem>
                    <SelectItem value="PLENO">Pleno</SelectItem>
                    <SelectItem value="SENIOR">Senior</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-sm text-red-500">{errors.level.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Tecnologias</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: React"
                    value={tech}
                    onChange={e => setTech(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTech}
                    variant="secondary"
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {technologies.map((tech, index) => {
                    return (
                      <span
                        key={String(index)}
                        className="text-sm text-zinc-800 px-2 py-1 bg-zinc-200 rounded-md"
                      >
                        {tech}
                      </span>
                    )
                  })}
                </div>
                {errors.technologies && (
                  <p className="text-sm text-red-500">
                    {errors.technologies.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2  w-full">
            <DialogClose asChild>
              <Button variant="outline" size="lg">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="font-bold w-auto"
            >
              {isPending && <LoaderCircle className="animate-spin" />}
              {!isPending && 'Criar vaga'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
