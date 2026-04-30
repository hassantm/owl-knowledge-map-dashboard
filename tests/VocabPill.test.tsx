import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import VocabPill from '../src/components/vocabulary/VocabPill'
import { DEFAULT_HIGHLIGHT } from '../src/components/vocabulary/highlightTypes'

const MOCK_SUBJECT = {
  name: 'History',
  color: '#7AA8E8',
  soft: '#E1ECF9',
  ink: '#2C4F7C',
}

describe('VocabPill', () => {
  it('renders the word text', () => {
    render(<VocabPill word={{ w: 'pharaoh', u: 1 }} subject={MOCK_SUBJECT} highlight={DEFAULT_HIGHLIGHT} deferredTrace="" />)
    expect(screen.getByText('pharaoh')).toBeInTheDocument()
  })

  it('shows unit badge only when u > 1', () => {
    const { container: c1 } = render(
      <VocabPill word={{ w: 'pharaoh', u: 1 }} subject={MOCK_SUBJECT} highlight={DEFAULT_HIGHLIGHT} deferredTrace="" />
    )
    expect(c1.querySelector('span span')).toBeNull()

    const { container: c2 } = render(
      <VocabPill word={{ w: 'exile', u: 4 }} subject={MOCK_SUBJECT} highlight={DEFAULT_HIGHLIGHT} deferredTrace="" />
    )
    expect(c2.querySelector('span span')).not.toBeNull()
    expect(c2.querySelector('span span')?.textContent).toBe('4')
  })

  it('applies reduced opacity when dimBelowThreshold', () => {
    const hlOn = { ...DEFAULT_HIGHLIGHT, highlightOn: true, minRecur: 3 as const }
    const { container } = render(
      <VocabPill word={{ w: 'pharaoh', u: 1 }} subject={MOCK_SUBJECT} highlight={hlOn} deferredTrace="" />
    )
    const pill = container.firstChild as HTMLElement
    expect(pill.style.opacity).toBe('0.28')
  })

  it('shifts background to highlightColor when word matches deferredTrace', () => {
    const { container } = render(
      <VocabPill
        word={{ w: 'exile', u: 4 }}
        subject={MOCK_SUBJECT}
        highlight={{ ...DEFAULT_HIGHLIGHT, highlightColor: '#c96442' }}
        deferredTrace="exile"
      />
    )
    const pill = container.firstChild as HTMLElement
    // jsdom normalises hex to rgb; check that it is NOT the default soft background
    expect(pill.style.background).not.toBe('')
    expect(pill.style.background).not.toContain('225, 236, 249') // not MOCK_SUBJECT.soft
  })

  it('does not apply highlight background when deferredTrace is empty', () => {
    const { container } = render(
      <VocabPill word={{ w: 'exile', u: 4 }} subject={MOCK_SUBJECT} highlight={DEFAULT_HIGHLIGHT} deferredTrace="" />
    )
    const pill = container.firstChild as HTMLElement
    // Should be the subject soft colour (jsdom normalises hex → rgb)
    expect(pill.style.background).not.toBe('')
    expect(pill.style.background).toContain('225, 236, 249') // rgb for #E1ECF9
  })
})
