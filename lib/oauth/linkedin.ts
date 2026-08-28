export const linkedinOAuthConfig = {
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  authorizeUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
  userinfoUrl: 'https://api.linkedin.com/v2/userinfo',
  scope: 'openid profile email',
  stateCookieName: 'linkedin_oauth_state'
}

export function assertLinkedinConfigured() {
  if (!linkedinOAuthConfig.clientId || !linkedinOAuthConfig.clientSecret) {
    throw new Error(
      'LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set. See .env.example.'
    )
  }
}