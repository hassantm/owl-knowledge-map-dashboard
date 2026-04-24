import type { Cluster } from '../../lib/api'
import ClusterCard from './ClusterCard'

interface ClusterCardsViewProps {
  clusters: Cluster[]
  loading: boolean
  error: string | null
  onWordSelect: (conceptId: number) => void
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-parchment animate-pulse rounded-xl h-40 border border-slate-100" />
      ))}
    </div>
  )
}

export default function ClusterCardsView({ clusters, loading, error, onWordSelect }: ClusterCardsViewProps) {
  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-red-700 text-sm">
        {error}
      </div>
    )
  }

  if (clusters.length === 0) {
    return (
      <p className="text-slate-500 italic text-sm">
        No approved concepts found in this chapter.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {clusters.map(cluster => (
        <ClusterCard
          key={cluster.cluster_id}
          cluster={cluster}
          onWordSelect={onWordSelect}
        />
      ))}
    </div>
  )
}
