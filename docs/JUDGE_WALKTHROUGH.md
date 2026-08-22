# Judge walkthrough

Two minutes. No login, no API key, no model required.

This is the same path as `e2e/questforge.spec.ts`. Use these answers in order: **`5²`**, then **`7i`**, then the next line. Stop when the pen is yours.

**Open:** the hosted demo, or locally `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` → [http://127.0.0.1:4173](http://127.0.0.1:4173).

1. Land on `/`. The page title and heading both say **QuestForge**.
2. Under **1 · Pick your page**, click **Worksheet 4.3 — Quadratic Vertex Form**.
3. Confirm **3 · Undefined references**. The engine names the two marks the worksheet uses but never teaches: completing the square, and the imaginary unit *i*.
4. Click **Teach me these →**.
5. You are on **4 · Move 1/2 — completing the square**. In **Answer for completing the square**, type `13` and click **Apply**. **Not yet** appears. Wrong answers are refused; nothing is written for you.
6. Replace the field with **`5²`**. Click **Apply**. The heading advances to **Move 2/2**.
7. You are on **4 · Move 2/2 — the imaginary unit i**. In **Answer for the imaginary unit i**, type **`7i`**. Click **Apply**.
8. Confirm **5 · Write the next line yourself**. The setup is problem 2: you already grouped `y = (x² − 12x) + 7`; now you write Line 2.
9. In **Your next line**, type `y = x² − 12x + 7`. Click **Commit line**.
10. A hint containing **Half of −12** appears. A miss earns a hint. The engine never writes the line.
11. Replace the field with **`y = (x² − 12x + 36) − 36 + 7`**. Click **Commit line**.
12. The heading **The pen is yours.** appears. You named the missing moves, used each one, and wrote the next line yourself. Stop.
