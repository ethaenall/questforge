import { expect, test } from '@playwright/test'

/**
 * QuestForge E2E smoke — the FULL loop against the preview server that
 * playwright.config.ts starts (http://127.0.0.1:4173).
 *
 * Pick worksheet → see the undefined references → learn each missing
 * move (wrong answers refused, nothing revealed) → apply it → write the
 * next line yourself (a miss gets a hint) → the pen is yours.
 */
test('full loop: diagnose, forge both marks, write the next line', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/QuestForge/)
  await expect(page.getByRole('heading', { name: 'QuestForge' })).toBeVisible()

  // 1 · Pick your page
  await page
    .getByRole('button', { name: 'Worksheet 4.3 — Quadratic Vertex Form' })
    .click()

  // 3 · Undefined references found
  await expect(page.getByRole('heading', { name: /Undefined references/ })).toBeVisible()
  await page.getByRole('button', { name: /Teach me these/ }).click()

  // 4 · Move 1/2 — completing the square: wrong answer is refused, not corrected
  const answerSquare = page.getByLabel('Answer for completing the square')
  await answerSquare.fill('13')
  await page.getByRole('button', { name: 'Apply' }).click()
  await expect(page.getByText(/Not yet/)).toBeVisible()

  // …the correct form passes and advances to move 2 of 2
  await answerSquare.fill('5²')
  await page.getByRole('button', { name: 'Apply' }).click()
  await expect(page.getByRole('heading', { name: /Move 2\/2/ })).toBeVisible()

  // 4 · Move 2/2 — the imaginary unit i
  await page.getByLabel('Answer for the imaginary unit i').fill('7i')
  await page.getByRole('button', { name: 'Apply' }).click()

  // 5 · Write the next line yourself — a miss earns a hint, never the line
  await expect(
    page.getByRole('heading', { name: /Write the next line yourself/ }),
  ).toBeVisible()
  const nextLine = page.getByLabel('Your next line')
  await nextLine.fill('y = x² − 12x + 7')
  await page.getByRole('button', { name: 'Commit line' }).click()
  await expect(page.getByText(/Half of −12/)).toBeVisible()

  await nextLine.fill('y = (x² − 12x + 36) − 36 + 7')
  await page.getByRole('button', { name: 'Commit line' }).click()
  await expect(page.getByRole('heading', { name: /The pen is yours/ })).toBeVisible()
})
