import { useEffect, useRef, useState } from 'react'
import { X, ArrowUpRight } from 'lucide-react'
import type { WordDetailContext } from '../../lib/api'
import { streamWordDetail } from '../../lib/api'
import NeighbourhoodCloud from './NeighbourhoodCloud'
import TeacherBriefing from './TeacherBriefing'
import TrajectoryTimeline from './TrajectoryTimeline'

interface WordDetailPanelProps {
  conceptId: number | null
  unit: string
  chapter: string
  onClose: () => void
  onWordSelect: (conceptId: number) => void
}

type BriefingStatus = 'idle' | 'loading' | 'streaming' | 'done' | 'error'

export default function WordDetailPanel({
  conceptId,
  unit,
  chapter,
  onClose,
  onWordSelect,
}: WordDetailPanelProps) {
  const [ctx, setCtx]             = useState<WordDetailContext | null>(null)
  const [briefing, setBriefing]   = useState('')
  const [status, setStatus]       = useState<BriefingStatus>('idle')
  const [briefingError, setBriefingError] = useState<string | undefined>()
  const abortRef = useRef<AbortController | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const prevFocusRef = useRef<Element | null>(null)
  const open = conceptId !== null

  // Esc to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Focus management
  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement
      closeButtonRef.current?.focus()
    } else {
      if (prevFocusRef.current instanceof HTMLElement) {
        prevFocusRef.current.focus()
      }
    }
  }, [open])

  function startStream(id: number) {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setCtx(null)
    setBriefing('')
    setStatus('loading')
    setBriefingError(undefined)

    streamWordDetail(id, unit, chapter, {
      signal: controller.signal,
      onContext: c => { setCtx(c); setStatus('streaming') },
      onToken:   t => setBriefing(prev => prev + t),
      onDone:    () => setStatus('done'),
      onError:   msg => { setBriefingError(msg); setStatus('error') },
    })
  }

  useEffect(() => {
    if (conceptId !== null) {
      startStream(conceptId)
    } else {
      abortRef.current?.abort()
    }
    return () => abortRef.current?.abort()
  }, [conceptId]) // eslint-disable-line react-hooks/exhaustive-deps

  const concept = ctx?.concept

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-ink/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-full md:w-[520px] z-50 bg-cream border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Word detail"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink leading-tight">
              {concept?.term ?? '…'}
            </h2>
            {concept && (
              <p className="text-xs text-slate-500 mt-0.5">
                {concept.tier ? `Tier ${concept.tier}` : ''}
                {concept.register ? ` · ${concept.register}` : ''}
              </p>
            )}
            {ctx && ctx.bridge_details.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-owl-green mt-1">
                <ArrowUpRight size={12} />
                Bridge word: also in {ctx.bridge_details.map(b => b.other_subject).join(', ')}
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="shrink-0 text-slate-400 hover:text-ink transition-colors p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-owl-purple"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Neighbourhood */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Conceptual Neighbourhood
            </h3>
            {ctx
              ? <NeighbourhoodCloud neighbourhood={ctx.neighbourhood} onWordSelect={onWordSelect} />
              : <div className="h-16 bg-parchment animate-pulse rounded-lg" />
            }
          </section>

          {/* Briefing */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Teacher Briefing
            </h3>
            <TeacherBriefing
              text={briefing}
              term={concept?.term}
              status={status}
              error={briefingError}
              onRetry={conceptId !== null ? () => startStream(conceptId) : undefined}
            />
          </section>

          {/* Trajectory */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Curriculum Trajectory
            </h3>
            {ctx
              ? <TrajectoryTimeline trajectory={ctx.trajectory} />
              : <div className="h-24 bg-parchment animate-pulse rounded-lg" />
            }
          </section>
        </div>
      </div>
    </>
  )
}
