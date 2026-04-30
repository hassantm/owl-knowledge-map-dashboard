import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock the heavy data module with a minimal dataset so render is fast
vi.mock('../src/lib/vocabData', () => ({
  VOCAB_DATA: {
    meta: {
      subjects: {
        History:   { name: 'History',              color: '#7AA8E8', soft: '#E1ECF9', ink: '#2C4F7C' },
        Geography: { name: 'Geography',             color: '#86C28A', soft: '#E2F0E4', ink: '#36633A' },
        Religion:  { name: 'Religion & Worldviews', color: '#E8B547', soft: '#F8EBC9', ink: '#7A5610' },
      },
      termLabels: {
        Autumn1: 'Aut 1', Autumn2: 'Aut 2',
        Spring1: 'Spr 1', Spring2: 'Spr 2',
        Summer1: 'Sum 1', Summer2: 'Sum 2',
      },
    },
    rows: [
      {
        year: '3',
        term: 'Autumn1',
        cols: {
          History: [{
            id: 'ancient-egypt-3autumn1',
            title: 'Ancient Egypt',
            chapters: [
              { n: 1, title: 'Howard Carter', words: [{ w: 'hieroglyphic', u: 1 }, { w: 'exile', u: 4 }] },
            ],
          }],
          Geography: [{
            id: 'rivers-3autumn1',
            title: 'Rivers',
            chapters: [
              { n: 1, title: 'River Systems', words: [{ w: 'tributary', u: 1 }] },
            ],
          }],
        },
      },
      {
        year: '4',
        term: 'Autumn1',
        cols: {
          History: [{
            id: 'ancient-civs-4autumn1',
            title: 'Ancient Civilisations',
            chapters: [
              { n: 1, title: 'Early Civilisations', words: [{ w: 'civilisation', u: 2 }] },
            ],
          }],
        },
      },
    ],
  },
}))

import VocabTimelineView from '../src/pages/VocabTimelineView'

function renderPage() {
  return render(
    <MemoryRouter>
      <VocabTimelineView />
    </MemoryRouter>
  )
}

describe('VocabTimelineView', () => {
  it('renders without crashing', () => {
    renderPage()
    expect(screen.getByText('Vocabulary Timeline')).toBeInTheDocument()
  })

  it('shows Matrix tab as active by default', () => {
    renderPage()
    const matrixTab = screen.getByRole('tab', { name: /matrix/i })
    expect(matrixTab).toHaveAttribute('aria-selected', 'true')
  })

  it('switches to Booklets sub-view on tab click', () => {
    renderPage()
    const bookletsTab = screen.getByRole('tab', { name: /booklets/i })
    fireEvent.click(bookletsTab)
    expect(bookletsTab).toHaveAttribute('aria-selected', 'true')
    const matrixTab = screen.getByRole('tab', { name: /matrix/i })
    expect(matrixTab).toHaveAttribute('aria-selected', 'false')
  })

  it('renders HighlightControls (trace input)', () => {
    renderPage()
    expect(screen.getByPlaceholderText('Trace a word…')).toBeInTheDocument()
  })

  it('filters to Year 3 when Y3 is selected in the year filter', () => {
    renderPage()
    // The HighlightControls year segmented control has "Y3" buttons
    // Click the one inside the segmented control (not the matrix row label)
    const allY3 = screen.getAllByText('Y3')
    // The segmented control button is the first match
    const y3btn = allY3.find(el => el.tagName === 'BUTTON')!
    fireEvent.click(y3btn)
    // Year 4 booklet should be gone
    expect(screen.queryByText('Ancient Civilisations')).toBeNull()
    // Year 3 booklet should still be present
    expect(screen.getByText('Ancient Egypt')).toBeInTheDocument()
  })

  it('renders vocabulary content in Matrix view', () => {
    renderPage()
    expect(screen.getByText('Ancient Egypt')).toBeInTheDocument()
  })
})
