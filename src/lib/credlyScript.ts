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
