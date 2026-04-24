import { useEffect, useState } from 'react'
import { fetchStats, fetchCrossSubject, type StatsResponse, type CrossSubjectRow } from '../lib/api'
import { Link } from 'react-router-dom'

export default function OverviewView() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [crossSubject, setCrossSubject] = useState<CrossSubjectRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchStats(),
      fetchCrossSubject(),
    ])
      .then(([s, cs]) => { setStats(s); setCrossSubject(cs); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-owl-purple border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Loading overview…</p>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    { label: 'Concepts', value: stats.concepts.toLocaleString(), colour: '#865595' },
    { label: 'Occurrences', value: stats.occurrences.toLocaleString(), colour: '#3B82F6' },
    { label: 'Confirmed Edges', value: stats.confirmed_edges.toLocaleString(), colour: '#F59E0B' },
    { label: 'Units', value: stats.units.toLocaleString(), colour: '#699940' },
  ]

  const subjectEntries = Object.entries(stats.by_subject)
  const natureEntries = Object.entries(stats.by_nature)

  const SUBJECT_DOT: Record<string, string> = {
    History: 'bg-blue-500',
    Geography: 'bg-green-600',
    Religion: 'bg-amber-500',
    'Religion & Worldviews': 'bg-amber-500',
  }

  const NATURE_DOT: Record<string, string> = {
    reinforcement: 'bg-slate-400',
    extension: 'bg-amber-500',
    application: 'bg-violet-500',
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-serif text-2xl font-semibold text-ink mb-2">Curriculum Overview</h1>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        A summary of the Opening Worlds knowledge map — {stats.concepts.toLocaleString()} vocabulary
        concepts across {stats.units} units of History, Geography, and Religion & Worldviews.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {statCards.map(card => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm"
            style={{ borderLeftWidth: 3, borderLeftColor: card.colour }}
          >
            <div className="text-2xl font-bold text-ink">{card.value}</div>
            <div className="text-xs text-slate-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* By subject */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="font-semibold text-ink mb-4">Concepts by Subject</h2>
          <div className="space-y-3">
            {subjectEntries.map(([subject, count]) => {
              const pct = Math.round((count / stats.concepts) * 100)
              return (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <span className={`w-2.5 h-2.5 rounded-full ${SUBJECT_DOT[subject] ?? 'bg-slate-400'}`} />
                      {subject}
                    </span>
                    <span className="text-sm text-slate-500">{count.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: subject === 'History' ? '#3B82F6' : subject === 'Geography' ? '#699940' : '#D97706' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* By edge nature */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="font-semibold text-ink mb-4">Edges by Nature</h2>
          <div className="space-y-3">
            {natureEntries.map(([nature, count]) => {
              const pct = Math.round((count / stats.confirmed_edges) * 100)
              return (
                <div key={nature}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2 text-sm text-slate-700 capitalize">
                      <span className={`w-2.5 h-2.5 rounded-full ${NATURE_DOT[nature] ?? 'bg-slate-400'}`} />
                      {nature}
                    </span>
                    <span className="text-sm text-slate-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: nature === 'reinforcement' ? '#94A3B8' : nature === 'extension' ? '#F59E0B' : '#8B5CF6',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Extension + application edges are the pedagogically significant connections.
            <Link to="/architecture" className="text-owl-purple hover:underline ml-1">
              View architecture →
            </Link>
          </p>
        </div>
      </div>

      {/* Cross-subject concepts */}
      {crossSubject.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="font-semibold text-ink mb-2">Cross-Subject Concepts</h2>
          <p className="text-sm text-slate-500 mb-4">
            Concepts that appear across multiple subjects — the vocabulary that binds the curriculum together.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {crossSubject.slice(0, 18).map(row => (
              <Link
                key={row.term}
                to={`/concepts?q=${encodeURIComponent(row.term)}`}
                className="flex items-center justify-between p-3 rounded-lg bg-parchment hover:bg-owl-purple/5 transition-colors"
              >
                <div>
                  <span className="font-medium text-ink text-sm">{row.term}</span>
                  <div className="flex gap-1 mt-1">
                    {row.subjects.map(s => (
                      <span key={s} className={`w-2 h-2 rounded-full ${SUBJECT_DOT[s] ?? 'bg-slate-400'}`} title={s} />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  Y{row.first_year}–{row.last_year}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
