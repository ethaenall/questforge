import { useEffect, useRef, useState } from 'react'
import { DEFAULT_CONFIG, clearModelConfig, saveModelConfig, type ModelConfig } from '../domain/config'

/**
 * Accessible settings dialog for the optional ModelKernel.
 * Escape closes. Focus moves in on open and returns on close.
 */
export function SettingsDialog(props: {
  open: boolean
  initial: ModelConfig | null
  onClose: () => void
}) {
  const { open, initial, onClose } = props
  const [baseUrl, setBaseUrl] = useState(initial?.baseUrl ?? DEFAULT_CONFIG.baseUrl)
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState(initial?.model ?? DEFAULT_CONFIG.model)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    dialogRef.current?.querySelector('input')?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function save() {
    if (apiKey.trim().length === 0) {
      onClose()
      return
    }
    saveModelConfig({ baseUrl: baseUrl.trim(), apiKey: apiKey.trim(), model: model.trim() })
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Model engine settings"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'color-mix(in srgb, var(--desk) 80%, transparent)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
      }}
    >
      <div ref={dialogRef} className="panel" style={{ maxWidth: 460, width: '92%' }}>
        <h2>Model engine</h2>
        <p className="why">
          Optional. QuestForge works fully offline without this. Your key is stored in
          your browser only and sent only to the endpoint below.
        </p>
        <label style={{ display: 'block', marginBottom: 10 }}>
          Base URL
          <input
            className="answer-input"
            style={{ width: '100%' }}
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            aria-label="Base URL"
          />
        </label>
        <label style={{ display: 'block', marginBottom: 10 }}>
          API key
          <input
            className="answer-input"
            style={{ width: '100%' }}
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={initial ? '•••••••• (saved)' : 'sk-…'}
            aria-label="API key"
          />
        </label>
        <label style={{ display: 'block', marginBottom: 14 }}>
          Model
          <input
            className="answer-input"
            style={{ width: '100%' }}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            aria-label="Model name"
          />
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn" onClick={save}>
            Save & use AI engine
          </button>
          <button type="button" className="btn secondary" onClick={() => { clearModelConfig(); onClose() }}>
            Use local engine
          </button>
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
