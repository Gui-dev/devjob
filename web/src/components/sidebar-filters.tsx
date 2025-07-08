'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { SlidersHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  filtersSchema,
  type FiltersSchemaData,
} from '@/validations/filters-schema'
import { useJobsFilters } from '@/hooks/use-jobs-filters'

export const SidebarFilters = () => {
  const { handleSubmit, register, setValue } = useForm<FiltersSchemaData>({
    defaultValues: {
      technology: '',
      location: '',
      type: undefined,
      level: undefined,
      sortBy: 'createdAt',
    },
    resolver: zodResolver(filtersSchema),
  })

  const { resetFilters, updateFilters } = useJobsFilters()

  const handleSubmitFilters = (data: FiltersSchemaData) => {
    updateFilters({ ...data, page: 1 })
  }

  const handleResetFilters = () => {
    resetFilters()
    setValue('technology', '')
    setValue('location', '')
    setValue('type', undefined)
    setValue('level', undefined)
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">
          <div className="flex items-center justify-center gap-2">
            <SlidersHorizontal className="size-4" />
            <span>Filtros</span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtrar vagas por:</SheetTitle>
        </SheetHeader>
        <form
          className="p-4 space-y-4 border-r"
          onSubmit={handleSubmit(handleSubmitFilters)}
        >
          <Input
            type="text"
            placeholder="Tecnologia"
            {...register('technology')}
          />
          <Input
            type="text"
            placeholder="Localização"
            {...register('location')}
          />

          <Select
            onValueChange={value =>
              setValue('type', value as FiltersSchemaData['type'])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="REMOTE">Remoto</SelectItem>
              <SelectItem value="ONSITE">Presencial</SelectItem>
              <SelectItem value="HYBRID">Hibrido</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={value =>
              setValue('level', value as FiltersSchemaData['level'])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JUNIOR">Júnior</SelectItem>
              <SelectItem value="PLENO">Pleno</SelectItem>
              <SelectItem value="SENIOR">Sênior</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={value =>
              setValue('sortBy', value as FiltersSchemaData['sortBy'])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Mais recente</SelectItem>
              <SelectItem value="company">Empresa</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center justify-center gap-2 w-full">
            <Button type="submit" className="flex-1">
              Filtrar
            </Button>
            <SheetClose asChild>
              <Button variant="outline" onClick={handleResetFilters}>
                Limpar filtros
              </Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
