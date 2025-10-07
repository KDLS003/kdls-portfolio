'use client'

import { motion } from 'framer-motion'
import {
  FiMail,
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiCalendar,
  FiClock,
  FiInfo,
} from 'react-icons/fi'
import { fadeIn } from '../lib/animations'

const contactHighlights = [
  {
    icon: <FiCalendar className="w-5 h-5 text-primary" />,
    label: 'Availability',
    value: 'Open to cybersecurity internships and part-time roles starting August 2025.',
  },
  {
    icon: <FiClock className="w-5 h-5 text-primary" />,
    label: 'Response Time',
    value: 'Typically replies within 24 hours during UTC+8 business hours.',
  },
  {
    icon: <FiInfo className="w-5 h-5 text-primary" />,
    label: 'Contact Preference',
    value: 'Email is the fastest way to reach me—direct messages route to the inbox below.',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Contact</h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
            I'm always open to new opportunities, collaborations, or just a chat about cybersecurity and tech.<br className="hidden sm:inline" />
            Prefer email? Great—reaching out below sends your note straight to my inbox.
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          {contactHighlights.map((item) => (
            <div key={item.label} className="card border border-primary/20 bg-dark-lighter/40">
              <div className="flex items-start gap-3">
                {item.icon}
                <div>
                  <p className="text-xs uppercase tracking-wider text-primary/80">{item.label}</p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <motion.a
            href="mailto:kennethsantos003@gmail.com"
            className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg text-primary hover:underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiMail className="w-5 h-5 sm:w-6 sm:h-6" />
            kennethsantos003@gmail.com
          </motion.a>
          <div className="flex gap-4 sm:gap-6 justify-center">
            <motion.a
              href="https://github.com/KDLS003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl sm:text-2xl text-gray-400 hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiGithub />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/kenneth-santos-26727a211/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl sm:text-2xl text-gray-400 hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiLinkedin />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/kdls.ynk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl sm:text-2xl text-gray-400 hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiInstagram />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
} 