import { useSuspenseQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import { getStats } from '@/services/get-stats'

export const useGetStats = () => {
  const { data: session } = useSession()
  const role = session?.user.role

  let endpoint = ''

  if (role === 'CANDIDATE') {
    endpoint = '/me/stats'
  } else if (role === 'RECRUITER') {
    endpoint = '/me/recruiters/stats'
  } else if (role === 'ADMIN') {
    endpoint = '/stats'
  }

  const { data } = useSuspenseQuery({
    queryKey: ['stats', role],
    queryFn: () => getStats(endpoint),
  })

  return {
    stats: data?.candidateStats || data?.recruiterStats || data?.stats,
  }
}
