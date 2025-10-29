import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import pool from '@/lib/db'
import { ensureUserInformationTable } from '@/lib/schema'

type UserInformationPayload = {
  fullName: string
  email: string
  company?: string
  role?: string
  location?: string
  projectContext?: string
  goals?: string
  timeline?: string
  budget?: string
  message?: string
  linkedinUrl?: string
  githubUrl?: string
  websiteUrl?: string
  referralSource?: string
  availability?: string
  collaborationIdeas?: string
}

type FieldKey = keyof UserInformationPayload

const FIELD_TO_COLUMN: Record<FieldKey, string> = {
  fullName: 'full_name',
  email: 'email',
  company: 'company',
  role: 'role',
  location: 'location',
  projectContext: 'project_context',
  goals: 'goals',
  timeline: 'timeline',
  budget: 'budget',
  message: 'message',
  linkedinUrl: 'linkedin_url',
  githubUrl: 'github_url',
  websiteUrl: 'website_url',
  referralSource: 'referral_source',
  availability: 'availability',
  collaborationIdeas: 'collaboration_ideas',
}

const normalizeValue = (value: unknown): string | null => {
  if (value === undefined || value === null) return null

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  try {
    const serialized = JSON.stringify(value)
    return serialized.length > 0 ? serialized : null
  } catch (error) {
    console.error('Failed to serialise user information field', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  let payload: Partial<UserInformationPayload>

  try {
    payload = (await request.json()) as Partial<UserInformationPayload>
  } catch (error) {
    console.error('Invalid JSON payload received', error)
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const fullName = normalizeValue(payload.fullName)
  const email = normalizeValue(payload.email)

  if (!fullName || !email) {
    return NextResponse.json(
      { error: 'Both fullName and email are required to submit user information.' },
      { status: 400 },
    )
  }

  await ensureUserInformationTable()

  const columns: string[] = []
  const placeholders: string[] = []
  const values: Array<string> = []

  (Object.entries(FIELD_TO_COLUMN) as Array<[FieldKey, string]>).forEach(([field, column]) => {
    const normalised = normalizeValue(payload[field])

    if (normalised !== null) {
      columns.push(column)
      placeholders.push('?')
      values.push(normalised)
    }
  })

  if (!columns.includes('full_name')) {
    columns.unshift('full_name')
    placeholders.unshift('?')
    values.unshift(fullName)
  }

  if (!columns.includes('email')) {
    const index = columns.indexOf('full_name') + 1
    columns.splice(index, 0, 'email')
    placeholders.splice(index, 0, '?')
    values.splice(index, 0, email)
  }

  const insertStatement = `INSERT INTO user_information (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`

  try {
    await pool.execute(insertStatement, values)
  } catch (error) {
    console.error('Failed to persist user information', error)
    return NextResponse.json({ error: 'Failed to save the submitted information.' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
