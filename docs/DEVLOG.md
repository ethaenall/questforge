# QuestForge Devlog

## Night one — 2026-08-22

**Mission:** vertical slice for Pixel Forge AI Hackathon (deadline Sun Aug 23 ~6am PDT).

### Shipped
- **Domain layer** (`src/domain/`): ContentPack contract with runtime validation,
  LocalKernel deterministic diagnosis (authored-seed signature regexes),
  ModelKernel adapter (BYO OpenAI-compatible endpoint, key stays in-browser),
  answer/next-line checking with whitespace + notation normalization.
- **Content packs ×3**: algebra/completing-the-square (+ imaginary unit),
  physics/sign-conventions (+ vector components), calculus/d/dt reading
  (+ chain rule). Original worksheets, shame-free `why` fields, regex
  accept-patterns tested against equivalent correct forms.
- **UI**: pick page → see the page as given → undefined references named →
  teach-me lessons → apply-each-move checks → write-the-next-line-yourself.
  Dark arcade-grimoire identity, full a11y labeling.
- **Tests**: domain unit tests; Playwright E2E walking the entire learn loop
  (spec cross-checked byte-exact against UI labels).

### Architecture decision
Two interchangeable diagnostic engines behind one seam:
- **LocalKernel** — zero network, auditable regex evidence. The default judge path.
- **ModelKernel** — optional live AI reading; user's key never touches our repo.

This keeps the demo working offline forever while making "meaningful AI
integration" structural, not decorative.

### Known gaps
- vitest hangs in this build environment (Node 26 suspicion) — tests authored,
  execution pending a green runner; `tsc -b` is the night gate.
- Deploy/video/submission deliberately awaiting operator authorization.
