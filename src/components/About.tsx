'use client'

import { motion } from 'framer-motion'
import { FiShield, FiLock, FiCode, FiServer, FiCloud, FiSearch, FiAward, FiTerminal } from 'react-icons/fi'
import { fadeIn, staggerContainer } from '../lib/animations'
import Image from 'next/image'

const skills = [
  {
    icon: <FiShield className="w-6 h-6" />,
    title: 'Network Forensics & Analysis',
    description: 'Network traffic analysis, packet inspection using Wireshark, incident investigation, and PCAP analysis for threat detection',
  },
  {
    icon: <FiCloud className="w-6 h-6" />,
    title: 'Cloud Security',
    description: 'AWS security implementation including IAM, Security Groups, VPC configuration, and secure web application deployment',
  },
  {
    icon: <FiLock className="w-6 h-6" />,
    title: 'Cryptography Development',
    description: 'Developed comprehensive cryptographic toolkit featuring encryption, steganography, and secure password management systems',
  },
  {
    icon: <FiTerminal className="w-6 h-6" />,
    title: 'System Administration',
    description: 'Windows Server 2016 security hardening, Linux system administration, and implementation of robust access control policies',
  },
  {
    icon: <FiSearch className="w-6 h-6" />,
    title: 'CTF & Security Assessment',
    description: 'Created and solved CTF challenges in steganography and OSINT, experienced in IoT security testing and vulnerability assessment',
  },
  {
    icon: <FiCode className="w-6 h-6" />,
    title: 'Security Development',
    description: 'Python-based security tool development, specializing in cryptographic implementations and steganography solutions',
  }
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
              BS Cybersecurity, Holy Angel University (2021–2025)
            </motion.p>
          </div>

          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <motion.p 
              variants={fadeIn}
              className="prose prose-invert text-gray-300 text-lg leading-relaxed mx-auto"
            >
              Final-year cybersecurity specialist with hands-on experience in network forensics, wireless security, and cryptography.
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
              for academic excellence and former officer at{' '}
              <span className="text-primary font-medium">CSIA</span>,{' '}
              focusing on practical security research and tool development.
            </motion.p>

            <motion.p variants={fadeIn} className="text-gray-300 text-lg leading-relaxed">
              Actively exploring emerging threats and defense mechanisms, while contributing to the open-source security community. 
              Passionate about turning complex security challenges into innovative, practical solutions.
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              variants={fadeIn}
              className={
                skills.length % 3 !== 0 && index === skills.length - 1
                  ? "card group hover:border-primary/50 border border-transparent col-span-3 mx-auto"
                  : "card group hover:border-primary/50 border border-transparent"
              }
            >
              <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                {skill.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
              <p className="text-gray-400">{skill.description}</p>
            </motion.div>
          ))}
        </motion.div>

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