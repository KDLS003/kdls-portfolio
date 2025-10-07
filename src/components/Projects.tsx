'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { FiGithub, FiExternalLink, FiX } from 'react-icons/fi'
import { fadeIn, staggerContainer } from '../lib/animations'
import Image from 'next/image'
import ProjectSkeleton from './ProjectSkeleton'

// Dynamically import motion components
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
)

interface Project {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string
  topics: string[]
  stargazers_count: number
  language: string
  gif: string
  details: string
  code: string
}

const projects = [
  {
    title: 'WiFi Sentinel',
    description: 'Terminal-based WiFi attack and defense toolkit for Kali Linux. Features real-time sniffing, Evil Twin attacks, WPA2 handshake capture, and more. Designed for cybersecurity students and professionals.',
    github: 'https://github.com/KDLS003/Wifi_Sentinel',
    tech: ['Python', 'Shell', 'Flask', 'WiFi tools'],
    image: '/images/optimized/wifiSentinel.webp',
    details: 'WiFi Sentinel is a CLI toolkit for WiFi security testing. It supports real-time sniffing, Evil Twin attacks, WPA2 handshake capture, and more. Built for Kali Linux and inspired by WiFi Marauder.',
    code: `sudo ./run.sh\n# Select attack or sniffer module\n# View real-time results in the terminal`,
  },
  {
    title: 'cryptoToolkit',
    description: 'Python toolkit for cryptography, password management, and steganography. Includes password strength checker, AES encryption, and educational features.',
    github: 'https://github.com/KDLS003/cryptoToolkit',
    tech: ['Python'],
    image: '/images/optimized/cryptoToolkit.webp',
    details: 'cryptoToolkit is a Python CLI tool for cryptography, password management, and steganography. It features a password strength checker, AES encryption, and more.',
    code: `python cryptoToolkit.py\n# Choose cryptography or password manager module`,
  },
  {
    title: 'ByteBurrow',
    description: 'A cybersecurity project focused on secure data storage and hiding paylods.',
    github: 'https://github.com/KDLS003/ByteBurrow',
    tech: ['Python'],
    image: '/images/optimized/byteburrow.webp',
    details: 'ByteBurrow is a sophisticated toolkit for embedding executable files within various file formats while maintaining the integrity of both the host file and the embedded payload.',
    code: `python byteburrow.py\n# Store or retrieve encrypted data`,
  },
]

export default function Projects() {
  const [selected, setSelected] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section id="projects" className="section">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <div className="h-8 bg-gray-700/50 rounded w-1/4 mx-auto mb-4" />
            <div className="h-4 bg-gray-700/50 rounded w-3/4 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="section">
      <div className="container px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Projects</h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
            A collection of my cybersecurity and development projects, showcasing my
            skills and contributions to the security community.
          </p>
        </MotionDiv>

        <MotionDiv
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {projects.map((project, idx) => (
            <MotionDiv
              key={project.title}
              variants={fadeIn}
              className="relative card group border border-transparent cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary/40 bg-white/10 backdrop-blur-md shadow-lg hover:border-primary/50"
              tabIndex={0}
              onClick={() => setSelected(idx)}
            >
              {/* Project image with zoom effect */}
              <div className="overflow-hidden rounded-lg mb-3 sm:mb-4 relative w-full aspect-[16/9]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={idx === 0}
                  className="object-cover bg-dark-lighter transform transition-transform duration-300 group-hover:scale-110 rounded-lg"
                  quality={idx === 0 ? 100 : 75}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <span className="text-primary font-medium text-sm sm:text-base">View Details</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-400 mb-4 line-clamp-2 text-sm sm:text-base">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs sm:text-sm rounded-full bg-primary/10 text-primary border border-primary/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  window.open(project.github, '_blank', 'noopener noreferrer');
                }}
                className="btn btn-primary w-full flex items-center justify-center gap-2 mt-auto text-sm sm:text-base"
                type="button"
              >
                <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" /> View on GitHub
              </button>
            </MotionDiv>
          ))}
        </MotionDiv>

        {/* Modal for project details */}
        {selected !== null && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-dark-lighter rounded-xl p-4 sm:p-8 max-w-lg w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-primary"
                onClick={() => setSelected(null)}
              >
                <FiX className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>
              {/* Custom content for WiFi Sentinel */}
              {projects[selected].title === 'WiFi Sentinel' ? (
                <>
                  <div className="relative w-full h-36 sm:h-48 mb-4 bg-black rounded">
                    <Image
                      src={projects[selected].image}
                      alt="Project Preview"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain rounded"
                      quality={90}
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-primary">{projects[selected].title}</h3>
                  <p className="text-gray-300 mb-4 text-sm sm:text-base">{projects[selected].details}</p>
                  <pre className="bg-dark text-primary text-xs sm:text-sm rounded p-3 sm:p-4 overflow-x-auto mb-4 whitespace-pre scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-dark-lighter">
{`wifi_sentinel.py         # Main launcher
setup.sh                 # Auto-installs dependencies and directories
run.sh                   # Checks environment and launches tool
monitor.py               # Monitor mode interface handler
sniffers.py              # Beacon, probe, and deauth sniffing
handshake.py             # Auto capture WPA2 handshakes
crack_handshake.py       # Crack .cap/.hc22000 files using hashcat
fake_ap.py               # Evil Twin setup + captive portal launcher
phish_server.py          # Flask phishing server with ISP themes
attacks.py               # Attack module router
utils.py                 # Helper functions and logging
logs/                    # Logs and handshake captures
templates/, static/      # Phishing HTML/CSS assets`}
                  </pre>
                  <a
                    href={projects[selected].github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" /> View on GitHub
                  </a>
                </>
              ) : (
                <>
                  <div className="relative w-full h-36 sm:h-48 mb-4 bg-black rounded">
                    <Image
                      src={projects[selected].image}
                      alt="Project Preview"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain rounded"
                      quality={90}
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-primary">{projects[selected].title}</h3>
                  <p className="text-gray-300 mb-4 text-sm sm:text-base">{projects[selected].details}</p>
                  <a
                    href={projects[selected].github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" /> View on GitHub
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
} 