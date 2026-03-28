import { useEffect, useState, useRef } from 'react'
import { fetchOccurrences, fetchFilters, type OccurrencesResponse, type FilterOptions } from '../lib/api'
import OccurrenceCard from '../components/OccurrenceCard'
import FilterChips from '../components/FilterChips'
import Paginator from '../components/Paginator'

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

  useEffect(() => {
    fetchFilters()
      .then(setFilters)
      .catch(e => console.error('Filter load error:', e))
  }, [])

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

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    load(query, subject, year, term, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, year, term, page])

  const handleQueryChange = (val: string) => {
    setQuery(val)
    setPage(0)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      load(val, subject, year, term, 0)
    }, 300)
  }

  const totalPages = results ? Math.ceil(results.total / PAGE_SIZE) : 0

  // T08 — active filter chips
  const activeFilters = [
    ...(subject ? [{ key: 'subject', label: subject }] : []),
    ...(year ? [{ key: 'year', label: `Year ${year}` }] : []),
    ...(term ? [{ key: 'term', label: term }] : []),
  ]
  const clearFilter = (key: string) => {
    if (key === 'subject') { setSubject(''); setPage(0) }
    if (key === 'year') { setYear(''); setPage(0) }
    if (key === 'term') { setTerm(''); setPage(0) }
  }
  const clearAllFilters = () => {
    setSubject(''); setYear(''); setTerm(''); setPage(0)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Browse Occurrences</h1>
      <p className="text-slate-500 text-sm mb-6">Search and filter all confirmed curriculum occurrences</p>

      {/* T18 — filter bar recedes visually */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* T16 — clearer placeholder */}
          <input
            type="search"
            placeholder="Search by concept or keyword…"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            className="flex-1 min-w-40 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
          />
          <select
            value={subject}
            onChange={e => { setSubject(e.target.value); setPage(0) }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none bg-white"
          >
            <option value="">All Subjects</option>
            {filters?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={year}
            onChange={e => { setYear(e.target.value); setPage(0) }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none bg-white"
          >
            <option value="">All Years</option>
            {filters?.years.map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
          <select
            value={term}
            onChange={e => { setTerm(e.target.value); setPage(0) }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none bg-white"
          >
            <option value="">All Terms</option>
            {filters?.terms.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* T08 — active filter chips */}
      <FilterChips filters={activeFilters} onRemove={clearFilter} onClearAll={clearAllFilters} />

      {results && (
        <p className="text-xs text-slate-400 mb-4">
          {results.total.toLocaleString()} results
          {query && <span> for "<strong>{query}</strong>"</span>}
        </p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-slate-400 text-sm py-12 text-center">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {results?.rows.map(occ => (
              <OccurrenceCard key={occ.occurrence_id} occurrence={occ} />
            ))}
            {results?.rows.length === 0 && (
              <div className="col-span-full text-center text-slate-400 text-sm py-12">
                No results found
                <p className="mt-1">Try broadening your search or removing a filter.</p>
              </div>
            )}
          </div>

          {/* T09 — numbered pagination */}
          <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
