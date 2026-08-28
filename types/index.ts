export type LlmProvider = "anthropic" | "gemini" | "groq" | "deepseek"

export interface LinkedinProfile {
  name?: string
  email?: string
  picture?: string
}

export interface HuggingfaceProfile {
  username?: string
  name?: string
  picture?: string
}

export interface SessionData {
  llmProvider?: LlmProvider
  llmKey?: string
  githubToken?: string
  hfToken?: string
  hfProfile?: HuggingfaceProfile
  linkedinToken?: string
  linkedinProfile?: LinkedinProfile
  linkedinManualPaste?: string
}

export const defaultSession: SessionData = {}