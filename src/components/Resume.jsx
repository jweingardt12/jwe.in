'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/Button'
import { BriefcaseIcon, ArrowDownIcon } from '@/components/Icons' // You'll need to move these icons to a separate file

function Role({ role }) {
  let startLabel =
    typeof role.start === 'string' ? role.start : role.start.label
  let startDate =
    typeof role.start === 'string' ? role.start : role.start.dateTime

  let endLabel = typeof role.end === 'string' ? role.end : role.end.label
  let endDate = typeof role.end === 'string' ? role.end : role.end.dateTime

  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
      </div>
      <dl className="flex flex-auto flex-wrap gap-x-2">
        <dt className="sr-only">Company</dt>
        <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {role.company}
        </dd>
        <dt className="sr-only">Role</dt>
        <dd className="text-xs text-zinc-500 dark:text-zinc-400">
          {role.title}
        </dd>
        <dt className="sr-only">Date</dt>
        <dd
          className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
          aria-label={`${startLabel} until ${endLabel}`}
        >
          <time dateTime={startDate}>{startLabel}</time>{' '}
          <span aria-hidden="true">—</span>{' '}
          <time dateTime={endDate}>{endLabel}</time>
        </dd>
      </dl>
    </li>
  )
}

export function Resume({ resume }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [downloadReason, setDownloadReason] = useState('')

  const handleDownload = () => {
    if (downloadReason) {
      // Implement actual download logic here
      console.log('Downloading CV. Reason:', downloadReason)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Work</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <Role key={roleIndex} role={role} />
        ))}
      </ol>
      <Button
        variant="secondary"
        className="group mt-6 w-full"
        onClick={() => setIsDialogOpen(true)}
      >
        Download CV
        <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
      </Button>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-zinc-800">
            <h3 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
              Quickk ask - who are you?
            </h3>
            <div className="space-y-3">
              {[
                { value: 'hiring', label: 'Hiring Manager / Recruiter' },
                { value: 'collaboration', label: 'Potential Collaboration' },
                { value: 'research', label: 'Research / Background Check' },
                { value: 'other', label: 'Other' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                >
                  <input
                    type="radio"
                    name="downloadReason"
                    value={option.value}
                    checked={downloadReason === option.value}
                    onChange={(e) => setDownloadReason(e.target.value)}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-500"
                  />
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDownload}
                disabled={!downloadReason}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
