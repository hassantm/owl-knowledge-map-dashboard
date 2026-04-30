import type { VocabWord } from '../../lib/vocabData'
import type { SubjectMeta } from '../../lib/vocabData'
import { matchesTrace, meetsHighlight } from '../../lib/vocabHelpers'
import type { HighlightState } from './highlightTypes'

interface VocabPillProps {
  word: VocabWord
  subject: SubjectMeta
  highlight: HighlightState
  deferredTrace: string
  hovered?: boolean
  onHover?: (word: string | null) => void
}

export default function VocabPill({ word, subject, highlight, deferredTrace, hovered, onHover }: VocabPillProps) {
  const { w, u } = word
  const isTrace = deferredTrace ? matchesTrace(w, deferredTrace) : false
  const isHighlighted = meetsHighlight(u, highlight)
  const dimByTrace = deferredTrace.trim() !== '' && !isTrace && highlight.dimNonMatching
  const dimBelowThreshold = highlight.highlightOn && !meetsHighlight(u, highlight) && !isTrace
  const isRecurring = u >= 3

  let bg = subject.soft
  let textColor = subject.ink
  let border = 'transparent'
  let opacity = 1

  if (isTrace) {
    bg = highlight.highlightColor
    textColor = '#ffffff'
    border = highlight.highlightColor
  } else if (hovered) {
    bg = subject.color
    textColor = '#ffffff'
  }

  if (isHighlighted && !isTrace) {
    border = highlight.highlightColor
  } else if (isRecurring && !isTrace) {
    border = subject.color
  }

  if (dimByTrace) opacity = 0.18
  else if (dimBelowThreshold) opacity = 0.28

  const fontWeight = highlight.boldRecurrences && isRecurring ? 600 : undefined

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 4px 3px 10px',
        borderRadius: 13,
        background: bg,
        color: textColor,
        border: `1.5px solid ${border}`,
        opacity,
        fontSize: 13,
        fontWeight,
        cursor: 'default',
        transition: 'background 120ms ease, opacity 120ms ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={() => onHover?.(w)}
      onMouseLeave={() => onHover?.(null)}
    >
      {w}
      {u > 1 && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: isRecurring ? subject.color : '#e2e8f0',
            color: isRecurring ? '#fff' : '#64748b',
            fontSize: 10,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {u}
        </span>
      )}
    </span>
  )
}
