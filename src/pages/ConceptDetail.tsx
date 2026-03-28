import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchConcept, type ConceptDetailResponse, type Occurrence } from '../lib/api'
import { SUBJECT_BG, EDGE_NATURE_BG, SUBJECT_COLOURS } from '../lib/colours'
import { highlightTerm, TERM_ORDER } from '../lib/utils.tsx'

// To revert to horizontal: change flex-col→flex, add overflow-x-auto + minWidth:max-content,
// restore w-52 flex-shrink-0, line-clamp-4, subject.slice(0,4), and absolute edge badge.
function OccurrenceTimelineCard({ occ, term }: { occ: Occurrence; term: string }) {
  const isIntro = Boolean(occ.is_introduction)
  const subjectColour = SUBJECT_COLOURS[occ.subject] ?? '#888'

  return (
    <div
      className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2"
      style={{ borderTopColor: subjectColour, borderTopWidth: 3 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isIntro ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
          {isIntro ? 'INTRO' : 'RECUR'}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${SUBJECT_BG[occ.subject] ?? 'bg-slate-100'}`}>
          {occ.subject}
        </span>
      </div>
      <div className="text-sm font-semibold text-slate-700">Y{occ.year} · {occ.term_period}</div>
      <div className="text-sm text-slate-500">{occ.unit}</div>
      {occ.chapter && occ.chapter !== 'null' && (
        <div className="text-xs text-slate-400">{occ.chapter}</div>
      )}
      {occ.term_in_context && (
        <p className="font-serif text-sm text-slate-600 leading-relaxed mt-1 border-t border-slate-100 pt-2">
          {highlightTerm(occ.term_in_context, term)}
        </p>
      )}
    </div>
  )
}

export default function ConceptDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
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
    return <div className="p-8 text-slate-400 text-sm">Loading…</div>
  }
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>
      </div>
    )
  }
  if (!data) return null

  const { concept, occurrences, edges } = data

  const sorted: Occurrence[] = [...occurrences].sort((a, b) => {
    const posA = a.year * 10 + (TERM_ORDER[a.term_period] ?? 0)
    const posB = b.year * 10 + (TERM_ORDER[b.term_period] ?? 0)
    return posA - posB
  })

  const allSubjects = [...new Set(occurrences.map(o => o.subject))]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-400 hover:text-slate-700 flex items-center gap-1"
        >
          ← Back
        </button>
        {/* T14 — link to Timeline with concept pre-filled */}
        <Link
          to={`/timeline?search=${encodeURIComponent(concept.term)}`}
          className="text-sm text-slate-400 hover:text-slate-700 flex items-center gap-1"
        >
          View in timeline →
        </Link>
      </div>

      {/* T13 — normalised heading */}
      <div className="flex items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{concept.term}</h1>
          <div className="flex items-center gap-2">
            {allSubjects.map(s => (
              <span key={s} className={`text-sm px-3 py-1 rounded-full font-medium ${SUBJECT_BG[s] ?? 'bg-slate-100'}`}>{s}</span>
            ))}
            <span className="text-sm text-slate-400">{occurrences.length} occurrence{occurrences.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Timeline strip — vertical */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Curriculum Timeline</h2>
        <div className="flex flex-col gap-0 max-w-2xl">
          {sorted.map((occ, i) => {
            const fromEdge = edges.find(e => e.from_occurrence === occ.occurrence_id)
            return (
              <div key={occ.occurrence_id}>
                <OccurrenceTimelineCard occ={occ} term={concept.term} />
                {i < sorted.length - 1 && (
                  <div className="flex flex-col items-center py-2 gap-1">
                    {fromEdge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${EDGE_NATURE_BG[fromEdge.edge_nature] ?? 'bg-slate-100 text-slate-600'}`}>
                        {fromEdge.edge_nature}
                      </span>
                    )}
                    <div className="text-slate-300 text-base select-none">↓</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Edges section */}
      <div>
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
          Confirmed Edges ({edges.length})
        </h2>
        {edges.length === 0 ? (
          <p className="text-slate-400 text-sm">No confirmed edges for this concept yet.</p>
        ) : (
          <div className="space-y-3">
            {edges.map(edge => (
              <div
                key={`${edge.from_occurrence}-${edge.to_occurrence}`}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-4"
              >
                {/* From */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-400 mb-0.5">From</div>
                  <div className="text-sm font-medium text-slate-700">Y{edge.from_year} {edge.from_term}</div>
                  <div className="text-xs text-slate-500 truncate">{edge.from_subject} · {edge.from_unit}</div>
                </div>
                {/* Arrow + nature */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${EDGE_NATURE_BG[edge.edge_nature] ?? 'bg-slate-100 text-slate-600'}`}>
                    {edge.edge_nature}
                  </span>
                  <div className="text-slate-300">→</div>
                  <span className="text-xs text-slate-400">{edge.edge_type?.replace('_', ' ')}</span>
                </div>
                {/* To */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="text-xs text-slate-400 mb-0.5">To</div>
                  <div className="text-sm font-medium text-slate-700">Y{edge.to_year} {edge.to_term}</div>
                  <div className="text-xs text-slate-500 truncate">{edge.to_subject} · {edge.to_unit}</div>
                </div>
                {/* Confirmed by */}
                {edge.confirmed_by && (
                  <div className="text-xs text-slate-400 shrink-0">
                    {edge.confirmed_by}<br />
                    {edge.confirmed_date}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
