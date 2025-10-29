const CREDLY_SCRIPT_SRC = 'https://cdn.credly.com/assets/utilities/embed.js'

let loadingPromise: Promise<void> | null = null

export const ensureCredlyScript = (): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (loadingPromise) {
    return loadingPromise
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${CREDLY_SCRIPT_SRC}"]`,
  )

  if (existingScript) {
    if (existingScript.dataset.loaded === 'true' || window.Credly) {
      existingScript.dataset.loaded = 'true'
      return Promise.resolve()
    }

    loadingPromise = new Promise((resolve, reject) => {
      const handleLoad = () => {
        existingScript.dataset.loaded = 'true'
        cleanup()
        resolve()
      }
      const handleError = () => {
        cleanup()
        loadingPromise = null
        reject(new Error('Failed to load Credly embed script.'))
      }

      const cleanup = () => {
        existingScript.removeEventListener('load', handleLoad)
        existingScript.removeEventListener('error', handleError)
      }

      existingScript.addEventListener('load', handleLoad)
      existingScript.addEventListener('error', handleError)
    })

    return loadingPromise
  }

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = CREDLY_SCRIPT_SRC
    script.async = true

    const handleLoad = () => {
      script.dataset.loaded = 'true'
      cleanup()
      resolve()
    }

    const handleError = () => {
      cleanup()
      loadingPromise = null
      reject(new Error('Failed to load Credly embed script.'))
    }

    const cleanup = () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
    }

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

    document.body.appendChild(script)
  })

  return loadingPromise
}

export const reinitializeCredlyEmbeds = () => {
  if (typeof window === 'undefined') return

  window.Credly?.Tracker?.init?.()
}

export const waitForNextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

export const verifyCredlyEmbedPresence = async (
  badgeId: string,
  {
    shouldExist = true,
    timeoutMs = 10000,
    pollInterval = 250,
  }: { shouldExist?: boolean; timeoutMs?: number; pollInterval?: number } = {},
) => {
  if (typeof window === 'undefined') return false

  const start = performance.now()

  const badgeEmbedSelector = `[data-share-badge-id="${badgeId}"]`

  return new Promise<boolean>((resolve) => {
    const check = () => {
      const containers = Array.from(document.querySelectorAll<HTMLElement>(badgeEmbedSelector))
      const iframeByAttr = document.querySelector<HTMLIFrameElement>(`iframe${badgeEmbedSelector}`)
      const iframeBySrc = Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe')).find((element) => {
        try {
          if (!element.src) return false

          const url = new URL(element.src, window.location.href)
          const hasIdParam = url.searchParams.get('badge_id') === badgeId

          return hasIdParam || url.pathname.includes(badgeId)
        } catch (error) {
          return element.src.includes(badgeId)
        }
      })
      const containerWithIframe = containers.some((element) => element.tagName === 'IFRAME' || !!element.querySelector('iframe'))

      if (shouldExist) {
        if (iframeBySrc || iframeByAttr || containerWithIframe) {
          resolve(true)
          return
        }
      } else if (containers.length === 0 && !iframeBySrc && !iframeByAttr) {
        resolve(true)
        return
      }

      if (performance.now() - start > timeoutMs) {
        resolve(false)
        return
      }

      window.setTimeout(check, pollInterval)
    }

    check()
  })
}

export const credlyScriptSrc = CREDLY_SCRIPT_SRC
