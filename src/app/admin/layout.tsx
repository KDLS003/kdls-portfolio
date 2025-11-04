import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import LogoutButton from '@/components/admin/LogoutButton'
import { getSessionFromCookies } from '@/lib/auth/session'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const session = getSessionFromCookies()

  if (!session) {
    redirect('/admin/login?error=invalid')
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 bg-white px-6 py-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">Administrator tools</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Session expires {new Date(session.expiresAt).toLocaleTimeString()}.
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

