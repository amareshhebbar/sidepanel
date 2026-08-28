import { getIronSession, type IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { defaultSession, type SessionData } from '@/types'

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error(
    'SESSION_SECRET must be set and at least 32 characters. See .env.example.'
  )
}

export const sessionOptions = {
  password: sessionSecret,
  cookieName: 'sidepanel_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7
  }
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  if (!session.llmProvider && !session.llmKey) {
    Object.assign(session, defaultSession)
  }

  return session
}