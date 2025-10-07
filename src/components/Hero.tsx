'use client'

import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { SiPython, SiLinux, SiGnubash, SiAmazon } from 'react-icons/si'

const WORDS = ["Learning.", "Breaking.", "Securing."];

export default function Hero() {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = WORDS[wordIndex];
    let timeout: NodeJS.Timeout;
    if (!deleting && charIndex < currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 100);
    } else if (!deleting && charIndex === currentWord.length) {
      timeout = setTimeout(() => setDeleting(true), 1200);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 40);
    } else if (deleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIndex((wordIndex + 1) % WORDS.length);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex]);

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 animated-bg" />
      {/* Subtle Animated Blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] blob-gradient-cyan opacity-10 rounded-full filter blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] blob-gradient-blue opacity-15 rounded-full filter blur-2xl z-0" />
      {/* <div className="absolute inset-0 bg-black/60" /> */}
      <div className="container relative z-10">
        <div className="text-left">
          <h1 className="mb-4 sm:mb-6">
            <span
              className="block text-primary font-bold tracking-wide text-lg sm:text-2xl md:text-3xl mb-1 sm:mb-2"
              style={{ position: 'relative', width: 'fit-content' }}
            >
              <span className="glitch" style={{ position: 'relative', display: 'inline-block' }}>
                ynk
                <span className="glitch-layer cyan" aria-hidden="true">ynk</span>
                <span className="glitch-layer magenta" aria-hidden="true">ynk</span>
                <span className="glitch-layer white" aria-hidden="true">ynk</span>
              </span>
            </span>
            <span className="block bg-gradient-to-r from-white via-white to-cyan-400 bg-clip-text text-transparent drop-shadow-cyber text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-4">
              Kenneth David L. Santos
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl text-primary font-semibold mb-4 min-h-[2.5rem] font-mono flex items-center justify-center md:justify-start gap-2">
            <span>{displayed}</span>
            <span className="inline-block w-2 h-6 bg-primary animate-blink align-middle" style={{marginLeft: '2px'}}></span>
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-2xl mx-auto md:mx-0">
            I help security-minded teams harden wireless networks and automate defensive playbooks with hands-on tooling tailored to academic and startup environments.
          </p>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0">
            I'm an aspiring cybersecurity professional who believes that curiosity is the best teacher—eager to learn, willing to break, and committed to securing what matters most.
          </p>
          {/* Tech stack icons */}
          <div className="flex gap-4 justify-center md:justify-start mt-6 mb-8">
            <SiPython className="w-8 h-8 text-yellow-400" title="Python" />
            <SiLinux className="w-8 h-8 text-gray-200" title="Linux" />
            <SiGnubash className="w-8 h-8 text-green-400" title="Bash" />
            <SiAmazon className="w-8 h-8 text-orange-400" title="AWS" />
            <img src="/images/kali-linux.svg" alt="Kali Linux" className="w-8 h-8" />
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href="#projects"
              className="btn btn-primary shadow-lg shadow-cyan-500/30"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="btn border border-primary text-primary hover:bg-primary hover:text-dark shadow-lg shadow-cyan-500/30"
            >
              Contact Me
            </a>
            <a
              href="/resume/Kenneth-David-L-Santos-Resume.pdf"
              className="btn border border-transparent bg-white/10 text-white hover:bg-primary hover:text-dark shadow-lg shadow-cyan-500/30"
              download
            >
              Download Résumé
            </a>
          </div>
          <p className="text-sm md:text-base text-gray-400 mt-6 text-center md:text-left">
            Based in Angeles City, Philippines (UTC+8) • Available for remote-friendly security roles and internships.
          </p>
          <div className="flex gap-6 mt-8 justify-center md:justify-start">
            <a
              href="https://github.com/KDLS003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-white hover:text-primary transition-colors"
            >
              <FiGithub />
            </a>
            <a
              href="https://linkedin.com/in/kenneth-santos-26727a211/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-white hover:text-primary transition-colors"
            >
              <FiLinkedin />
            </a>
            <a
              href="mailto:kennethsantos003@gmail.com"
              className="text-2xl text-white hover:text-primary transition-colors"
            >
              <FiMail />
            </a>
          </div>
        </div>
        {/* Scroll down indicator */}
        <div className="absolute left-1/2 -bottom-14 transform -translate-x-1/2 z-30">
          <div className="animate-bounce text-primary text-3xl">&#8595;</div>
        </div>
      </div>
    </section>
  )
} 