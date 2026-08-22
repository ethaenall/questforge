import { describe, expect, it } from 'vitest'
import { LocalKernel } from './kernel'
import { loadPacks } from './loader'
import type { ContentPack } from './types'

function makePack(overrides: Partial<ContentPack> = {}): ContentPack {
  return {
    id: 'test-pack',
    title: 'Test Pack',
    subject: 'Testing',
    sourceText: 'The quick brown fox uses (b/2)² here.',
    marks: [
      {
        id: 'm1',
        label: 'mark one',
        why: 'because',
        signatures: ['\\(\\s*b\\s*/\\s*2\\s*\\)\\s*(\\^2|²)'],
        lesson: {
          notation: 'algebraic',
          steps: [{ text: 'a' }, { text: 'b' }, { text: 'c' }],
        },
        check: { prompt: 'p', accept: ['^25$'] },
      },
      {
        id: 'm2',
        label: 'mark two',
        why: 'because',
        lesson: {
          notation: 'algebraic',
          steps: [{ text: 'a' }, { text: 'b' }, { text: 'c' }],
        },
        check: { prompt: 'p', accept: ['^7i$'] },
      },
    ],
    nextLine: {
      setup: 's',
      expect: { pattern: '^x$', hint: 'h' },
    },
    ...overrides,
  }
}

describe('LocalKernel.diagnose', () => {
  it('locates signature evidence at its offset', () => {
    const d = new LocalKernel().diagnose(makePack())
    expect(d.detected[0].firstOffset).toBe(
      makePack().sourceText.indexOf('(b/2)²'),
    )
  })

  it('reports offset -1 when no signatures exist', () => {
    const d = new LocalKernel().diagnose(makePack())
    expect(d.detected[1].firstOffset).toBe(-1)
  })

  it('skips invalid signature patterns without crashing', () => {
    const pack = makePack()
    pack.marks[0].signatures = ['[bad']
    const d = new LocalKernel().diagnose(pack)
    expect(d.detected[0].firstOffset).toBe(-1)
  })

  it('returns detection for every mark, preserving order', () => {
    const d = new LocalKernel().diagnose(makePack())
    expect(d.packId).toBe('test-pack')
    expect(d.detected.map((x) => x.mark.id)).toEqual(['m1', 'm2'])
  })
})

describe('authored packs integrate with kernel', () => {
  const packs = loadPacks()

  it('loads exactly the three night-one packs', () => {
    expect(packs.map((p) => p.id)).toEqual([
      'algebra-quadratic-completion',
      'calc-chain-notation',
      'physics-kinematics-signs',
    ])
  })

  it.each(packs.map((p) => [p.id, p] as const))(
    '%s: every mark is located by its signatures',
    (_id, pack) => {
      const d = new LocalKernel().diagnose(pack)
      for (const det of d.detected) {
        expect(det.firstOffset).toBeGreaterThanOrEqual(0)
      }
    },
  )

  it.each(packs.map((p) => [p.id, p] as const))(
    '%s: every accept/nextLine regex compiles',
    (_id, pack) => {
      for (const m of pack.marks) {
        for (const src of m.check.accept) expect(() => new RegExp(src)).not.toThrow()
      }
      expect(() => new RegExp(pack.nextLine.expect.pattern)).not.toThrow()
    },
  )
})
