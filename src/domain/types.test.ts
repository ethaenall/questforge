import { describe, expect, it } from 'vitest'
import {
  checkAnswer,
  checkNextLine,
  normalizeAnswer,
  type ContentPack,
  type NextLine,
} from './types'

describe('normalizeAnswer', () => {
  it('collapses whitespace and trims', () => {
    expect(normalizeAnswer('  25 \n ')).toBe('25')
    expect(normalizeAnswer('x^2   -  12x')).toBe('x^2 - 12x')
  })

  it('converts non-breaking spaces', () => {
    expect(normalizeAnswer('\u00a025\u00a0')).toBe('25')
  })
})

describe('checkAnswer', () => {
  const accept = ['^5(\\^2|²)$']

  it('accepts equivalent correct forms', () => {
    expect(checkAnswer('5^2', accept)).toBe(true)
    expect(checkAnswer('5²', accept)).toBe(true)
    expect(checkAnswer(' 5² ', accept)).toBe(true)
  })

  it('rejects wrong or empty answers', () => {
    expect(checkAnswer('25', accept)).toBe(false)
    expect(checkAnswer('', accept)).toBe(false)
    expect(checkAnswer('   ', accept)).toBe(false)
  })

  it('never throws on invalid patterns', () => {
    expect(checkAnswer('x', ['[unclosed'])).toBe(false)
  })
})

const nl: NextLine = {
  setup: 'differentiate x² with respect to t',
  expect: { pattern: '^2x\\s*[·\\*]?\\s*dx/dt$', hint: 'chain rule fee' },
}

describe('checkNextLine', () => {
  it('passes the expected line across notation variants', () => {
    expect(checkNextLine('2x · dx/dt', nl).kind).toBe('pass')
    expect(checkNextLine('2x*dx/dt', nl).kind).toBe('pass')
  })

  it('fails with hint on wrong lines', () => {
    const out = checkNextLine('2x', nl)
    expect(out.kind).toBe('fail')
    if (out.kind === 'fail') expect(out.hint).toBe('chain rule fee')
  })

  it('fails empty input without hint noise', () => {
    const out = checkNextLine('  ', nl)
    expect(out).toEqual({ kind: 'fail' })
  })
})

describe('pack contract shape', () => {
  it('ContentPack fields align with loader expectations', () => {
    const pack: ContentPack = {
      id: 't',
      title: 'T',
      subject: 'S',
      sourceText: 'text',
      marks: [],
      nextLine: nl,
    }
    expect(pack.marks).toEqual([])
  })
})
