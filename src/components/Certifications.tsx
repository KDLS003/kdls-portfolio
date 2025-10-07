'use client'

import { motion } from 'framer-motion'
import { FiAward, FiExternalLink, FiFileText } from 'react-icons/fi'
import { fadeIn, staggerContainer } from '../lib/animations'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const certifications = [
  {
    title: 'CompTIA IT Fundamentals+',
    issuer: 'CompTIA',
    date: 'May 30, 2023',
    type: 'completed',
    imageUrl: '/images/Comptia.png',
    previewUrl: '/images/preview/comptiaCert.png',
    credentialUrl: 'https://www.credly.com/badges/36adc4b9-65c8-4355-9998-b9ef00f8219a',
    pdfUrl: '/certifications/CompTIA IT Fundamentals (ITF+) Certification certificate.pdf'
  },
  {
    title: 'English for IT 1',
    issuer: 'Cisco',
    date: 'April 01, 2025',
    type: 'completed',
    imageUrl: '/images/EnglishForit.png',
    previewUrl: '/images/preview/englishForIT.png',
    credentialUrl: 'https://www.credly.com/badges/6a7b0e9e-6f25-4352-97a8-542f9f5f8b1a',
    pdfUrl: '/certifications/EnglishforIT1Update20250611-27-q382nw.pdf'
  },
  {
    title: 'Introduction to Modern AI',
    issuer: 'Cisco',
    date: 'June 10, 2025',
    type: 'completed',
    imageUrl: '/images/introToModernAI.png',
    previewUrl: '/images/preview/modernAI.png',
    credentialUrl: 'https://www.credly.com/badges/aeacf824-5ad5-489a-9bd4-34bbf8c38efd',
    pdfUrl: '/certifications/IntrotoModernAIUpdate20250611-27-bogmyn.pdf'
  },
  {
    title: 'CCNA: Introduction to Networks',
    issuer: 'Cisco',
    date: 'May 2024',
    type: 'completed',
    imageUrl: '',
    previewUrl: '/images/preview/CCNAIntroductiontoNetworks.png',
    pdfUrl: '/certifications/CCNA-_Introduction_to_Networks_certificate_kennethsantos003-gmail-com_29aaa4d9-c480-4df2-8a7f-13c33c88bf3c.pdf',
    credentialUrl: ''
  },
  {
    title: 'CCNA: Switching, Routing, and Wireless Essentials',
    issuer: 'Cisco',
    date: 'November 2024',
    type: 'completed',
    imageUrl: '',
    previewUrl: '/images/preview/CCNASwitching,Routing,andWirelessEssentials.png',
    pdfUrl: '/certifications/CCNA-_Switching-_Routing-_and_Wireless_Essentials_certificate_kennethsantos003-gmail-com_1bcc32cb-2101-4a1e-a56f-cc290772f2f5.pdf',
    credentialUrl: ''
  }
]

export default function Certifications() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current!.offsetLeft)
    setScrollLeft(scrollRef.current!.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current!.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current!.scrollLeft = scrollLeft - walk
  }

  // Double the certifications array for seamless looping
  const loopedCertifications = [...certifications, ...certifications]

  return (
    <section id="certifications" className="section bg-dark-lighter">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Certifications</h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
            Professional certifications and badges demonstrating expertise in various
            cybersecurity domains and technologies.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            ref={scrollRef}
            className="overflow-x-auto pb-4 hide-scrollbar"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false)
              setIsDragging(false)
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div
              className={`flex gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4 transition-all duration-300 ${!isDragging && !isHovered ? 'animate-scroll' : 'hover-pause'}`}
            >
              {loopedCertifications.map((cert, index) => (
                <motion.div
                  key={`${cert.title}-${index}`}
                  variants={fadeIn}
                  className="card group hover:border-primary/50 border border-transparent relative w-[280px] sm:w-[320px] md:w-[350px] shrink-0"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {cert.type === 'completed' && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col items-center gap-2 z-10">
                      <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" title="View PDF">
                        <FiFileText className="text-cyan-400 hover:text-cyan-300 w-5 h-5 sm:w-6 sm:h-6" />
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 min-h-[90px] sm:min-h-[110px]">
                    <div className="text-primary">
                      <FiAward size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex flex-col items-start">
                      <h3 className="text-lg sm:text-xl font-semibold">{cert.title}</h3>
                      <div className="flex flex-row items-center gap-2 my-1">
                        {cert.type === 'completed' && cert.imageUrl ? (
                          <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                            <Image
                              src={cert.imageUrl}
                              alt={cert.title + ' Badge'}
                              fill
                              className="object-contain opacity-75"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <FiAward className="w-3 h-3 sm:w-4 sm:h-4 text-primary/50" />
                          </div>
                        )}
                        <p className="text-gray-400 text-xs sm:text-sm">{cert.issuer}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`w-full h-40 sm:h-48 md:h-56 rounded-lg mb-3 sm:mb-4 overflow-hidden flex items-center justify-center bg-white`}>
                    <div className="relative w-full h-full">
                      <Image
                        src={cert.previewUrl}
                        alt={cert.title + ' PDF Preview'}
                        fill
                        className="object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 sm:mt-8">
                    <span className="text-xs sm:text-sm text-gray-400">{cert.date}</span>
                    {cert.credentialUrl && (
                      <motion.a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-secondary transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiExternalLink size={16} className="sm:w-5 sm:h-5" />
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <div className="absolute left-0 top-0 bottom-4 w-4 sm:w-8 bg-gradient-to-r from-dark-lighter to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-4 sm:w-8 bg-gradient-to-l from-dark-lighter to-transparent pointer-events-none" />
        </div>

        <div className="text-center mt-6 sm:mt-8 text-gray-400 text-sm sm:text-base">
          Visit my{' '}
          <a 
            href="https://www.credly.com/users/kenneth-david-santos" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary underline"
          >
            Credly profile
          </a>
          .
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-280px * ${certifications.length} - 1rem * ${certifications.length}));
          }
        }

        @media (min-width: 640px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-320px * ${certifications.length} - 1.5rem * ${certifications.length}));
            }
          }
        }

        @media (min-width: 768px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-350px * ${certifications.length} - 2rem * ${certifications.length}));
            }
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
          will-change: transform;
        }

        .hover-pause {
          transform: translateX(0);
          transition: transform 0.3s ease-out;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </section>
  )
} 