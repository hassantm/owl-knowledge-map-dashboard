import { useState, useDeferredValue, useMemo } from 'react'
import { useTimelineData } from '../lib/useTimelineData'
import { VOCAB_SUBJECT_META } from '../lib/colours'
import { buildWordIndex } from '../lib/vocabHelpers'
import type { VocabSubject } from '../lib/vocabData'
import WordAtlasTier from '../components/vocabulary/WordAtlasTier'
import HighlightControls from '../components/vocabulary/HighlightControls'
import { DEFAULT_HIGHLIGHT, type HighlightState } from '../components/vocabulary/highlightTypes'
import { Search, X } from 'lucide-react'

const SUBJECTS: readonly VocabSubject[] = ['History', 'Geography', 'Religion']
const YEARS = ['3', '4', '5', '6']

export default function WordAtlasView() {
  const { data, loading, error } = useTimelineData()

  const [highlight, setHighlight] = useState<HighlightState>(DEFAULT_HIGHLIGHT)
  const [tierOpen, setTierOpen] = useState<Record<number, boolean>>({ 4: true, 3: true, 2: true, 1: false })
  const [subjectFilter, setSubjectFilter] = useState<VocabSubject | 'all'>('all')
  const [yearFilter, setYearFilter] = useState('all')
  const deferredTrace = useDeferredValue(highlight.traceWord)

  const patchHighlight = (patch: Partial<HighlightState>) =>
    setHighlight(s => ({ ...s, ...patch }))

  // Build word index from live data (filtered by subject/year if set)
  const filteredData = useMemo(() => {
    if (!data) return null
    if (subjectFilter === 'all' && yearFilter === 'all') return data
    return {
      ...data,
      rows: data.rows
        .filter(r => yearFilter === 'all' || r.year === yearFilter)
        .map(r => ({
          ...r,
          cols: subjectFilter === 'all'
            ? r.cols
            : Object.fromEntries(
                Object.entries(r.cols).filter(([s]) => s === subjectFilter)
              ) as typeof r.cols,
        })),
    }
  }, [data, subjectFilter, yearFilter])

  const wordIndex = useMemo(() => filteredData ? buildWordIndex(filteredData) : new Map(), [filteredData])
  const allWords = useMemo(() => [...wordIndex.values()], [wordIndex])

  const filteredWords = useMemo(() => {
    const q = deferredTrace.trim().toLowerCase()
    if (!q) return allWords
    return allWords.filter(w => w.word.toLowerCase().includes(q))
  }, [allWords, deferredTrace])

  const TIER_RANGES: Array<{ n: 4 | 3 | 2 | 1; min: number; max: number }> = [
    { n: 4, min: 8, max: Infinity },
    { n: 3, min: 4, max: 7 },
    { n: 2, min: 2, max: 3 },
    { n: 1, min: 1, max: 1 },
  ]

  const tiers = useMemo(
    () => TIER_RANGES.map(({ n, min, max }) => ({
      n,
      words: filteredWords.filter(w => w.units >= min && w.units <= max),
    })),
    [filteredWords]
  )

  const toggleTier = (n: number) => setTierOpen(s => ({ ...s, [n]: !s[n] }))

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
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              OWL Knowledge Map · Vocabulary
            </div>
            <h1 className="text-3xl font-serif text-ink mb-1">Word Atlas</h1>
            <p className="text-sm text-slate-500">
              {loading
                ? 'Loading vocabulary data…'
                : `${wordIndex.size.toLocaleString()} unique words across the Y3–Y6 curriculum, ranked by how many units they appear in.`}
            </p>
          </div>

          {/* Search + legend */}
          <div className="flex flex-col items-end gap-3 pt-1">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search words…"
                value={highlight.traceWord}
                onChange={e => patchHighlight({ traceWord: e.target.value })}
                className="pl-8 pr-8 py-1.5 text-sm border border-slate-200 rounded-[16px] bg-white w-52 focus:outline-none focus:border-slate-400"
              />
              {highlight.traceWord && (
                <button
                  onClick={() => patchHighlight({ traceWord: '' })}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            {/* Subject legend */}
            <div className="flex items-center gap-3">
              {SUBJECTS.map(s => {
                const meta = VOCAB_SUBJECT_META[s]
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <span
                      style={{ background: meta.color }}
                      className="inline-block w-2 h-2 rounded-full"
                    />
                    <span className="text-[11px] text-slate-500">{meta.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Filters row */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* Subject filter */}
          <div className="flex items-center gap-2">
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

          {/* Year filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Year</span>
            <div className="inline-flex items-center border border-slate-200 rounded-[14px] bg-white p-0.5 gap-0.5">
              {([{ label: 'All', value: 'all' }, ...YEARS.map(y => ({ label: `Y${y}`, value: y }))]).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setYearFilter(opt.value)}
                  style={yearFilter === opt.value ? { background: '#1a1a1a', color: '#fff' } : undefined}
                  className={`px-2.5 py-0.5 rounded-[11px] text-xs transition-colors ${
                    yearFilter === opt.value ? '' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Highlight controls */}
          <HighlightControls state={highlight} onChange={patchHighlight} />
        </div>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="max-w-[1640px] mx-auto px-6 py-16 text-center">
          <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-owl-purple rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-400">Loading vocabulary data…</p>
        </div>
      )}

      {/* Tier sections */}
      {!loading && (
        <div className="max-w-[1640px] mx-auto px-6 pb-12">
          {filteredWords.length === 0 && highlight.traceWord && (
            <div className="py-16 text-center text-slate-400 text-sm">
              No words match &ldquo;{highlight.traceWord}&rdquo;
            </div>
          )}

          {tiers.map(({ n, words }) => (
            words.length > 0 || !highlight.traceWord ? (
              <WordAtlasTier
                key={n}
                tier={n as 1 | 2 | 3 | 4}
                words={words}
                meta={data!.meta}
                highlight={highlight}
                deferredTrace={deferredTrace}
                isOpen={tierOpen[n] ?? false}
                onToggle={() => toggleTier(n)}
              />
            ) : null
          ))}
        </div>
      )}
    </div>
  )
}
