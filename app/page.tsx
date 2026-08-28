'use client'

import { useState } from 'react'
import { JobDescriptionPanel } from '@/components/panels/JobDescriptionPanel'

export default function Home() {
  const [jobDescription, setJobDescription] = useState('')

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-signal" />
          <span className="text-lg font-semibold tracking-tight">sidepanel</span>
        </div>
        <span className="rounded-full border border-base-700 px-3 py-1 text-xs text-base-400">
          bring your own key
        </span>
      </header>

      <section className="mt-20 flex flex-col gap-4">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-base-50 sm:text-5xl">
          drop the job post. drop your resume.
          <span className="text-signal"> let it cook.</span>
        </h1>
        <p className="max-w-xl text-base text-base-400">
          sidepanel reads the role, pulls receipts from your github, hugging face
          and linkedin, and rewrites your resume so it actually matches, not
          keyword soup, just the truth, said better.
        </p>
      </section>

      <section className="mt-16 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
        <JobDescriptionPanel value={jobDescription} onChange={setJobDescription} />
        <div className="flex flex-col rounded-xl2 border border-base-700 bg-base-900 p-6">
          <span className="text-xs uppercase tracking-widest text-base-400">
            your resume
          </span>
          <div className="mt-4 flex-1 rounded-xl border border-dashed border-base-700 bg-base-950" />
        </div>
      </section>
    </main>
  )
}