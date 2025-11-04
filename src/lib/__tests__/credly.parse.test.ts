import { describe, expect, it } from 'vitest'

import { parseCredlyEmbedCode, sanitizeCredlyEmbedInput } from '../credly'

const BADGE_ID = '12345678-1234-1234-1234-1234567890ab'

describe('parseCredlyEmbedCode', () => {
  it('normalizes embed HTML and strips unsafe attributes', () => {
    const input = `
      <div
        data-share-badge-id="${BADGE_ID}"
        data-share-badge-host="https://evil.example"
        data-iframe-title="Secure Badge"
        data-iframe-width="600"
        onload="alert('boom')"
        style="background:red"
      ></div>
      <iframe src="https://evil.example/outside"></iframe>
    `

    const result = parseCredlyEmbedCode(input)

    expect(result.badgeId).toBe(BADGE_ID)
    expect(result.title).toBe('Secure Badge')
    expect(result.sanitized).not.toContain('style=')
    expect(result.sanitized).not.toContain('onload=')
    expect(result.sanitized).not.toContain('evil.example/outside')

    const template = document.createElement('template')
    template.innerHTML = result.sanitized
    const sanitizedElement = template.content.firstElementChild as HTMLElement | null

    expect(sanitizedElement).not.toBeNull()
    expect(sanitizedElement?.tagName.toLowerCase()).toBe('div')
    expect(sanitizedElement?.getAttribute('data-share-badge-id')).toBe(BADGE_ID)
    expect(sanitizedElement?.getAttribute('data-share-badge-host')).toBe('https://www.credly.com')
    expect(sanitizedElement?.getAttribute('data-hide-footer')).toBe('true')
    expect(sanitizedElement?.getAttribute('data-hide-share')).toBe('true')
    expect(sanitizedElement?.getAttribute('data-iframe-width')).toBe('600')
    expect(sanitizedElement?.getAttribute('data-iframe-height')).toBe('340')
    expect(sanitizedElement?.getAttribute('data-iframe-title')).toBe('Secure Badge')
    expect(sanitizedElement?.getAttribute('data-iframe-src')).toBe(
      `https://www.credly.com/embedded_window/${BADGE_ID}?embed=true&show_share=false`,
    )

    const attributeNames = Array.from(sanitizedElement?.attributes ?? []).map((attribute) => attribute.name)
    expect(attributeNames.sort()).toEqual(
      [
        'data-hide-footer',
        'data-hide-share',
        'data-iframe-height',
        'data-iframe-src',
        'data-iframe-title',
        'data-iframe-width',
        'data-share-badge-host',
        'data-share-badge-id',
      ].sort(),
    )
  })
})

describe('sanitizeCredlyEmbedInput', () => {
  it('removes scripts and extraneous iframe/object/embed tags', () => {
    const dirty = `
      <div data-share-badge-id="${BADGE_ID}"></div>
      <iframe src="https://evil.example/outside"></iframe>
      <object data="https://evil.example/object"></object>
      <embed src="https://evil.example/embed" />
      <script>alert('boom')</script>
    `

    const sanitized = sanitizeCredlyEmbedInput(dirty)

    expect(sanitized).toContain(`data-share-badge-id="${BADGE_ID}`)
    expect(sanitized).not.toMatch(/<iframe/i)
    expect(sanitized).not.toMatch(/<object/i)
    expect(sanitized).not.toMatch(/<embed/i)
    expect(sanitized).not.toMatch(/<script/i)
  })
})
