import { useEffect, useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchConcepts, fetchFilters, type ConceptsResponse, type FilterOptions } from '../lib/api'
import { SUBJECT_BG } from '../lib/colours'
import FilterChips from '../components/FilterChips'
import Paginator from '../components/Paginator'

const PAGE_SIZE = 50

type SortField = 'term' | 'occ_count'
type SortDir = 'asc' | 'desc'

export default function Concepts() {
  const navigate = useNavigate()
  const [results, setResults] = useState<ConceptsResponse | null>(null)
  const [filters, setFilters] = useState<FilterOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('')
  const [loadBearingOnly, setLoadBearingOnly] = useState(false)
  const [page, setPage] = useState(0)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // T15 — load filter options dynamically
  useEffect(() => {
    fetchFilters()
      .then(setFilters)
      .catch(e => console.error('Filter load error:', e))
  }, [])

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

  // T17 — client-side sort
  const sortedRows = useMemo(() => {
    if (!results?.rows || !sortField) return results?.rows ?? []
    return [...results.rows].sort((a, b) => {
      const cmp = sortField === 'term'
        ? a.term.localeCompare(b.term)
        : a.occ_count - b.occ_count
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [results?.rows, sortField, sortDir])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="text-slate-300 ml-1">↕</span>
    return <span className="text-slate-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const totalPages = results ? Math.ceil(results.total / PAGE_SIZE) : 0

  // T08 — active filter chips
  const activeFilters = [
    ...(subject ? [{ key: 'subject', label: subject }] : []),
  ]
  const clearFilter = (key: string) => {
    if (key === 'subject') { setSubject(''); setPage(0) }
  }
  const clearAllFilters = () => {
    setSubject('')
    setPage(0)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Concepts</h1>
      <p className="text-slate-500 text-sm mb-6">All curriculum vocabulary extracted from OWL booklets</p>

      {/* T18 — filter bar recedes visually */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        {/* T16 — clearer placeholder */}
        <input
          type="search"
          placeholder="Filter by name…"
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
          {/* T15 — dynamic options from API */}
          {filters?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
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

      {/* T08 — active filter chips */}
      <FilterChips filters={activeFilters} onRemove={clearFilter} onClearAll={clearAllFilters} />

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
                  {/* T17 — sortable column headers */}
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-700"
                    onClick={() => handleSort('term')}
                  >
                    Term {sortIcon('term')}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Subjects</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Years</th>
                  <th
                    className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-700"
                    onClick={() => handleSort('occ_count')}
                  >
                    Occurrences {sortIcon('occ_count')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, i) => (
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
                {sortedRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-slate-400 text-sm">
                      No concepts found
                      <p className="mt-1 text-slate-400">Try broadening your search or removing a filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* T09 — numbered pagination */}
          <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
