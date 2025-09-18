'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { LogoutButton } from './logout-button'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { User } from 'lucide-react'
import { ModeToggle } from './toggle-theme'
import { SkeletonHeader } from './skeleton-header'

export const Header = () => {
  const { data: session, status } = useSession()
  const role = session?.user?.role.toLowerCase()

  if (status === 'loading') {
    return <SkeletonHeader />
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md">
      <Link href="/">
        <h1 className="text-2xl font-bold text-primary">Devjobs</h1>
      </Link>

      <nav className="flex items-center gap-4">
        <Link href="/">Vagas</Link>
        <Link href="/about">Sobre</Link>

        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-8 cursor-pointer">
                <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <div className="flex items-center justify-around gap-2">
                  <User className="size-4" />
                  <Link href={`/dashboard/${role}`}>Profile</Link>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center justify-around gap-2">
                  <span>Tema</span>
                  <ModeToggle />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!session && (
          <>
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>

            <Button variant="secondary" asChild>
              <Link href="/register">Cadastrar</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  )
}
