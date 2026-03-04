import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import StatCard from '../components/StatCard'
import ConceptChip from '../components/ConceptChip'
import {
  fetchStats, fetchYearProgression, fetchCrossSubject, fetchLongevity, fetchDensity,
  type StatsResponse, type CrossSubjectRow, type LongevityRow, type DensityRow
} from '../lib/api'
import { SUBJECT_COLOURS, SUBJECT_BG, EDGE_NATURE_COLOURS } from '../lib/colours'

function Spinner() {
  return <div className="text-slate-400 text-sm py-8 text-center">Loading…</div>
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
      {msg}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [crossSubject, setCrossSubject] = useState<CrossSubjectRow[]>([])
  const [longevity, setLongevity] = useState<LongevityRow[]>([])
  const [density, setDensity] = useState<DensityRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetchStats(),
      fetchYearProgression(),
      fetchCrossSubject(),
      fetchLongevity(10),
      fetchDensity(),
    ])
      .then(([s, _yp, cs, lon, den]) => {
        setStats(s)
        setCrossSubject(cs)
        setLongevity(lon)
        setDensity(den)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8"><Spinner /></div>
  if (error) return <div className="p-8"><ErrorMsg msg={error} /></div>
  if (!stats) return null

  // Bar chart data: new terms per year per subject
  const YEARS = [3, 4, 5, 6]
  const barData = YEARS.map(y => {
    const row: Record<string, number | string> = { year: `Year ${y}` }
    for (const subj of ['History', 'Geography', 'Religion']) {
      row[subj] = stats.intros_by_subject[subj]?.[y] ?? 0
    }
    return row
  })

  // Pie chart data: edge nature breakdown
  const pieData = Object.entries(stats.by_nature).map(([name, value]) => ({ name, value }))

  // Density: top 20
  const topDensity = density.slice(0, 20)

  const maxDensityIntros = Math.max(...topDensity.map(d => d.intros), 1)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">OWL Curriculum Knowledge Architecture — Key Stage 2</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Concepts" value={stats.concepts.toLocaleString()} sub="unique terms extracted" />
        <StatCard label="Confirmed Occurrences" value={stats.occurrences.toLocaleString()} sub="across all units" />
        <StatCard label="Confirmed Edges" value={stats.confirmed_edges.toLocaleString()} sub="human-reviewed connections" />
        <StatCard label="Cross-subject Terms" value={crossSubject.length.toLocaleString()} sub="spanning multiple subjects" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Introductions per year stacked bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">New Terms Introduced by Year</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="History" stackId="a" fill={SUBJECT_COLOURS.History} />
              <Bar dataKey="Geography" stackId="a" fill={SUBJECT_COLOURS.Geography} />
              <Bar dataKey="Religion" stackId="a" fill={SUBJECT_COLOURS.Religion} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Edge nature donut */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Edge Nature Breakdown</h2>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-60 text-slate-400 text-sm">
              No confirmed edges yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }: { name: string; value: number }) => `${name} (${value})`}
                  labelLine={false}
                >
                  {pieData.map(entry => (
                    <Cell key={entry.name} fill={EDGE_NATURE_COLOURS[entry.name] ?? '#888'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Panels row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cross-subject bridges */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Cross-subject Bridges</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {crossSubject.slice(0, 15).map(row => (
              <div key={row.term} className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-50 last:border-0">
                <ConceptChip term={row.term} small />
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {row.subjects.map(s => (
                    <span key={s} className={`text-xs px-1.5 py-0.5 rounded-full ${SUBJECT_BG[s] ?? 'bg-slate-100 text-slate-600'}`}>{s}</span>
                  ))}
                  <span className="text-xs text-slate-400 ml-1">Y{row.first_year}–{row.last_year}</span>
                </div>
              </div>
            ))}
            {crossSubject.length === 0 && <p className="text-slate-400 text-sm">No cross-subject terms found.</p>}
          </div>
        </div>

        {/* Longest-lived terms */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Longest-lived Terms</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {longevity.map(row => (
              <div key={row.term} className="flex items-center gap-3">
                <span className="text-sm text-slate-700 font-medium w-28 truncate shrink-0">{row.term}</span>
                {/* Year span bar */}
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${(row.years_active / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-12 text-right">Y{row.intro_year}–{row.last_year}</span>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${SUBJECT_BG[row.intro_subject] ?? 'bg-slate-100 text-slate-600'}`}>
                  {row.intro_subject.slice(0, 4)}
                </span>
              </div>
            ))}
            {longevity.length === 0 && <p className="text-slate-400 text-sm">No longevity data yet.</p>}
          </div>
        </div>
      </div>

      {/* Vocabulary density bar chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Vocabulary Density by Unit (top 20)</h2>
        <div className="space-y-2">
          {topDensity.map(row => {
            const barWidth = (row.intros / maxDensityIntros) * 100
            const colour = SUBJECT_COLOURS[row.subject] ?? '#888'
            return (
              <div key={`${row.subject}-${row.unit}`} className="flex items-center gap-3">
                <div className="w-48 truncate text-xs text-slate-600 shrink-0" title={row.unit}>
                  Y{row.year} {row.unit}
                </div>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center pl-2"
                    style={{ width: `${barWidth}%`, backgroundColor: colour }}
                  >
                    <span className="text-white text-xs font-medium">{row.intros}</span>
                  </div>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full w-16 text-center shrink-0 ${SUBJECT_BG[row.subject] ?? 'bg-slate-100 text-slate-600'}`}>
                  {row.subject.slice(0, 4)}
                </span>
              </div>
            )
          })}
          {topDensity.length === 0 && <p className="text-slate-400 text-sm">No density data.</p>}
        </div>
      </div>
    </div>
  )
}
