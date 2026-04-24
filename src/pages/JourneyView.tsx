import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchConcept, type ConceptDetailResponse, type EdgeDetail } from '../lib/api'
import { EDGE_NATURE_BG } from '../lib/colours'

const SUBJECT_STYLES: Record<string, { dot: string; badge: string; bg: string }> = {
  History: { dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800', bg: 'bg-blue-50 border-blue-200' },
  Geography: { dot: 'bg-green-600', badge: 'bg-green-100 text-green-800', bg: 'bg-green-50 border-green-200' },
  Religion: { dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800', bg: 'bg-amber-50 border-amber-200' },
  'Religion & Worldviews': { dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800', bg: 'bg-amber-50 border-amber-200' },
}

function getSubjectStyle(subject: string) {
  return SUBJECT_STYLES[subject] ?? SUBJECT_STYLES['History']
}

function highlightTerm(text: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  if (parts.length === 1) return <>{text}</>
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase()
          ? <strong key={i} className="font-bold text-ink">{part}</strong>
          : part
      )}
    </>
  )
}

export default function JourneyView() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<ConceptDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchConcept(Number(id))
      .then(setData)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-owl-purple border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Loading concept journey…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error ?? 'Concept not found'}
        </div>
      </div>
    )
  }

  const { concept, occurrences, edges } = data

  // Sort occurrences chronologically
  const sorted = [...occurrences].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    const termOrder = ['Autumn1', 'Autumn2', 'Spring1', 'Spring2', 'Summer1', 'Summer2',
      'Aut1', 'Aut2', 'Spr1', 'Spr2', 'Sum1', 'Sum2',
      'aut1', 'aut2', 'spr1', 'spr2', 'sum1', 'sum2']
    return termOrder.indexOf(a.term_period) - termOrder.indexOf(b.term_period)
  })

  // Group edges by occurrence
  const edgesByOcc = new Map<number, EdgeDetail[]>()
  for (const e of edges) {
    if (!edgesByOcc.has(e.from_occurrence)) edgesByOcc.set(e.from_occurrence, [])
    edgesByOcc.get(e.from_occurrence)!.push(e)
    if (!edgesByOcc.has(e.to_occurrence)) edgesByOcc.set(e.to_occurrence, [])
    edgesByOcc.get(e.to_occurrence)!.push(e)
  }

  const uniqueSubjects = [...new Set(occurrences.map(o => o.subject))]
  const yearSpan = sorted.length > 0
    ? `Year ${sorted[0].year}${sorted[sorted.length - 1].year !== sorted[0].year ? ` – Year ${sorted[sorted.length - 1].year}` : ''}`
    : ''

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link to="/concepts" className="hover:text-owl-purple transition-colors">Concepts</Link>
        <span>›</span>
        <span className="text-slate-600">{concept.term}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-ink mb-3">{concept.term}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          {uniqueSubjects.map(s => (
            <span key={s} className={`text-xs px-2.5 py-1 rounded-full font-medium ${getSubjectStyle(s).badge}`}>
              {s}
            </span>
          ))}
          <span className="text-sm text-slate-400">{yearSpan}</span>
          <span className="text-sm text-slate-400">· {occurrences.length} occurrence{occurrences.length !== 1 ? 's' : ''}</span>
          {edges.length > 0 && (
            <span className="text-sm text-slate-400">· {edges.length} connection{edges.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200" />

        <div className="space-y-6">
          {sorted.map((occ) => {
            const style = getSubjectStyle(occ.subject)
            const occEdges = edgesByOcc.get(occ.occurrence_id) ?? []
            const isIntro = occ.is_introduction === 1 || occ.is_introduction === true

            return (
              <div key={occ.occurrence_id} className="relative pl-12">
                {/* Timeline dot */}
                <div className={`absolute left-[14px] top-2 w-[11px] h-[11px] rounded-full border-2 border-white ${style.dot} shadow-sm`} />

                {/* Card */}
                <div className={`rounded-lg border p-5 ${style.bg}`}>
                  {/* Meta line */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Year {occ.year} · {occ.term_period}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                      {occ.subject}
                    </span>
                    {isIntro && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-owl-purple/10 text-owl-purple font-medium">
                        First introduction
                      </span>
                    )}
                  </div>

                  {/* Unit */}
                  <h3 className="font-semibold text-ink mb-2">{occ.unit}</h3>
                  {occ.chapter && (
                    <p className="text-xs text-slate-500 mb-2">Chapter: {occ.chapter}</p>
                  )}

                  {/* Context paragraph — scholarly serif */}
                  {occ.term_in_context && (
                    <blockquote className="font-serif text-sm text-slate-700 leading-relaxed bg-white/60 rounded-md p-3 border-l-3 border-slate-300 mt-3">
                      {highlightTerm(occ.term_in_context, concept.term)}
                    </blockquote>
                  )}

                  {/* Edges from this occurrence */}
                  {occEdges.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {occEdges.map((e, ei) => {
                        const isFrom = e.from_occurrence === occ.occurrence_id
                        return (
                          <span
                            key={ei}
                            className={`text-xs px-2 py-0.5 rounded-full ${EDGE_NATURE_BG[e.edge_nature] ?? 'bg-slate-100 text-slate-600'}`}
                          >
                            {e.edge_nature}
                            {isFrom
                              ? ` → Y${e.to_year} ${e.to_subject}`
                              : ` ← Y${e.from_year} ${e.from_subject}`
                            }
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* View in timeline link */}
      <div className="mt-8 text-center">
        <Link
          to={`/timeline?search=${encodeURIComponent(concept.term)}`}
          className="text-sm text-owl-purple hover:underline"
        >
          View in timeline matrix →
        </Link>
      </div>
    </div>
  )
}
