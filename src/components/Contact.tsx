'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiMail, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi'
import { fadeIn, slideUp } from '../lib/animations'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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
            Feel free to reach out via email or connect with me on social media!
          </p>
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