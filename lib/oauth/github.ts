export const githubOAuthConfig ={
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  authorizeUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  scope: "read:user public_repo",
  stateCookieName: "github_oauth_state"
}


export function assertGithubConfigured(){
    if (!githubOAuthConfig.clientId || !githubOAuthConfig.clientSecret){
        throw new Error("GITHUB_CLIENT_ID and GITHUB_CLIENT_SCERET must be set")
    }
}
