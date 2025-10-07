export type AchievementKind = 'certificate' | 'badge'
export type AchievementStatus = 'earned' | 'upcoming'

export interface Achievement {
  title: string
  issuer: string
  date: string
  status: AchievementStatus
  kind: AchievementKind
  category: string
  takeaway?: string
  imageUrl?: string
  previewUrl?: string
  credentialUrl?: string
  pdfUrl?: string
  verificationNote?: string
}

export const certificateData: Achievement[] = [
  {
    title: 'CompTIA IT Fundamentals+',
    issuer: 'CompTIA',
    date: 'May 30, 2023',
    status: 'earned',
    kind: 'certificate',
    imageUrl: '/images/Comptia.png',
    previewUrl: '/images/preview/comptiaCert.png',
    credentialUrl: 'https://www.credly.com/badges/36adc4b9-65c8-4355-9998-b9ef00f8219a',
    pdfUrl: '/certifications/CompTIA IT Fundamentals (ITF+) Certification certificate.pdf',
    category: 'Foundational',
    takeaway:
      'Grounded my security journey with hardware, networking, and troubleshooting fundamentals.',
  },
  {
    title: 'CCNA: Introduction to Networks',
    issuer: 'Cisco',
    date: 'May 2024',
    status: 'earned',
    kind: 'certificate',
    previewUrl: '/images/preview/CCNAIntroductiontoNetworks.png',
    pdfUrl:
      '/certifications/CCNA-_Introduction_to_Networks_certificate_kennethsantos003-gmail-com_29aaa4d9-c480-4df2-8a7f-13c33c88bf3c.pdf',
    category: 'Networking',
    takeaway: 'Mapped out routing and switching concepts that inform my incident response runbooks.',
    verificationNote: 'Verification available on request.',
  },
  {
    title: 'CCNA: Switching, Routing, and Wireless Essentials',
    issuer: 'Cisco',
    date: 'November 2024',
    status: 'earned',
    kind: 'certificate',
    previewUrl: '/images/preview/CCNASwitching,Routing,andWirelessEssentials.png',
    pdfUrl:
      '/certifications/CCNA-_Switching-_Routing-_and_Wireless_Essentials_certificate_kennethsantos003-gmail-com_1bcc32cb-2101-41e-a56f-cc290772f2f5.pdf',
    category: 'Networking',
    takeaway:
      'Deepened my understanding of wireless architectures that inspired the WiFi Sentinel toolkit roadmap.',
    verificationNote: 'Verification available on request.',
  },
  {
    title: 'Upcoming Certification',
    issuer: 'Details coming soon',
    date: 'To be announced',
    status: 'upcoming',
    kind: 'certificate',
    category: 'In Progress',
    takeaway: 'A reserved spotlight for the next milestone in progress.',
  },
]

export const badgeData: Achievement[] = [
  {
    title: 'English for IT 1',
    issuer: 'Cisco',
    date: 'April 01, 2025',
    status: 'earned',
    kind: 'badge',
    imageUrl: '/images/EnglishForit.png',
    previewUrl: '/images/preview/englishForIT.png',
    credentialUrl: 'https://www.credly.com/badges/6a7b0e9e-6f25-4352-97a8-542f9f5f8b1a',
    pdfUrl: '/certifications/EnglishforIT1Update20250611-27-q382nw.pdf',
    category: 'Foundational',
    takeaway:
      'Strengthened technical communication for cross-functional collaboration and documentation.',
  },
  {
    title: 'Introduction to Modern AI',
    issuer: 'Cisco',
    date: 'June 10, 2025',
    status: 'earned',
    kind: 'badge',
    imageUrl: '/images/introToModernAI.png',
    previewUrl: '/images/preview/modernAI.png',
    credentialUrl: 'https://www.credly.com/badges/aeacf824-5ad5-489a-9bd4-34bbf8c38efd',
    pdfUrl: '/certifications/IntrotoModernAIUpdate20250611-27-bogmyn.pdf',
    category: 'Emerging Tech',
    takeaway: 'Explored how machine learning can augment threat detection and triage workflows.',
  },
  {
    title: 'Upcoming Badge One',
    issuer: 'Badge in progress',
    date: 'Planned',
    status: 'upcoming',
    kind: 'badge',
    category: 'In Progress',
    takeaway: 'Placeholder for a new badge that will be showcased soon.',
  },
  {
    title: 'Upcoming Badge Two',
    issuer: 'Badge in progress',
    date: 'Planned',
    status: 'upcoming',
    kind: 'badge',
    category: 'In Progress',
    takeaway: 'Another reserved slot ready for the next badge achievement.',
  },
]

export const defaultCategories = [
  'Foundational',
  'Networking',
  'Emerging Tech',
  'In Progress',
]
