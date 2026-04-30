import { useEffect, useState } from 'react'
import type { VocabData, VocabSubject, VocabTerm } from './vocabData'

const SUBJECT_MAP: Record<string, VocabSubject> = {
  history: 'History',
  geography: 'Geography',
  rw: 'Religion',
}

interface TimelineConcept { id: number; name: string; freq: number }
interface TimelineChapter { name: string; concepts: TimelineConcept[] }
interface TimelineUnit {
  key: string
  subject: string
  year: number
  term: VocabTerm
  title: string
  chapters: TimelineChapter[]
  concepts: TimelineConcept[]
}
interface TimelineResponse { units: TimelineUnit[] }

export interface UseTimelineDataResult {
  data: VocabData | null
  loading: boolean
  error: string | null
}

export function useTimelineData(): UseTimelineDataResult {
  const [data, setData] = useState<VocabData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch('/api/timeline')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<TimelineResponse>
      })
      .then(raw => {
        if (cancelled) return

        // --- build unit-count map: term -> lower-word -> Set of unit keys ---
        const unitSets = new Map<string, Set<string>>()
        for (const unit of raw.units) {
          for (const ch of unit.chapters) {
            for (const c of ch.concepts) {
              const key = c.name.toLowerCase()
              if (!unitSets.has(key)) unitSets.set(key, new Set())
              unitSets.get(key)!.add(unit.key)
            }
          }
        }

        // --- group units into rows (year x term) ---
        type RowKey = string
        const rowMap = new Map<RowKey, Map<VocabSubject, {id: string; title: string; chapters: {n: number; title: string; words: {w: string; u: number}[]}[]}[]>>()

        for (const unit of raw.units) {
          const subject = SUBJECT_MAP[unit.subject]
          if (!subject) continue
          const rowKey: RowKey = `${unit.year}:${unit.term}`
          if (!rowMap.has(rowKey)) rowMap.set(rowKey, new Map())
          const subjects = rowMap.get(rowKey)!
          if (!subjects.has(subject)) subjects.set(subject, [])

          const booklet = {
            id: unit.key,
            title: unit.title,
            chapters: unit.chapters.map((ch, idx) => ({
              n: idx + 1,
              title: ch.name,
              words: ch.concepts.map(c => ({
                w: c.name,
                u: unitSets.get(c.name.toLowerCase())?.size ?? 1,
              })),
            })),
          }
          subjects.get(subject)!.push(booklet)
        }

        // --- sort rows year asc, term order ---
        const TERM_ORDER: VocabTerm[] = ['Autumn1','Autumn2','Spring1','Spring2','Summer1','Summer2']
        const rows = [...rowMap.entries()]
          .sort(([a], [b]) => {
            const [ay, at] = a.split(':')
            const [by, bt] = b.split(':')
            if (ay !== by) return Number(ay) - Number(by)
            return TERM_ORDER.indexOf(at as VocabTerm) - TERM_ORDER.indexOf(bt as VocabTerm)
          })
          .map(([key, subjectMap]) => {
            const [year, term] = key.split(':')
            const cols: VocabData['rows'][0]['cols'] = {}
            for (const [subj, booklets] of subjectMap) {
              cols[subj] = booklets
            }
            return { year, term: term as VocabTerm, cols }
          })

        setData({
          meta: {
            subjects: {
              History:   { name: 'History',              color: '#7AA8E8', soft: '#E1ECF9', ink: '#2C4F7C' },
              Geography: { name: 'Geography',            color: '#86C28A', soft: '#E2F0E4', ink: '#36633A' },
              Religion:  { name: 'Religion & Worldviews',color: '#E8B547', soft: '#F8EBC9', ink: '#7A5610' },
            },
            termLabels: {
              Autumn1: 'Aut 1', Autumn2: 'Aut 2',
              Spring1: 'Spr 1', Spring2: 'Spr 2',
              Summer1: 'Sum 1', Summer2: 'Sum 2',
            },
          },
          rows,
        })
        setLoading(false)
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load vocabulary data')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
