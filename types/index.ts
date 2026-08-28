export type LlmProvider = 'anthropic' | 'gemini' | 'groq' | 'deepseek'

export interface SessionData {
  llmProvider?: LlmProvider
  llmKey?: string
  githubToken?: string
  hfToken?: string
  linkedinToken?: string
}

export const defaultSession: SessionData = {}