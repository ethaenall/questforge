# QuestForge

**Learn the moves. Write the next line yourself.**

QuestForge is an open-source, AI-powered learning engine that turns any worksheet,
textbook page, or study guide into a guided quest: it finds exactly the prerequisite
moves you're missing, teaches only those, makes you *use* each one, and then hands
the pen back to you. It never does the work for you.

> Built open-source for the Pixel Forge AI Hackathon (Aug 2026).

## Why

Every "AI tutor" on the market finishes your homework. That feels good and teaches
nothing — worse, it quietly locks students out of tomorrow's class, because the
next lesson assumes yesterday's skills are in hand.

QuestForge takes the opposite stance:

1. **Diagnose** — read any pasted/uploaded page and name the exact undefined
   references: the marks, notations, or moves a student cannot yet treat as given.
2. **Teach narrow** — build a micro-lesson for each missing move in the *same
   notation* as the student's own material.
3. **Force transfer** — make the student apply each move before moving on.
4. **Return the pen** — the student writes the next line of their own work.
   The AI checks; it never writes.

## How the kernel works

QuestForge runs on a **dual-kernel architecture**. Diagnosis — naming which marks a
student can't yet treat as given — sits behind one small interface (`DiagnosticKernel`),
and two interchangeable engines implement it:

1. **LocalKernel (default).** Deterministic, authored-seed detection. Every mark in a
   content pack may declare `signatures` — plain regexes that find *usage evidence* of
   that mark inside the source text. The kernel locates each mark's first occurrence,
   fully offline, with zero network calls. Because detection is just authored regexes
   over text you can read, every diagnosis is **auditable**: you can see exactly why a
   mark was flagged. An invalid signature never crashes diagnosis; it's skipped.

2. **ModelKernel (optional).** Same interface, model-backed analysis behind it. You
   bring your own OpenAI-compatible endpoint and key, entered in-browser. The endpoint
   and key live in your browser's `localStorage` and are **never transmitted anywhere
   except the endpoint you chose** — no QuestForge server sees them, because there is
   no QuestForge server. Prefer to stay fully offline? Don't configure it; LocalKernel
   needs nothing but the pack.

Either way, teaching, checking, and next-line verification run on the pack's authored
content and deterministic matchers — never on generated answers.

## Quick start

```bash
npm install     # Node >= 20
npm run dev     # Vite dev server
npm test        # vitest — domain layer unit tests
npm run build   # type-check + production build
```

## Adding your own content pack

A content pack is plain JSON matching the `ContentPack` contract in
[src/domain/types.ts](src/domain/types.ts). It's one worksheet-shaped object:

| Field        | What it holds |
| ------------ | ------------- |
| `id`, `title`, `subject` | Identity of the pack. |
| `sourceText` | The realistic worksheet/excerpt containing the undefined references. |
| `marks[]`    | The marks a student might be missing (see below). |
| `nextLine`   | The problem where the student writes their own next line. |

Each mark carries:

- `id`, `label` — e.g. `"completing-the-square"`, `"completing the square"`.
- `why` — why this mark matters. Respectful, zero shame.
- `signatures` *(optional)* — regexes LocalKernel uses to spot usage evidence in
  `sourceText`. Provide them so diagnosis can locate the mark.
- `lesson` — `{ notation, steps }`: the notation family this mark belongs to and
  3–6 ordered steps, written in the *same notation* as your source text.
- `check` — `{ prompt, accept }`: an apply-it-yourself micro-problem plus 2–4 regex
  patterns. A student answer passes if ANY pattern matches after whitespace
  normalization, so equivalent correct forms (`^2`, `²`) are all accepted.

`nextLine` carries `setup` (the problem) and `expect` — a `pattern` regex for the
expected next line of the student's own work, plus a `hint` shown after a failed
attempt. Nudges, never writes.

Skeleton:

```json
{
  "id": "algebra-ii-quadratics",
  "title": "Quadratics worksheet",
  "subject": "Algebra II",
  "sourceText": "Solve x^2 + 6x + 5 = 0 by completing the square…",
  "marks": [
    {
      "id": "completing-the-square",
      "label": "completing the square",
      "why": "It rewrites any quadratic into vertex form — used throughout this page.",
      "signatures": ["completing the square", "\\(x [+-] \\d+\\)^2"],
      "lesson": {
        "notation": "algebraic",
        "steps": [{ "text": "…" }, { "text": "…" }]
      },
      "check": {
        "prompt": "Rewrite x^2 + 6x as a squared binomial.",
        "accept": ["\\(x\\s*\\+\\s*3\\)^2"]
      }
    }
  ],
  "nextLine": {
    "setup": "Now solve x^2 + 6x + 5 = 0. Write the next line.",
    "expect": { "pattern": "\\(x\\s*\\+\\s*3\\)^2\\s*=\\s*-?4", "hint": "Move only the constant first." }
  }
}
```

## How we map to the judging criteria

- **Originality** — the anti-homework-bot stance lives in the code itself: the engine
  has no path that writes a student's work. It diagnoses, teaches, checks, and hands
  back the pen.
- **Design** — an accessible dark grimoire UI: dark theme, labelled regions, keyboard-
  reachable controls, feedback that respects the learner.
- **Impact** — unlocks tomorrow's class without doing tonight's work. Missing moves get
  named and taught instead of papered over.
- **Technical** — dual-kernel architecture behind one interface, with the domain layer
  (diagnosis, answer checking, next-line verification) covered by unit tests.

## Status

Night one build (2026-08-22): see [DEVLOG.md](DEVLOG.md).

## License

MIT — see [LICENSE](LICENSE).
