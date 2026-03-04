import type React from 'react'

/**
 * Splits `text` and wraps every case-insensitive match of `term` in a <strong>.
 * Returns a React node array suitable for rendering directly in JSX.
 */
export function highlightTerm(text: string, term: string): React.ReactNode {
  if (!text || !term) return text
  try {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase()
        ? <strong key={i} className="font-bold">{part}</strong>
        : part
    )
  } catch {
    return text
  }
}

export const TERM_ORDER: Record<string, number> = {
  Autumn1: 1, Autumn2: 2, Spring1: 3, Spring2: 4, Summer1: 5, Summer2: 6,
}
