import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

interface TeacherBriefingProps {
  text: string
  term?: string
  status: 'idle' | 'loading' | 'streaming' | 'done' | 'error'
  error?: string
  onRetry?: () => void
}

function renderWithBold(text: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase()
      ? <strong key={i} className="font-semibold">{part}</strong>
      : part
  )
}

export default function TeacherBriefing({ text, term, status, error, onRetry }: TeacherBriefingProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (status === 'idle') return null

  if (status === 'error') {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-3">
        <span className="flex-1">{error ?? 'Failed to generate briefing.'}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-red-100 hover:bg-red-200 transition-colors"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      {status === 'done' && (
        <button
          onClick={handleCopy}
          className="absolute top-0 right-0 flex items-center gap-1 text-xs text-slate-400 hover:text-ink px-2 py-1 rounded transition-colors"
          title="Copy briefing"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      )}
      <p className="font-serif text-base leading-relaxed text-ink whitespace-pre-wrap pr-10">
        {text && term ? renderWithBold(text, term) : (text || ' ')}
        {(status === 'loading' || status === 'streaming') && (
          <span className="animate-pulse text-owl-purple">▋</span>
        )}
      </p>
    </div>
  )
}
