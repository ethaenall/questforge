import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

async function pickFirstPack(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /Worksheet 4\.3/i }))
  await user.click(screen.getByRole('button', { name: /Teach me these/i }))
}

describe('QuestForge full learn loop', () => {
  it('walks diagnose → lessons → next line → done', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Pack picker renders all three packs.
    expect(screen.getByRole('button', { name: /Worksheet 4\.3/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Lab Sheet 3/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Problem Set 7/i })).toBeInTheDocument()

    await pickFirstPack(user)

    // Diagnosis names both algebra marks.
    expect(screen.getByText(/completing the square/i)).toBeInTheDocument()
    expect(screen.getByText(/the imaginary unit/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Teach me these/i }))

    // Lesson 1: wrong answer rejected, correct answer passes.
    expect(screen.getByText(/Move 1\/2/i)).toBeInTheDocument()
    await user.type(screen.getByLabelText(/Answer for completing the square/i), '13')
    await user.click(screen.getByRole('button', { name: /Apply/i }))
    expect(screen.getByText(/Not yet/i)).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/Answer for completing the square/i))
    await user.type(screen.getByLabelText(/Answer for completing the square/i), '5²')
    await user.click(screen.getByRole('button', { name: /Apply/i }))
    await waitFor(() => expect(screen.getByText(/Move 2\/2/i)).toBeInTheDocument())

    // Lesson 2: imaginary unit.
    await user.type(screen.getByLabelText(/Answer for the imaginary unit/i), '7i')
    await user.click(screen.getByRole('button', { name: /Apply/i }))
    await waitFor(() => expect(screen.getByText(/Write the next line yourself/i)).toBeInTheDocument())

    // Next line: hint on failure, pass on correct line.
    await user.type(screen.getByLabelText('Your next line'), 'y = x² − 12x + 49')
    await user.click(screen.getByRole('button', { name: /Commit line/i }))
    expect(screen.getByText(/Half of −12 is −6/i)).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Your next line'))
    await user.type(screen.getByLabelText('Your next line'), 'y = (x² − 12x + 36) − 36 + 7')
    await user.click(screen.getByRole('button', { name: /Commit line/i }))
    expect(await screen.findByText(/The pen is yours/i)).toBeInTheDocument()
  })

  it('never offers a "solve it for me" path', () => {
    render(<App />)
    const body = document.body.textContent ?? ''
    expect(body.toLowerCase()).not.toContain('auto-solve')
    // The apply button is the only action during lessons; no "show answer" exists anywhere.
    expect(screen.queryByText(/show answer/i)).not.toBeInTheDocument()
  })
})
