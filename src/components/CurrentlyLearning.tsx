'use client'

import { motion } from 'framer-motion'
import { FiCompass, FiTarget, FiTrendingUp } from 'react-icons/fi'
import { fadeIn, staggerContainer } from '../lib/animations'

const focusAreas = [
  {
    icon: <FiCompass className="w-6 h-6 text-primary" />,
    title: 'Wireless Intrusion Detection',
    description:
      'Experimenting with SDR-based packet capture and anomaly detection models to surface rogue access points faster.',
  },
  {
    icon: <FiTarget className="w-6 h-6 text-primary" />,
    title: 'Cloud Attack Simulations',
    description:
      'Building AWS lab environments that rehearse IAM misconfigurations and remediation with Infrastructure as Code.',
  },
  {
    icon: <FiTrendingUp className="w-6 h-6 text-primary" />,
    title: 'Purple Team Collaboration',
    description:
      'Documenting repeatable purple-team drills that blend threat intelligence with actionable engineering tasks.',
  },
]

export default function CurrentlyLearning() {
  return (
    <section id="whats-next" className="section bg-dark">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl">What&apos;s Next</h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
            I keep a running backlog of skills to sharpen between courses. Here are the focus areas guiding my next projects and
            collaborations.
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {focusAreas.map((area) => (
            <motion.div
              key={area.title}
              variants={fadeIn}
              className="card border border-primary/20 hover:border-primary/60 transition-colors"
            >
              <div className="mb-4 flex items-center gap-3">
                {area.icon}
                <h3 className="text-lg font-semibold text-white">{area.title}</h3>
              </div>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{area.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
