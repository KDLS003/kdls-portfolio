'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiAward, FiExternalLink, FiFileText } from 'react-icons/fi'
import Image from 'next/image'
import { fadeIn, staggerContainer } from '../lib/animations'
import {
  Achievement,
  badgeData,
  certificateData,
} from '../lib/achievements'

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const isUpcoming = achievement.status === 'upcoming'
  const hasPreview = Boolean(achievement.previewUrl)

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 16 }}
      className={`card group relative flex h-full flex-col border transition-colors ${
        isUpcoming
          ? 'border-dashed border-primary/40 bg-dark/40'
          : 'border-transparent hover:border-primary/50'
      }`}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <span
          className={`px-2 py-1 text-[11px] uppercase tracking-wider rounded-full ${
            isUpcoming
              ? 'border border-primary/40 text-primary/80'
              : 'border border-primary/40 text-primary/90'
          }`}
        >
          {achievement.category}
        </span>
        <div className="flex items-center gap-2 text-primary">
          <FiAward className="w-5 h-5 sm:w-6 sm:h-6" />
          <p className="text-gray-400 text-xs sm:text-sm">{achievement.issuer}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {achievement.imageUrl && achievement.status === 'earned' ? (
            <div className="relative h-8 w-8">
              <Image
                src={achievement.imageUrl}
                alt={`${achievement.title} badge`}
                fill
                className="object-contain"
                loading="lazy"
              />
            </div>
          ) : (
            <FiAward className="h-5 w-5" />
          )}
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">{achievement.title}</h3>
          <p className="text-xs text-gray-400 sm:text-sm">
            {isUpcoming ? 'Details will be added soon.' : achievement.kind === 'badge' ? 'Digital badge' : 'Certification'}
          </p>
        </div>
      </div>
      <div className="mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-white/5 sm:h-48 md:h-56">
        {hasPreview ? (
          <div className="relative h-full w-full">
            <Image
              src={achievement.previewUrl!}
              alt={`${achievement.title} preview`}
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
            <FiAward className="h-8 w-8 text-primary/60" />
            <span className="text-sm">Preview coming soon</span>
          </div>
        )}
      </div>
      {achievement.takeaway && (
        <p className="text-gray-400 text-sm leading-relaxed">{achievement.takeaway}</p>
      )}
      <div className="mt-6 flex items-center justify-between text-xs text-gray-400 sm:text-sm">
        <span>{achievement.date}</span>
        {achievement.status === 'earned' ? (
          achievement.credentialUrl ? (
            <motion.a
              href={achievement.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiExternalLink className="h-5 w-5" />
            </motion.a>
          ) : achievement.pdfUrl ? (
            <motion.a
              href={achievement.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiFileText className="h-5 w-5" />
            </motion.a>
          ) : achievement.verificationNote ? (
            <span className="uppercase tracking-wider text-[11px]">{achievement.verificationNote}</span>
          ) : null
        ) : (
          <span className="uppercase tracking-wider text-[11px] text-primary/70">In progress</span>
        )}
      </div>
    </motion.article>
  )
}

const AchievementSection = ({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: Achievement[]
}) => {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  )
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0])

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0])
    }
  }, [categories, selectedCategory])

  const filteredItems = useMemo(
    () =>
      selectedCategory === 'All'
        ? items
        : items.filter((achievement) => achievement.category === selectedCategory),
    [items, selectedCategory],
  )

  return (
    <section className="mb-12 sm:mb-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="mb-6 text-center"
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-400 sm:text-base">{description}</p>
      </motion.div>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {categories.map((category) => {
          const isActive = category === selectedCategory

          return (
            <motion.button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors sm:text-sm ${
                isActive
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(59,130,246,0.35)]'
                  : 'border-white/10 bg-dark text-gray-300 hover:border-primary/50 hover:text-primary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={isActive}
            >
              {category}
            </motion.button>
          )
        })}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {filteredItems.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((achievement) => (
                <AchievementCard key={achievement.title} achievement={achievement} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 bg-dark/60 p-6 text-center text-sm text-gray-400 sm:p-8 sm:text-base">
            No achievements in this category yet—check back soon!
          </div>
        )}
      </motion.div>
    </section>
  )
}

export default function Certifications() {
  return (
    <section id="certifications" className="section bg-dark-lighter">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Certifications & Badges</h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
            Professional milestones organised for clarity—dive into earned certifications and explore digital badges at a glance.
          </p>
        </motion.div>

        <AchievementSection
          title="Professional Certifications"
          description="Accredited credentials backed by verifiable coursework and assessments."
          items={certificateData}
        />

        <AchievementSection
          title="Digital Badges"
          description="Micro-credentials highlighting specialised skills and ongoing learning initiatives."
          items={badgeData}
        />

        <div className="text-center mt-10 sm:mt-12 text-gray-400 text-sm sm:text-base">
          Visit my{' '}
          <a
            href="https://www.credly.com/users/kenneth-david-santos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Credly profile
          </a>{' '}
          for the full list of achievements.
        </div>
      </div>
    </section>
  )
}