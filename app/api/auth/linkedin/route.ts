import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { assertLinkedinConfigured, linkedinOAuthConfig } from "@/lib/oauth/linkedin"

export async function GET(request: NextRequest) {
  assertLinkedinConfigured()

  const state = randomBytes(16).toString("hex")
  const redirectUri = new URL("/api/auth/linkedin/callback", request.nextUrl.origin).toString()

  const authorizeUrl = new URL(linkedinOAuthConfig.authorizeUrl)
  authorizeUrl.searchParams.set("response_type", "code")
  authorizeUrl.searchParams.set("client_id", linkedinOAuthConfig.clientId!)
  authorizeUrl.searchParams.set("redirect_uri", redirectUri)
  authorizeUrl.searchParams.set("scope", linkedinOAuthConfig.scope)
  authorizeUrl.searchParams.set("state", state)

  const response = NextResponse.redirect(authorizeUrl)
  response.cookies.set(linkedinOAuthConfig.stateCookieName, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/"
  })

  return response
}