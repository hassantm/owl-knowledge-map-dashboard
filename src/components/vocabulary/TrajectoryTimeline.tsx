import type { TrajectoryEntry } from '../../lib/api'

interface TrajectoryTimelineProps {
  trajectory: TrajectoryEntry[]
}

export default function TrajectoryTimeline({ trajectory }: TrajectoryTimelineProps) {
  if (trajectory.length === 0) {
    return <p className="text-sm text-slate-400 italic">No occurrences recorded.</p>
  }

  return (
    <ul className="space-y-2">
      {trajectory.map((t, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <span className="shrink-0 text-slate-400 w-20">
            Yr{t.year} · {t.term_period}
          </span>
          <span className="text-ink flex-1">
            {t.unit}
            {t.chapter && (
              <span className="text-slate-400"> · {t.chapter}</span>
            )}
          </span>
          <span
            className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
              t.is_introduction === 1
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t.is_introduction === 1 ? 'INTRO' : 'RECUR'}
          </span>
        </li>
      ))}
    </ul>
  )
}
