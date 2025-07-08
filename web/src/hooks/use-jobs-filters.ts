'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import queryString from 'query-string'
import type { IUseJobParams } from './use-jobs'
import type { FiltersSchemaData } from '@/validations/filters-schema'

export const useJobsFilters = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const filters: IUseJobParams = useMemo(() => {
    const parsed = queryString.parse(searchParams.toString())

    return {
      page: parsed.page ? Number.parseInt(parsed.page?.toString()) : 1,
      technology: parsed.technology?.toString(),
      location: parsed.location?.toString(),
      type: parsed.type?.toString() as FiltersSchemaData['type'],
      level: parsed.level?.toString() as FiltersSchemaData['level'],
      sortBy: parsed.sortBy?.toString() as FiltersSchemaData['sortBy'],
    }
  }, [searchParams])

  const updateFilters = (newFilters: Partial<IUseJobParams>) => {
    const currentParams = queryString.parse(searchParams.toString())

    const merged = {
      ...currentParams,
      ...newFilters,
      page: newFilters.page ?? 1,
    }
    const query = queryString.stringify(merged, {
      skipEmptyString: true,
      skipNull: true,
    })

    router.push(`${pathname}?${query}`)
  }

  const resetFilters = () => {
    router.push(`${pathname}`)
  }

  return {
    filters,
    updateFilters,
    resetFilters,
  }
}
