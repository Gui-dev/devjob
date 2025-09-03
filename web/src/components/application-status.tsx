'use client'

import { cn } from '@/lib/utils'

import { Badge } from './ui/badge'

interface IApplicationStatusProps {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
}

export const ApplicationStatus = ({ status }: IApplicationStatusProps) => {
  const getStatus = () => {
    switch (status) {
      case 'PENDING':
        return 'Pendente'
      case 'ACCEPTED':
        return 'Aprovado'
      case 'REJECTED':
        return 'Rejeitado'
      default:
        return ''
    }
  }

  return (
    <Badge
      variant="outline"
      className={cn('text-sm', {
        'text-yellow-500': status === 'PENDING',
        'text-green-500': status === 'ACCEPTED',
        'text-red-500': status === 'REJECTED',
      })}
    >
      {getStatus()}
    </Badge>
  )
}
