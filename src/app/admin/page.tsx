'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiAward, FiLayers, FiPlusCircle, FiRefreshCcw, FiTrash2 } from 'react-icons/fi'
import Link from 'next/link'
import {
  Achievement,
  AchievementKind,
  AchievementStatus,
  badgeData,
  certificateData,
  defaultCategories,
} from '../../lib/achievements'

interface AchievementForm extends Omit<Achievement, 'kind'> {
  kind: AchievementKind
}

const initialFormState: AchievementForm = {
  kind: 'certificate',
  title: '',
  issuer: '',
  date: '',
  status: 'earned',
  category: defaultCategories[0] ?? 'General',
  takeaway: '',
  imageUrl: '',
  previewUrl: '',
  credentialUrl: '',
  pdfUrl: '',
  verificationNote: '',
}

const statusOptions: { label: string; value: AchievementStatus; helper: string }[] = [
  {
    label: 'Earned',
    value: 'earned',
    helper: 'Use for certifications and badges that are fully complete and verifiable.',
  },
  {
    label: 'Upcoming',
    value: 'upcoming',
    helper: 'Reserve space for milestones that are in progress or planned.',
  },
]

const tabCopy: Record<AchievementKind, { title: string; helper: string }> = {
  certificate: {
    title: 'Certifications',
    helper: 'Track accredited certifications, bootcamps, or intensive courses.',
  },
  badge: {
    title: 'Badges',
    helper: 'Capture micro-credentials and lightweight recognitions.',
  },
}

const FieldLabel = ({ label, helper }: { label: string; helper?: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-white">{label}</span>
    {helper ? <span className="text-xs text-gray-400">{helper}</span> : null}
  </div>
)

const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${className ?? ''}`.trim()}
  />
)

const TextArea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${className ?? ''}`.trim()}
  />
)

const TabButton = ({
  isActive,
  children,
  onClick,
}: {
  isActive: boolean
  children: React.ReactNode
  onClick: () => void
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm uppercase tracking-wide transition-colors ${
      isActive
        ? 'border-primary bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(59,130,246,0.35)]'
        : 'border-white/10 bg-dark text-gray-300 hover:border-primary/50 hover:text-primary'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.button>
)

const PreviewCard = ({
  achievement,
  onDelete,
}: {
  achievement: Achievement
  onDelete: (achievement: Achievement) => void
}) => {
  const isUpcoming = achievement.status === 'upcoming'

  return (
    <motion.article
      layout
      className="rounded-lg border border-white/10 bg-white/[0.03] p-4 shadow-lg"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-primary">{achievement.category}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{achievement.title}</h3>
          <p className="text-xs text-gray-400">{achievement.issuer}</p>
        </div>
        <div className="flex flex-col items-end gap-2 self-end sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide leading-none ${
              isUpcoming
                ? 'border border-primary/40 text-primary/80'
                : 'border border-emerald-400/40 text-emerald-300'
            }`}
          >
            {isUpcoming ? 'Upcoming' : 'Earned'}
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Remove ${achievement.title}? This only updates the preview list.`)) {
                onDelete(achievement)
              }
            }}
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] p-2 text-gray-400 transition hover:border-red-400/60 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 focus-visible:ring-0 sm:relative sm:z-10"
            aria-label={`Delete ${achievement.title}`}
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400">{achievement.date}</p>
      {achievement.takeaway ? (
        <p className="mt-3 text-sm text-gray-300">{achievement.takeaway}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3 text-[11px] uppercase tracking-wide text-gray-500">
        {achievement.previewUrl ? <span>Preview</span> : null}
        {achievement.credentialUrl ? <span>Credential Link</span> : null}
        {achievement.pdfUrl ? <span>PDF</span> : null}
        {achievement.verificationNote ? <span>Verification Note</span> : null}
      </div>
    </motion.article>
  )
}

export default function AdminPage() {
  const [form, setForm] = useState<AchievementForm>(initialFormState)
  const [certifications, setCertifications] = useState<Achievement[]>(certificateData)
  const [badges, setBadges] = useState<Achievement[]>(badgeData)
  const [categories, setCategories] = useState<string[]>(defaultCategories)
  const [newCategory, setNewCategory] = useState('')
  const [activeTab, setActiveTab] = useState<AchievementKind>('certificate')

  const makeKey = (achievement: Achievement) =>
    [achievement.kind, achievement.title, achievement.issuer, achievement.date].join('::')

  useEffect(() => {
    if (!categories.includes(form.category)) {
      setForm((prev) => ({ ...prev, category: categories[0] ?? 'General' }))
    }
  }, [categories, form.category])

  const previewItems = activeTab === 'certificate' ? certifications : badges

  const handleDelete = (achievement: Achievement) => {
    if (achievement.kind === 'certificate') {
      setCertifications((prev) => prev.filter((item) => makeKey(item) !== makeKey(achievement)))
      return
    }

    setBadges((prev) => prev.filter((item) => makeKey(item) !== makeKey(achievement)))
  }

  const addCategory = () => {
    const value = newCategory.trim()
    if (!value) return
    if (!categories.some((cat) => cat.toLowerCase() === value.toLowerCase())) {
      setCategories((prev) => [...prev, value])
    }
    setForm((prev) => ({ ...prev, category: value }))
    setNewCategory('')
  }

  const resetForm = () => {
    setForm((prev) => ({
      ...initialFormState,
      category: categories[0] ?? 'General',
      kind: prev.kind,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload: Achievement = {
      ...form,
      takeaway: form.takeaway?.trim() ? form.takeaway : undefined,
      imageUrl: form.imageUrl?.trim() ? form.imageUrl : undefined,
      previewUrl: form.previewUrl?.trim() ? form.previewUrl : undefined,
      credentialUrl: form.credentialUrl?.trim() ? form.credentialUrl : undefined,
      pdfUrl: form.pdfUrl?.trim() ? form.pdfUrl : undefined,
      verificationNote: form.verificationNote?.trim() ? form.verificationNote : undefined,
    }

    if (form.kind === 'certificate') {
      setCertifications((prev) => [payload, ...prev])
    } else {
      setBadges((prev) => [payload, ...prev])
    }

    resetForm()
    setActiveTab(form.kind)
  }

  const isUpcoming = form.status === 'upcoming'

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-dark-lighter py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            <div className="flex items-center justify-center gap-3 text-primary">
              <FiLayers className="h-6 w-6" />
              <span className="text-sm uppercase tracking-[0.4em] text-primary/80">
                Admin Toolkit
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Achievement Management Hub
            </h1>
            <p className="text-sm text-gray-400 sm:text-base">
              This tucked-away dashboard lets you organise certifications and badges without exposing the controls publicly. Add new achievements, reserve upcoming slots, and keep categories tidy for the main portfolio page.
            </p>
            <div className="text-xs text-gray-500">
              <span className="font-medium text-primary">Heads up:</span> This page is intentionally hidden from navigation. Bookmark it for quick access when you need to update your achievements.
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <motion.form
            layout
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Add a new achievement</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FiPlusCircle className="h-4 w-4 text-primary" />
                <span>Fields marked optional can be left blank.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {(Object.keys(tabCopy) as AchievementKind[]).map((key) => (
                <TabButton
                  key={key}
                  isActive={form.kind === key}
                  onClick={() => setForm((prev) => ({ ...prev, kind: key }))}
                >
                  <FiAward className="h-4 w-4" />
                  {tabCopy[key].title}
                </TabButton>
              ))}
            </div>
            <p className="text-xs text-gray-500">{tabCopy[form.kind].helper}</p>

            <div className="grid gap-5">
              <div className="grid gap-2">
                <FieldLabel label="Title" />
                <Input
                  required
                  placeholder="e.g. CCNP Enterprise"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel label="Issuer" />
                <Input
                  required
                  placeholder="Organisation or platform"
                  value={form.issuer}
                  onChange={(event) => setForm((prev) => ({ ...prev, issuer: event.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel label="Date" helper="Use a friendly format (e.g. June 2025 or Q3 2025)." />
                <Input
                  required
                  placeholder="June 2025"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <FieldLabel
                  label="Category"
                  helper="Keep related achievements grouped together on the public page."
                />
                <div className="flex flex-col gap-3">
                  <select
                    value={form.category}
                    onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      placeholder="Add new category"
                      value={newCategory}
                      onChange={(event) => setNewCategory(event.target.value)}
                      className="min-w-[12rem] flex-1"
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="rounded-md border border-primary/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/10"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <FieldLabel label="Status" helper="Switch to upcoming to reserve a placeholder slot." />
                <div className="grid gap-3 sm:grid-cols-2">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer flex-col gap-2 rounded-xl border px-4 py-3 text-sm transition ${
                        form.status === option.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/10 bg-white/[0.02] text-gray-300 hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={form.status === option.value}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            status: event.target.value as AchievementStatus,
                          }))
                        }
                        className="hidden"
                      />
                      <span className="font-semibold uppercase tracking-wide">{option.label}</span>
                      <span className="text-xs text-gray-400">{option.helper}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <FieldLabel
                  label="Key takeaway"
                  helper="Optional highlight that explains the value of this achievement."
                />
                <TextArea
                  rows={3}
                  placeholder="Summarise what this milestone means for your growth."
                  value={form.takeaway}
                  onChange={(event) => setForm((prev) => ({ ...prev, takeaway: event.target.value }))}
                />
              </div>

              <div className="grid gap-4 rounded-xl border border-white/10 bg-dark/40 p-4">
                <span className="text-sm font-medium text-white">Verification resources</span>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <FieldLabel
                      label="Preview image URL"
                      helper={
                        isUpcoming
                          ? 'Optional for upcoming achievements.'
                          : 'Displays in the main achievements grid.'
                      }
                    />
                    <Input
                      placeholder="/images/preview/example.png"
                      value={form.previewUrl}
                      onChange={(event) => setForm((prev) => ({ ...prev, previewUrl: event.target.value }))}
                      disabled={isUpcoming}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FieldLabel label="Badge image URL" helper="Shown on the card when available." />
                    <Input
                      placeholder="/images/example.png"
                      value={form.imageUrl}
                      onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                      disabled={isUpcoming}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FieldLabel label="Credential URL" helper="Link to Credly or issuing platform." />
                    <Input
                      placeholder="https://www.credly.com/..."
                      value={form.credentialUrl}
                      onChange={(event) => setForm((prev) => ({ ...prev, credentialUrl: event.target.value }))}
                      disabled={isUpcoming}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FieldLabel label="PDF URL" helper="Direct link to certificate PDF." />
                    <Input
                      placeholder="/certifications/example.pdf"
                      value={form.pdfUrl}
                      onChange={(event) => setForm((prev) => ({ ...prev, pdfUrl: event.target.value }))}
                      disabled={isUpcoming}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <FieldLabel
                    label="Verification note"
                    helper="Optional context such as ‘Verification available on request’."
                  />
                  <Input
                    placeholder="Verification available on request."
                    value={form.verificationNote}
                    onChange={(event) => setForm((prev) => ({ ...prev, verificationNote: event.target.value }))}
                    disabled={isUpcoming}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-secondary"
              >
                <FiPlusCircle className="h-4 w-4" />
                Save achievement
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-gray-300 transition hover:border-primary/60 hover:text-primary"
              >
                <FiRefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </motion.form>

          <section className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">Live preview</h2>
                <p className="text-xs text-gray-400">
                  Review how the public grid will look before publishing any changes.
                </p>
              </div>
              <Link
                href="/"
                className="text-xs font-semibold uppercase tracking-wide text-primary underline-offset-4 hover:underline"
              >
                View portfolio
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {(Object.keys(tabCopy) as AchievementKind[]).map((key) => (
                <TabButton key={key} isActive={activeTab === key} onClick={() => setActiveTab(key)}>
                  <FiAward className="h-4 w-4" />
                  {tabCopy[key].title}
                </TabButton>
              ))}
            </div>

            {previewItems.length > 0 ? (
              <motion.div layout className="grid gap-4 md:grid-cols-2">
                <AnimatePresence>
                  {previewItems.map((achievement) => (
                    <PreviewCard
                      key={`${achievement.title}-${achievement.date}`}
                      achievement={achievement}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-dark/40 p-10 text-center text-sm text-gray-400">
                <FiAward className="h-6 w-6 text-primary" />
                <p>No achievements yet. Start by adding a new record on the left.</p>
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  )
}
