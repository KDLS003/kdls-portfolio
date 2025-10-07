'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiDownload } from 'react-icons/fi'
import { fadeIn } from '../lib/animations'

export default function Footer() {
  return (
    <footer className="bg-dark-lighter py-8 sm:py-12">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center"
        >
          <div className="flex justify-center space-x-4 sm:space-x-6 mb-6 sm:mb-8 items-center">
            <motion.a
              href="https://github.com/KDLS003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiGithub className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/kenneth-santos-26727a211/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiLinkedin className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.a>
            <motion.a
              href="mailto:kennethsantos003@gmail.com"
              className="text-gray-400 hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiMail className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.a>
            <motion.a
              href="/resume-placeholder.pdf"
              download
              className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors ml-2 sm:ml-4 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary border border-transparent hover:border-primary bg-transparent text-sm sm:text-base"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              style={{ height: '32px' }}
            >
              <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium hidden sm:inline">Download my CV here!</span>
              <span className="font-medium sm:hidden">Download CV</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </motion.a>
          </div>

          <p className="text-gray-400 text-sm sm:text-base">
            © {new Date().getFullYear()} ynk. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </motion.div>
      </div>
    </footer>
  )
} 