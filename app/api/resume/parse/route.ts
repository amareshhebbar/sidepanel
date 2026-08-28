import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'

const MAX_SIZE_BYTES = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'no file provided' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'file too large, 10mb max' }, { status: 413 })
  }

  const isDocx =
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.toLowerCase().endsWith('.docx')

  if (!isDocx) {
    return NextResponse.json({ error: 'only .docx files are accepted here' }, { status: 400 })
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const result = await mammoth.extractRawText({ buffer })

    return NextResponse.json({ text: result.value })
  } catch {
    return NextResponse.json({ error: 'could not parse this docx file' }, { status: 422 })
  }
}