import { useMemo, useState } from 'react'
import { loadPacks } from './domain/loader'
import { LocalKernel } from './domain/kernel'
import { ModelKernel, ModelKernelError } from './domain/modelKernel'
import { loadModelConfig } from './domain/config'
import { checkAnswer, checkNextLine, type CheckOutcome, type ContentPack, type Diagnosis } from './domain/types'
import { SettingsDialog } from './components/SettingsDialog'

const kernel = new LocalKernel()

type Phase = 'diagnose' | 'forge' | 'nextline' | 'done'

interface MarkProgress {
  passed: boolean
  attempts: number
}

export default function App() {
  const packs = useMemo(() => loadPacks(), [])
  const [packId, setPackId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('diagnose')
  const [markIndex, setMarkIndex] = useState(0)
  const [progress, setProgress] = useState<Record<string, MarkProgress>>({})
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [modelDiagnosis, setModelDiagnosis] = useState<Diagnosis | null>(null)
  const [modelBusy, setModelBusy] = useState(false)
  const [modelError, setModelError] = useState<string | null>(null)
  const [modelConfigured, setModelConfigured] = useState<boolean>(() => loadModelConfig() !== null)

  const pack = packs.find((p) => p.id === packId) ?? null

  function choosePack(id: string) {
    setPackId(id)
    setPhase('diagnose')
    setMarkIndex(0)
    setProgress({})
    setModelDiagnosis(null)
    setModelError(null)
    runModelDiagnosis(id)
  }

  function runModelDiagnosis(id: string) {
    const cfg = loadModelConfig()
    if (!cfg) return
    const target = packs.find((p) => p.id === id)
    if (!target) return
    setModelBusy(true)
    new ModelKernel(cfg)
      .diagnose(target)
      .then((d) => {
        if (id === packId || packId === null) setModelDiagnosis(d)
      })
      .catch((e: unknown) => {
        setModelError(e instanceof ModelKernelError ? e.message : 'AI engine failed — local results shown.')
      })
      .finally(() => setModelBusy(false))
  }


  return (
    <>
      <header className="masthead">
        <span className="rune">⚔ ⚒ ✒</span>
        <h1>QuestForge</h1>
        <p>
          Your page uses moves it never taught you. QuestForge names exactly those,
          teaches only those — then hands the pen back. It never does the work for you.
        </p>
        <div style={{ marginTop: 10 }}>
          <button
            type="button"
            className="btn secondary"
            onClick={() => setSettingsOpen(true)}
            aria-label="Model engine settings"
          >
            ⚙ Model engine {modelConfigured ? '· AI' : '· local'}
          </button>
        </div>
      </header>

      <SettingsDialog
        open={settingsOpen}
        initial={loadModelConfig()}
        onClose={() => {
          setSettingsOpen(false)
          setModelConfigured(loadModelConfig() !== null)
        }}
      />

      <main>
        <section className="card" aria-label="Choose a worksheet">
          <h2>1 · Pick your page</h2>
          <div className="pack-picker">
            {packs.map((p) => (
              <button
                key={p.id}
                type="button"
                className="pack-btn"
                aria-pressed={p.id === packId}
                onClick={() => choosePack(p.id)}
              >
                {p.title}
              </button>
            ))}
          </div>
        </section>

        {pack && phase === 'diagnose' && (
          <DiagnoseView
            pack={pack}
            diagnosis={modelDiagnosis ?? kernel.diagnose(pack)}
            modelBusy={modelBusy}
            modelError={modelError}
            onBegin={() => setPhase('forge')}
          />
        )}

        {pack && phase === 'forge' && (
          <ForgeView
            key={markIndex}
            pack={pack}
            markIndex={markIndex}
            progress={progress}
            onPass={(id) => {
              setProgress((prev) => ({ ...prev, [id]: { passed: true, attempts: (prev[id]?.attempts ?? 0) + 1 } }))
              if (markIndex + 1 < pack.marks.length) {
                setMarkIndex(markIndex + 1)
              } else {
                setPhase('nextline')
              }
            }}
          />
        )}

        {pack && phase === 'nextline' && (
          <NextLineView
            pack={pack}
            onPass={() => {
              setPhase('done')
            }}
          />
        )}

        {pack && phase === 'done' && (
          <section className="card finale" aria-label="Session complete">
            <span className="pen-icon">✒️</span>
            <h2>The pen is yours.</h2>
            <p>
              You named the missing moves, used each one, and wrote the next line
              yourself. That line is yours — no engine wrote it.
            </p>
          </section>
        )}
      </main>

      <footer className="site-foot">
        QuestForge · learn the moves, write the next line · MIT licensed
      </footer>
    </>
  )
}

function DiagnoseView(props: {
  pack: ContentPack
  diagnosis: Diagnosis
  modelBusy: boolean
  modelError: string | null
  onBegin: () => void
}) {
  const { pack, diagnosis, onBegin } = props
  return (
    <>
      <section className="card" aria-label="Your page as given">
        <h2>2 · The page as given</h2>
        <p className="source-text">{pack.sourceText}</p>
      </section>

      <section className="card" aria-label="Undefined references found">
        <h2>3 · Undefined references</h2>
        {props.modelBusy && (
          <p role="status" style={{ color: 'var(--text-dim)' }}>AI engine reading the page…</p>
        )}
        {props.modelError && (
          <p role="alert" style={{ color: 'var(--fail)' }}>{props.modelError}</p>
        )}
        <p className="why" style={{ color: 'var(--text-dim)', marginTop: 0 }}>
          These marks are <em>used</em> on this page but never <em>taught</em>.
          QuestForge names them so they can't ambush you.
        </p>
        <ol className="diagnosis-list">
          {diagnosis.detected.map((d) => (
            <li key={d.mark.id} className="mark-card">
              <h3>{d.mark.label}</h3>
              <p className="why">{d.mark.why}</p>
            </li>
          ))}
        </ol>
        <div style={{ marginTop: 16 }}>
          <button type="button" className="btn" onClick={onBegin}>
            Teach me these →
          </button>
        </div>
      </section>
    </>
  )
}

function ForgeView(props: {
  pack: ContentPack
  markIndex: number
  progress: Record<string, MarkProgress>
  onPass: (id: string) => void
}) {
  const { pack, markIndex, progress, onPass } = props
  const mark = pack.marks[markIndex]
  const [answer, setAnswer] = useState('')
  const [verdict, setVerdict] = useState<{ kind: 'pass' | 'fail'; text: string } | null>(null)

  const doneCount = Object.values(progress).filter((x) => x.passed).length

  function submit() {
    if (checkAnswer(answer, mark.check.accept)) {
      setVerdict({ kind: 'pass', text: '✔ The move is yours.' })
      window.setTimeout(onPass, 900)
    } else {
      setVerdict({
        kind: 'fail',
        text: '✘ Not yet — re-read the steps and try again. No answers are written for you.',
      })
    }
  }

  return (
    <section className="card" aria-label={`Lesson ${markIndex + 1} of ${pack.marks.length}`}>
      <h2>
        4 · Move {markIndex + 1}/{pack.marks.length} — {mark.label}
        <span style={{ color: 'var(--text-dim)', fontSize: 14 }}> · forged {doneCount}</span>
      </h2>
      <ol className="lesson-steps">
        {mark.lesson.steps.map((s, i) => (
          <li key={i}>{s.text}</li>
        ))}
      </ol>
      <p className="check-prompt">{mark.check.prompt}</p>
      <form
        className="answer-row"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <input
          className="answer-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write it yourself…"
          aria-label={`Answer for ${mark.label}`}
        />
        <button type="submit" className="btn">
          Apply
        </button>
      </form>
      <p className={`verdict ${verdict?.kind ?? ''}`} role="status">
        {verdict?.text ?? ''}
      </p>
    </section>
  )
}

function NextLineView(props: { pack: ContentPack; onPass: () => void }) {
  const { pack } = props
  const [text, setText] = useState('')
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null)

  function submit() {
    const outcome = checkNextLine(text, pack.nextLine)
    setOutcome(outcome)
    if (outcome.kind === 'pass') {
      window.setTimeout(props.onPass, 900)
    }
  }

  return (
    <section className="card" aria-label="Write the next line">
      <h2>5 · Write the next line yourself</h2>
      <p className="nextline-setup">{pack.nextLine.setup}</p>
      <form
        className="answer-row"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <input
          className="answer-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your next line…"
          aria-label="Your next line"
        />
        <button type="submit" className="btn secondary">
          Commit line
        </button>
      </form>
      <p className={`verdict ${(outcome?.kind) ?? ''}`} role="status">
        {outcome?.kind === 'pass'
          ? '✔ That line is yours.'
          : outcome?.kind === 'fail' && outcome.hint
            ? `✘ ${outcome.hint}`
            : ''}
      </p>
    </section>
  )
}
