import { describe, it, expect } from 'vitest'
import { VOCAB_DATA } from '../src/lib/vocabData'
import {
  buildWordIndex,
  reachStyle,
  meetsHighlight,
  matchesTrace,
  wordSubjects,
  wordBooklets,
} from '../src/lib/vocabHelpers'
import { DEFAULT_HIGHLIGHT } from '../src/components/vocabulary/highlightTypes'

describe('buildWordIndex', () => {
  const idx = buildWordIndex(VOCAB_DATA)

  it('returns a Map with all unique words', () => {
    expect(idx.size).toBeGreaterThan(2900)
  })

  it('identifies the two tier-4 words', () => {
    expect(idx.get('exile')?.units).toBe(4)
    expect(idx.get('decree')?.units).toBe(4)
  })

  it('stores locations for each word', () => {
    const exile = idx.get('exile')
    expect(exile?.locations.length).toBeGreaterThan(0)
    expect(exile?.locations[0]).toHaveProperty('year')
    expect(exile?.locations[0]).toHaveProperty('subject')
    expect(exile?.locations[0]).toHaveProperty('booklet')
  })

  it('preserves original casing in the word field while keying by lowercase', () => {
    for (const [key, entry] of idx) {
      expect(key).toBe(key.toLowerCase())
      expect(entry.word.toLowerCase()).toBe(key)
    }
  })

  it('no word has u > 4', () => {
    for (const entry of idx.values()) {
      expect(entry.units).toBeLessThanOrEqual(4)
    }
  })
})

describe('reachStyle', () => {
  it('returns correct style for u=1', () => {
    const s = reachStyle(1)
    expect(s.fontSize).toBe(12)
    expect(s.fontWeight).toBe(400)
    expect(s.opacity).toBeCloseTo(0.7)
    expect(s.showSuperscript).toBe(false)
  })

  it('returns correct style for u=2', () => {
    const s = reachStyle(2)
    expect(s.fontSize).toBe(15)
    expect(s.fontWeight).toBe(500)
    expect(s.opacity).toBeCloseTo(0.92)
    expect(s.showSuperscript).toBe(false)
  })

  it('returns correct style for u=3', () => {
    const s = reachStyle(3)
    expect(s.fontSize).toBe(19)
    expect(s.showSuperscript).toBe(true)
  })

  it('returns correct style for u=4', () => {
    const s = reachStyle(4)
    expect(s.fontSize).toBe(24)
    expect(s.fontWeight).toBe(700)
    expect(s.opacity).toBeCloseTo(1.0)
    expect(s.showSuperscript).toBe(true)
  })

  it('clamps u <= 0 to u=1 behaviour', () => {
    expect(reachStyle(0).fontSize).toBe(12)
    expect(reachStyle(-1).fontSize).toBe(12)
  })

  it('clamps u >= 5 to u=4 behaviour', () => {
    expect(reachStyle(5).fontSize).toBe(24)
    expect(reachStyle(10).fontSize).toBe(24)
  })
})

describe('meetsHighlight', () => {
  it('returns false when highlightOn is false regardless of u', () => {
    const off = { ...DEFAULT_HIGHLIGHT, highlightOn: false, minRecur: 2 as const }
    expect(meetsHighlight(4, off)).toBe(false)
    expect(meetsHighlight(1, off)).toBe(false)
  })

  it('returns true for u >= minRecur when on', () => {
    const on3 = { ...DEFAULT_HIGHLIGHT, highlightOn: true, minRecur: 3 as const }
    expect(meetsHighlight(3, on3)).toBe(true)
    expect(meetsHighlight(4, on3)).toBe(true)
  })

  it('returns false for u < minRecur when on', () => {
    const on3 = { ...DEFAULT_HIGHLIGHT, highlightOn: true, minRecur: 3 as const }
    expect(meetsHighlight(2, on3)).toBe(false)
    expect(meetsHighlight(1, on3)).toBe(false)
  })

  it('threshold 2: catches words with u=2,3,4', () => {
    const on2 = { ...DEFAULT_HIGHLIGHT, highlightOn: true, minRecur: 2 as const }
    expect(meetsHighlight(2, on2)).toBe(true)
    expect(meetsHighlight(1, on2)).toBe(false)
  })
})

describe('matchesTrace', () => {
  it('returns false for empty traceWord', () => {
    expect(matchesTrace('exile', '')).toBe(false)
    expect(matchesTrace('exile', '   ')).toBe(false)
  })

  it('matches substring case-insensitively', () => {
    expect(matchesTrace('Mediterranean Sea', 'medi')).toBe(true)
    expect(matchesTrace('Mediterranean Sea', 'MEDI')).toBe(true)
    expect(matchesTrace('Mediterranean Sea', 'Mediterranean')).toBe(true)
  })

  it('returns false when word does not contain query', () => {
    expect(matchesTrace('exile', 'decree')).toBe(false)
  })

  it('returns true for exact match', () => {
    expect(matchesTrace('exile', 'exile')).toBe(true)
    expect(matchesTrace('exile', 'EXILE')).toBe(true)
  })
})

describe('wordSubjects', () => {
  it('deduplicates subjects', () => {
    const entry = {
      word: 'test',
      units: 2,
      locations: [
        { year: '3', term: 'Autumn1' as const, subject: 'History' as const, booklet: 'A', chapter: 1 },
        { year: '4', term: 'Spring1' as const, subject: 'History' as const, booklet: 'B', chapter: 1 },
        { year: '3', term: 'Spring2' as const, subject: 'Geography' as const, booklet: 'C', chapter: 2 },
      ],
    }
    const subjects = wordSubjects(entry)
    expect(subjects).toHaveLength(2)
    expect(subjects).toContain('History')
    expect(subjects).toContain('Geography')
  })
})

describe('wordBooklets', () => {
  it('deduplicates by booklet+subject pair', () => {
    const entry = {
      word: 'test',
      units: 2,
      locations: [
        { year: '3', term: 'Autumn1' as const, subject: 'History' as const, booklet: 'Ancient Egypt', chapter: 1 },
        { year: '3', term: 'Autumn1' as const, subject: 'History' as const, booklet: 'Ancient Egypt', chapter: 2 },
        { year: '4', term: 'Spring1' as const, subject: 'Geography' as const, booklet: 'Rivers', chapter: 1 },
      ],
    }
    const booklets = wordBooklets(entry)
    expect(booklets).toHaveLength(2)
    expect(booklets.map(b => b.booklet)).toContain('Ancient Egypt')
    expect(booklets.map(b => b.booklet)).toContain('Rivers')
  })
})
