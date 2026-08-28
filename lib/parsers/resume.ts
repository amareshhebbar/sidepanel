import { extractPdfText } from './pdf'

export class UnsupportedFileTypeError extends Error {}

export async function parseResumeFile(file: File): Promise<string> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.txt') || file.type === 'text/plain') {
    return file.text()
  }

  if (name.endsWith('.pdf') || file.type === 'application/pdf') {
    return extractPdfText(file)
  }

  if (
    name.endsWith('.docx') ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/resume/parse', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error ?? 'could not parse this file')
    }

    const data = (await response.json()) as { text: string }
    return data.text
  }

  throw new UnsupportedFileTypeError(
    'only .pdf, .docx, and .txt files are supported'
  )
}