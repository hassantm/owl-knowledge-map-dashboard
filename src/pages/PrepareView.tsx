import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, Lightbulb } from 'lucide-react'

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

const SUBJECT_STYLES: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  history: { border: 'border-blue-300', bg: 'bg-blue-50', text: 'text-blue-800', badge: 'bg-blue-100 text-blue-800' },
  geography: { border: 'border-green-300', bg: 'bg-green-50', text: 'text-green-800', badge: 'bg-green-100 text-green-800' },
  rw: { border: 'border-amber-300', bg: 'bg-amber-50', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-800' },
}

const YEARS = [3, 4, 5, 6]
const TERMS = ['Autumn1', 'Autumn2', 'Spring1', 'Spring2', 'Summer1', 'Summer2']
const TERM_LABELS: Record<string, string> = {
  Autumn1: 'Autumn 1', Autumn2: 'Autumn 2',
  Spring1: 'Spring 1', Spring2: 'Spring 2',
  Summer1: 'Summer 1', Summer2: 'Summer 2',
}
const SUBJECTS = ['history', 'geography', 'rw'] as const

export default function PrepareView() {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/timeline')
      .then(r => r.json())
      .then(data => { setUnits(data.units); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Build a lookup: conceptId → all units containing it
  const conceptUnitMap = useMemo(() => {
    const m = new Map<number, Unit[]>()
    for (const u of units) {
      for (const c of u.concepts) {
        if (!m.has(c.id)) m.set(c.id, [])
        m.get(c.id)!.push(u)
      }
    }
    return m
  }, [units])

  // Find the selected unit
  const selectedUnit = useMemo(() => {
    if (!selectedYear || !selectedTerm || !selectedSubject) return null
    const termNorm = selectedTerm.toLowerCase()
      .replace('autumn', 'aut')
      .replace('spring', 'spr')
      .replace('summer', 'sum')
    const key = `y${selectedYear}_${termNorm}_${selectedSubject}`
    return units.find(u => u.key === key) ?? null
  }, [units, selectedYear, selectedTerm, selectedSubject])

  // For the selected unit, find prior knowledge: concepts that appeared in earlier units
  const priorKnowledge = useMemo(() => {
    if (!selectedUnit) return []

    const unitPos = (u: Unit) => {
      const termIdx = TERMS.findIndex(t =>
        t.toLowerCase().replace('autumn', 'aut').replace('spring', 'spr').replace('summer', 'sum') === u.term
      )
      return u.year * 10 + (termIdx >= 0 ? termIdx : 0)
    }

    const currentPos = unitPos(selectedUnit)

    return selectedUnit.concepts
      .map(concept => {
        const allUnits = conceptUnitMap.get(concept.id) ?? []
        const priorUnits = allUnits
          .filter(u => u.key !== selectedUnit.key && unitPos(u) < currentPos)
          .sort((a, b) => unitPos(a) - unitPos(b))
        return { concept, priorUnits, allUnits }
      })
      .filter(item => item.priorUnits.length > 0)
      .sort((a, b) => b.priorUnits.length - a.priorUnits.length)
  }, [selectedUnit, conceptUnitMap])

  // Concepts that are new in this unit (no prior appearances)
  const newConcepts = useMemo(() => {
    if (!selectedUnit) return []

    const unitPos = (u: Unit) => {
      const termIdx = TERMS.findIndex(t =>
        t.toLowerCase().replace('autumn', 'aut').replace('spring', 'spr').replace('summer', 'sum') === u.term
      )
      return u.year * 10 + (termIdx >= 0 ? termIdx : 0)
    }
    const currentPos = unitPos(selectedUnit)

    return selectedUnit.concepts.filter(concept => {
      const allUnits = conceptUnitMap.get(concept.id) ?? []
      return !allUnits.some(u => u.key !== selectedUnit.key && unitPos(u) < currentPos)
    })
  }, [selectedUnit, conceptUnitMap])

  // Available units for the current filter
  const availableUnits = useMemo(() => {
    if (!selectedYear || !selectedTerm) return []
    const termNorm = selectedTerm.toLowerCase()
      .replace('autumn', 'aut')
      .replace('spring', 'spr')
      .replace('summer', 'sum')
    return SUBJECTS
      .map(s => {
        const key = `y${selectedYear}_${termNorm}_${s}`
        return units.find(u => u.key === key)
      })
      .filter((u): u is Unit => u != null)
  }, [units, selectedYear, selectedTerm])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-owl-purple border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Loading curriculum data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-semibold text-ink mb-3">
          Prepare for a Unit
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Select a unit to discover what your pupils already know when they arrive —
          the prior knowledge that transforms their ability to make sense of new content.
        </p>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 mb-8 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Year */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Year</label>
            <div className="flex gap-2">
              {YEARS.map(y => (
                <button
                  key={y}
                  onClick={() => { setSelectedYear(y); setSelectedSubject(null) }}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    selectedYear === y
                      ? 'text-white'
                      : 'bg-parchment text-slate-600 hover:bg-slate-200'
                  }`}
                  style={selectedYear === y ? { backgroundColor: '#865595' } : {}}
                >
                  Y{y}
                </button>
              ))}
            </div>
          </div>

          {/* Term */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Term</label>
            <select
              value={selectedTerm ?? ''}
              onChange={e => { setSelectedTerm(e.target.value || null); setSelectedSubject(null) }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-owl-purple/30"
            >
              <option value="">Choose term…</option>
              {TERMS.map(t => (
                <option key={t} value={t}>{TERM_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject unit cards */}
        {selectedYear && selectedTerm && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {availableUnits.length === 0 ? (
              <p className="col-span-3 text-center text-slate-400 text-sm py-4">
                No units found for Y{selectedYear} {TERM_LABELS[selectedTerm]}
              </p>
            ) : (
              availableUnits.map(unit => {
                const styles = SUBJECT_STYLES[unit.subject]
                const isSelected = selectedUnit?.key === unit.key
                return (
                  <button
                    key={unit.key}
                    onClick={() => setSelectedSubject(unit.subject)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `${styles.border} ${styles.bg} ring-2 ring-offset-1 ring-owl-purple/30`
                        : `border-slate-200 hover:${styles.border} hover:${styles.bg}`
                    }`}
                  >
                    <span className={`text-xs font-semibold uppercase tracking-wide ${styles.text}`}>
                      {SUBJECT_LABELS[unit.subject]}
                    </span>
                    <div className="font-semibold text-ink mt-1 leading-snug">{unit.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{unit.concepts.length} concepts</div>
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {selectedUnit && (
        <div className="space-y-8">
          {/* Unit header */}
          <div className={`rounded-xl border-2 ${SUBJECT_STYLES[selectedUnit.subject].border} ${SUBJECT_STYLES[selectedUnit.subject].bg} p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${SUBJECT_STYLES[selectedUnit.subject].text}`}>
                    {SUBJECT_LABELS[selectedUnit.subject]}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">Year {selectedUnit.year}, {TERM_LABELS[selectedTerm!] ?? selectedTerm}</span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-ink">{selectedUnit.title}</h2>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-ink">{selectedUnit.concepts.length}</div>
                <div className="text-xs text-slate-500">concepts</div>
              </div>
            </div>
          </div>

          {/* Prior knowledge section */}
          {priorKnowledge.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-owl-purple" />
                <h3 className="font-serif text-xl font-semibold text-ink">
                  What pupils already know
                </h3>
                <span className="text-sm text-slate-400 ml-1">
                  ({priorKnowledge.length} concept{priorKnowledge.length !== 1 ? 's' : ''} with prior history)
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                These concepts have appeared earlier in the curriculum. Pupils arrive at this unit
                with existing knowledge that can be activated and built upon.
              </p>

              <div className="space-y-3">
                {priorKnowledge.map(({ concept, priorUnits }) => (
                  <div key={concept.id} className="bg-white rounded-lg border border-slate-200/80 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <Link
                          to={`/concepts/${concept.id}`}
                          className="font-bold text-base text-ink hover:text-owl-purple transition-colors"
                        >
                          {concept.name}
                        </Link>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {priorUnits.map(u => {
                            const s = SUBJECT_STYLES[u.subject]
                            return (
                              <span
                                key={u.key}
                                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${s.badge}`}
                              >
                                Y{u.year} {u.title}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                      <Link
                        to={`/concepts/${concept.id}`}
                        className="text-slate-400 hover:text-owl-purple transition-colors shrink-0 mt-1"
                        title="View full journey"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New concepts section */}
          {newConcepts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-owl-green" />
                <h3 className="font-serif text-xl font-semibold text-ink">
                  Introduced in this unit
                </h3>
                <span className="text-sm text-slate-400 ml-1">
                  ({newConcepts.length} new concept{newConcepts.length !== 1 ? 's' : ''})
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                These concepts appear here for the first time in the curriculum.
              </p>

              <div className="flex flex-wrap gap-2">
                {newConcepts.map(c => (
                  <Link
                    key={c.id}
                    to={`/concepts/${c.id}`}
                    className="inline-block px-3 py-1.5 rounded-lg bg-parchment text-sm font-bold text-ink hover:bg-owl-purple/10 hover:text-owl-purple transition-colors border border-slate-200/60"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state when nothing selected */}
      {!selectedUnit && !selectedYear && (
        <div className="text-center py-16">
          <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-400 text-lg">
            Select a year and term above to begin
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Discover the prior knowledge your pupils carry into each unit
          </p>
        </div>
      )}
    </div>
  )
}
