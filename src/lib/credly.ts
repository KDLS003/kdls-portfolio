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

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isCredlyEmbed = (value: unknown): value is CredlyEmbed => {
  if (!isObject(value)) return false

  const { badgeId, category, title, issuer } = value

  const hasValidBadgeId = typeof badgeId === 'string' && badgeId.length > 0
  const hasValidCategory = category === 'certification' || category === 'badge'
  const hasValidTitle = title === undefined || typeof title === 'string'
  const hasValidIssuer = issuer === undefined || typeof issuer === 'string'

  return hasValidBadgeId && hasValidCategory && hasValidTitle && hasValidIssuer
}

const sanitizeCredlyEmbeds = (items: unknown): CredlyEmbed[] => {
  if (!Array.isArray(items)) return []

  return items.filter(isCredlyEmbed)
}

export const mergeCredlyLists = (
  base: CredlyEmbed[],
  overrides: CredlyEmbed[] | null,
): CredlyEmbed[] => {
  if (!overrides) return base

  const seen = new Set<string>()
  const merged: CredlyEmbed[] = []

  for (const item of overrides) {
    if (seen.has(item.badgeId)) continue
    seen.add(item.badgeId)
    merged.push(item)
  }

  return merged
}

export const credlyStorageKey = 'portfolio:credly-badges'
export const credlyUpdateEvent = 'credly-badges-updated'

export const readCredlyStorage = (): CredlyEmbed[] | null => {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(credlyStorageKey)
  if (raw === null) return null

  try {
    return sanitizeCredlyEmbeds(JSON.parse(raw))
  } catch (error) {
    console.error('Failed to read Credly badge storage', error)
    return null
  }
}

export const writeCredlyStorage = (items: CredlyEmbed[]) => {
  if (typeof window === 'undefined') return

  try {
    const sanitized = sanitizeCredlyEmbeds(items)
    window.localStorage.setItem(credlyStorageKey, JSON.stringify(sanitized))
  } catch (error) {
    console.error('Failed to persist Credly badge storage', error)
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
