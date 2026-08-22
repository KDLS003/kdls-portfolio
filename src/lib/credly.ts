export type CredlyCategory = 'certification' | 'badge' | 'training'

export type CredlyEmbed = {
  badgeId: string
  category: CredlyCategory
  title?: string
  issuer?: string
}

declare global {
  interface Window {
    Credly?: {
      Tracker?: {
        init?: () => void
      }
    }
  }
}

export const credlyBadges: CredlyEmbed[] = [
  // Professional Certifications
  {
    title: 'Cisco Certificate in Ethical Hacking',
    issuer: 'Cisco',
    badgeId: '0d215f80-e5e7-456a-b72b-c09fc9be56a9',
    category: 'certification',
  },
  {
    title: 'Offensive Security Capture the Flag - Operation SMB Exploit',
    issuer: 'Cisco',
    badgeId: '786bdf71-3683-4ece-87c7-de90f4cce300',
    category: 'certification',
  },
  {
    title: 'CompTIA IT Fundamentals+ (ITF+)',
    issuer: 'CompTIA',
    badgeId: '36adc4b9-65c8-4355-9998-b9ef00f8219a',
    category: 'certification',
  },
  {
    title: 'Fortinet Certified Associate Cybersecurity',
    issuer: 'Fortinet',
    badgeId: '488dbcdd-4d7c-4112-b77f-b38027c6c297',
    category: 'certification',
  },
  {
    title: 'Fortinet FortiGate 7.6 Operator',
    issuer: 'Fortinet',
    badgeId: 'b3778dde-0c59-4469-9801-f8eaa0973e1b',
    category: 'certification',
  },
  {
    title: 'Ethical Hacker',
    issuer: 'Cisco',
    badgeId: 'a1cb42eb-783c-462a-ab49-f284c7f0b356',
    category: 'certification',
  },
  {
    title: 'CCNA: Enterprise Networking, Security, and Automation',
    issuer: 'Cisco',
    badgeId: 'c3abddc5-2676-415a-9869-03068e42a2e6',
    category: 'certification',
  },
  {
    title: 'ISC2 Candidate',
    issuer: 'ISC2',
    badgeId: '1bd6d233-db8f-49ae-bdb9-45dc26596a92',
    category: 'certification',
  },
  {
    title: 'AWS Academy Graduate – Cloud Security Builder',
    issuer: 'AWS Academy',
    badgeId: '3fb22e79-610f-4231-916d-3f895efcb327',
    category: 'certification',
  },

  // Digital Badges & Challenges
  {
    title: 'English for IT 1',
    issuer: 'Cisco',
    badgeId: '6a7b0e9e-6f25-4352-97a8-542f9f5f8b1a',
    category: 'badge',
  },
  {
    title: 'AWS Academy Graduate – Cloud Security Foundations',
    issuer: 'AWS Academy',
    badgeId: '0825997e-fb13-49e6-82ef-f1e151803123',
    category: 'badge',
  },
  {
    title: 'Introduction to Modern AI',
    issuer: 'Cisco',
    badgeId: 'aeacf824-5ad5-489a-9bd4-34bbf8c38efd',
    category: 'badge',
  },
  {
    title: 'Networking Academy Learn-A-Thon 2025',
    issuer: 'Cisco',
    badgeId: '013dd79e-503e-45c7-b5d5-b29dee83d61e',
    category: 'badge',
  },

  // Fortinet Security Academy training track (rendered as a compact cluster, not full cards)
  {
    title: 'Getting Started in Cybersecurity 3.0',
    issuer: 'Fortinet',
    badgeId: 'c3214a0f-8a1f-40bd-a479-2b344d3da8f3',
    category: 'training',
  },
  {
    title: 'Introduction to the Threat Landscape 3.0',
    issuer: 'Fortinet',
    badgeId: 'f848bb35-7286-4b27-befe-bf1a679ff159',
    category: 'training',
  },
  {
    title: 'Technical Introduction to Cybersecurity 3.0',
    issuer: 'Fortinet',
    badgeId: '2c6d7aa4-0ba3-4a98-a5e2-dcba682eccc1',
    category: 'training',
  },
  {
    title: 'Fortinet Certified Fundamentals Cybersecurity',
    issuer: 'Fortinet',
    badgeId: '24e3ffaf-25d9-46c4-b91e-1bf4c71c7ebf',
    category: 'training',
  },
  {
    title: 'Fortinet NSE 1 Certified in Cybersecurity',
    issuer: 'Fortinet',
    badgeId: '209f06aa-acc5-412e-8f8a-e99b804985c2',
    category: 'training',
  },
  {
    title: 'Fortinet NSE 2 Certified in Cybersecurity',
    issuer: 'Fortinet',
    badgeId: 'cbcee921-a441-4130-8a7b-47b44743d2d8',
    category: 'training',
  },
  {
    title: 'Fortinet NSE 3 Certified in Cybersecurity',
    issuer: 'Fortinet',
    badgeId: '2a914a53-270b-4cd0-92fc-ea38cc91a1e2',
    category: 'training',
  },
]
