'use client'

import { motion } from 'framer-motion'
import {
  FiShield,
  FiLock,
  FiCode,
  FiCloud,
  FiSearch,
  FiAward,
  FiTerminal,
  FiUsers,
  FiTarget,
} from 'react-icons/fi'
import { fadeIn, staggerContainer } from '../lib/animations'
import Image from 'next/image'

const highlights = [
  { icon: <FiAward className="w-4 h-4" />, label: "Dean's Lister, S.Y. 2022–2025" },
  { icon: <FiUsers className="w-4 h-4" />, label: 'CSIA Officer, 5 events coordinated' },
  { icon: <FiCode className="w-4 h-4" />, label: '3 open-source security tools shipped' },
  { icon: <FiTarget className="w-4 h-4" />, label: 'Open to full-time roles' },
]

const skillCategories = [
  {
    name: 'Network Defense & Response',
    summary: 'On-the-job endpoint security and infrastructure support gained during an IT infrastructure internship.',
    skills: [
      {
        icon: <FiShield className="w-6 h-6" />,
        title: 'Endpoint Security & Monitoring',
        description:
          'Gained hands-on exposure to CrowdStrike Falcon during endpoint security deployment, including console familiarization and workflow observation in a live training environment.',
      },
      {
        icon: <FiTerminal className="w-6 h-6" />,
        title: 'Network Infrastructure Support',
        description:
          'Supported FortiGate setup concepts across LAN, WAN, DNS, and VLAN segmentation; validated basic lab topology and connectivity in a controlled training environment.',
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
      },
      {
        icon: <FiCode className="w-6 h-6" />,
        title: 'Security Development',
        description:
          'Automated password-cracking pipelines, wireless reconnaissance, and phishing simulations with Python and Bash scripting.',
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
          'Completed AWS Academy Cloud Security Builder coursework covering IAM, Security Groups, and VPC guardrails.',
      },
      {
        icon: <FiSearch className="w-6 h-6" />,
        title: 'CTF & Security Assessment',
        description:
          'Designed 8 CTF challenges and facilitated workshops that drew 120+ participants, emphasizing OSINT and IoT threat modeling.',
      },
    ],
  },
]

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
              BS Cybersecurity, Holy Angel University · Graduated April 2026
            </motion.p>
          </div>

          <div className="max-w-2xl mx-auto text-left space-y-6">
            <motion.p
              variants={fadeIn}
              className="text-gray-300 text-lg leading-relaxed"
            >
              Cybersecurity graduate with hands-on experience in endpoint security, network infrastructure support, and security-focused development, from academic research to real IT infrastructure environments.
            </motion.p>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-3"
            >
              {highlights.map((item) => (
                <motion.li
                  key={item.label}
                  variants={fadeIn}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/30"
                >
                  {item.icon}
                  {item.label}
                </motion.li>
              ))}
            </motion.ul>

            <motion.p variants={fadeIn} className="text-gray-400 leading-relaxed">
              Built <span className="text-primary font-medium">WiFi Sentinel</span>,{' '}
              <span className="text-primary font-medium">CryptoToolkit</span>, and{' '}
              <span className="text-primary font-medium">ByteBurrow</span>, three open-source
              security tools covering wireless testing, cryptography, and file analysis (see Projects below).
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
              <div className="absolute -left-8 top-2 w-6 h-6 rounded-full bg-dark border-4 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="bg-dark p-6 rounded-xl border border-primary/30 shadow-lg">
                <h4 className="text-xl font-semibold mb-2">Capstone: Detection and Mitigation of Dormant Cyber Threats in Intelligent Virtual Assistants</h4>
                <span className="text-primary text-sm mb-2 block">2025–2026</span>
                <p className="text-gray-400">
                  Built an on-device monitoring framework on Raspberry Pi 4 using TensorFlow Lite, MFCC preprocessing, VAD, and forensic logging to detect suspicious voice-trigger activity.
                </p>
              </div>
            </div>

            {/* Timeline item: IT Infrastructure Internship */}
            <div className="relative">
              <div className="absolute -left-8 top-2 w-6 h-6 rounded-full bg-dark border-4 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="bg-dark p-6 rounded-xl border border-primary/30 shadow-lg">
                <h4 className="text-xl font-semibold mb-2">IT Infrastructure Intern, Adventus IT Services Philippines</h4>
                <span className="text-primary text-sm mb-2 block">Dec 2025–Mar 2026</span>
                <p className="text-gray-400">
                  Supported endpoint security and network infrastructure workflows—Excel-based reporting for Action1 and KnowBe4, FortiGate and VLAN segmentation concepts, and CrowdStrike Falcon console familiarization.
                </p>
              </div>
            </div>

            {/* Timeline item: Graduation */}
            <div className="relative">
              <div className="absolute -left-8 top-2 w-6 h-6 rounded-full bg-dark border-4 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="bg-dark p-6 rounded-xl border border-primary/30 shadow-lg">
                <h4 className="text-xl font-semibold mb-2">Graduated BS Cybersecurity</h4>
                <span className="text-primary text-sm mb-2 block">April 2026</span>
                <p className="text-gray-400">
                  Graduated from Holy Angel University as a Dean's Lister (S.Y. 2022–2025).
                </p>
              </div>
            </div>

            {/* Timeline item: NDA contract work */}
            <div className="relative">
              <div className="absolute -left-8 top-2 w-6 h-6 rounded-full bg-dark border-4 border-cyan-400 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <div className="bg-dark p-6 rounded-xl border-2 border-cyan-400 shadow-lg">
                <h4 className="text-xl font-semibold mb-2 text-cyan-400">Contract Security Work (NDA)</h4>
                <span className="text-cyan-400 text-sm mb-2 block">2026 (Ongoing)</span>
                <p className="text-gray-300">
                  Project-based contract work for a private client under NDA—building data-collection tooling and performing malware analysis, plus light sales support.
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
                <span className="text-primary/80 text-sm mb-2 block">2026 and Beyond</span>
                <p className="text-gray-300">
                  Actively seeking a full-time, entry-level cybersecurity role—open to security operations, vulnerability management,
                  incident response, IT audit, or infrastructure security support, anywhere in the Philippines.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 