'use client'

import { motion } from 'framer-motion'
import { FiShield, FiLock, FiCode, FiCloud, FiSearch, FiAward, FiTerminal } from 'react-icons/fi'
import { fadeIn, staggerContainer } from '../lib/animations'
import Image from 'next/image'

const skillCategories = [
  {
    name: 'Network Defense & Response',
    summary: 'Hands-on incident response practice and infrastructure hardening in academic security labs.',
    skills: [
      {
        icon: <FiShield className="w-6 h-6" />,
        title: 'Network Forensics & Analysis',
        description:
          'Triaged 200+ PCAPs with Wireshark and Zeek to investigate simulated intrusions, documenting repeatable playbooks for classmates.',
        level: 'Advanced' as const,
      },
      {
        icon: <FiTerminal className="w-6 h-6" />,
        title: 'System Administration',
        description:
          'Hardened Windows Server 2016 and Debian lab environments, reducing misconfigurations by 40% across student teams through shared baselines.',
        level: 'Proficient' as const,
      },
    ],
  },
  {
    name: 'Secure Engineering',
    summary: 'Building and maintaining security-focused tooling used across coursework and community events.',
    skills: [
      {
        icon: <FiLock className="w-6 h-6" />,
        title: 'Cryptography Development',
        description:
          'Authored a reusable crypto and steganography toolkit adopted by 30+ peers for coursework and capture-the-flag training.',
        level: 'Advanced' as const,
      },
      {
        icon: <FiCode className="w-6 h-6" />,
        title: 'Security Development',
        description:
          'Automated password-cracking pipelines, wireless reconnaissance, and phishing simulations with Python and Bash scripting.',
        level: 'Proficient' as const,
      },
    ],
  },
  {
    name: 'Cloud & Assessment',
    summary: 'Extending defensive coverage into cloud and competition environments.',
    skills: [
      {
        icon: <FiCloud className="w-6 h-6" />,
        title: 'Cloud Security',
        description:
          'Implemented IAM, Security Group, and VPC guardrails for class projects on AWS, enabling compliant deployments in under 15 minutes.',
        level: 'Proficient' as const,
      },
      {
        icon: <FiSearch className="w-6 h-6" />,
        title: 'CTF & Security Assessment',
        description:
          'Designed 8 CTF challenges and facilitated workshops that drew 120+ participants, emphasizing OSINT and IoT threat modeling.',
        level: 'Advanced' as const,
      },
    ],
  },
]

const PROFICIENCY_WEIGHT = {
  Foundational: 1,
  Proficient: 2,
  Advanced: 3,
} as const

const renderLevel = (level: keyof typeof PROFICIENCY_WEIGHT) => (
  <div className="flex items-center gap-2 mt-4" aria-label={`Proficiency level: ${level}`}>
    {[1, 2, 3].map((step) => (
      <span
        key={step}
        className={`h-2 w-8 rounded-full transition-colors ${
          step <= PROFICIENCY_WEIGHT[level] ? 'bg-primary' : 'bg-gray-700'
        }`}
      />
    ))}
    <span className="text-[11px] uppercase tracking-wider text-gray-400">{level}</span>
  </div>
)

export default function About() {
  return (
    <section id="about" className="section bg-dark-lighter">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16 max-w-4xl mx-auto px-4"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-cyan-500/50 to-primary blur-lg animate-pulse-slow"></div>
              <Image
                src="/images/profilePic.jpg"
                alt="Profile photo"
                width={144}
                height={144}
                className="relative w-36 h-36 rounded-full object-cover border-4 border-primary shadow-lg shadow-primary/20"
                priority
              />
            </div>
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
            >
              Kenneth David L. Santos <span className="text-primary font-mono tracking-wider">(ynk)</span>
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-lg bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent font-semibold mb-4 tracking-wide"
            >
              BS Cybersecurity, Holy Angel University (2022–2026)
            </motion.p>
          </div>

          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <motion.p
              variants={fadeIn}
              className="prose prose-invert text-gray-300 text-lg leading-relaxed mx-auto"
            >
              Final-year cybersecurity specialist with hands-on experience in network forensics, wireless security, and cryptography. I translate classroom research into field-ready playbooks that shorten response times for student blue teams.
            </motion.p>

            <motion.div variants={fadeIn} className="space-y-2">
              <p className="text-gray-300 text-lg leading-relaxed">
                Developer of{' '}
                <span className="text-primary font-medium">WiFi Sentinel</span>,{' '}
                a wireless security testing framework,{' '}
                <span className="text-primary font-medium">CryptoToolkit</span>,{' '}
                a comprehensive encryption and steganography suite, and{' '}
                <span className="text-primary font-medium">ByteBurrow</span>,{' '}
                a file analysis toolkit.
              </p>
            </motion.div>

            <motion.p variants={fadeIn} className="text-gray-300 text-lg leading-relaxed">
              Recognized as a{' '}
              <span className="text-primary font-medium">Dean's Lister</span>{' '}
              for six consecutive terms and former officer at{' '}
              <span className="text-primary font-medium">CSIA</span>,{' '}
              where I coordinated 5 campus-wide security events and mentored first-time CTF competitors.
            </motion.p>

            <motion.p variants={fadeIn} className="text-gray-300 text-lg leading-relaxed">
              Actively exploring emerging threats and defense mechanisms, while contributing to the open-source security community.
              Passionate about turning complex security challenges into innovative, practical solutions that teammates can reuse.
            </motion.p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="my-20 flex items-center justify-center">
          <div className="w-full max-w-4xl flex items-center gap-4">
            <div className="h-px bg-primary/30 flex-grow"></div>
            <div className="text-primary/60 text-sm font-semibold uppercase tracking-wider">Technical Skills</div>
            <div className="h-px bg-primary/30 flex-grow"></div>
          </div>
        </div>

        <div className="space-y-20">
          {skillCategories.map((category) => (
            <div key={category.name}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="mb-8 text-center"
              >
                <h3 className="text-2xl font-semibold mb-2 text-primary">{category.name}</h3>
                <p className="text-gray-400 max-w-2xl mx-auto">{category.summary}</p>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill.title}
                    variants={fadeIn}
                    className="card group hover:border-primary/50 border border-transparent"
                  >
                    <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                      {skill.icon}
                    </div>
                    <h4 className="text-xl font-semibold mb-2">{skill.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{skill.description}</p>
                    {renderLevel(skill.level)}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-20 flex items-center justify-center">
          <div className="w-full max-w-4xl flex items-center gap-4">
            <div className="h-px bg-primary/30 flex-grow"></div>
            <div className="text-primary/60 text-sm font-semibold uppercase tracking-wider">Experience</div>
            <div className="h-px bg-primary/30 flex-grow"></div>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mt-16 max-w-2xl mx-auto relative"
        >
          {/* Timeline vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-primary/30 rounded-full" />
          <div className="space-y-12 pl-16">
            {/* Timeline item 1 */}
            <div className="relative">
              <div className="absolute -left-8 top-2 w-6 h-6 rounded-full bg-dark border-4 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="bg-dark p-6 rounded-xl border border-primary/30 shadow-lg">
                <h4 className="text-xl font-semibold mb-2">BS Cybersecurity Student</h4>
                <span className="text-primary text-sm mb-2 block">2022–2026</span>
                <p className="text-gray-400">
                  Currently studying at Holy Angel University, expected to graduate in 2026. Dean's Lister and previously served as an officer in CSIA, the university's cybersecurity organization.
                </p>
              </div>
            </div>
            {/* Timeline item: CSIA Member & CTF/Workshop Participant */}
            <div className="relative">
              <div className="absolute -left-8 top-2 w-6 h-6 rounded-full bg-dark border-4 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="bg-dark p-6 rounded-xl border border-primary/30 shadow-lg">
                <h4 className="text-xl font-semibold mb-2">CSIA Member & CTF/Workshop Participant</h4>
                <span className="text-primary text-sm mb-2 block">2023–2024</span>
                <p className="text-gray-400">
                  Became an active member of CSIA, the university's cybersecurity organization, and participated in Capture The Flag competitions and cybersecurity workshops.
                </p>
              </div>
            </div>
            {/* Timeline item 3 */}
            <div className="relative">
              <div className="absolute -left-8 top-2 w-6 h-6 rounded-full bg-dark border-4 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="bg-dark p-6 rounded-xl border border-primary/30 shadow-lg">
                <h4 className="text-xl font-semibold mb-2">CSIA Officer & CTF Challenge Creator</h4>
                <span className="text-primary text-sm mb-2 block">2024–2025 <span className="text-gray-400">(Term Ended)</span></span>
                <p className="text-gray-400">
                  Served as an officer and CTF challenge creator for CSIA, organizing and leading cybersecurity events, creating CTF challenges, and fostering a collaborative learning environment for aspiring security professionals.
                </p>
              </div>
            </div>
            {/* Timeline item 4 - Capstone */}
            <div className="relative">
              <div className="absolute -left-8 top-2 w-6 h-6 rounded-full bg-dark border-4 border-cyan-400 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <div className="bg-dark p-6 rounded-xl border-2 border-cyan-400 shadow-lg">
                <h4 className="text-xl font-semibold mb-2 text-cyan-400">Preparing for Capstone Project</h4>
                <span className="text-cyan-400 text-sm mb-2 block">2025 (Ongoing)</span>
                <p className="text-gray-300">
                  Currently preparing for my capstone project, focusing on applying my cybersecurity knowledge and skills to a real-world challenge. Excited to innovate, collaborate, and make a meaningful impact before graduation.
                </p>
              </div>
            </div>

            {/* Future Goals */}
            <div className="relative">
              <div className="absolute -left-8 top-2 w-6 h-6 rounded-full bg-dark border-4 border-primary/50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="bg-dark p-6 rounded-xl border border-primary/30 shadow-lg bg-gradient-to-b from-dark to-dark/50">
                <h4 className="text-xl font-semibold mb-2 text-primary">Looking Ahead</h4>
                <span className="text-primary/80 text-sm mb-2 block">2025 and Beyond</span>
                <p className="text-gray-300">
                  Pursuing industry certifications and expanding expertise across offensive security, cloud infrastructure, 
                  and emerging technologies. Committed to advancing the field through continuous learning, innovative tool 
                  development, and active participation in the cybersecurity community.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 