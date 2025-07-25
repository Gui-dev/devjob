import { IsUserAuthenticated } from '@/components/is-user-authenticated'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <IsUserAuthenticated>{children}</IsUserAuthenticated>
}
