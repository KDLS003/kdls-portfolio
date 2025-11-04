import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import {
  clearCsrfCookie,
  clearSessionCookie,
  getSessionFromCookies,
  mintCsrfToken,
  mintSessionToken,
  setCsrfCookie,
  setSessionCookie,
  validateCsrfToken,
  verifyPassword,
} from '@/lib/auth/session'

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000
const RATE_LIMIT_MAX_ATTEMPTS = 5

const attemptTracker = new Map<string, number[]>()

function recordAttempt(identifier: string, timestamp: number): void {
  const existing = attemptTracker.get(identifier) ?? []
  const filtered = existing.filter((entry) => timestamp - entry < RATE_LIMIT_WINDOW_MS)
  filtered.push(timestamp)
  attemptTracker.set(identifier, filtered)
}

function isRateLimited(identifier: string, timestamp: number): boolean {
  const existing = attemptTracker.get(identifier)
  if (!existing) return false
  const filtered = existing.filter((entry) => timestamp - entry < RATE_LIMIT_WINDOW_MS)
  attemptTracker.set(identifier, filtered)
  return filtered.length >= RATE_LIMIT_MAX_ATTEMPTS
}

function getRequestIp(request: NextRequest): string {
  const header = request.headers.get('x-forwarded-for')
  if (header) {
    return header.split(',')[0]?.trim() || 'unknown'
  }
  return request.ip || 'unknown'
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const now = Date.now()
  const ip = getRequestIp(request)

  if (isRateLimited(ip, now)) {
    const response = NextResponse.redirect(new URL('/admin/login?error=rate', request.url), {
      status: 303,
    })
    return response
  }

  const formData = await request.formData()
  const password = formData.get('password')
  const csrfToken = formData.get('csrfToken')

  if (typeof password !== 'string' || typeof csrfToken !== 'string') {
    recordAttempt(ip, now)
    const response = NextResponse.redirect(new URL('/admin/login?error=invalid', request.url), {
      status: 303,
    })
    return response
  }

  if (!validateCsrfToken(csrfToken)) {
    recordAttempt(ip, now)
    const response = NextResponse.redirect(new URL('/admin/login?error=csrf', request.url), {
      status: 303,
    })
    clearCsrfCookie(response)
    return response
  }

  const passwordValid = await verifyPassword(password)
  recordAttempt(ip, now)

  if (!passwordValid) {
    const response = NextResponse.redirect(new URL('/admin/login?error=invalid', request.url), {
      status: 303,
    })
    clearSessionCookie(response)
    return response
  }

  const sessionToken = mintSessionToken()
  const response = NextResponse.redirect(new URL('/admin', request.url), {
    status: 303,
  })
  setSessionCookie(response, sessionToken)
  clearCsrfCookie(response)
  attemptTracker.delete(ip)
  return response
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({ success: true })
  clearSessionCookie(response)
  clearCsrfCookie(response)
  attemptTracker.delete(getRequestIp(request))
  return response
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const existingSession = getSessionFromCookies()
  if (existingSession) {
    return NextResponse.json({ authenticated: true })
  }

  const csrfToken = mintCsrfToken()
  const response = NextResponse.json({ authenticated: false })
  setCsrfCookie(response, csrfToken)
  return response
}

