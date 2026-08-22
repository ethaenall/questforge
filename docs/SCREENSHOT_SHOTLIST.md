# QuestForge — Screenshot Shotlist

Six stills. Desktop Chrome, 16:9 (1440×900 or 1920×1080). Dark room. Crop browser chrome. Local preview: http://127.0.0.1:4173. No login, no API key. Same path as `e2e/questforge.spec.ts`.

Canonical pack: **Worksheet 4.3 — Quadratic Vertex Form** (Algebra 2). Leave **Model engine · local**.

## 1. Pick your page

**Subject:** `.desk` — shelf (`aside.shelf`) + empty workspace. Heading **1 · Pick your page**. Three pack buttons. Empty desk copy **Open a page.**

**Setup:** Fresh load. Do not click a worksheet. Frame the ink desk: gold **Ink** mark, **QuestForge** wordmark, lede, local engine button.

**Shows:** you start with a page, not a chatbot.

## 2. Worksheet selected

**Subject:** selected pack button (`aria-pressed="true"`) plus `.paper` — **2 · The page as given**. Cream worksheet, ink type, problem 1 worked, problem 2 blank.

**Setup:** click **Worksheet 4.3 — Quadratic Vertex Form**. Keep the shelf in frame so the gold-bordered selected card is visible. Crop before scrolling the diagnosis column away.

**Shows:** the real worksheet paper is the product, not a card stack.

## 3. Undefined refs

**Subject:** `.stage` — paper left, `.panel` right headed **3 · Undefined references**. Two mark cards: **completing the square**, **the imaginary unit i**. Button **Teach me these →**.

**Setup:** same state as shot 2. Frame paper + diagnosis together. Do not open Model engine.

**Shows:** the engine names the two marks the page uses but never teaches.

## 4. Move 1

**Subject:** `.lesson-card` headed **4 · Move 1/2 — completing the square**. Numbered lesson steps, prompt about `x² + 10x`, field **Answer for completing the square**, **Apply**, fail verdict **Not yet**.

**Setup:** from shot 3, click **Teach me these →**. Type `13`. Click **Apply**. Capture the refused state. Do not type `5²`.

**Shows:** wrong answers are refused. Nothing is written for you.

## 5. Next line

**Subject:** `.lesson-card` headed **5 · Write the next line yourself**. Setup for problem 2 (`y = (x² − 12x) + 7`). Field **Your next line**, **Commit line**, hint containing **Half of −12**.

**Setup:** finish both applies (`5²`, then `7i`). On the next-line screen type `y = x² − 12x + 7`. Click **Commit line**. Capture the hint. Do not commit the correct line yet.

**Shows:** a miss earns a nudge. The engine never writes Line 2.

## 6. Finale

**Subject:** `section.finale` headed **The pen is yours.**

**Setup:** replace the field with `y = (x² − 12x + 36) − 36 + 7`. Click **Commit line**. Wait for the heading. Stop.

**Shows:** you named the missing moves, used each one, and wrote the next line yourself.
