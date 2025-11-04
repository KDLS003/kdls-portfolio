import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { sessionConstants, validateSessionToken } from '@/lib/auth/session'

const ADMIN_LOGIN_PATH = '/admin/login'
const ADMIN_SESSION_API_PATH = '/api/admin/session'

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname.startsWith(ADMIN_LOGIN_PATH) || pathname.startsWith(ADMIN_SESSION_API_PATH)) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(sessionConstants.SESSION_COOKIE_NAME)?.value
  const session = validateSessionToken(sessionCookie)

  if (session) {
    return NextResponse.next()
  }

  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
  if (pathname !== ADMIN_LOGIN_PATH) {
    loginUrl.searchParams.set('from', pathname)
  }
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}

