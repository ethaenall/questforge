# Rubric

Pixel Forge judges should score the AI lesson loop, not a chatbot.

Required: diagnose → teach in this page's notation → apply each missing move → the student writes the next line. Then stop. The engine never writes that line.

**Originality.** High when that stance is code: check and nudge only. Low if a tutor fills answers.

**Design.** High when one page holds the loop and a miss hints the unfinished problem. Low for slideshows.

**Potential Impact.** High when tonight finishes offline — no login, key, or network. Default: LocalKernel.

**Technological Implementation.** High when diagnosis uses one seam: offline LocalKernel plus optional BYO ModelKernel (user endpoint; key stays in-browser). Do not penalize skipping the model. Penalize writing the student's line.
