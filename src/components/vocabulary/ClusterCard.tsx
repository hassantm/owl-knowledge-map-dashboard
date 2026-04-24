import type { Cluster } from '../../lib/api'
import BridgeCallout from './BridgeCallout'
import WordChip from './WordChip'

interface ClusterCardProps {
  cluster: Cluster
  onWordSelect: (conceptId: number) => void
}

export default function ClusterCard({ cluster, onWordSelect }: ClusterCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <h3 className="font-serif text-lg text-ink leading-tight">{cluster.label}</h3>
        {cluster.centre_concept.is_bridge && (
          <BridgeCallout subjects={cluster.centre_concept.bridge_subjects} />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {cluster.concepts.map(concept => (
          <WordChip
            key={concept.concept_id}
            concept={concept}
            onClick={() => onWordSelect(concept.concept_id)}
          />
        ))}
      </div>
    </div>
  )
}
