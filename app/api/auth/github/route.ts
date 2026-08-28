import { assertGithubConfigured, githubOAuthConfig } from "@/lib/oauth/github";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  assertGithubConfigured();
  const state = randomBytes(16).toString("hex");
  const redirectUri = new URL(
    "/api/auth/github/callback",
    request.nextUrl.origin).toString()
  
  const authorizeUrl = new URL(githubOAuthConfig.authorizeUrl);
  authorizeUrl.searchParams.set("client_id", githubOAuthConfig.clientId!);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", githubOAuthConfig.scope);
  authorizeUrl.searchParams.set("state", state);

  const response=NextResponse.redirect(authorizeUrl)
  response.cookies.set(githubOAuthConfig.stateCookieName, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV =="production",
    sameSite: "lax",
    maxAge:60*60,
    path:"/"
  })
  return response
}
