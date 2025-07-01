'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

interface IAuthProvider {
  children: ReactNode
}

export const AuthProvider = ({ children }: IAuthProvider) => {
  return <SessionProvider>{children}</SessionProvider>
}
