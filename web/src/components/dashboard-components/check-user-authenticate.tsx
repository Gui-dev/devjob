'use client'

import { signOut, useSession } from 'next-auth/react'
import { type ReactNode, useEffect } from 'react'

interface ICheckUserAuthenticateProps {
  children: ReactNode
}

export const CheckUserAuthenticate = ({
  children,
}: ICheckUserAuthenticateProps) => {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut()
    }
  }, [session])

  return children
}
