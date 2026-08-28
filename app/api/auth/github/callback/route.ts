import { NextRequest, NextResponse } from "next/server"
import { assertGithubConfigured, githubOAuthConfig } from "@/lib/oauth/github"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  assertGithubConfigured()

  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")
  const storedState = request.cookies.get(githubOAuthConfig.stateCookieName)?.value

  if (!code) {
    return NextResponse.json({ error: "missing code" }, { status: 400 })
  }

  if (!state || !storedState || state !== storedState) {
    return NextResponse.json({ error: "state mismatch" }, { status: 400 })
  }

  const redirectUri = new URL("/api/auth/github/callback", request.nextUrl.origin).toString()

  const tokenResponse = await fetch(githubOAuthConfig.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      client_id: githubOAuthConfig.clientId,
      client_secret: githubOAuthConfig.clientSecret,
      code,
      redirect_uri: redirectUri
    })
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

  const session = await getSession()
  session.githubToken = tokenData.access_token
  await session.save()

  const redirectResponse = NextResponse.redirect(new URL("/?connected=github", request.nextUrl.origin))
  redirectResponse.cookies.delete(githubOAuthConfig.stateCookieName)

  return redirectResponse
}