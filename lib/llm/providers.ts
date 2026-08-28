import type { LlmProvider } from '@/types'

export interface ProviderMeta {
  id: LlmProvider
  label: string
  placeholder: string
  keyUrl: string
}

export const providers: ProviderMeta[] = [
  {
    id: 'anthropic',
    label: 'Claude',
    placeholder: 'sk-ant-...',
    keyUrl: 'https://console.anthropic.com/settings/keys'
  },
  {
    id: 'gemini',
    label: 'Gemini',
    placeholder: 'AIza...',
    keyUrl: 'https://aistudio.google.com/apikey'
  },
  {
    id: 'groq',
    label: 'Groq',
    placeholder: 'gsk_...',
    keyUrl: 'https://console.groq.com/keys'
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    placeholder: 'sk-...',
    keyUrl: 'https://platform.deepseek.com/api_keys'
  }
]