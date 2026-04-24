import type { NavigationResponse } from '../../lib/api'

export interface Selection {
  subject: string
  year: string
  unit: string
  chapter: string
}

interface ChapterSelectorProps {
  nav: NavigationResponse | null
  value: Selection
  onChange: (next: Partial<Selection>) => void
  loading?: boolean
}

const selectCls =
  'bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-owl-purple/40 disabled:opacity-50 disabled:cursor-not-allowed'

export default function ChapterSelector({ nav, value, onChange, loading }: ChapterSelectorProps) {
  const years = nav && value.subject ? Object.keys(nav.hierarchy[value.subject] ?? {}).sort() : []
  const units =
    nav && value.subject && value.year
      ? Object.keys(nav.hierarchy[value.subject]?.[value.year] ?? {}).sort()
      : []
  const chapters =
    nav && value.subject && value.year && value.unit
      ? (nav.hierarchy[value.subject]?.[value.year]?.[value.unit] ?? [])
      : []

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className={selectCls}
        value={value.subject}
        disabled={loading}
        onChange={e => onChange({ subject: e.target.value, year: '', unit: '', chapter: '' })}
      >
        <option value="">Subject…</option>
        {(nav?.subjects ?? []).map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        className={selectCls}
        value={value.year}
        disabled={!value.subject}
        onChange={e => onChange({ year: e.target.value, unit: '', chapter: '' })}
      >
        <option value="">Year…</option>
        {years.map(y => (
          <option key={y} value={y}>Year {y}</option>
        ))}
      </select>

      <select
        className={selectCls}
        value={value.unit}
        disabled={!value.year}
        onChange={e => onChange({ unit: e.target.value, chapter: '' })}
      >
        <option value="">Unit…</option>
        {units.map(u => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>

      <select
        className={selectCls}
        value={value.chapter}
        disabled={!value.unit}
        onChange={e => onChange({ chapter: e.target.value })}
      >
        <option value="">Chapter…</option>
        {chapters.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}
