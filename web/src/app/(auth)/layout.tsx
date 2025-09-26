import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { IsUserAuthenticated } from '@/components/is-user-authenticated'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <IsUserAuthenticated>
      <div className="relative">
        <Link
          href="/"
          className="absolute left-12 top-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground z-10 hover:text-primary"
        >
          <ArrowLeft className="size-6" />
          Voltar
        </Link>
        {children}
      </div>
    </IsUserAuthenticated>
  )
}
