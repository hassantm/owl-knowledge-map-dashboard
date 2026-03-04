import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import OccurrenceCard from './OccurrenceCard'
import type { Occurrence } from '../lib/api'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const baseOccurrence: Occurrence = {
  occurrence_id: 42,
  concept_id: 1,
  term: 'empire',
  subject: 'History',
  year: 4,
  term_period: 'Spring2',
  unit: 'Christianity in 3 empires',
  chapter: '1. To the lions',
  slide_number: 5,
  is_introduction: 1,
  term_in_context: 'The Roman empire spread across three continents.',
}

function renderCard(props: Partial<Occurrence> = {}) {
  return render(
    <MemoryRouter>
      <OccurrenceCard occurrence={{ ...baseOccurrence, ...props }} />
    </MemoryRouter>
  )
}

describe('OccurrenceCard', () => {
  it('shows INTRO badge when is_introduction=1', () => {
    renderCard({ is_introduction: 1 })
    expect(screen.getByText('INTRO')).toBeInTheDocument()
    expect(screen.queryByText('RECUR')).toBeNull()
  })

  it('shows RECUR badge when is_introduction=0', () => {
    renderCard({ is_introduction: 0 })
    expect(screen.getByText('RECUR')).toBeInTheDocument()
    expect(screen.queryByText('INTRO')).toBeNull()
  })

  it('displays the term', () => {
    renderCard()
    // term appears in the heading and possibly in the context highlight — just confirm presence
    expect(screen.getAllByText('empire').length).toBeGreaterThanOrEqual(1)
  })

  it('displays year and term period', () => {
    renderCard()
    expect(screen.getByText(/Y4/)).toBeInTheDocument()
    expect(screen.getByText(/Spring2/)).toBeInTheDocument()
  })

  it('displays the subject', () => {
    renderCard()
    expect(screen.getByText('History')).toBeInTheDocument()
  })

  it('displays the unit name', () => {
    renderCard()
    expect(screen.getByText(/Christianity in 3 empires/)).toBeInTheDocument()
  })

  it('highlights the term in context paragraph', () => {
    renderCard()
    const strong = document.querySelector('strong')
    expect(strong).not.toBeNull()
    expect(strong?.textContent?.toLowerCase()).toBe('empire')
  })

  it('navigates to concept detail on click', async () => {
    const user = userEvent.setup()
    const { container } = renderCard()
    // Click the card element itself, not a text node that may appear multiple times
    await user.click(container.firstChild as HTMLElement)
    expect(mockNavigate).toHaveBeenCalledWith('/concepts/1')
  })

  it('omits context paragraph in compact mode', () => {
    render(
      <MemoryRouter>
        <OccurrenceCard occurrence={baseOccurrence} compact />
      </MemoryRouter>
    )
    // context text should not appear
    expect(screen.queryByText(/Roman empire spread/)).toBeNull()
  })
})
