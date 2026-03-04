import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { highlightTerm, TERM_ORDER } from './utils.tsx'

// ─── highlightTerm ─────────────────────────────────────────────────────────

describe('highlightTerm', () => {
  it('returns original text when term is empty', () => {
    expect(highlightTerm('hello world', '')).toBe('hello world')
  })

  it('returns original text when text is empty', () => {
    expect(highlightTerm('', 'empire')).toBe('')
  })

  it('returns plain string when no match', () => {
    const result = highlightTerm('The Roman conquest', 'empire')
    // No match — parts array collapses to one string element
    expect(Array.isArray(result) ? (result as string[]).join('') : result)
      .toBe('The Roman conquest')
  })

  it('wraps an exact match in <strong>', () => {
    const node = highlightTerm('The empire grew', 'empire')
    const { container } = render(<>{node}</>)
    const strong = container.querySelector('strong')
    expect(strong).not.toBeNull()
    expect(strong?.textContent).toBe('empire')
  })

  it('is case-insensitive', () => {
    const node = highlightTerm('The Empire grew', 'empire')
    const { container } = render(<>{node}</>)
    const strong = container.querySelector('strong')
    expect(strong).not.toBeNull()
    expect(strong?.textContent?.toLowerCase()).toBe('empire')
  })

  it('preserves original casing of matched text', () => {
    const node = highlightTerm('The Empire grew', 'empire')
    const { container } = render(<>{node}</>)
    // The rendered text should show "Empire" not "empire"
    expect(container.querySelector('strong')?.textContent).toBe('Empire')
  })

  it('handles regex special characters in the term without throwing', () => {
    expect(() => highlightTerm('trade (goods) routes', 'trade (goods)')).not.toThrow()
  })

  it('highlights regex-special-char term correctly', () => {
    const node = highlightTerm('trade (goods) routes', 'trade (goods)')
    const { container } = render(<>{node}</>)
    expect(container.querySelector('strong')?.textContent).toBe('trade (goods)')
  })

  it('highlights multiple occurrences', () => {
    const node = highlightTerm('empire and empire', 'empire')
    const { container } = render(<>{node}</>)
    const strongs = container.querySelectorAll('strong')
    expect(strongs.length).toBe(2)
  })
})

// ─── TERM_ORDER ────────────────────────────────────────────────────────────

describe('TERM_ORDER', () => {
  it('contains all 6 curriculum terms', () => {
    const expected = ['Autumn1', 'Autumn2', 'Spring1', 'Spring2', 'Summer1', 'Summer2']
    for (const term of expected) {
      expect(TERM_ORDER[term]).toBeDefined()
    }
  })

  it('has values 1–6', () => {
    const values = Object.values(TERM_ORDER).sort()
    expect(values).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('orders terms chronologically', () => {
    expect(TERM_ORDER['Autumn1']).toBeLessThan(TERM_ORDER['Spring1'])
    expect(TERM_ORDER['Spring1']).toBeLessThan(TERM_ORDER['Summer1'])
    expect(TERM_ORDER['Autumn2']).toBeLessThan(TERM_ORDER['Spring2'])
  })
})
