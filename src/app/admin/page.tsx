'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheckCircle,
  FiInfo,
  FiPlusCircle,
  FiTrash2,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import {
  CUSTOM_CREDLY_STORAGE_KEY,
  credlyBadges,
  loadStoredCredlyEmbeds,
  parseCredlyEmbedCode,
  saveStoredCredlyEmbeds,
  sortStoredCredlyEmbeds,
  type CredlyCategory,
  type StoredCredlyEmbed,
} from '../../lib/credly'
import {
  ensureCredlyScript,
  reinitializeCredlyEmbeds,
  verifyCredlyEmbedPresence,
  waitForNextFrame,
} from '../../lib/credlyScript'

const categories: { value: CredlyCategory; label: string; helper: string }[] = [
  {
    value: 'certification',
    label: 'Professional Certifications',
    helper:
      'Accredited certifications and intensive programmes. These surface in the main Certifications section.',
  },
  {
    value: 'badge',
    label: 'Digital Badges & Challenges',
    helper:
      'Short-form achievements, competitions, and micro-credentials. These appear in the Badges section.',
  },
]

const sectionDescriptions: Record<CredlyCategory, string> = {
  certification:
    'Embed professional and career-aligned certifications. Paste the exact embed snippet from Credly and the system will handle the rest.',
  badge:
    'Add micro-credentials, challenges, and smaller recognitions. Each embed keeps the portfolio styling intact.',
}

type StatusVariant = 'success' | 'error' | 'info'

type StatusState = {
  type: StatusVariant
  message: string
} | null

const statusIconMap: Record<StatusVariant, IconType> = {
  success: FiCheckCircle,
  error: FiAlertTriangle,
  info: FiInfo,
}

const formatDateTime = (value: string) => {
  try {
    const formatter = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    return formatter.format(new Date(value))
  } catch (error) {
    console.error('Failed to format date', error)
    return value
  }
}

const createCredlyBadgeElement = (badge: { badgeId: string }) => (
  <div className="credly-badge-frame w-full max-w-[340px]">
    <div
      className="credly-badge block h-[340px] w-full"
      data-iframe-width="340"
      data-iframe-height="340"
      data-hide-footer="true"
      data-hide-share="true"
      data-share-badge-id={badge.badgeId}
      data-share-badge-host="https://www.credly.com"
    />
    <span className="credly-badge-overlay" aria-hidden="true" />
  </div>
)

export default function AdminPage() {
  const [embedInput, setEmbedInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CredlyCategory>('certification')
  const [customBadges, setCustomBadges] = useState<StoredCredlyEmbed[]>([])
  const [status, setStatus] = useState<StatusState>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [issuerInput, setIssuerInput] = useState('')

  const defaultBadgeIds = useMemo(
    () => new Set(credlyBadges.map((badge) => badge.badgeId)),
    [],
  )

  useEffect(() => {
    const stored = sortStoredCredlyEmbeds(loadStoredCredlyEmbeds())
    setCustomBadges(stored)
  }, [])

  useEffect(() => {
    saveStoredCredlyEmbeds(customBadges)
  }, [customBadges])

  useEffect(() => {
    ensureCredlyScript()
      .then(() => {
        reinitializeCredlyEmbeds()
      })
      .catch((error) => {
        console.error('Failed to prepare Credly embeds', error)
        setStatus({ type: 'error', message: 'Could not load the Credly embed script. Refresh and try again.' })
      })
  }, [])

  useEffect(() => {
    ensureCredlyScript()
      .then(() => {
        reinitializeCredlyEmbeds()
      })
      .catch((error) => {
        console.error('Failed to refresh Credly embeds', error)
      })
  }, [customBadges])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key !== CUSTOM_CREDLY_STORAGE_KEY) return

      const stored = sortStoredCredlyEmbeds(loadStoredCredlyEmbeds())
      setCustomBadges(stored)
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const resetForm = () => {
    setEmbedInput('')
    setTitleInput('')
    setIssuerInput('')
  }

  const handleAddBadge = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!embedInput.trim()) {
      setStatus({ type: 'error', message: 'Paste the embed code from Credly before submitting.' })
      return
    }

    if (isProcessing) return

    setIsProcessing(true)
    setStatus({ type: 'info', message: 'Validating embed and loading preview…' })

    try {
      const parsed = parseCredlyEmbedCode(embedInput)

      if (defaultBadgeIds.has(parsed.badgeId) || customBadges.some((badge) => badge.badgeId === parsed.badgeId)) {
        throw new Error('This badge is already included in your portfolio.')
      }

      const normalizedTitle = titleInput.trim() || parsed.title || undefined
      const normalizedIssuer = issuerInput.trim() || undefined

      const newBadge: StoredCredlyEmbed = {
        badgeId: parsed.badgeId,
        category: selectedCategory,
        createdAt: new Date().toISOString(),
        ...(normalizedTitle ? { title: normalizedTitle } : {}),
        ...(normalizedIssuer ? { issuer: normalizedIssuer } : {}),
      }

      setCustomBadges((previous) => sortStoredCredlyEmbeds([...previous, newBadge]))
      await waitForNextFrame()
      await ensureCredlyScript()
      reinitializeCredlyEmbeds()

      const verified = await verifyCredlyEmbedPresence(parsed.badgeId, { shouldExist: true })

      if (!verified) {
        setCustomBadges((previous) => previous.filter((badge) => badge.badgeId !== parsed.badgeId))
        throw new Error('Unable to confirm that Credly loaded the embed. Double-check the code and try again.')
      }

      resetForm()
      setStatus({ type: 'success', message: 'Badge added successfully and verified on the preview grid.' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong while adding the badge.'
      setStatus({ type: 'error', message })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteBadge = async (badge: StoredCredlyEmbed) => {
    if (isProcessing) return

    const confirmation = window.confirm(
      `Remove "${badge.title ?? 'Credly Badge'}" from the custom list? This cannot be undone.`,
    )

    if (!confirmation) return

    setIsProcessing(true)
    setStatus({ type: 'info', message: 'Removing badge and confirming updates…' })

    setCustomBadges((previous) => previous.filter((item) => item.badgeId !== badge.badgeId))
    await waitForNextFrame()
    await ensureCredlyScript().catch((error) => {
      console.error('Failed to reload Credly script after removal', error)
    })
    reinitializeCredlyEmbeds()

    const removed = await verifyCredlyEmbedPresence(badge.badgeId, { shouldExist: false })

    if (removed) {
      setStatus({ type: 'success', message: 'Badge deleted. The main site will update automatically.' })
    } else {
      setStatus({ type: 'error', message: 'Badge removed locally, but verification timed out. Refresh to confirm.' })
    }

    setIsProcessing(false)
  }

  const StatusMessage = () => {
    if (!status) return null

    const Icon = statusIconMap[status.type]

    return (
      <div
        className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
          status.type === 'success'
            ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
            : status.type === 'error'
              ? 'border-red-400/60 bg-red-400/10 text-red-200'
              : 'border-primary/40 bg-primary/10 text-primary'
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="leading-relaxed">{status.message}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark/95 to-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-secondary"
            >
              <FiArrowLeft className="h-4 w-4" /> Back to portfolio
            </Link>
            <div>
              <h1 className="text-3xl font-semibold sm:text-4xl">Credential Manager</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-300 sm:text-base">
                Paste the embed code snippet provided by Credly to publish a badge instantly. Every addition updates the
                home page while preserving the existing design.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300 sm:max-w-xs">
            <p className="font-semibold text-primary">Quick tips</p>
            <ul className="mt-3 space-y-2 text-xs text-gray-400">
              <li>Use the “Copy embed code” button on Credly, then paste it below.</li>
              <li>The script will verify that Credly loaded the badge successfully.</li>
              <li>You can remove badges at any time—the main site syncs automatically.</li>
            </ul>
          </div>
        </header>

        <form
          onSubmit={handleAddBadge}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Add a Credly embed</h2>
              <p className="text-sm text-gray-400">
                Paste the embed HTML from Credly, choose where it should appear, and confirm the preview below.
              </p>
            </div>
            <FiPlusCircle className="hidden h-8 w-8 text-primary sm:block" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Credly embed code</span>
                <textarea
                  value={embedInput}
                  onChange={(event) => setEmbedInput(event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Paste the full <div> embed snippet from Credly here."
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Certificate name</span>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(event) => setTitleInput(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Optional — overrides the title detected from Credly"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Issuing provider</span>
                  <input
                    type="text"
                    value={issuerInput}
                    onChange={(event) => setIssuerInput(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Optional — e.g. Cisco, AWS Academy"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-4">
              <label>
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Category</span>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value as CredlyCategory)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-500">{sectionDescriptions[selectedCategory]}</p>
              </label>

              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40"
              >
                <FiPlusCircle className="h-4 w-4" />
                {isProcessing ? 'Working…' : 'Add badge'}
              </button>

              <StatusMessage />
            </div>
          </div>
        </form>

        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Custom badges</h2>
              <p className="text-sm text-gray-400">
                Badges added here sync to the main portfolio experience. Deleting them removes them everywhere.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/70">
              {customBadges.length} active {customBadges.length === 1 ? 'badge' : 'badges'}
            </span>
          </div>

          {customBadges.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-gray-400">
              No custom Credly embeds yet. Paste a snippet above to publish your first badge.
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {customBadges.map((badge) => (
                <div
                  key={badge.badgeId}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 via-dark/40 to-dark/60 p-6 shadow-lg shadow-black/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60">
                        {badge.category === 'certification' ? 'Certification' : 'Badge'}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {badge.title ?? 'Credly Badge'}
                      </h3>
                      {badge.issuer ? (
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary/70">
                          {badge.issuer}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs text-gray-500">Added {formatDateTime(badge.createdAt)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteBadge(badge)}
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/30 p-2 text-gray-400 transition hover:border-red-400/50 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Delete ${badge.title ?? 'Credly badge'}`}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex grow items-center justify-center rounded-xl border border-white/10 bg-black/30 p-4">
                    {createCredlyBadgeElement(badge)}
                  </div>

                  <a
                    href={`https://www.credly.com/badges/${badge.badgeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium uppercase tracking-wide text-primary transition hover:text-secondary"
                  >
                    View on Credly
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold text-white">Default portfolio badges</h2>
          <p className="mt-2 text-sm text-gray-400">
            These badges ship with the site and cannot be removed here. They are listed for reference when checking for
            duplicates.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {credlyBadges.map((badge) => (
              <div
                key={badge.badgeId}
                className="rounded-2xl border border-white/10 bg-dark/60 p-4 text-sm text-gray-400"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60">
                  {badge.category === 'certification' ? 'Certification' : 'Badge'}
                </p>
                <p className="mt-2 font-semibold text-white">{badge.title ?? 'Credly Badge'}</p>
                {badge.issuer ? <p className="text-xs text-gray-500">{badge.issuer}</p> : null}
                <p className="mt-4 text-xs text-gray-500">Badge ID: {badge.badgeId}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
