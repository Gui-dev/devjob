import { LogoutButton } from '@/components/logout-button'
import { ModeToggle } from '@/components/toggle-theme'

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <LogoutButton />
      <ModeToggle />
    </div>
  )
}
