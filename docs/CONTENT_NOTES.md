# Content Notes — pedagogy of the packs

Every pack follows one contract: **name the missing mark → teach it narrow →
force application → hand back the pen.**

## Design decisions

**Marks, not topics.** Each pack targets notation-level gaps (`(b/2)²`,
`√−1`, `i`, sign conventions, `d/dt`) rather than whole units. The failure mode
QuestForge exists to fix is *local*: a student who is fine until one untaught
symbol appears. Teaching narrow keeps dignity intact and time cost tiny.

**Same notation as the source.** Lessons are written in whatever notation the
worksheet itself uses (Unicode `x²` vs `x^2`, `v_y` vs `vᵧ`), because transfer
fails across notation switches. The student should never have to translate
between the lesson and their own page.

**Application gates progress.** Every mark ends in a check the student must
pass by producing the move themselves. Accept patterns deliberately admit
equivalent correct forms (spacing variants, `^2` vs `²`, `−` vs `-`) so we
never punish formatting while checking understanding.

**The pen comes back.** Each pack ends with `nextLine`: the student writes
the next line of real coursework. The engine validates against a pattern and,
on failure, returns a hint that re-teaches the move — it never writes the line.
This is the anti-homework-bot stance in code.

**Zero-shame phrasing.** `why` fields never imply the student should already
know the mark ("obviously", "just", "simply" are banned). Gaps are positioned
as unnamed imports, not personal failings.

## Pack roster

| Pack | Subject | Marks |
|---|---|---|
| `algebra-quadratic-completion` | Algebra 2 | completing the square `(b/2)²`; imaginary unit `i` |
| `physics-kinematics-signs` | Physics | upward-positive convention; velocity components |
| `calc-chain-notation` | Calculus | reading `d/dt`; chain rule as rates converter |

All worksheet text is original, written for QuestForge.

stats-z-score-units signatures: z\s*=\s*\(x\s*−\s*μ\)\s*/\s*σ; standard units; z\s*=\s*[-−]\s*2; empirical rule
