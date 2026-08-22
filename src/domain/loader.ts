import type { ContentPack } from './types'

/**
 * Pack loader — discovers every content pack under src/content at build time
 * via import.meta.glob and validates each against the ContentPack contract.
 * Invalid packs are rejected loudly in dev; silently dropped elsewhere would
 * hide authoring bugs, so we throw instead — a broken pack is a build bug.
 */

const modules = import.meta.glob('../content/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

export class InvalidPackError extends Error {
  constructor(path: string, problems: string[]) {
    super(`Invalid content pack ${path}: ${problems.join('; ')}`)
    this.name = 'InvalidPackError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

/** Structural validation — throws with a precise problem list on failure. */
export function validatePack(value: unknown, path = '<pack>'): asserts value is ContentPack {
  const problems: string[] = []
  if (!isRecord(value)) {
    throw new InvalidPackError(path, ['pack is not an object'])
  }
  if (!isNonEmptyString(value.id)) problems.push('id missing')
  if (!isNonEmptyString(value.title)) problems.push('title missing')
  if (!isNonEmptyString(value.subject)) problems.push('subject missing')
  if (!isNonEmptyString(value.sourceText)) problems.push('sourceText missing')

  if (!Array.isArray(value.marks) || value.marks.length === 0) {
    problems.push('marks must be a non-empty array')
  } else {
    value.marks.forEach((m, i) => {
      if (!isRecord(m)) {
        problems.push(`marks[${i}] not an object`)
        return
      }
      if (!isNonEmptyString(m.id)) problems.push(`marks[${i}].id missing`)
      if (!isNonEmptyString(m.label)) problems.push(`marks[${i}].label missing`)
      if (!isNonEmptyString(m.why)) problems.push(`marks[${i}].why missing`)
      const lesson = m.lesson
      if (!isRecord(lesson)) {
        problems.push(`marks[${i}].lesson missing`)
      } else {
        if (!isNonEmptyString(lesson.notation)) problems.push(`marks[${i}].lesson.notation missing`)
        if (!Array.isArray(lesson.steps) || lesson.steps.length < 3 || lesson.steps.length > 6) {
          problems.push(`marks[${i}].lesson.steps must have 3-6 entries`)
        }
      }
      const check = m.check
      if (!isRecord(check)) {
        problems.push(`marks[${i}].check missing`)
      } else {
        if (!isNonEmptyString(check.prompt)) problems.push(`marks[${i}].check.prompt missing`)
        if (
          !Array.isArray(check.accept) ||
          check.accept.length < 1 ||
          !check.accept.every((p: unknown) => typeof p === 'string')
        ) {
          problems.push(`marks[${i}].check.accept must be non-empty string array`)
        }
      }
    })
  }

  const nl = value.nextLine
  if (!isRecord(nl)) {
    problems.push('nextLine missing')
  } else {
    if (!isNonEmptyString(nl.setup)) problems.push('nextLine.setup missing')
    const expect = nl.expect
    if (!isRecord(expect)) {
      problems.push('nextLine.expect missing')
    } else {
      if (!isNonEmptyString(expect.pattern)) problems.push('nextLine.expect.pattern missing')
      if (!isNonEmptyString(expect.hint)) problems.push('nextLine.expect.hint missing')
    }
  }

  if (problems.length > 0) {
    throw new InvalidPackError(path, problems)
  }
}

let cache: ContentPack[] | null = null

/** Load all valid packs, sorted by id. Throws on any malformed pack. */
export function loadPacks(): ContentPack[] {
  if (cache) return cache
  const packs: ContentPack[] = []
  for (const [path, value] of Object.entries(modules)) {
    validatePack(value, path)
    packs.push(value)
  }
  if (packs.length === 0) {
    throw new Error('No content packs found under src/content')
  }
  cache = packs.sort((a, b) => a.id.localeCompare(b.id))
  return cache
}
