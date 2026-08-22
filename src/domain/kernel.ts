import type { ContentPack, Diagnosis, DetectedMark } from './types'

/**
 * LocalKernel — the deterministic, offline diagnostic engine.
 *
 * Strategy: authored-seed detection. Each mark declares signature regexes;
 * the kernel locates the first usage-evidence occurrence in the pack's
 * sourceText. A mark with no signatures is assumed present-but-unlocated
 * (offset -1) — content authors should provide signatures.
 *
 * Zero network. Fully auditable. Same interface ModelKernel implements.
 */
export interface DiagnosticKernel {
  diagnose(pack: ContentPack): Diagnosis
}

export class LocalKernel implements DiagnosticKernel {
  diagnose(pack: ContentPack): Diagnosis {
    const detected: DetectedMark[] = []
    for (const mark of pack.marks) {
      const firstOffset = locate(mark.signatures ?? [], pack.sourceText)
      detected.push({ mark, firstOffset })
    }
    return { packId: pack.id, detected }
  }
}

/** First offset where any signature matches, or -1 when none do. Invalid patterns are skipped. */
function locate(signatures: string[], text: string): number {
  let best = -1
  for (const source of signatures) {
    try {
      const idx = new RegExp(source).exec(text)?.index
      if (typeof idx === 'number' && (best === -1 || idx < best)) {
        best = idx
      }
    } catch {
      // An invalid authored signature must never crash diagnosis.
    }
  }
  return best
}
