import Link from 'next/link'

import { mintCsrfToken } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

const errorMessages: Record<string, string> = {
  invalid: 'The password you entered is incorrect. Please try again.',
  rate: 'Too many attempts detected. Please wait a few minutes before trying again.',
  csrf: 'We could not verify your request. Refresh the page and try again.',
}

type LoginPageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

export default function AdminLoginPage({ searchParams }: LoginPageProps) {
  const errorKey = typeof searchParams?.error === 'string' ? searchParams?.error : undefined
  const message = errorKey ? errorMessages[errorKey] : undefined
  const csrfToken = mintCsrfToken()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4 py-12">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Admin login</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Enter the administrator password to manage portfolio badges.
        </p>
      </div>
      {message ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/60 dark:bg-red-500/10 dark:text-red-200">
          {message}
        </p>
      ) : null}
      <form
        method="post"
        action="/api/admin/session"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <label className="flex flex-col gap-2 text-left">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Admin password</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-base text-neutral-900 outline-none ring-0 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
        >
          Sign in
        </button>
      </form>
      <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
        <Link href="/" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Return to portfolio
        </Link>
      </p>
    </main>
  )
}

