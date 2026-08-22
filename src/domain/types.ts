/**
 * QuestForge domain types — the contract every content pack must satisfy.
 * A "mark" is a notation, symbol, or move that a source text USES but never TEACHES.
 * QuestForge names the missing marks, teaches them, makes the student apply each one,
 * then hands the pen back. It never writes the student's next line.
 */

export interface LessonStep {
  /** One concrete instructional step, written in the same notation as the source text. */
  text: string
}

export interface MarkLesson {
  /** Notation family this mark belongs to, e.g. "algebraic", "vector", "calculus". */
  notation: string
  /** 3–6 ordered steps. */
  steps: LessonStep[]
}

export interface MarkCheck {
  /** An apply-it-yourself micro-problem. The student answers; the engine checks. */
  prompt: string
  /**
   * 2–4 regex patterns (JS RegExp source strings). A student answer passes if ANY
   * pattern matches after whitespace normalization. Patterns must accept equivalent
   * correct forms (e.g. `^2` and `²`).
   */
  accept: string[]
}

export interface Mark {
  id: string
  /** Student-facing name, e.g. "completing the square". */
  label: string
  /** Why this mark matters — respectful, zero shame. */
  why: string
  /**
   * Optional regex sources used by LocalKernel to find USAGE EVIDENCE of this
   * mark inside a sourceText. Authored-seed detection: deterministic, auditable.
   * ModelKernel replaces this step with model analysis behind the same interface.
   */
  signatures?: string[]
  lesson: MarkLesson
  check: MarkCheck
}

export interface NextLineExpect {
  /** Regex (RegExp source) matching the expected next line of the student's own work. */
  pattern: string
  /** Hint shown after a failed attempt — nudges, never writes. */
  hint: string
}

export interface NextLine {
  /** The problem where the student writes the next line themselves. */
  setup: string
  expect: NextLineExpect
}

export interface ContentPack {
  id: string
  title: string
  subject: string
  /** The realistic worksheet/excerpt containing the undefined references. */
  sourceText: string
  marks: Mark[]
  nextLine: NextLine
}

/** A mark detected as "undefined" for this student in this pack. */
export interface DetectedMark {
  mark: Mark
  /** Where the mark appears in the source text (character offset). */
  firstOffset: number
}

/** Immutable result of a diagnosis pass. */
export interface Diagnosis {
  packId: string
  detected: DetectedMark[]
}

/** Outcome of checking one student input. */
export type CheckOutcome =
  | { kind: 'pass' }
  | { kind: 'fail'; hint?: string }

export function normalizeAnswer(input: string): string {
  return input
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Test a student answer against a mark's accept patterns. */
export function checkAnswer(input: string, accept: string[]): boolean {
  const normalized = normalizeAnswer(input)
  if (normalized.length === 0) return false
  return accept.some((pattern) => {
    try {
      return new RegExp(pattern).test(normalized)
    } catch {
      return false
    }
  })
}

/** Test the student's written next line against the pack's expectation. */
export function checkNextLine(input: string, nextLine: NextLine): CheckOutcome {
  const normalized = normalizeAnswer(input)
  if (normalized.length === 0) return { kind: 'fail' }
  try {
    if (new RegExp(nextLine.expect.pattern).test(normalized)) {
      return { kind: 'pass' }
    }
    return { kind: 'fail', hint: nextLine.expect.hint }
  } catch {
    return { kind: 'fail', hint: nextLine.expect.hint }
  }
}
