import { useEffect, useState, useCallback } from 'react'

interface Concept {
  id: number
  name: string
  freq: number
}

interface Unit {
  key: string
  subject: 'history' | 'geography' | 'rw'
  year: number
  term: string
  title: string
  concepts: Concept[]
}

const SUBJECT_LABELS: Record<string, string> = {
  history: 'History',
  geography: 'Geography',
  rw: 'Religion & Worldviews',
}

const SUBJECT_COLOURS: Record<string, { bg: string; chip: string; header: string }> = {
  history:   { bg: 'bg-amber-50',   chip: 'bg-amber-100 text-amber-900 border-amber-300',   header: 'bg-amber-200 text-amber-900' },
  geography: { bg: 'bg-teal-50',    chip: 'bg-teal-100 text-teal-900 border-teal-300',       header: 'bg-teal-200 text-teal-900' },
  rw:        { bg: 'bg-rose-50',    chip: 'bg-rose-100 text-rose-900 border-rose-300',       header: 'bg-rose-200 text-rose-900' },
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
  const [search, setSearch] = useState('')
  const [hoveredConceptId, setHoveredConceptId] = useState<number | null>(null)
  const [hoveredUnitKeys, setHoveredUnitKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/timeline')
      .then(r => r.json())
      .then(data => { setUnits(data.units); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Build lookups
  const unitMap = new Map<string, Unit>()
  for (const u of units) unitMap.set(u.key, u)

  const conceptUnitMap = new Map<number, string[]>()
  for (const u of units) {
    for (const c of u.concepts) {
      if (!conceptUnitMap.has(c.id)) conceptUnitMap.set(c.id, [])
      conceptUnitMap.get(c.id)!.push(u.key)
    }
  }

  const handleConceptHover = useCallback((conceptId: number | null) => {
    setHoveredConceptId(conceptId)
    setHoveredUnitKeys(conceptId ? new Set(conceptUnitMap.get(conceptId) ?? []) : new Set())
  }, [conceptUnitMap])

  const searchLower = search.toLowerCase().trim()
  const conceptMatchesSearch = (c: Concept) => !searchLower || c.name.toLowerCase().includes(searchLower)
  const unitHasMatch = (u: Unit) => !searchLower || u.concepts.some(conceptMatchesSearch)

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading timeline…</div>
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-slate-800">Timeline Matrix</h1>
        <input
          type="search"
          placeholder="Search concepts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-300 rounded px-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-3 ml-2 text-xs text-slate-500">
          {SUBJECTS.map(s => (
            <span key={s} className={`px-2 py-0.5 rounded border ${SUBJECT_COLOURS[s].chip}`}>
              {SUBJECT_LABELS[s]}
            </span>
          ))}
        </div>
      </div>

      {/* Status bar */}
      {hoveredConceptId !== null && (
        <div className="mb-2 text-xs text-slate-500">
          Highlighting <strong className="text-slate-700">
            {units.flatMap(u => u.concepts).find(c => c.id === hoveredConceptId)?.name}
          </strong> — appears in {hoveredUnitKeys.size} unit{hoveredUnitKeys.size !== 1 ? 's' : ''}
        </div>
      )}

      {/* Table: rows = year × term, columns = subjects */}
      <table className="border-collapse w-full text-xs">
        <thead>
          <tr>
            <th className="w-20 border border-slate-200 bg-slate-100 px-2 py-2 text-left text-slate-500 font-medium sticky top-0 z-10">
              Year · Term
            </th>
            {SUBJECTS.map(s => (
              <th
                key={s}
                className={`border border-slate-200 px-3 py-2 text-center font-semibold sticky top-0 z-10 ${SUBJECT_COLOURS[s].header}`}
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

              // Check if any cell in this row has content
              const rowUnits = SUBJECTS.map(s => unitMap.get(`y${year}_${termNorm}_${s}`))
              const anyContent = rowUnits.some(Boolean)

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
                        className={`border border-slate-200 px-2 py-2 align-top transition-colors ${
                          SUBJECT_COLOURS[subject].bg
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
                            <div className="flex flex-wrap gap-0.5">
                              {unit.concepts
                                .filter(c => !searchLower || conceptMatchesSearch(c))
                                .slice(0, 25)
                                .map(c => (
                                  <span
                                    key={c.id}
                                    onMouseEnter={() => handleConceptHover(c.id)}
                                    onMouseLeave={() => handleConceptHover(null)}
                                    className={`inline-block px-1.5 py-0 rounded border cursor-default leading-5 transition-all ${
                                      hoveredConceptId === c.id
                                        ? 'bg-blue-200 text-blue-900 border-blue-400 font-semibold z-10 relative'
                                        : SUBJECT_COLOURS[subject].chip
                                    }`}
                                    title={`Appears in ${(conceptUnitMap.get(c.id) ?? []).length} unit(s)`}
                                  >
                                    {c.name}
                                  </span>
                                ))}
                              {(() => {
                                const filtered = unit.concepts.filter(c => !searchLower || conceptMatchesSearch(c))
                                return filtered.length > 25 ? (
                                  <span className="text-slate-400 italic">+{filtered.length - 25} more</span>
                                ) : null
                              })()}
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
