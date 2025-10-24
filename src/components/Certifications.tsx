'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '../lib/animations'

type CredlyCategory = 'certification' | 'badge'

type CredlyBadge = {
  title: string
  issuer: string
  badgeId: string
  category: CredlyCategory
}

declare global {
  interface Window {
    Credly?: {
      Tracker?: {
        init?: () => void
      }
    }
  }
}

const credlyBadges: CredlyBadge[] = [
  {
    title: 'Cisco Certificate in Ethical Hacking',
    issuer: 'Cisco',
    badgeId: '0d215f80-e5e7-456a-b72b-c09fc9be56a9',
    category: 'certification',
  },
  {
    title: 'Offensive Security Capture the Flag - Operation SMB Exploit',
    issuer: 'Offensive Security',
    badgeId: '786bdf71-3683-4ece-87c7-de90f4cce300',
    category: 'certification',
  },
  {
    title: 'CompTIA IT Fundamentals+ (ITF+)',
    issuer: 'CompTIA',
    badgeId: '36adc4b9-65c8-4355-9998-b9ef00f8219a',
    category: 'certification',
  },
  {
    title: 'Fortinet Certified Associate Cybersecurity',
    issuer: 'Fortinet',
    badgeId: '4d6e82bd-7017-4f13-8680-38922ce466fe',
    category: 'certification',
  },
  {
    title: 'Fortinet FortiGate 7.6 Operator',
    issuer: 'Fortinet',
    badgeId: '7803dc94-e30f-4e4a-b78c-b76e322b3e24',
    category: 'certification',
  },
  {
    title: 'Ethical Hacker',
    issuer: 'Certiport',
    badgeId: 'a1cb42eb-783c-462a-ab49-f284c7f0b356',
    category: 'certification',
  },
  {
    title: 'CCNA: Enterprise Networking, Security, and Automation',
    issuer: 'Cisco',
    badgeId: 'c3abddc5-2676-415a-9869-03068e42a2e6',
    category: 'certification',
  },
  {
    title: 'English for IT 1',
    issuer: 'Cisco',
    badgeId: '6a7b0e9e-6f25-4352-97a8-542f9f5f8b1a',
    category: 'badge',
  },
  {
    title: 'AWS Academy Graduate – Cloud Security Foundations',
    issuer: 'AWS Academy',
    badgeId: '0825997e-fb13-49e6-82ef-f1e151803123',
    category: 'badge',
  },
  {
    title: 'Introduction to Modern AI',
    issuer: 'Cisco',
    badgeId: 'aeacf824-5ad5-489a-9bd4-34bbf8c38efd',
    category: 'badge',
  },
  {
    title: 'Networking Academy Learn-A-Thon 2025',
    issuer: 'Cisco',
    badgeId: '013dd79e-503e-45c7-b5d5-b29dee83d61e',
    category: 'badge',
  },
]

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

export default function Certifications() {
  useEffect(() => {
    const scriptSrc = 'https://cdn.credly.com/assets/utilities/embed.js'
    const handleScriptLoad = () => {
      window.Credly?.Tracker?.init?.()
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${scriptSrc}"]`)

    if (existingScript) {
      if (window.Credly) {
        handleScriptLoad()
      } else {
        existingScript.addEventListener('load', handleScriptLoad)
      }

      return () => {
        existingScript.removeEventListener('load', handleScriptLoad)
      }
    }

    const script = document.createElement('script')
    script.src = scriptSrc
    script.async = true
    script.addEventListener('load', handleScriptLoad)
    document.body.appendChild(script)

    return () => {
      script.removeEventListener('load', handleScriptLoad)
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
            <motion.section
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
                {items.map((badge) => (
                  <motion.article
                    key={badge.badgeId}
                    variants={badgeCardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="group relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 via-dark/30 to-dark/40 p-6 shadow-lg shadow-black/10 backdrop-blur-sm transition hover:border-primary/60 hover:shadow-primary/20"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-primary/70">{badge.issuer}</p>
                      <h4 className="mt-3 text-lg font-semibold text-white sm:text-xl">{badge.title}</h4>
                    </div>
                    <div className="relative flex grow items-center justify-center rounded-xl border border-white/10 bg-black/20 p-4">
                      <div className="credly-badge-frame w-full max-w-[340px]">
                        <div
                          className="credly-badge block h-[340px] w-full"
                          data-iframe-width="340"
                          data-iframe-height="340"
                          data-hide-footer="true"
                        data-share-badge-id={badge.badgeId}
                          data-share-badge-host="https://www.credly.com"
                        />
                      </div>
                    </div>
                    <a
                      href={`https://www.credly.com/badges/${badge.badgeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium uppercase tracking-wide text-primary transition group-hover:text-secondary"
                    >
                      View on Credly
                    </a>
                  </motion.article>
                ))}
              </div>
            </motion.section>
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
