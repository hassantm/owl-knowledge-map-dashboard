import { useNavigate } from 'react-router-dom'
import type { Occurrence } from '../lib/api'
import { SUBJECT_BG, SUBJECT_COLOURS } from '../lib/colours'
import { highlightTerm } from '../lib/utils.tsx'

interface OccurrenceCardProps {
  occurrence: Occurrence
  compact?: boolean
}

export default function OccurrenceCard({ occurrence, compact }: OccurrenceCardProps) {
  const navigate = useNavigate()
  const isIntro = Boolean(occurrence.is_introduction)
  const subjectBg = SUBJECT_BG[occurrence.subject] ?? 'bg-slate-100 text-slate-700'
  const subjectColour = SUBJECT_COLOURS[occurrence.subject] ?? '#888'

  return (
    <div
      className={`bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer hover:border-slate-300 transition-colors ${compact ? 'p-3' : 'p-4'}`}
      onClick={() => navigate(`/concepts/${occurrence.concept_id}`)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isIntro
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isIntro ? 'INTRO' : 'RECUR'}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${subjectBg}`}>
            {occurrence.subject}
          </span>
        </div>
        <div className="text-xs text-slate-400 whitespace-nowrap">
          Y{occurrence.year} · {occurrence.term_period}
        </div>
      </div>

      {/* Term */}
      <div
        className="text-sm font-semibold mb-1"
        style={{ color: subjectColour }}
      >
        {occurrence.term}
      </div>

      {/* Unit + chapter */}
      <div className="text-xs text-slate-500 mb-2">
        {occurrence.unit}
        {occurrence.chapter && occurrence.chapter !== 'null' && (
          <span className="text-slate-400"> · {occurrence.chapter}</span>
        )}
      </div>

      {/* Context paragraph */}
      {occurrence.term_in_context && !compact && (
        <p className="font-serif text-xs text-slate-600 leading-relaxed line-clamp-3 border-t border-slate-50 pt-2 mt-2">
          {highlightTerm(occurrence.term_in_context, occurrence.term)}
        </p>
      )}
    </div>
  )
}
