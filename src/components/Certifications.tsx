"use client";

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '../lib/animations'
import { credlyBadges } from '../lib/credly'
import type { CredlyCategory } from '../lib/credly'
import { ensureCredlyScript, reinitializeCredlyEmbeds } from '../lib/credlyScript'
import CredlyEmbedFrame from './CredlyEmbedFrame'

const MotionSection = motion.section;
const MotionLink = motion.a;

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

const trainingBadges = credlyBadges.filter((badge) => badge.category === 'training')

export default function Certifications() {
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
          const items = credlyBadges.filter((badge) => badge.category === section.filter)

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
                    <MotionLink
                      key={badge.badgeId}
                      href={`https://www.credly.com/badges/${badge.badgeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
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
                        <CredlyEmbedFrame badgeId={badge.badgeId} />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wide text-primary transition group-hover:text-secondary">
                        View on Credly
                      </span>
                    </MotionLink>
                  )
                })}
              </div>
            </MotionSection>
          )
        })}

        {trainingBadges.length > 0 && (
          <MotionSection
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="mb-16"
          >
            <div className="mx-auto mb-8 max-w-3xl text-center">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">Fortinet Security Academy</h3>
              <p className="mt-3 text-sm text-gray-400 sm:text-base">
                Foundational cybersecurity training track, {trainingBadges.length} modules completed.
              </p>
            </div>

            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
              {trainingBadges.map((badge) => (
                <a
                  key={badge.badgeId}
                  href={`https://www.credly.com/badges/${badge.badgeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm text-primary transition hover:border-primary/60 hover:bg-primary/20"
                >
                  {badge.title ?? 'Credly Badge'}
                </a>
              ))}
            </div>
          </MotionSection>
        )}

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
