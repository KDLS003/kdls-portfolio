export type CredlyCategory = 'certification' | 'badge'

export type CredlyEmbed = {
  badgeId: string
  category: CredlyCategory
  title?: string
  issuer?: string
  embedHtml?: string
}

export type StoredCredlyEmbed = CredlyEmbed & {
  createdAt: string
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

const CREDLY_BADGE_ID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

export const CUSTOM_CREDLY_STORAGE_KEY = 'kdls-portfolio.custom-credly-embeds.v1'

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

export const isCredlyBadgeId = (value: string) => CREDLY_BADGE_ID_PATTERN.test(value)

export const sanitizeCredlyEmbedInput = (value: string) =>
  value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '').trim()

export const parseCredlyEmbedCode = (value: string) => {
  const sanitized = sanitizeCredlyEmbedInput(value)
  const badgeIdPattern = new RegExp(
    `data-share-badge-id\\s*=\\s*['"](${CREDLY_BADGE_ID_PATTERN.source})['"]`,
    'i',
  )
  const titlePattern = /data-iframe-title\s*=\s*['"]([^'"]+)['"]/i

  const badgeIdMatch = sanitized.match(badgeIdPattern)

  if (!badgeIdMatch?.[1]) {
    throw new Error('Unable to find a Credly badge ID in the provided embed code.')
  }

  let title = sanitized.match(titlePattern)?.[1]?.trim() ?? ''
  let normalized = sanitized

  if (typeof document !== 'undefined') {
    const template = document.createElement('template')
    template.innerHTML = sanitized

    const element = template.content.querySelector<HTMLElement>('[data-share-badge-id]')

    if (element) {
      element.setAttribute('data-share-badge-id', badgeIdMatch[1])
      element.setAttribute('data-share-badge-host', element.getAttribute('data-share-badge-host') ?? 'https://www.credly.com')
      element.setAttribute('data-hide-footer', 'true')
      element.setAttribute('data-hide-share', 'true')
      element.setAttribute('data-iframe-width', element.getAttribute('data-iframe-width') ?? '340')
      element.setAttribute('data-iframe-height', element.getAttribute('data-iframe-height') ?? '340')

      if (!element.getAttribute('data-iframe-src')) {
        element.setAttribute(
          'data-iframe-src',
          `https://www.credly.com/embedded_window/${badgeIdMatch[1]}?embed=true&show_share=false`,
        )
      }

      if (!title) {
        title = element.getAttribute('data-iframe-title')?.trim() ?? ''
      }

      normalized = element.outerHTML
    }
  }

  return {
    sanitized: normalized,
    badgeId: badgeIdMatch[1],
    title,
  }
}

const isOptionalString = (value: unknown) =>
  value === undefined || value === null || typeof value === 'string'

const isStoredCredlyEmbed = (value: unknown): value is StoredCredlyEmbed => {
  if (!value || typeof value !== 'object') return false

  const data = value as Record<string, unknown>

  return (
    typeof data.badgeId === 'string' &&
    isCredlyBadgeId(data.badgeId) &&
    (data.category === 'certification' || data.category === 'badge') &&
    typeof data.createdAt === 'string' &&
    isOptionalString(data.title) &&
    isOptionalString(data.issuer) &&
    isOptionalString((data as Record<string, unknown>).embedHtml)
  )
}

export const loadStoredCredlyEmbeds = (): StoredCredlyEmbed[] => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(CUSTOM_CREDLY_STORAGE_KEY)

    if (!raw) return []

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) return []

    return parsed.filter(isStoredCredlyEmbed)
  } catch (error) {
    console.error('Failed to load stored Credly embeds', error)
    return []
  }
}

export const saveStoredCredlyEmbeds = (embeds: StoredCredlyEmbed[]) => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(CUSTOM_CREDLY_STORAGE_KEY, JSON.stringify(embeds))
  } catch (error) {
    console.error('Failed to persist Credly embeds', error)
  }
}

export const toCredlyEmbeds = (stored: StoredCredlyEmbed[]): CredlyEmbed[] =>
  stored.map(({ createdAt: _createdAt, ...rest }) => rest)

export const sortStoredCredlyEmbeds = (embeds: StoredCredlyEmbed[]) =>
  [...embeds].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
