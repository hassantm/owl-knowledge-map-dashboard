import { useState, useDeferredValue } from 'react'
import { useTimelineData } from '../lib/useTimelineData'
import { VOCAB_SUBJECT_META } from '../lib/colours'
import type { VocabSubject, VocabBooklet } from '../lib/vocabData'
import VocabPill from '../components/vocabulary/VocabPill'
import BookletCard from '../components/vocabulary/BookletCard'
import HighlightControls from '../components/vocabulary/HighlightControls'
import { DEFAULT_HIGHLIGHT, type HighlightState } from '../components/vocabulary/highlightTypes'

type TabView = 'matrix' | 'booklets'

const SUBJECTS: VocabSubject[] = ['History', 'Geography', 'Religion']
const YEARS = ['3', '4', '5', '6']

export default function VocabTimelineView() {
  const { data, loading, error } = useTimelineData()

  const [view, setView] = useState<TabView>('matrix')
  const [yearFilter, setYearFilter] = useState('all')
  const [subjectFilter, setSubjectFilter] = useState<VocabSubject | 'all'>('all')
  const [highlight, setHighlight] = useState<HighlightState>(DEFAULT_HIGHLIGHT)
  const [hoverWord, setHoverWord] = useState<string | null>(null)
  const deferredTrace = useDeferredValue(highlight.traceWord)

  const patchHighlight = (patch: Partial<HighlightState>) =>
    setHighlight(s => ({ ...s, ...patch }))

  const visibleRows = (data?.rows ?? []).filter(r => {
    if (yearFilter !== 'all' && r.year !== yearFilter) return false
    return true
  })

  const visibleSubjects: VocabSubject[] = subjectFilter === 'all' ? SUBJECTS : [subjectFilter]

  if (error) {
    return (
      <div className="min-h-screen bg-[#fcfcfa] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-2">Failed to load vocabulary data</p>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fcfcfa]">
      {/* Page header */}
      <div className="max-w-[1640px] mx-auto px-6 pt-8 pb-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
          OWL Knowledge Map · Vocabulary
        </div>
        <h1 className="text-3xl font-serif text-ink mb-1">Vocabulary Timeline</h1>
        <p className="text-sm text-slate-500 mb-4">
          Curriculum vocabulary across Years 3–6, organised by term and subject. Words appearing in multiple units are sized and highlighted by reach.
        </p>

        {/* Tab toggle */}
        <div
          role="tablist"
          className="inline-flex items-center border border-slate-200 rounded-[14px] bg-white p-0.5 gap-0.5 mb-4"
        >
          {(['matrix', 'booklets'] as TabView[]).map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={view === t}
              onClick={() => setView(t)}
              style={view === t ? { background: '#1a1a1a', color: '#fff' } : undefined}
              className={`px-4 py-1 rounded-[11px] text-sm transition-colors capitalize ${
                view === t ? '' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Subject filter */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Subject</span>
          <div className="inline-flex items-center border border-slate-200 rounded-[14px] bg-white p-0.5 gap-0.5">
            {(['all', ...SUBJECTS] as const).map(s => (
              <button
                key={s}
                onClick={() => setSubjectFilter(s as VocabSubject | 'all')}
                style={subjectFilter === s ? { background: '#1a1a1a', color: '#fff' } : undefined}
                className={`px-3 py-0.5 rounded-[11px] text-xs transition-colors ${
                  subjectFilter === s ? '' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s === 'all' ? 'All' : s === 'Religion' ? 'R&W' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight + year controls */}
        <HighlightControls
          state={highlight}
          onChange={patchHighlight}
          years={YEARS}
          yearFilter={yearFilter}
          onYearFilter={setYearFilter}
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="max-w-[1640px] mx-auto px-6 py-16 text-center">
          <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-owl-purple rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-400">Loading vocabulary data…</p>
        </div>
      )}

      {/* Matrix view */}
      {!loading && view === 'matrix' && (
        <div className="max-w-[1640px] mx-auto px-6 pb-12">
          {/* Sticky column header */}
          <div
            className="grid gap-3 mb-0 bg-[#fcfcfa] z-10"
            style={{
              gridTemplateColumns: subjectFilter === 'all' ? '84px 1fr 1fr 1fr' : '84px 1fr',
              position: 'sticky',
              top: 56,
              paddingTop: 8,
              paddingBottom: 8,
              borderBottom: '1px solid #e8e4de',
            }}
          >
            <div />
            {visibleSubjects.map(s => {
              const meta = VOCAB_SUBJECT_META[s]
              return (
                <div
                  key={s}
                  style={{ borderLeft: `3px solid ${meta.color}`, paddingLeft: 10, color: meta.ink }}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  {meta.name}
                </div>
              )
            })}
          </div>

          {/* Rows */}
          {visibleRows.map((row) => (
            <div
              key={`${row.year}-${row.term}`}
              className="grid gap-3 py-5 border-b border-[#ece9e3]"
              style={{ gridTemplateColumns: subjectFilter === 'all' ? '84px 1fr 1fr 1fr' : '84px 1fr' }}
            >
              {/* Year + term label */}
              <div className="pt-1">
                <div className="text-xs font-bold text-slate-700">Y{row.year}</div>
                <div className="text-[11px] text-slate-400">{data?.meta.termLabels[row.term]}</div>
              </div>

              {/* Subject columns */}
              {visibleSubjects.map(s => {
                const meta = VOCAB_SUBJECT_META[s]
                const booklets = row.cols[s] ?? []
                return (
                  <div key={s} className="flex flex-col gap-3">
                    {booklets.length === 0 ? (
                      <div className="text-[11px] text-slate-300 italic">—</div>
                    ) : (
                      booklets.map(bk => (
                        <BookletBlock
                          key={bk.id}
                          booklet={bk}
                          subject={meta}
                          highlight={highlight}
                          deferredTrace={deferredTrace}
                          hoverWord={hoverWord}
                          onHover={setHoverWord}
                        />
                      ))
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Booklets view */}
      {!loading && view === 'booklets' && (
        <div className="max-w-[1640px] mx-auto px-6 pb-12">
          {/* Year tabs */}
          <div className="flex items-center gap-2 mb-6 pt-2">
            {YEARS.map(y => (
              <button
                key={y}
                onClick={() => setYearFilter(y === yearFilter ? 'all' : y)}
                style={
                  yearFilter === y
                    ? { background: '#1a1a1a', color: '#fff' }
                    : undefined
                }
                className={`px-4 py-1.5 rounded-[12px] text-sm font-medium border border-slate-200 transition-colors ${
                  yearFilter === y ? '' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Y{y}
              </button>
            ))}
            {yearFilter !== 'all' && (
              <button
                onClick={() => setYearFilter('all')}
                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-600"
              >
                Show all
              </button>
            )}
            {/* Reach scale legend */}
            <div className="ml-auto flex items-end gap-3 text-slate-400">
              <span className="text-[10px] uppercase tracking-wide font-semibold">Reach:</span>
              {[1, 2, 3, 4].map(u => (
                <span
                  key={u}
                  style={{
                    fontSize: [12, 15, 19, 24][u - 1],
                    fontWeight: [400, 500, 600, 700][u - 1],
                    opacity: [0.7, 0.92, 1, 1][u - 1],
                    color: '#64748b',
                  }}
                >
                  {u}
                </span>
              ))}
            </div>
          </div>

          {visibleRows.map(row => (
            <div key={`${row.year}-${row.term}`} className="mb-8">
              {/* Term bar */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-slate-700">
                  Year {row.year} · {data?.meta.termLabels[row.term]}
                </span>
                <div className="flex-1 h-px bg-[#e8e4de]" />
              </div>

              {/* 3-column booklet grid (or 1-column if subject filtered) */}
              <div className={`grid gap-4 ${subjectFilter === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                {visibleSubjects.map(s => {
                  const meta = VOCAB_SUBJECT_META[s]
                  const booklets = row.cols[s] ?? []
                  if (booklets.length === 0) {
                    return (
                      <div
                        key={s}
                        className="border border-dashed border-[#d8d4ce] rounded-[6px] flex items-center justify-center py-8 text-[11px] text-slate-300"
                      >
                        No {meta.name} booklet this term
                      </div>
                    )
                  }
                  return booklets.map(bk => (
                    <BookletCard
                      key={bk.id}
                      booklet={bk}
                      subject={meta}
                      subjectKey={s}
                      highlight={highlight}
                      deferredTrace={deferredTrace}
                    />
                  ))
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── BookletBlock (matrix cell) ──────────────────────────────────────────────

interface BookletBlockProps {
  booklet: VocabBooklet
  subject: { name: string; color: string; soft: string; ink: string }
  highlight: HighlightState
  deferredTrace: string
  hoverWord: string | null
  onHover: (w: string | null) => void
}

function BookletBlock({ booklet, subject, highlight, deferredTrace, hoverWord, onHover }: BookletBlockProps) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-slate-600 mb-1.5">{booklet.title}</div>
      {booklet.chapters.map(chapter => (
        <div key={chapter.n} className="mb-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              style={{ background: subject.color, color: '#fff' }}
              className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold flex-shrink-0"
            >
              {chapter.n}
            </span>
            {chapter.title && (
              <span className="text-[10px] text-slate-400 truncate">{chapter.title}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {chapter.words.map((wd, i) => (
              <VocabPill
                key={i}
                word={wd}
                subject={subject}
                highlight={highlight}
                deferredTrace={deferredTrace}
                hovered={hoverWord === wd.w}
                onHover={onHover}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
