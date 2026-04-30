import type { VocabData, VocabSubject, VocabTerm } from './vocabData'
import type { HighlightState } from '../components/vocabulary/highlightTypes'

export interface WordLocation {
  year: string
  term: VocabTerm
  subject: VocabSubject
  booklet: string
  chapter: number
}

export interface WordIndexEntry {
  word: string
  units: number
  locations: WordLocation[]
}

export type WordIndex = Map<string, WordIndexEntry>

export function buildWordIndex(data: VocabData): WordIndex {
  const index = new Map<string, WordIndexEntry>()

  for (const row of data.rows) {
    for (const [subject, booklets] of Object.entries(row.cols) as [VocabSubject, NonNullable<typeof row.cols[VocabSubject]>][]) {
      for (const booklet of booklets) {
        for (const chapter of booklet.chapters) {
          for (const word of chapter.words) {
            const key = word.w.toLowerCase()
            const existing = index.get(key)
            const loc: WordLocation = {
              year: row.year,
              term: row.term,
              subject,
              booklet: booklet.title,
              chapter: chapter.n,
            }
            if (existing) {
              existing.locations.push(loc)
            } else {
              index.set(key, { word: word.w, units: word.u, locations: [loc] })
            }
          }
        }
      }
    }
  }

  return index
}

export interface ReachStyle {
  fontSize: number
  fontWeight: number
  fontVariationSettings: string
  opacity: number
  showSuperscript: boolean
}

const REACH_STYLES: ReachStyle[] = [
  { fontSize: 12, fontWeight: 400, fontVariationSettings: "'wght' 400", opacity: 0.7,  showSuperscript: false },
  { fontSize: 15, fontWeight: 500, fontVariationSettings: "'wght' 500", opacity: 0.92, showSuperscript: false },
  { fontSize: 19, fontWeight: 600, fontVariationSettings: "'wght' 650", opacity: 1.0,  showSuperscript: true  },
  { fontSize: 24, fontWeight: 700, fontVariationSettings: "'wght' 700", opacity: 1.0,  showSuperscript: true  },
]

export function reachStyle(u: number): ReachStyle {
  const idx = Math.min(Math.max(Math.round(u) - 1, 0), 3)
  return REACH_STYLES[idx]
}

export function meetsHighlight(u: number, state: HighlightState): boolean {
  if (!state.highlightOn) return false
  return u >= state.minRecur
}

export function matchesTrace(word: string, traceWord: string): boolean {
  if (!traceWord.trim()) return false
  return word.toLowerCase().includes(traceWord.toLowerCase())
}

export function wordSubjects(entry: WordIndexEntry): VocabSubject[] {
  return [...new Set(entry.locations.map(l => l.subject))]
}

export function wordBooklets(entry: WordIndexEntry): Array<{ booklet: string; subject: VocabSubject }> {
  const seen = new Set<string>()
  const result: Array<{ booklet: string; subject: VocabSubject }> = []
  for (const loc of entry.locations) {
    const key = `${loc.subject}::${loc.booklet}`
    if (!seen.has(key)) {
      seen.add(key)
      result.push({ booklet: loc.booklet, subject: loc.subject })
    }
  }
  return result
}
