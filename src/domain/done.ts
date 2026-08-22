const STORE = 'questforge.done.v1'

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export function loadDone(): string[] {
  try {
    const raw = localStorage.getItem(STORE)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!isStringArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveDone(ids: string[]): void {
  localStorage.setItem(STORE, JSON.stringify(ids))
}
