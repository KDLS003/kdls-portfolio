"use client";

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '../lib/animations'
import {
  CUSTOM_CREDLY_STORAGE_KEY,
  credlyBadges,
  loadStoredCredlyEmbeds,
  sortStoredCredlyEmbeds,
  toCredlyEmbeds,
} from '../lib/credly'
import type { CredlyCategory, CredlyEmbed, StoredCredlyEmbed } from '../lib/credly'
import { ensureCredlyScript, reinitializeCredlyEmbeds } from '../lib/credlyScript'
import CredlyEmbedFrame from './CredlyEmbedFrame'

const MotionSection = motion.section;
const MotionArticle = motion.article;

const sections = [
  {
    title: 'Professional Certifications',
    description:
      'Industry-recognised credentials earned through rigorous assessments and hands-on validation.',
    filter: 'certification' as CredlyCategory,
  },
  {
    title: 'Digital Badges & Challenges',
    description:
      'Micro-credentials and competitive challenges that highlight continued learning and practical expertise.',
    filter: 'badge' as CredlyCategory,
  },
]

const badgeCardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

const mapStoredEmbeds = (stored: StoredCredlyEmbed[]): CredlyEmbed[] =>
  toCredlyEmbeds(sortStoredCredlyEmbeds(stored))

export default function Certifications() {
  const [customBadges, setCustomBadges] = useState<CredlyEmbed[]>([])

  useEffect(() => {
    const updateFromStorage = () => {
      const stored = loadStoredCredlyEmbeds()
      setCustomBadges(mapStoredEmbeds(stored))
    }

    updateFromStorage()

    const handleStorage = (event: StorageEvent) => {
      if (!event.key) return
      if (event.key !== CUSTOM_CREDLY_STORAGE_KEY) return

      updateFromStorage()
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    ensureCredlyScript()
      .then(() => {
        if (!isActive) return
        reinitializeCredlyEmbeds()
      })
      .catch((error) => {
        console.error('Failed to load Credly embed script', error)
      })

    return () => {
      isActive = false
    }
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

  const allBadges = useMemo(() => [...credlyBadges, ...customBadges], [customBadges])

  return (
    <section id="certifications" className="section bg-dark-lighter">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="mb-12 text-center"
        >
          <h2 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Certifications &amp; Badges</h2>
          <p className="text-gray-300 mx-auto mt-4 max-w-3xl text-sm sm:text-base">
            Explore verifiable digital credentials issued via Credly. Each badge is embedded directly from the
            issuing authority, ensuring authenticity while aligning with the site&apos;s polished presentation.
          </p>
        </motion.div>

        {sections.map((section) => {
          const items = allBadges.filter((badge) => badge.category === section.filter)

          return (
            <MotionSection
              key={section.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="mb-16"
            >
              <div className="mx-auto mb-8 max-w-3xl text-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">{section.title}</h3>
                <p className="mt-3 text-sm text-gray-400 sm:text-base">{section.description}</p>
              </div>

              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
                {items.map((badge) => {
                  const badgeTitle = badge.title ?? 'Credly Badge'

                  return (
                    <MotionArticle
                      key={badge.badgeId}
                      variants={badgeCardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      className="group relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 via-dark/30 to-dark/40 p-6 shadow-lg shadow-black/10 backdrop-blur-sm transition hover:border-primary/60 hover:shadow-primary/20"
                    >
                      <div>
                        {badge.issuer ? (
                          <p className="text-xs uppercase tracking-[0.3em] text-primary/70">{badge.issuer}</p>
                        ) : null}
                        <h4 className="mt-3 text-lg font-semibold text-white sm:text-xl">{badgeTitle}</h4>
                      </div>
                      <div className="relative flex grow items-center justify-center rounded-xl border border-white/10 bg-black/20 p-4">
                        <CredlyEmbedFrame badgeId={badge.badgeId} embedHtml={badge.embedHtml} />
                      </div>
                      <a
                        href={`https://www.credly.com/badges/${badge.badgeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium uppercase tracking-wide text-primary transition group-hover:text-secondary"
                      >
                        View on Credly
                      </a>
                    </MotionArticle>
                  )
                })}
              </div>
            </MotionSection>
          )
        })}

        <div className="text-center text-gray-400 text-sm sm:text-base">
          For a comprehensive credential history, visit my{' '}
          <a
            href="https://www.credly.com/users/kenneth-david-santos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline decoration-primary/60 decoration-2 underline-offset-4 transition hover:text-secondary"
          >
            Credly profile
          </a>
          .
        </div>
      </div>
    </section>
  )
}
