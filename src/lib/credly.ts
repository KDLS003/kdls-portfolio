export type CredlyCategory = 'certification' | 'badge'

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
  {
    title: 'Cisco Certificate in Ethical Hacking',
    issuer: 'Cisco',
    badgeId: '0d215f80-e5e7-456a-b72b-c09fc9be56a9',
    category: 'certification',
  },
  {
    title: 'Offensive Security Capture the Flag - Operation SMB Exploit',
    issuer: 'Offensive Security',
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
    badgeId: '4d6e82bd-7017-4f13-8680-38922ce466fe',
    category: 'certification',
  },
  {
    title: 'Fortinet FortiGate 7.6 Operator',
    issuer: 'Fortinet',
    badgeId: '7803dc94-e30f-4e4a-b78c-b76e322b3e24',
    category: 'certification',
  },
  {
    title: 'Ethical Hacker',
    issuer: 'Certiport',
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
]
