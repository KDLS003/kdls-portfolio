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

type ProjectStatus = 'Completed' | 'Ongoing'

interface Project {
  title: string
  description: string
  github: string
  tech: string[]
  image: string
  details: string
  impact: string
  status: ProjectStatus
  code?: string
  resources?: { label: string; url: string }[]
  roadmap?: string[]
}

const projects: Project[] = [
  {
    title: 'WiFi Sentinel',
    description:
      'Terminal-based WiFi attack and defense toolkit for Kali Linux. Features real-time sniffing, Evil Twin attacks, WPA2 handshake capture, and more. Designed for cybersecurity students and professionals.',
    github: 'https://github.com/KDLS003/Wifi_Sentinel',
    tech: ['Python', 'Shell', 'Flask', 'WiFi tools'],
    image: '/images/optimized/wifiSentinel.webp',
    details:
      'WiFi Sentinel is a CLI toolkit for WiFi security testing. It supports real-time sniffing, Evil Twin attacks, WPA2 handshake capture, and more. Built for Kali Linux and inspired by WiFi Marauder.',
    impact:
      'Adopted by peer blue teams to capture WPA2 handshakes 40% faster during lab exercises while keeping logs for after-action reviews.',
    status: 'Completed',
    code: `sudo ./run.sh\n# Select attack or sniffer module\n# View real-time results in the terminal`,
    resources: [
      {
        label: 'Documentation',
        url: 'https://github.com/KDLS003/Wifi_Sentinel#readme',
      },
    ],
  },
  {
    title: 'cryptoToolkit',
    description:
      'Python toolkit for cryptography, password management, and steganography. Includes password strength checker, AES encryption, and educational features.',
    github: 'https://github.com/KDLS003/cryptoToolkit',
    tech: ['Python'],
    image: '/images/optimized/cryptoToolkit.webp',
    details:
      'cryptoToolkit is a Python CLI tool for cryptography, password management, and steganography. It features a password strength checker, AES encryption, and more.',
    impact:
      'Provided classmates with a single interface for labs, cutting report preparation time by ~25% thanks to reusable encryption scripts and evidence exports.',
    status: 'Completed',
    code: `python cryptoToolkit.py\n# Choose cryptography or password manager module`,
    resources: [
      {
        label: 'User Guide',
        url: 'https://github.com/KDLS003/cryptoToolkit#readme',
      },
    ],
  },
  {
    title: 'ByteBurrow',
    description: 'A cybersecurity project focused on secure data storage and hiding payloads.',
    github: 'https://github.com/KDLS003/ByteBurrow',
    tech: ['Python'],
    image: '/images/optimized/byteburrow.webp',
    details:
      'ByteBurrow is a sophisticated toolkit for embedding executable files within various file formats while maintaining the integrity of both the host file and the embedded payload.',
    impact:
      'Designed to streamline red-team lab demos by bundling payload delivery, encryption, and forensic logging into a single workflow.',
    status: 'Ongoing',
    code: `python byteburrow.py\n# Store or retrieve encrypted data`,
    resources: [
      {
        label: 'Project Plan',
        url: 'https://github.com/KDLS003/ByteBurrow#roadmap',
      },
    ],
    roadmap: [
      'Add automated payload integrity validation and reporting.',
      'Ship command-line wizards for common forensic exercises.',
      'Publish comparative benchmarks against baseline steganography tools.',
    ],
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
                  alt={`${project.title} preview screenshot`}
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
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg sm:text-xl font-semibold">{project.title}</h3>
                <span
                  className={`px-2 py-1 text-[11px] uppercase tracking-wider rounded-full border ${
                    project.status === 'Completed'
                      ? 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10'
                      : 'border-amber-400/40 text-amber-200 bg-amber-500/10'
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base mb-3">
                {project.description}
              </p>
              <p className="text-primary/80 text-xs sm:text-sm">
                <span className="font-semibold text-primary">Impact:</span> {project.impact}
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
            <div className="bg-dark-lighter rounded-xl p-4 sm:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-primary"
                onClick={() => setSelected(null)}
              >
                <FiX className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>
              <div className="relative w-full h-40 sm:h-56 mb-4 bg-black rounded">
                <Image
                  src={projects[selected].image}
                  alt={`${projects[selected].title} modal preview`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain rounded"
                  quality={90}
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-primary">{projects[selected].title}</h3>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full border ${
                    projects[selected].status === 'Completed'
                      ? 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10'
                      : 'border-amber-400/40 text-amber-200 bg-amber-500/10'
                  }`}
                >
                  {projects[selected].status}
                </span>
                <span className="text-xs sm:text-sm text-primary/80">
                  <strong className="text-primary">Impact:</strong> {projects[selected].impact}
                </span>
              </div>
              <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">{projects[selected].details}</p>
              {projects[selected].code && (
                <pre className="bg-dark text-primary text-xs sm:text-sm rounded p-3 sm:p-4 overflow-x-auto mb-4 whitespace-pre scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-dark-lighter">
{projects[selected].code}
                </pre>
              )}
              {projects[selected].roadmap && projects[selected].roadmap.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm sm:text-base font-semibold text-primary mb-2">Roadmap</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base space-y-1">
                    {projects[selected].roadmap.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {projects[selected].resources && projects[selected].resources.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-primary mb-2">Explore More</h4>
                  <div className="flex flex-wrap gap-3">
                    {projects[selected].resources.map((resource) => (
                      <a
                        key={resource.url}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm sm:text-base text-cyan-300 hover:text-cyan-200"
                      >
                        <FiExternalLink className="w-4 h-4" /> {resource.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <a
                href={projects[selected].github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" /> View on GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
} 