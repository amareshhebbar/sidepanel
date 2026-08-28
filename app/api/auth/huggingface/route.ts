import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { assertHuggingfaceConfigured, huggingfaceOAuthConfig } from "@/lib/oauth/huggingface"

export async function GET(request: NextRequest) {
  assertHuggingfaceConfigured()

  const state = randomBytes(16).toString("hex")
  const redirectUri = new URL("/api/auth/huggingface/callback", request.nextUrl.origin).toString()

  const authorizeUrl = new URL(huggingfaceOAuthConfig.authorizeUrl)
  authorizeUrl.searchParams.set("client_id", huggingfaceOAuthConfig.clientId!)
  authorizeUrl.searchParams.set("redirect_uri", redirectUri)
  authorizeUrl.searchParams.set("scope", huggingfaceOAuthConfig.scope)
  authorizeUrl.searchParams.set("state", state)
  authorizeUrl.searchParams.set("response_type", "code")

  const response = NextResponse.redirect(authorizeUrl)
  response.cookies.set(huggingfaceOAuthConfig.stateCookieName, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/"
  })

  return response
}