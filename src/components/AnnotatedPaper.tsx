import type { Mark } from '../domain/types'

interface Hit {
  start: number
  end: number
  label: string
}

/** Highlight every authored signature in the worksheet. Never rewrites the page. */
export function AnnotatedPaper(props: { text: string; marks: Mark[] }) {
  const hits: Hit[] = []
  for (const m of props.marks) {
    for (const src of m.signatures ?? []) {
      try {
        const re = new RegExp(src, 'g')
        let match: RegExpExecArray | null
        while ((match = re.exec(props.text))) {
          if (match[0].length === 0) break
          hits.push({ start: match.index, end: match.index + match[0].length, label: m.label })
        }
      } catch {
        /* authored regex failed — skip, never throw on a student's page */
      }
    }
  }
  hits.sort((a, b) => a.start - b.start || a.end - b.end)

  const nodes: Array<string | { key: number; label: string; text: string }> = []
  let cursor = 0
  for (const h of hits) {
    if (h.start < cursor) continue
    if (h.start > cursor) nodes.push(props.text.slice(cursor, h.start))
    nodes.push({ key: h.start, label: h.label, text: props.text.slice(h.start, h.end) })
    cursor = h.end
  }
  if (cursor < props.text.length) nodes.push(props.text.slice(cursor))

  return (
    <p className="source-text">
      {nodes.map((n, i) =>
        typeof n === 'string' ? (
          n
        ) : (
          <mark key={`${n.key}-${i}`} title={n.label}>
            {n.text}
          </mark>
        ),
      )}
    </p>
  )
}
