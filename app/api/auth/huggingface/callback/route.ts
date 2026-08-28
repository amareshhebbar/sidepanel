import { NextRequest, NextResponse } from "next/server"
import { assertHuggingfaceConfigured, huggingfaceOAuthConfig } from "@/lib/oauth/huggingface"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  assertHuggingfaceConfigured()

  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")
  const storedState = request.cookies.get(huggingfaceOAuthConfig.stateCookieName)?.value

  if (!code) {
    return NextResponse.json({ error: "missing code" }, { status: 400 })
  }

  if (!state || !storedState || state !== storedState) {
    return NextResponse.json({ error: "state mismatch" }, { status: 400 })
  }

  const redirectUri = new URL("/api/auth/huggingface/callback", request.nextUrl.origin).toString()

  const basicAuth = Buffer.from(
    `${huggingfaceOAuthConfig.clientId}:${huggingfaceOAuthConfig.clientSecret}`
  ).toString("base64")

  const tokenBody = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri
  })

  const tokenResponse = await fetch(huggingfaceOAuthConfig.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`
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

  const userinfoResponse = await fetch(huggingfaceOAuthConfig.userinfoUrl, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`
    }
  })

  if (!userinfoResponse.ok) {
    return NextResponse.json({ error: "userinfo fetch failed" }, { status: 502 })
  }

  const userinfo = (await userinfoResponse.json()) as {
    preferred_username?: string
    name?: string
    picture?: string
  }

  const session = await getSession()
  session.hfToken = tokenData.access_token
  session.hfProfile = {
    username: userinfo.preferred_username,
    name: userinfo.name,
    picture: userinfo.picture
  }
  await session.save()

  const redirectResponse = NextResponse.redirect(new URL("/?connected=huggingface", request.nextUrl.origin))
  redirectResponse.cookies.delete(huggingfaceOAuthConfig.stateCookieName)

  return redirectResponse
}