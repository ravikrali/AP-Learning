// Display order for multiple-choice options.
// Shuffled each time a question is shown, so the right answer isn't always in the same spot.
// Purely numeric option sets keep their written (ascending) order, like on the real exam.

const NUMERIC = /^[\s−\-+]*(\d|\.\d)/

export function choiceOrder(choices: string[]): number[] {
  const idx = choices.map((_, i) => i)
  if (choices.every((c) => NUMERIC.test(c))) return idx
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}
