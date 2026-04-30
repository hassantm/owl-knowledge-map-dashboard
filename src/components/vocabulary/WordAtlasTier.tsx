import { ChevronRight } from 'lucide-react'
import type { VocabData } from '../../lib/vocabData'
import type { WordIndexEntry } from '../../lib/vocabHelpers'
import { matchesTrace, meetsHighlight, wordBooklets } from '../../lib/vocabHelpers'
import { VOCAB_SUBJECT_META } from '../../lib/colours'
import type { HighlightState } from './highlightTypes'

const TIER_META = {
  4: { label: 'Across 4 units', description: 'Highest curriculum reach — appear in every subject strand',  bg: '#1a1a1a', text: '#fff' },
  3: { label: 'Across 3 units', description: 'Strong recurring vocabulary across most strands',           bg: '#3a3631', text: '#fff' },
  2: { label: 'Across 2 units', description: 'Words shared between two curriculum units',                 bg: '#8a857a', text: '#fff' },
  1: { label: '1 unit only',   description: 'Single-unit vocabulary — specialist or introductory terms', bg: '#c8c4bc', text: '#1a1a1a' },
} as const

const FULL_TIERS = new Set([3, 4])
const TIER1_CAP = 200

interface WordAtlasTierProps {
  tier: 1 | 2 | 3 | 4
  words: WordIndexEntry[]
  meta: VocabData['meta']
  highlight: HighlightState
  deferredTrace: string
  isOpen: boolean
  onToggle: () => void
}

export default function WordAtlasTier({ tier, words, highlight, deferredTrace, isOpen, onToggle }: WordAtlasTierProps) {
  const tm = TIER_META[tier]
  const displayWords = tier === 1 && isOpen ? words.slice(0, TIER1_CAP) : words
  const overflow = tier === 1 ? Math.max(0, words.length - TIER1_CAP) : 0
  const isFull = FULL_TIERS.has(tier)

  return (
    <div className="border-b border-[#e8e4de] py-4">
      {/* Tier header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 text-left group"
      >
        <span
          style={{ background: tm.bg, color: tm.text }}
          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold flex-shrink-0"
        >
          {tier}
        </span>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm text-slate-800">{tm.label}</span>
          <span className="text-xs text-slate-400 ml-2">{tm.description}</span>
        </div>
        <span className="text-xs text-slate-400 mr-2">{words.length} words</span>
        <ChevronRight
          size={16}
          className="text-slate-400 transition-transform flex-shrink-0"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Tier body */}
      {isOpen && (
        <div
          className="mt-3 grid gap-2"
          style={{
            gridTemplateColumns: isFull ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            columnGap: isFull ? 28 : 24,
            rowGap: isFull ? 12 : 8,
          }}
        >
          {displayWords.map((entry, i) => (
            isFull
              ? <FullEntry key={i} entry={entry} highlight={highlight} deferredTrace={deferredTrace} />
              : <CompactEntry key={i} entry={entry} highlight={highlight} deferredTrace={deferredTrace} />
          ))}
        </div>
      )}

      {isOpen && overflow > 0 && (
        <div className="mt-3 text-xs text-slate-400 italic">
          +{overflow} more single-unit words not shown
        </div>
      )}
    </div>
  )
}

// ── Full entry (tiers 3–4) ─────────────────────────────────────────────────────

interface EntryProps {
  entry: WordIndexEntry
  highlight: HighlightState
  deferredTrace: string
}

function FullEntry({ entry, highlight, deferredTrace }: EntryProps) {
  const isTrace = deferredTrace ? matchesTrace(entry.word, deferredTrace) : false
  const isHighlighted = meetsHighlight(entry.units, highlight)
  const dimByTrace = deferredTrace.trim() !== '' && !isTrace && highlight.dimNonMatching
  const booklets = wordBooklets(entry)

  return (
    <div
      style={{
        opacity: dimByTrace ? 0.25 : 1,
        transition: 'opacity 120ms ease',
        outline: isHighlighted && !isTrace ? `1.5px solid ${highlight.highlightColor}` : undefined,
        borderRadius: 4,
        padding: isHighlighted ? '2px 4px' : undefined,
      }}
      className="flex flex-col gap-1"
    >
      <div className="flex items-center gap-1.5">
        <span
          style={{ background: '#1a1a1a', color: '#fff' }}
          className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-full text-[11px] font-bold flex-shrink-0"
        >
          {entry.units}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: isTrace ? highlight.highlightColor : '#1a1a1a',
            background: isTrace ? highlight.highlightColor + '20' : undefined,
            borderRadius: isTrace ? 3 : undefined,
            padding: isTrace ? '0 3px' : undefined,
          }}
        >
          {entry.word}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 pl-8">
        {booklets.map((loc, i) => {
          const sm = VOCAB_SUBJECT_META[loc.subject as keyof typeof VOCAB_SUBJECT_META]
          return sm ? (
            <span
              key={i}
              style={{ background: sm.soft, color: sm.ink, borderRadius: 8 }}
              className="text-[10px] font-medium px-1.5 py-0.5"
            >
              {loc.booklet}
            </span>
          ) : null
        })}
      </div>
    </div>
  )
}

// ── Compact entry (tiers 1–2) ──────────────────────────────────────────────────

function CompactEntry({ entry, highlight, deferredTrace }: EntryProps) {
  const isTrace = deferredTrace ? matchesTrace(entry.word, deferredTrace) : false
  const isHighlighted = meetsHighlight(entry.units, highlight)
  const dimByTrace = deferredTrace.trim() !== '' && !isTrace && highlight.dimNonMatching

  const subjects = [...new Set(entry.locations.map(l => l.subject))].slice(0, 4)

  return (
    <div
      style={{
        opacity: dimByTrace ? 0.25 : 1,
        transition: 'opacity 120ms ease',
        outline: isHighlighted && !isTrace ? `1.5px solid ${highlight.highlightColor}` : undefined,
        borderRadius: 3,
      }}
      className="flex items-center gap-1.5"
    >
      <div className="flex gap-0.5 flex-shrink-0">
        {subjects.map(s => {
          const sm = VOCAB_SUBJECT_META[s as keyof typeof VOCAB_SUBJECT_META]
          return sm ? (
            <span
              key={s}
              style={{ background: sm.color }}
              className="inline-block w-1.5 h-1.5 rounded-full"
            />
          ) : null
        })}
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: isTrace ? highlight.highlightColor : '#374151',
          background: isTrace ? highlight.highlightColor + '20' : undefined,
          borderRadius: isTrace ? 3 : undefined,
          padding: isTrace ? '0 2px' : undefined,
        }}
      >
        {entry.word}
      </span>
    </div>
  )
}
