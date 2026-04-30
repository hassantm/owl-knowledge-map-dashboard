import { X } from 'lucide-react'
import type { HighlightState } from './highlightTypes'

interface SegProps {
  options: Array<{ label: string; value: string | number }>
  value: string | number
  onChange: (v: string | number) => void
}

function Seg({ options, value, onChange }: SegProps) {
  return (
    <div className="inline-flex items-center border border-slate-200 rounded-[14px] bg-white p-0.5 gap-0.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={opt.value === value ? { background: '#1a1a1a', color: '#fff' } : undefined}
          className={`px-2.5 py-0.5 rounded-[11px] text-xs transition-colors ${
            opt.value === value ? '' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

interface HighlightControlsProps {
  state: HighlightState
  onChange: (patch: Partial<HighlightState>) => void
  years?: string[]
  yearFilter?: string
  onYearFilter?: (y: string) => void
}

export default function HighlightControls({ state, onChange, years, yearFilter, onYearFilter }: HighlightControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
      {years && onYearFilter && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Year</span>
          <Seg
            options={[{ label: 'All', value: 'all' }, ...years.map(y => ({ label: `Y${y}`, value: y }))]}
            value={yearFilter ?? 'all'}
            onChange={v => onYearFilter(v as string)}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Highlight ≥</span>
        <Seg
          options={[
            { label: 'Off', value: 0 },
            { label: '2+', value: 2 },
            { label: '3+', value: 3 },
            { label: '4+', value: 4 },
          ]}
          value={state.highlightOn ? state.minRecur : 0}
          onChange={v => {
            if (v === 0) {
              onChange({ highlightOn: false })
            } else {
              onChange({ highlightOn: true, minRecur: v as 2 | 3 | 4 })
            }
          }}
        />
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Trace a word…"
          value={state.traceWord}
          onChange={e => onChange({ traceWord: e.target.value })}
          className="pl-3 pr-8 py-1 text-sm border border-slate-200 rounded-[16px] bg-white w-48 focus:outline-none focus:border-slate-400"
        />
        {state.traceWord && (
          <button
            onClick={() => onChange({ traceWord: '' })}
            className="absolute right-2 text-slate-400 hover:text-slate-600"
            aria-label="Clear trace"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {state.traceWord && (
        <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={state.dimNonMatching}
            onChange={e => onChange({ dimNonMatching: e.target.checked })}
            className="accent-slate-700"
          />
          Dim non-matching
        </label>
      )}
    </div>
  )
}
