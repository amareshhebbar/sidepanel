import { NextRequest, NextResponse } from "next/server"
import { assertLinkedinConfigured, linkedinOAuthConfig } from "@/lib/oauth/linkedin"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  assertLinkedinConfigured()

  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")
  const storedState = request.cookies.get(linkedinOAuthConfig.stateCookieName)?.value

  if (!code) {
    return NextResponse.json({ error: "missing code" }, { status: 400 })
  }

  if (!state || !storedState || state !== storedState) {
    return NextResponse.json({ error: "state mismatch" }, { status: 400 })
  }

  const redirectUri = new URL("/api/auth/linkedin/callback", request.nextUrl.origin).toString()

  const tokenBody = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: linkedinOAuthConfig.clientId!,
    client_secret: linkedinOAuthConfig.clientSecret!
  })

  const tokenResponse = await fetch(linkedinOAuthConfig.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: tokenBody.toString()
  })

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: "token exchange failed" }, { status: 502 })
  }

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string
    error?: string
    error_description?: string
  }

  if (!tokenData.access_token) {
    return NextResponse.json(
      { error: tokenData.error ?? "no access token returned", detail: tokenData.error_description },
      { status: 502 }
    )
  }

  const userinfoResponse = await fetch(linkedinOAuthConfig.userinfoUrl, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`
    }
  })

  if (!userinfoResponse.ok) {
    return NextResponse.json({ error: "userinfo fetch failed" }, { status: 502 })
  }

  const userinfo = (await userinfoResponse.json()) as {
    name?: string
    email?: string
    picture?: string
  }

  const session = await getSession()
  session.linkedinToken = tokenData.access_token
  session.linkedinProfile = {
    name: userinfo.name,
    email: userinfo.email,
    picture: userinfo.picture
  }
  await session.save()

  const redirectResponse = NextResponse.redirect(new URL("/?connected=linkedin", request.nextUrl.origin))
  redirectResponse.cookies.delete(linkedinOAuthConfig.stateCookieName)

  return redirectResponse
}