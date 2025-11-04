'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type LogoutButtonProps = {
  className?: string
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleLogout = async () => {
    if (isPending) return
    setIsPending(true)
    try {
      await fetch('/api/admin/session', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Failed to log out', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ??
        'inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:bg-neutral-800'
      }
      disabled={isPending}
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}

