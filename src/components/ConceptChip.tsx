import { useNavigate } from 'react-router-dom'
import { SUBJECT_BG } from '../lib/colours'

interface ConceptChipProps {
  term: string
  subject?: string
  conceptId?: number
  small?: boolean
}

export default function ConceptChip({ term, subject, conceptId, small }: ConceptChipProps) {
  const navigate = useNavigate()
  const bgClass = subject ? (SUBJECT_BG[subject] ?? 'bg-slate-100 text-slate-700') : 'bg-slate-100 text-slate-700'

  const handleClick = () => {
    if (conceptId !== undefined) {
      navigate(`/concepts/${conceptId}`)
    }
  }

  return (
    <span
      onClick={handleClick}
      className={`inline-flex items-center rounded-full font-medium ${
        small ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${bgClass} ${conceptId !== undefined ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    >
      {term}
    </span>
  )
}
