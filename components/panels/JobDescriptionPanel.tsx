'use client'

const MAX_LENGTH = 20000

interface JobDescriptionPanelProps {
  value: string
  onChange: (value: string) => void
}

export function JobDescriptionPanel({ value, onChange }: JobDescriptionPanelProps) {
  return (
    <div className="flex h-full flex-col rounded-xl2 border border-base-700 bg-base-900 p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-base-400">
          the role
        </span>
        <span
          data-testid="jd-char-count"
          className={`text-xs ${value.length > MAX_LENGTH ? 'text-flag' : 'text-base-400'}`}
        >
          {value.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
        </span>
      </div>
      <textarea
        aria-label="job description"
        data-testid="jd-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={MAX_LENGTH}
        placeholder="paste the job post here. every requirement, every buzzword, all of it. the more you give sidepanel, the less it has to guess."
        className="mt-4 flex-1 resize-none rounded-xl border border-base-700 bg-base-950 p-4 text-sm text-base-50 placeholder:text-base-600 focus:border-signal focus:outline-none"
      />
    </div>
  )
}