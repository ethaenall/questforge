# QuestForge — Pixel Forge AI Hackathon Submission

> **NOT SUBMITTED — awaiting operator authorization.**
> This file is a working draft. Nothing below has been submitted anywhere.
> Every unfinished item is marked **PENDING** explicitly; nothing is claimed
> as done that isn't done.

## Checklist

| Item | Status | Notes |
| ---- | ------ | ----- |
| Hosted URL | **PENDING** — operator deploy decision | No deployment exists yet; whether/where to deploy is an operator-only call. |
| Public repo | **DONE** | https://github.com/ethaenall/questforge — public, MIT licensed ([LICENSE](../LICENSE)). |
| Demo video | **PENDING** | Not recorded yet. |
| Submission form | **PENDING** — operator-only | Form entry must be completed by the operator; this draft does not fill or submit anything. |

No other hackathon requirements are asserted as complete. Anything not listed
above should be re-checked against the official Pixel Forge rules before
submission.

## Devpost blurb — DRAFT (~250 words)

Every AI tutor on the market will finish your homework for you. It feels great,
teaches nothing, and quietly locks you out of tomorrow's class — because the
next lesson assumes yesterday's skills are already in hand.

QuestForge takes the opposite stance. Paste any worksheet, textbook page, or
study guide, and it names the exact undefined references — the marks, notations,
and moves the text uses but never teaches. Each one gets a micro-lesson written
in your material's own notation, then a forced apply-it check. Finally
QuestForge hands the pen back: you write the next line of your own work, and it
checks it. The AI checks; it never writes.

- **Originality:** the anti-homework-bot stance is enforced in code, not
  copywriting — the engine has no code path that produces student work, only
  diagnosis, teaching, checking, and nudging.
- **Design:** an accessible dark-grimoire interface — dark theme, labelled
  regions, keyboard-reachable controls, and feedback that nudges rather than
  replaces the learner.
- **Impact:** tomorrow's class unlocks because tonight's work was actually
  learned, not outsourced — missing moves get named and taught instead of
  papered over.
- **Technical:** a dual-kernel architecture behind one `DiagnosticKernel`
  interface — LocalKernel runs fully offline, deterministic, auditable
  detection; ModelKernel is an optional bring-your-own-endpoint alternative
  whose key never leaves your browser — with the domain layer covered by unit
  tests.

Content packs are plain JSON any teacher or student can author. Built
open-source under MIT for the Pixel Forge AI Hackathon: learn the moves. Write
the next line yourself.

## Built with

- Vite + React + TypeScript
- vitest (+ Testing Library) unit-tested domain layer
- Dual-kernel design: LocalKernel (offline, authored-seed regex signatures) and
  optional ModelKernel (user-supplied OpenAI-compatible endpoint)
- Hand-authored JSON content packs

## Morning checklist — exactly what remains before submit

1. **Re-check the official Pixel Forge rules** — confirm nothing beyond the
   items below is required.
2. **Hosted URL** — operator decides whether/where to deploy. If approved,
   deploy and replace the **PENDING** hosted-URL row above.
3. **Demo video** — record it and fill the **PENDING** demo-video row above.
4. **Blurb pass** — read the Devpost blurb once more and edit to taste.
5. **Submit** — fill out and submit the official form (operator only).
   Nothing in this draft fills or submits anything.

*End of draft.*
