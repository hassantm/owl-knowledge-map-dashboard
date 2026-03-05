import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchConcepts, type ConceptsResponse } from '../lib/api'
import { SUBJECT_BG } from '../lib/colours'

const PAGE_SIZE = 50

export default function Concepts() {
  const navigate = useNavigate()
  const [results, setResults] = useState<ConceptsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('')
  const [loadBearingOnly, setLoadBearingOnly] = useState(false)
  const [page, setPage] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = (q: string, subj: string, lb: boolean, pg: number) => {
    setLoading(true)
    fetchConcepts({
      q: q || undefined,
      subject: subj || undefined,
      loadBearingOnly: lb,
      page: pg,
      pageSize: PAGE_SIZE,
    })
      .then(setResults)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(query, subject, loadBearingOnly, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, loadBearingOnly, page])

  const handleQueryChange = (val: string) => {
    setQuery(val)
    setPage(0)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => load(val, subject, loadBearingOnly, 0), 300)
  }

  const totalPages = results ? Math.ceil(results.total / PAGE_SIZE) : 0

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Concepts</h1>
      <p className="text-slate-500 text-sm mb-6">All curriculum vocabulary extracted from OWL booklets</p>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="search"
          placeholder="Search term…"
          value={query}
          onChange={e => handleQueryChange(e.target.value)}
          className="flex-1 min-w-40 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <select
          value={subject}
          onChange={e => { setSubject(e.target.value); setPage(0) }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none"
        >
          <option value="">All Subjects</option>
          <option value="History">History</option>
          <option value="Geography">Geography</option>
          <option value="Religion">Religion</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={loadBearingOnly}
            onChange={e => { setLoadBearingOnly(e.target.checked); setPage(0) }}
            className="rounded"
          />
          Load-bearing only (2+ occurrences)
        </label>
      </div>

      {results && (
        <p className="text-xs text-slate-400 mb-4">{results.total.toLocaleString()} concepts</p>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-slate-400 text-sm py-12 text-center">Loading…</div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Term</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Subjects</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Years</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Occurrences</th>
                </tr>
              </thead>
              <tbody>
                {results?.rows.map((row, i) => (
                  <tr
                    key={row.concept_id}
                    onClick={() => navigate(`/concepts/${row.concept_id}`)}
                    className={`cursor-pointer hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{row.term}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {row.subjects.map(s => (
                          <span key={s} className={`text-xs px-1.5 py-0.5 rounded-full ${SUBJECT_BG[s] ?? 'bg-slate-100 text-slate-600'}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      Y{row.first_year}{row.first_year !== row.last_year ? `–${row.last_year}` : ''}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 rounded-full px-2 py-0.5 text-xs font-medium">
                        {row.occ_count}
                      </span>
                    </td>
                  </tr>
                ))}
                {results?.rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-slate-400 text-sm">
                      No concepts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">Page {page + 1} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
