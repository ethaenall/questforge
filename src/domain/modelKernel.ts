import type { Diagnosis, DetectedMark } from './types'
import type { ContentPack } from './types'
import type { ModelConfig } from './config'

/**
 * ModelKernel — optional AI diagnostic engine behind the same seam as LocalKernel.
 * Sends the pack's sourceText to an OpenAI-compatible chat completions endpoint
 * (user-supplied config), asking the model to identify which authored marks are
 * USED but NOT TAUGHT in the text. Returns markIds only; the orchestrating UI
 * re-hydrates them against the pack's own Mark objects.
 */

export class ModelKernelError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ModelKernelError'
  }
}

interface ChatResponseShape {
  choices?: Array<{ message?: { content?: string } }>
}

export class ModelKernel {
  constructor(private readonly config: ModelConfig) {}

  async diagnose(pack: ContentPack): Promise<Diagnosis> {
    const raw = await this.complete(this.prompt(pack))
    const ids = this.parseMarkIds(raw, pack)
    const byId = new Map(pack.marks.map((m) => [m.id, m]))
    const detected: DetectedMark[] = []
    for (const id of ids) {
      const mark = byId.get(id)
      if (!mark) {
        throw new ModelKernelError(`model returned unknown mark id "${id}"`)
      }
      detected.push({ mark, firstOffset: -1 })
    }
    return { packId: pack.id, detected }
  }

  private prompt(pack: ContentPack): string {
    const markList = pack.marks.map((m) => `- ${m.id}: ${m.label}`).join('\n')
    return [
      'You are a diagnostic reading assistant. Given a student worksheet and a list of',
      '"marks" (notation moves/symbols), identify which marks are USED in the worksheet',
      'but NEVER TAUGHT there. Reply with ONLY a JSON object: {"markIds": ["id1", ...]}',
      '',
      'Marks:',
      markList,
      '',
      'Worksheet:',
      pack.sourceText,
    ].join('\n')
  }

  private async complete(prompt: string): Promise<string> {
    let response: Response
    try {
      response = await fetch(`${this.config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0,
        }),
      })
    } catch (cause) {
      throw new ModelKernelError(`network failure reaching model endpoint: ${String(cause)}`)
    }
    if (!response.ok) {
      throw new ModelKernelError(`model endpoint returned ${response.status}`)
    }
    let body: ChatResponseShape
    try {
      body = (await response.json()) as ChatResponseShape
    } catch {
      throw new ModelKernelError('model endpoint returned non-JSON body')
    }
    const content = body.choices?.[0]?.message?.content
    if (typeof content !== 'string' || content.length === 0) {
      throw new ModelKernelError('model response missing content')
    }
    return content
  }

  /** Tolerant extraction of {"markIds": [...]} — handles fenced code blocks. */
  private parseMarkIds(raw: string, _pack: ContentPack): string[] {
    const stripped = raw.replace(/```(?:json)?/g, '').trim()
    const start = stripped.indexOf('{')
    const end = stripped.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) {
      throw new ModelKernelError('model response contained no JSON object')
    }
    try {
      const parsed = JSON.parse(stripped.slice(start, end + 1)) as { markIds?: unknown }
      if (!Array.isArray(parsed.markIds) || !parsed.markIds.every((v) => typeof v === 'string')) {
        throw new ModelKernelError('markIds must be a string array')
      }
      return parsed.markIds as string[]
    } catch (e) {
      if (e instanceof ModelKernelError) throw e
      throw new ModelKernelError('malformed JSON in model response')
    }
  }
}
