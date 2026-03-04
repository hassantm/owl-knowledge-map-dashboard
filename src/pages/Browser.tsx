import { useEffect, useState, useRef } from 'react'
import { fetchOccurrences, fetchFilters, type OccurrencesResponse, type FilterOptions } from '../lib/api'
import OccurrenceCard from '../components/OccurrenceCard'

const PAGE_SIZE = 20

export default function Browser() {
  const [results, setResults] = useState<OccurrencesResponse | null>(null)
  const [filters, setFilters] = useState<FilterOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('')
  const [year, setYear] = useState('')
  const [term, setTerm] = useState('')
  const [page, setPage] = useState(0)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load filter options once
  useEffect(() => {
    fetchFilters()
      .then(setFilters)
      .catch(e => console.error('Filter load error:', e))
  }, [])

  // Load results when filters/page change
  const load = (q: string, subj: string, yr: string, trm: string, pg: number) => {
    setLoading(true)
    setError(null)
    fetchOccurrences({
      q: q || undefined,
      subject: subj || undefined,
      year: yr ? Number(yr) : undefined,
      term: trm || undefined,
      page: pg,
      pageSize: PAGE_SIZE,
    })
      .then(setResults)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }

  // Clear pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Initial + filter changes
  useEffect(() => {
    load(query, subject, year, term, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, year, term, page])

  // Debounced search
  const handleQueryChange = (val: string) => {
    setQuery(val)
    setPage(0)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      load(val, subject, year, term, 0)
    }, 300)
  }

  const totalPages = results ? Math.ceil(results.total / PAGE_SIZE) : 0

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Browse Occurrences</h1>
      <p className="text-slate-500 text-sm mb-6">Search and filter all confirmed curriculum occurrences</p>

      {/* Search + filters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="search"
            placeholder="Search term…"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            className="flex-1 min-w-40 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          {/* Subject */}
          <select
            value={subject}
            onChange={e => { setSubject(e.target.value); setPage(0) }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none"
          >
            <option value="">All Subjects</option>
            {filters?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {/* Year */}
          <select
            value={year}
            onChange={e => { setYear(e.target.value); setPage(0) }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none"
          >
            <option value="">All Years</option>
            {filters?.years.map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
          {/* Term */}
          <select
            value={term}
            onChange={e => { setTerm(e.target.value); setPage(0) }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none"
          >
            <option value="">All Terms</option>
            {filters?.terms.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Results count */}
      {results && (
        <p className="text-xs text-slate-400 mb-4">
          {results.total.toLocaleString()} results
          {query && <span> for "<strong>{query}</strong>"</span>}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">{error}</div>
      )}

      {/* Results grid */}
      {loading ? (
        <div className="text-slate-400 text-sm py-12 text-center">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {results?.rows.map(occ => (
              <OccurrenceCard key={occ.occurrence_id} occurrence={occ} />
            ))}
            {results?.rows.length === 0 && (
              <div className="col-span-full text-center text-slate-400 text-sm py-12">No results found</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page + 1} of {totalPages}
              </span>
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
