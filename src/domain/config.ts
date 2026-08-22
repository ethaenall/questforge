/**
 * User-supplied model engine configuration.
 * Stored in localStorage ONLY. The key never leaves the browser except
 * toward the endpoint the user themselves chose. Never committed, never logged.
 */

export interface ModelConfig {
  baseUrl: string
  apiKey: string
  model: string
}

const STORE_KEY = 'questforge.modelconfig'

export const DEFAULT_CONFIG: Omit<ModelConfig, 'apiKey'> = {
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
}

export function loadModelConfig(): ModelConfig | null {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ModelConfig>
    if (
      typeof parsed.baseUrl !== 'string' ||
      typeof parsed.apiKey !== 'string' ||
      typeof parsed.model !== 'string' ||
      parsed.apiKey.length === 0
    ) {
      return null
    }
    return { baseUrl: parsed.baseUrl, apiKey: parsed.apiKey, model: parsed.model }
  } catch {
    return null
  }
}

export function saveModelConfig(config: ModelConfig): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(config))
}

export function clearModelConfig(): void {
  localStorage.removeItem(STORE_KEY)
}
