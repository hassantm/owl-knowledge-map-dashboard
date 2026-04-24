import { ArrowUpRight } from 'lucide-react'
import type { NeighbourEntry } from '../../lib/api'

interface NeighbourhoodCloudProps {
  neighbourhood: NeighbourEntry[]
  onWordSelect: (conceptId: number) => void
}

export default function NeighbourhoodCloud({ neighbourhood, onWordSelect }: NeighbourhoodCloudProps) {
  if (neighbourhood.length === 0) {
    return <p className="text-sm text-slate-400 italic">No neighbourhood data recorded.</p>
  }

  const maxWeight = Math.max(...neighbourhood.map(n => n.weight), 1)

  return (
    <div className="flex flex-wrap gap-2 items-baseline">
      {neighbourhood.map(n => {
        const size = 0.75 + (n.weight / maxWeight) * 0.75
        const cross = n.is_cross_subject
        return (
          <button
            key={n.concept_id}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-owl-purple ${
              cross
                ? 'bg-owl-green/10 text-owl-green border-owl-green/30 hover:bg-owl-green/20'
                : 'bg-parchment text-ink border-slate-200 hover:bg-slate-100'
            }`}
            style={{ fontSize: `${size}rem` }}
            title={cross ? `Cross-subject: ${n.subject_a} ↔ ${n.subject_b}` : `Co-occurrence weight: ${n.weight}`}
            onClick={() => onWordSelect(n.concept_id)}
          >
            {n.term}
            {cross && <ArrowUpRight size={11} className="shrink-0" />}
          </button>
        )
      })}
    </div>
  )
}
