import { ArrowUpRight } from 'lucide-react'
import type { ClusterConcept } from '../../lib/api'

interface WordChipProps {
  concept: ClusterConcept
  onClick: () => void
}

export default function WordChip({ concept, onClick }: WordChipProps) {
  const classes = [
    'inline-flex items-center gap-1 rounded-full border text-sm px-3 py-1',
    'cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-owl-purple',
    concept.is_centre
      ? 'text-base font-semibold ring-1 ring-owl-purple/30 shadow-sm border-slate-300 bg-white text-ink hover:bg-slate-50'
      : 'bg-white border-slate-200 text-ink hover:bg-slate-50',
    concept.is_bridge
      ? 'border-owl-green/60 text-owl-green bg-owl-green/5 hover:bg-owl-green/10'
      : '',
    concept.is_introduction && !concept.is_bridge
      ? 'underline decoration-owl-green decoration-2 underline-offset-2'
      : '',
    concept.tier === 1 ? 'opacity-70' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      onClick={onClick}
      title={concept.is_bridge ? `Also in: ${concept.bridge_subjects.join(', ')}` : undefined}
    >
      {concept.term}
      {concept.is_bridge && <ArrowUpRight size={11} className="shrink-0" aria-hidden="true" />}
    </button>
  )
}
