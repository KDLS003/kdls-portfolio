import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'admin_session'
const CSRF_FIELD_NAME = 'csrfToken'
const SESSION_TTL_MS = 1000 * 60 * 60 // 1 hour
const CSRF_TTL_MS = 1000 * 60 * 10 // 10 minutes
const SESSION_SECRET_ENV = 'ADMIN_SESSION_SECRET'
const PASSWORD_HASH_ENV = 'ADMIN_PASSWORD_HASH'

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
}

const CSRF_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
}

type SignedTokenPayload = {
  type: 'session' | 'csrf'
  token: string
  issuedAt: number
  expiresAt: number
}

type ValidatedSession = SignedTokenPayload & { type: 'session' }

const SCRYPT_KEY_LEN = 64
const SCRYPT_DEFAULTS = {
  N: 2 ** 15,
  r: 8,
  p: 1,
}

const DEFAULT_PLACEHOLDER_SECRET = crypto
  .createHash('sha256')
  .update('admin-session-placeholder-secret')
  .digest('hex')

const DUMMY_PASSWORD_HASH = (() => {
  const salt = crypto.randomBytes(16).toString('base64')
  const derived = crypto.randomBytes(32).toString('base64')
  return `scrypt$${SCRYPT_DEFAULTS.N}$${SCRYPT_DEFAULTS.r}$${SCRYPT_DEFAULTS.p}$${salt}$${derived}`
})()

function getSessionSecret(): string {
  return process.env[SESSION_SECRET_ENV] || DEFAULT_PLACEHOLDER_SECRET
}

function getStoredPasswordHash(): string {
  return process.env[PASSWORD_HASH_ENV] || DUMMY_PASSWORD_HASH
}

function timingSafeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)
  if (aBuffer.length !== bBuffer.length) {
    return false
  }
  return crypto.timingSafeEqual(aBuffer, bBuffer)
}

async function scryptHash(
  password: string,
  salt: Buffer,
  options: typeof SCRYPT_DEFAULTS = SCRYPT_DEFAULTS,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_KEY_LEN, options, (error, derivedKey) => {
      if (error) {
        reject(error)
        return
      }
      resolve(derivedKey)
    })
  })
}

function encodeSignedToken(payload: SignedTokenPayload): string {
  const secret = getSessionSecret()
  const serialized = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(serialized).digest('base64url')
  return `${serialized}.${signature}`
}

function decodeSignedToken(token: string | undefined | null): SignedTokenPayload | null {
  if (!token) return null
  const [serialized, signature] = token.split('.')
  if (!serialized || !signature) return null
  const secret = getSessionSecret()
  const expectedSignature = crypto.createHmac('sha256', secret).update(serialized).digest('base64url')
  if (!timingSafeCompare(expectedSignature, signature)) return null
  try {
    const payload = JSON.parse(Buffer.from(serialized, 'base64url').toString()) as SignedTokenPayload
    return payload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16)
  const derived = await scryptHash(password, salt)
  return `scrypt$${SCRYPT_DEFAULTS.N}$${SCRYPT_DEFAULTS.r}$${SCRYPT_DEFAULTS.p}$${salt.toString('base64')}$${derived.toString('base64')}`
}

export async function verifyPassword(password: string): Promise<boolean> {
  const storedHash = getStoredPasswordHash()
  const parts = storedHash.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') {
    // Unsupported format – fall back to constant-time comparison against dummy hash
    await scryptHash(password, crypto.randomBytes(16)).catch(() => undefined)
    return false
  }
  const [, nStr, rStr, pStr, saltBase64, hashBase64] = parts
  const N = Number(nStr)
  const r = Number(rStr)
  const p = Number(pStr)
  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) {
    return false
  }
  const salt = Buffer.from(saltBase64, 'base64')
  const expected = Buffer.from(hashBase64, 'base64')
  try {
    const derived = await scryptHash(password, salt, {
      N,
      r,
      p,
    })
    if (derived.length !== expected.length) return false
    return crypto.timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}

export function mintSessionToken(): string {
  const now = Date.now()
  const payload: SignedTokenPayload = {
    type: 'session',
    token: crypto.randomBytes(32).toString('base64url'),
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  }
  return encodeSignedToken(payload)
}

export function validateSessionToken(token: string | undefined | null): ValidatedSession | null {
  const payload = decodeSignedToken(token)
  if (!payload || payload.type !== 'session') return null
  if (payload.expiresAt <= Date.now()) return null
  return payload
}

export function mintCsrfToken(): string {
  const now = Date.now()
  const payload: SignedTokenPayload = {
    type: 'csrf',
    token: crypto.randomBytes(32).toString('base64url'),
    issuedAt: now,
    expiresAt: now + CSRF_TTL_MS,
  }
  return encodeSignedToken(payload)
}

export function validateCsrfToken(token: string | undefined | null): boolean {
  const payload = decodeSignedToken(token)
  if (!payload || payload.type !== 'csrf') return false
  if (payload.expiresAt <= Date.now()) return false
  return true
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  })
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  })
}

export function setCsrfCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_FIELD_NAME, token, {
    ...CSRF_COOKIE_OPTIONS,
    maxAge: Math.floor(CSRF_TTL_MS / 1000),
  })
}

export function clearCsrfCookie(response: NextResponse): void {
  response.cookies.set(CSRF_FIELD_NAME, '', {
    ...CSRF_COOKIE_OPTIONS,
    maxAge: 0,
  })
}

export function getSessionFromCookies(): ValidatedSession | null {
  const store = cookies()
  const token = store.get(SESSION_COOKIE_NAME)?.value
  return validateSessionToken(token)
}

export function getCsrfTokenFromCookies(): string | null {
  const store = cookies()
  return store.get(CSRF_FIELD_NAME)?.value ?? null
}

export const sessionConstants = {
  SESSION_COOKIE_NAME,
  CSRF_FIELD_NAME,
  SESSION_TTL_MS,
  CSRF_TTL_MS,
}

