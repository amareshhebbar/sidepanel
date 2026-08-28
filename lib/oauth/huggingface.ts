export const huggingfaceOAuthConfig = {
  clientId: process.env.HUGGINGFACE_CLIENT_ID,
  clientSecret: process.env.HUGGINGFACE_CLIENT_SECRET,
  authorizeUrl: 'https://huggingface.co/oauth/authorize',
  tokenUrl: 'https://huggingface.co/oauth/token',
  userinfoUrl: 'https://huggingface.co/oauth/userinfo',
  scope: 'openid profile read-repos',
  stateCookieName: 'huggingface_oauth_state'
}

export function assertHuggingfaceConfigured() {
  if (!huggingfaceOAuthConfig.clientId || !huggingfaceOAuthConfig.clientSecret) {
    throw new Error(
      'HUGGINGFACE_CLIENT_ID and HUGGINGFACE_CLIENT_SECRET must be set. See .env.example.'
    )
  }
}