import { describe, it, expect } from 'vitest'
import {
  SUBJECT_COLOURS,
  SUBJECT_BG,
  HOUSE_PURPLE,
  HOUSE_GREEN,
} from './colours'

// ---------------------------------------------------------------------------
// These tests describe the *target* state after P1-1 (colour unification).
// They will FAIL until colours.ts is updated to:
//   - export HOUSE_PURPLE and HOUSE_GREEN constants
//   - extend SUBJECT_COLOURS / SUBJECT_BG to cover DB-form keys
//   - add a SUBJECT_CHIP export
//   - adopt the unified palette (Geography → #699940, Religion → #D97706)
// ---------------------------------------------------------------------------

describe('HOUSE_PURPLE and HOUSE_GREEN constants', () => {
  it('exports HOUSE_PURPLE as the OWL brand purple', () => {
    expect(HOUSE_PURPLE).toBe('#865595')
  })

  it('exports HOUSE_GREEN as the OWL brand green', () => {
    expect(HOUSE_GREEN).toBe('#699940')
  })
})

describe('SUBJECT_COLOURS — unified palette', () => {
  it('History resolves to blue', () => {
    expect(SUBJECT_COLOURS['History']).toBe('#3B82F6')
  })

  it('Geography resolves to house green', () => {
    expect(SUBJECT_COLOURS['Geography']).toBe('#699940')
  })

  it('Religion resolves to warm amber', () => {
    expect(SUBJECT_COLOURS['Religion']).toBe('#D97706')
  })

  it('DB-form key "history" resolves to blue', () => {
    expect(SUBJECT_COLOURS['history']).toBe('#3B82F6')
  })

  it('DB-form key "geography" resolves to house green', () => {
    expect(SUBJECT_COLOURS['geography']).toBe('#699940')
  })

  it('DB-form key "rw" (Religion & Worldviews) resolves to warm amber', () => {
    expect(SUBJECT_COLOURS['rw']).toBe('#D97706')
  })

  it('no known key resolves to undefined', () => {
    const knownKeys = ['History', 'Geography', 'Religion', 'history', 'geography', 'rw']
    for (const key of knownKeys) {
      expect(SUBJECT_COLOURS[key]).not.toBeUndefined()
    }
  })
})

describe('SUBJECT_BG — Tailwind class strings', () => {
  it('returns a string for History', () => {
    expect(typeof SUBJECT_BG['History']).toBe('string')
    expect(SUBJECT_BG['History'].length).toBeGreaterThan(0)
  })

  it('returns a string for Geography', () => {
    expect(typeof SUBJECT_BG['Geography']).toBe('string')
    expect(SUBJECT_BG['Geography'].length).toBeGreaterThan(0)
  })

  it('returns a string for Religion', () => {
    expect(typeof SUBJECT_BG['Religion']).toBe('string')
    expect(SUBJECT_BG['Religion'].length).toBeGreaterThan(0)
  })

  it('returns a string for DB-form key "history"', () => {
    expect(typeof SUBJECT_BG['history']).toBe('string')
    expect(SUBJECT_BG['history'].length).toBeGreaterThan(0)
  })

  it('returns a string for DB-form key "geography"', () => {
    expect(typeof SUBJECT_BG['geography']).toBe('string')
    expect(SUBJECT_BG['geography'].length).toBeGreaterThan(0)
  })

  it('returns a string for DB-form key "rw"', () => {
    expect(typeof SUBJECT_BG['rw']).toBe('string')
    expect(SUBJECT_BG['rw'].length).toBeGreaterThan(0)
  })

  it('no known key resolves to undefined', () => {
    const knownKeys = ['History', 'Geography', 'Religion', 'history', 'geography', 'rw']
    for (const key of knownKeys) {
      expect(SUBJECT_BG[key]).not.toBeUndefined()
    }
  })
})

// SUBJECT_CHIP will be a new export added in P1-1
describe('SUBJECT_CHIP — Tailwind chip class strings', () => {
  // Dynamic import to avoid a hard compile error before the export exists.
  // Once SUBJECT_CHIP is exported, these tests will pass.
  it('returns a Tailwind class string for History', async () => {
    const mod = await import('./colours')
    const SUBJECT_CHIP = (mod as Record<string, unknown>)['SUBJECT_CHIP'] as Record<string, string> | undefined
    expect(SUBJECT_CHIP).toBeDefined()
    expect(typeof SUBJECT_CHIP!['History']).toBe('string')
    expect(SUBJECT_CHIP!['History'].length).toBeGreaterThan(0)
  })

  it('returns a Tailwind class string for Geography', async () => {
    const mod = await import('./colours')
    const SUBJECT_CHIP = (mod as Record<string, unknown>)['SUBJECT_CHIP'] as Record<string, string> | undefined
    expect(SUBJECT_CHIP).toBeDefined()
    expect(typeof SUBJECT_CHIP!['Geography']).toBe('string')
  })

  it('returns a Tailwind class string for Religion', async () => {
    const mod = await import('./colours')
    const SUBJECT_CHIP = (mod as Record<string, unknown>)['SUBJECT_CHIP'] as Record<string, string> | undefined
    expect(SUBJECT_CHIP).toBeDefined()
    expect(typeof SUBJECT_CHIP!['Religion']).toBe('string')
  })

  it('covers all six canonical keys', async () => {
    const mod = await import('./colours')
    const SUBJECT_CHIP = (mod as Record<string, unknown>)['SUBJECT_CHIP'] as Record<string, string> | undefined
    expect(SUBJECT_CHIP).toBeDefined()
    const knownKeys = ['History', 'Geography', 'Religion', 'history', 'geography', 'rw']
    for (const key of knownKeys) {
      expect(SUBJECT_CHIP![key]).not.toBeUndefined()
    }
  })
})
