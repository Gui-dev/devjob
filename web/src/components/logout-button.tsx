'use client'

import { signOut } from 'next-auth/react'
import { Button } from './ui/button'

export const LogoutButton = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Sair do app
    </Button>
  )
}
