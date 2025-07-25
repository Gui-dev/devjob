import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

interface IIsUserAuthenticatedProps {
  children: ReactNode
}

export const IsUserAuthenticated = async ({
  children,
}: IIsUserAuthenticatedProps) => {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    redirect('/')
  }

  return <>{children}</>
}
