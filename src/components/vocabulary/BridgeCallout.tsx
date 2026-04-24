import { ArrowUpRight } from 'lucide-react'

interface BridgeCalloutProps {
  subjects: string[]
}

export default function BridgeCallout({ subjects }: BridgeCalloutProps) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-owl-green border border-owl-green/30 bg-owl-green/5 rounded-full px-2 py-0.5">
      <ArrowUpRight size={11} />
      Also in: {subjects.join(', ')}
    </span>
  )
}
