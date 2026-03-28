import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ---------------------------------------------------------------------------
// These tests describe the Paginator component to be created in T09 (P1-4).
// They will FAIL until src/components/Paginator.tsx exists.
// ---------------------------------------------------------------------------

// Lazy import so the test file itself doesn't blow up at parse time if the
// module doesn't exist yet — vitest will still report a clear failure.
let Paginator: React.ComponentType<{
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}>

beforeEach(async () => {
  const mod = await import('./Paginator')
  Paginator = mod.default
})

function renderPaginator(
  currentPage: number,
  totalPages: number,
  onPageChange = vi.fn()
) {
  return { onPageChange, ...render(<Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />) }
}

describe('Paginator — basic rendering', () => {
  it('renders a Previous button', () => {
    renderPaginator(3, 10)
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument()
  })

  it('renders a Next button', () => {
    renderPaginator(3, 10)
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('renders the current page number', () => {
    renderPaginator(3, 10)
    // page 3 (0-based) should show "4" or have aria-current
    const buttons = screen.getAllByRole('button')
    const pageButtons = buttons.filter(b => /^\d+$/.test(b.textContent ?? ''))
    const currentButton = pageButtons.find(b => b.getAttribute('aria-current') === 'page')
    expect(currentButton).toBeDefined()
  })

  it('always shows page 1 (index 0)', () => {
    renderPaginator(5, 20)
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
  })

  it('always shows the last page', () => {
    renderPaginator(5, 20)
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
  })
})

describe('Paginator — window and ellipsis', () => {
  it('shows pages around the current page (±1 window)', () => {
    renderPaginator(9, 20) // current = page index 9 → display "10"
    expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument()  // n-1
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument() // n
    expect(screen.getByRole('button', { name: '11' })).toBeInTheDocument() // n+1
  })

  it('shows ellipsis when there is a gap between page 1 and the window', () => {
    renderPaginator(9, 20) // gap between 1 and 9
    const ellipses = screen.getAllByText('…')
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })

  it('shows ellipsis on both sides when current page is in the middle', () => {
    renderPaginator(9, 20)
    const ellipses = screen.getAllByText('…')
    expect(ellipses.length).toBe(2)
  })

  it('does not show ellipsis when all pages fit without gaps', () => {
    // 5 total pages: 1, 2, 3, 4, 5 all visible
    renderPaginator(2, 5)
    expect(screen.queryByText('…')).toBeNull()
  })
})

describe('Paginator — disabled states', () => {
  it('disables Previous when on page 0', () => {
    renderPaginator(0, 10)
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled()
  })

  it('enables Previous when not on page 0', () => {
    renderPaginator(1, 10)
    expect(screen.getByRole('button', { name: /prev/i })).not.toBeDisabled()
  })

  it('disables Next when on the last page', () => {
    renderPaginator(9, 10) // 0-based last page = totalPages - 1
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('enables Next when not on the last page', () => {
    renderPaginator(8, 10)
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
  })
})

describe('Paginator — callbacks', () => {
  it('calls onPageChange with correct index when a page button is clicked', async () => {
    const user = userEvent.setup()
    // currentPage=1 → window shows pages 1,2,3 (display) so button "3" is visible
    const { onPageChange } = renderPaginator(1, 10)
    await user.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(2) // 0-based: display "3" = index 2
  })

  it('calls onPageChange with currentPage - 1 when Previous is clicked', async () => {
    const user = userEvent.setup()
    const { onPageChange } = renderPaginator(5, 10)
    await user.click(screen.getByRole('button', { name: /prev/i }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('calls onPageChange with currentPage + 1 when Next is clicked', async () => {
    const user = userEvent.setup()
    const { onPageChange } = renderPaginator(5, 10)
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(onPageChange).toHaveBeenCalledWith(6)
  })
})

describe('Paginator — does not render when unnecessary', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = renderPaginator(0, 1)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when totalPages is 0', () => {
    const { container } = renderPaginator(0, 0)
    expect(container.firstChild).toBeNull()
  })
})
