import { useEffect, useState, useCallback, useMemo, useDeferredValue } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TIMELINE_SUBJECT } from '../lib/colours'

interface Concept {
  id: number
  name: string
  freq: number
}

interface Chapter {
  name: string | null
  concepts: Concept[]
}

interface Unit {
  key: string
  subject: 'history' | 'geography' | 'rw'
  year: number
  term: string
  title: string
  chapters: Chapter[]
  concepts: Concept[]  // flat list for hover/search compat
}

const SUBJECT_LABELS: Record<string, string> = {
  history: 'History',
  geography: 'Geography',
  rw: 'Religion & Worldviews',
}

const TERMS = ['Autumn1', 'Autumn2', 'Spring1', 'Spring2', 'Summer1', 'Summer2']
const TERM_LABELS: Record<string, string> = {
  Autumn1: 'Aut 1', Autumn2: 'Aut 2',
  Spring1: 'Spr 1', Spring2: 'Spr 2',
  Summer1: 'Sum 1', Summer2: 'Sum 2',
}
const YEARS = [3, 4, 5, 6]
const SUBJECTS = ['history', 'geography', 'rw'] as const

export default function TimelineView() {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '')
  const [hoveredConceptId, setHoveredConceptId] = useState<number | null>(null)
  const [hoveredUnitKeys, setHoveredUnitKeys] = useState<Set<string>>(new Set())

  // Defer expensive filter re-renders while typing
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    fetch('/api/timeline')
      .then(r => r.json())
      .then(data => { setUnits(data.units); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const unitMap = useMemo(() => {
    const m = new Map<string, Unit>()
    for (const u of units) m.set(u.key, u)
    return m
  }, [units])

  const conceptUnitMap = useMemo(() => {
    const m = new Map<number, string[]>()
    for (const u of units) {
      for (const c of u.concepts) {
        if (!m.has(c.id)) m.set(c.id, [])
        m.get(c.id)!.push(u.key)
      }
    }
    return m
  }, [units])

  const handleConceptHover = useCallback((conceptId: number | null) => {
    setHoveredConceptId(conceptId)
    setHoveredUnitKeys(conceptId ? new Set(conceptUnitMap.get(conceptId) ?? []) : new Set())
  }, [conceptUnitMap])

  const searchLower = deferredSearch.toLowerCase().trim()
  const conceptMatchesSearch = (c: Concept) => !searchLower || c.name.toLowerCase().includes(searchLower)
  const unitHasMatch = (u: Unit) => !searchLower || u.concepts.some(conceptMatchesSearch)

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading timeline…</div>
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4 flex items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Timeline Matrix</h1>
          <p className="text-sm text-slate-500 mb-2">All curriculum concepts mapped by year, term, and subject</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <input
            type="search"
            placeholder="Highlight a concept…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-slate-300 rounded px-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-3 text-xs text-slate-500">
            {SUBJECTS.map(s => (
              <span key={s} className={`px-2 py-0.5 rounded border ${TIMELINE_SUBJECT[s].chip}`}>
                {SUBJECT_LABELS[s]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hover status line — fixed height to prevent layout shift */}
      <div className={`mb-2 text-xs text-slate-500 h-5 ${hoveredConceptId === null ? 'invisible' : ''}`}>
        {hoveredConceptId !== null && (
          <>Highlighting <strong className="text-slate-700">
            {units.flatMap(u => u.concepts).find(c => c.id === hoveredConceptId)?.name}
          </strong> — appears in {hoveredUnitKeys.size} unit{hoveredUnitKeys.size !== 1 ? 's' : ''}</>
        )}
      </div>

      {/* Table: rows = year × term, columns = subjects */}
      <table className="border-collapse w-full text-xs table-fixed">
        <thead>
          <tr>
            <th className="w-20 border border-slate-200 bg-slate-100 px-2 py-2 text-left text-slate-500 font-medium sticky top-0 z-10">
              Year · Term
            </th>
            {SUBJECTS.map(s => (
              <th
                key={s}
                className={`border border-slate-200 px-3 py-2 text-center font-semibold sticky top-0 z-10 ${TIMELINE_SUBJECT[s].header}`}
              >
                {SUBJECT_LABELS[s]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {YEARS.map(year => (
            TERMS.map((term, termIdx) => {
              const termNorm = term.toLowerCase()
                .replace('autumn', 'aut')
                .replace('spring', 'spr')
                .replace('summer', 'sum')

              return (
                <tr
                  key={`${year}-${term}`}
                  className={termIdx === 0 ? 'border-t-2 border-slate-300' : ''}
                >
                  {/* Row header */}
                  <td className="border border-slate-200 bg-slate-50 px-2 py-2 font-medium text-slate-600 whitespace-nowrap align-top">
                    {termIdx === 0 && (
                      <div className="text-slate-800 font-bold text-xs mb-0.5">Y{year}</div>
                    )}
                    <div className="text-slate-500">{TERM_LABELS[term]}</div>
                  </td>

                  {/* Subject cells */}
                  {SUBJECTS.map(subject => {
                    const key = `y${year}_${termNorm}_${subject}`
                    const unit = unitMap.get(key)
                    const isHighlighted = hoveredUnitKeys.has(key)
                    const dimmed = searchLower && unit && !unitHasMatch(unit)

                    return (
                      <td
                        key={key}
                        className={`border border-slate-200 px-2 py-2 align-top transition-all duration-100 ${
                          TIMELINE_SUBJECT[subject].bg
                        } ${isHighlighted ? 'ring-2 ring-inset ring-blue-400' : ''} ${
                          dimmed ? 'opacity-25' : ''
                        }`}
                        style={{ width: '33%', minWidth: '200px' }}
                      >
                        {unit ? (
                          <>
                            <div className="font-semibold text-slate-700 mb-1.5 leading-tight">
                              {unit.title}
                            </div>

                            {/* Concepts grouped by chapter */}
                            <div className="space-y-2 min-h-12">
                              {unit.chapters.map((chapter, chIdx) => (
                                <div key={chIdx}>
                                  {/* Chapter heading — only shown when there is a name */}
                                  {chapter.name && (
                                    <div className="text-slate-400 font-semibold uppercase tracking-wide mb-0.5 mt-1 first:mt-0"
                                         style={{ fontSize: '10px' }}>
                                      {chapter.name}
                                    </div>
                                  )}
                                  <div className="flex flex-wrap gap-0.5">
                                    {chapter.concepts.map(c => {
                                      const matches = conceptMatchesSearch(c)
                                      return (
                                        <span
                                          key={c.id}
                                          onMouseEnter={() => handleConceptHover(c.id)}
                                          onMouseLeave={() => handleConceptHover(null)}
                                          className={`inline-block px-1.5 py-0 rounded border cursor-default leading-5 transition-opacity duration-150 ${
                                            searchLower && !matches ? 'opacity-0 pointer-events-none' : ''
                                          } ${
                                            hoveredConceptId === c.id
                                              ? 'bg-blue-200 text-blue-900 border-blue-400'
                                              : TIMELINE_SUBJECT[subject].chip
                                          }`}
                                          title={`Appears in ${(conceptUnitMap.get(c.id) ?? []).length} unit(s)`}
                                        >
                                          {c.name}
                                        </span>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="text-slate-300 italic">—</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          ))}
        </tbody>
      </table>
    </div>
  )
}
