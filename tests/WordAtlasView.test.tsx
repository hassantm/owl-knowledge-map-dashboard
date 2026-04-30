import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WordAtlasView from '../src/pages/WordAtlasView'

function renderPage() {
  return render(
    <MemoryRouter>
      <WordAtlasView />
    </MemoryRouter>
  )
}

describe('WordAtlasView', () => {
  it('renders without crashing', () => {
    renderPage()
    expect(screen.getByText('Word Atlas')).toBeInTheDocument()
  })

  it('shows total word count in lede', () => {
    renderPage()
    // lede contains "unique words"
    const lede = screen.getByText(/unique words/i)
    expect(lede).toBeInTheDocument()
  })

  it('Tier 4 section heading is visible', () => {
    renderPage()
    expect(screen.getByText('Across 4 units')).toBeInTheDocument()
  })

  it('Tier 1 is collapsed by default (word entries not visible)', () => {
    renderPage()
    // Tier 1 is closed — its word count button is visible but entries are not rendered
    // Tier 1 body grid should not exist when closed
    const tier1Toggle = screen.getByText('1 unit only').closest('button')
    expect(tier1Toggle).toBeInTheDocument()
    // Single-unit words should not be in DOM yet (tier is closed)
    // "replicating" is a single-unit word from the last entry in data.js
    expect(screen.queryByText('replicating')).toBeNull()
  })

  it('clicking Tier 1 header expands it', () => {
    renderPage()
    // Before clicking: "hieroglyphic" (a single-unit word) should not be visible
    expect(screen.queryByText('hieroglyphic')).toBeNull()
    const tier1Toggle = screen.getByText('1 unit only').closest('button')!
    fireEvent.click(tier1Toggle)
    // After opening tier 1, the first tier-1 word in insertion order appears
    expect(screen.getByText('hieroglyphic')).toBeInTheDocument()
  })

  it('Tier 4 shows "exile" and "decree" when expanded (default open)', () => {
    renderPage()
    expect(screen.getByText('exile')).toBeInTheDocument()
    expect(screen.getByText('decree')).toBeInTheDocument()
  })

  it('search input filters tiers to matching words', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText('Search words…')
    fireEvent.change(searchInput, { target: { value: 'exile' } })
    // "decree" should disappear (no match for "exile" search)
    expect(screen.queryByText('decree')).toBeNull()
    // "exile" should still be present
    expect(screen.getByText('exile')).toBeInTheDocument()
  })

  it('HighlightControls renders inside the page', () => {
    renderPage()
    expect(screen.getByPlaceholderText('Trace a word…')).toBeInTheDocument()
  })

  it('search input and trace input are in sync', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText('Search words…')
    fireEvent.change(searchInput, { target: { value: 'temple' } })
    const traceInput = screen.getByPlaceholderText('Trace a word…')
    expect((traceInput as HTMLInputElement).value).toBe('temple')
  })
})
