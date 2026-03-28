interface ActiveFilter {
  key: string
  label: string
}

interface FilterChipsProps {
  filters: ActiveFilter[]
  onRemove: (key: string) => void
  onClearAll: () => void
}

export default function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null

  return (
    <div className="flex items-center flex-wrap gap-2 mb-4">
      {filters.map(f => (
        <span
          key={f.key}
          className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full border border-slate-200"
        >
          {f.label}
          <button
            onClick={() => onRemove(f.key)}
            className="text-slate-400 hover:text-slate-700 leading-none ml-0.5"
            aria-label="Remove"
          >
            ×
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-slate-400 hover:text-slate-700 underline"
      >
        Clear all
      </button>
    </div>
  )
}
