'use client'

import { useRef, useState } from 'react'
import { parseResumeFile, UnsupportedFileTypeError } from '@/lib/parsers/resume'

type Status = 'parsing' | 'error' | 'idle'

interface ResumePanelProps {
  value: string
  onChange: (value: string) => void
  fileName: string | null
  onFileNameChange: (name: string | null) => void
}

export function ResumePanel({ value, onChange, fileName, onFileNameChange }: ResumePanelProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setStatus('parsing')
    setErrorMessage('')

    try {
      const text = await parseResumeFile(file)
      onChange(text)
      onFileNameChange(file.name)
      setStatus('idle')
    } catch (error) {
      if (error instanceof UnsupportedFileTypeError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('something went wrong reading that file')
      }
      setStatus('error')
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) handleFile(file)
    event.target.value = ''
  }

  function handleClear() {
    onChange('')
    onFileNameChange(null)
    setStatus('idle')
    setErrorMessage('')
  }

  if (status !== 'parsing' && fileName) {
    return (
      <div
        data-testid="resume-panel"
        className="flex h-full flex-col rounded-xl2 border border-base-700 bg-base-900 p-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-base-400">
            your resume
          </span>
          <div className="flex items-center gap-3">
            <span data-testid="resume-filename" className="text-xs text-base-400">
              {fileName}
            </span>
            <button
              type="button"
              data-testid="resume-clear"
              onClick={handleClear}
              className="text-xs text-base-400 underline hover:text-flag"
            >
              replace
            </button>
          </div>
        </div>
        <textarea
          aria-label="resume text"
          data-testid="resume-textarea"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-4 flex-1 resize-none rounded-xl border border-base-700 bg-base-950 p-4 text-sm text-base-50 focus:border-signal focus:outline-none"
        />
      </div>
    )
  }

  return (
    <div
      data-testid="resume-panel"
      className="flex h-full flex-col rounded-xl2 border border-base-700 bg-base-900 p-6"
    >
      <span className="text-xs uppercase tracking-widest text-base-400">
        your resume
      </span>
      <div
        data-testid="resume-dropzone"
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`mt-4 flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center transition-colors ${
          isDragging ? 'border-signal bg-base-950' : 'border-base-700 bg-base-950'
        }`}
      >
        {status === 'parsing' ? (
          <p className="text-sm text-base-400">reading your resume...</p>
        ) : (
          <>
            <p className="text-sm text-base-50">
              drop your resume here, or click to browse
            </p>
            <p className="text-xs text-base-600">pdf, docx, or txt</p>
          </>
        )}
        {status === 'error' && (
          <p data-testid="resume-error" className="text-xs text-flag">
            {errorMessage}
          </p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        data-testid="resume-file-input"
        accept=".pdf,.docx,.txt"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}