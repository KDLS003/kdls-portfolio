'use client'

import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import Certifications from '../components/Certifications'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { pageTransition, fadeIn, slideUp } from '../lib/animations'

export default function Home() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <motion.section variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Navigation />
        <Hero />
      </motion.section>
      <motion.section variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <About />
      </motion.section>
      <section>
        <Projects />
      </section>
      <section>
        <Certifications />
      </section>
      <section>
        <Contact />
      </section>
      <section>
        <Footer />
      </section>
    </motion.div>
  )
} 