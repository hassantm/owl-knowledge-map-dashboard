import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ---------------------------------------------------------------------------
// These tests describe the FilterChips component to be created in T08 (P1-3).
// They will FAIL until src/components/FilterChips.tsx exists.
//
// Expected component API:
//   interface ActiveFilter { key: string; label: string }
//   interface FilterChipsProps {
//     filters: ActiveFilter[]
//     onRemove: (key: string) => void
//     onClearAll: () => void
//   }
// ---------------------------------------------------------------------------

let FilterChips: React.ComponentType<{
  filters: { key: string; label: string }[]
  onRemove: (key: string) => void
  onClearAll: () => void
}>

beforeEach(async () => {
  const mod = await import('./FilterChips')
  FilterChips = mod.default
})

function renderChips(
  filters: { key: string; label: string }[],
  onRemove = vi.fn(),
  onClearAll = vi.fn()
) {
  return { onRemove, onClearAll, ...render(<FilterChips filters={filters} onRemove={onRemove} onClearAll={onClearAll} />) }
}

describe('FilterChips — no active filters', () => {
  it('renders nothing when filters array is empty', () => {
    const { container } = renderChips([])
    expect(container.firstChild).toBeNull()
  })

  it('does not render "Clear all" when filters are empty', () => {
    renderChips([])
    expect(screen.queryByText(/clear all/i)).toBeNull()
  })
})

describe('FilterChips — rendering chips', () => {
  const activeFilters = [
    { key: 'subject', label: 'History' },
    { key: 'year', label: 'Year 4' },
  ]

  it('renders one chip per active filter', () => {
    renderChips(activeFilters)
    expect(screen.getByText('History')).toBeInTheDocument()
    expect(screen.getByText('Year 4')).toBeInTheDocument()
  })

  it('renders exactly the right number of chips', () => {
    renderChips(activeFilters)
    // Each chip has a dismiss button; count those
    const dismissButtons = screen.getAllByRole('button', { name: /remove|×|close/i })
    expect(dismissButtons.length).toBe(activeFilters.length)
  })

  it('each chip displays its label text', () => {
    renderChips([{ key: 'subject', label: 'Geography' }])
    expect(screen.getByText('Geography')).toBeInTheDocument()
  })
})

describe('FilterChips — remove callback', () => {
  it('calls onRemove with the correct key when × is clicked on a chip', async () => {
    const user = userEvent.setup()
    const { onRemove } = renderChips([
      { key: 'subject', label: 'History' },
      { key: 'year', label: 'Year 3' },
    ])
    // Find the dismiss button near the "Year 3" text
    // The component should have an accessible name or be positioned after the label
    const yearChip = screen.getByText('Year 3').closest('[data-testid], li, span, div')
    const dismissButton = yearChip
      ? yearChip.querySelector('button') ?? screen.getAllByRole('button', { name: /remove|×|close/i })[1]
      : screen.getAllByRole('button', { name: /remove|×|close/i })[1]
    await user.click(dismissButton as Element)
    expect(onRemove).toHaveBeenCalledWith('year')
  })

  it('calls onRemove with the correct key for a single-filter chip', async () => {
    const user = userEvent.setup()
    const { onRemove } = renderChips([{ key: 'subject', label: 'Religion' }])
    await user.click(screen.getByRole('button', { name: /remove|×|close/i }))
    expect(onRemove).toHaveBeenCalledWith('subject')
  })
})

describe('FilterChips — Clear all', () => {
  it('renders "Clear all" link when at least one filter is active', () => {
    renderChips([{ key: 'subject', label: 'History' }])
    expect(screen.getByText(/clear all/i)).toBeInTheDocument()
  })

  it('calls onClearAll when "Clear all" is clicked', async () => {
    const user = userEvent.setup()
    const { onClearAll } = renderChips([{ key: 'subject', label: 'History' }])
    await user.click(screen.getByText(/clear all/i))
    expect(onClearAll).toHaveBeenCalledTimes(1)
  })

  it('does not render "Clear all" when no filters are active', () => {
    renderChips([])
    expect(screen.queryByText(/clear all/i)).toBeNull()
  })
})
