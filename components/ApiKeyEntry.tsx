'use client'

import { useEffect, useState } from 'react'
import type { LlmProvider } from '@/types'
import { providers } from '@/lib/llm/providers'

type Status = 'checking' | 'disconnected' | 'connecting' | 'connected' | 'error'

interface KeyStatusResponse {
  provider: LlmProvider | null
  hasKey: boolean
}

export function ApiKeyEntry() {
  const [status, setStatus] = useState<Status>('checking')
  const [selectedProvider, setSelectedProvider] = useState<LlmProvider>('anthropic')
  const [connectedProvider, setConnectedProvider] = useState<LlmProvider | null>(null)
  const [keyInput, setKeyInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    fetch('/api/llm/key')
      .then((response) => response.json())
      .then((data: KeyStatusResponse) => {
        if (cancelled) return
        if (data.hasKey && data.provider) {
          setConnectedProvider(data.provider)
          setStatus('connected')
        } else {
          setStatus('disconnected')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('disconnected')
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleConnect() {
    if (!keyInput.trim()) {
      setErrorMessage('paste a key first')
      return
    }

    setStatus('connecting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/llm/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: selectedProvider, key: keyInput })
      })

      if (!response.ok) {
        const data = await response.json()
        setErrorMessage(data.error ?? 'something went wrong')
        setStatus('error')
        return
      }

      setConnectedProvider(selectedProvider)
      setKeyInput('')
      setStatus('connected')
    } catch {
      setErrorMessage('could not reach the server')
      setStatus('error')
    }
  }

  async function handleDisconnect() {
    setStatus('connecting')

    try {
      await fetch('/api/llm/key', { method: 'DELETE' })
      setConnectedProvider(null)
      setStatus('disconnected')
    } catch {
      setErrorMessage('could not disconnect, try again')
      setStatus('error')
    }
  }

  if (status === 'checking') {
    return (
      <div
        data-testid="api-key-entry"
        className="rounded-xl2 border border-base-700 bg-base-900 p-4 text-xs text-base-400"
      >
        checking your setup...
      </div>
    )
  }

  if (status === 'connected' && connectedProvider) {
    const meta = providers.find((p) => p.id === connectedProvider)

    return (
      <div
        data-testid="api-key-entry"
        className="flex items-center justify-between rounded-xl2 border border-signal-dim bg-base-900 p-4"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal" />
          <span className="text-sm text-base-50">
            running on <span className="font-semibold">{meta?.label}</span>
          </span>
        </div>
        <button
          type="button"
          data-testid="disconnect-button"
          onClick={handleDisconnect}
          className="text-xs text-base-400 underline hover:text-flag"
        >
          disconnect
        </button>
      </div>
    )
  }

  const activeMeta = providers.find((p) => p.id === selectedProvider)!

  return (
    <div
      data-testid="api-key-entry"
      className="flex flex-col gap-3 rounded-xl2 border border-base-700 bg-base-900 p-4"
    >
      <span className="text-xs uppercase tracking-widest text-base-400">
        bring your own key
      </span>

      <div className="flex flex-wrap gap-2" role="group" aria-label="provider">
        {providers.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`provider-${p.id}`}
            onClick={() => setSelectedProvider(p.id)}
            aria-pressed={selectedProvider === p.id}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              selectedProvider === p.id
                ? 'border-signal bg-signal text-base-950'
                : 'border-base-700 text-base-400 hover:border-base-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="password"
          data-testid="key-input"
          value={keyInput}
          onChange={(event) => setKeyInput(event.target.value)}
          placeholder={activeMeta.placeholder}
          className="flex-1 rounded-lg border border-base-700 bg-base-950 px-3 py-2 text-sm text-base-50 placeholder:text-base-600 focus:border-signal focus:outline-none"
        />
        <button
          type="button"
          data-testid="connect-button"
          onClick={handleConnect}
          disabled={status === 'connecting'}
          className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-base-950 hover:bg-signal-dim disabled:opacity-50"
        >
          {status === 'connecting' ? 'connecting...' : 'connect'}
        </button>
      </div>

      <a href={activeMeta.keyUrl} target="_blank" rel="noreferrer" className="text-xs text-base-400 underline hover:text-signal">
        get a {activeMeta.label} key
      </a>

      {errorMessage && (
        <p data-testid="key-error" className="text-xs text-flag">
          {errorMessage}
        </p>
      )}
    </div>
  )
}