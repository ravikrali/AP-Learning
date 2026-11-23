// Narration for chem-8.7 "pH vs. pKa & Indicators". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u8.ts (plus chem/book.ts: 10 to 1 at one unit, 100 to 1 at two units,
// a colour change shows at about 10 to 1, so most indicators change over about pKa ± 1).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-8.7',
  title: 'pH vs. pKa & Indicators',
  course: 'AP® Chemistry',
  unit: 'Unit 8 · Acids and Bases',
  unitId: 'chem-u8',
  unitTitle: 'Acids and Bases',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'P H versus P K A, and indicators.', cap: 'pH vs. pKa & Indicators.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn how to tell which form of an acid dominates, why indicators change color, and how to pick the right indicator for a titration.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Pour red cabbage juice into vinegar, and it turns pink.', gap: 0.4 },
      { say: 'Mix it with baking soda, and it turns green.', gap: 0.5 },
      { say: 'That juice is an indicator.', gap: 0.4 },
      { say: 'Indicators are weak acids whose two forms have different colors.', gap: 0.5 },
      { say: 'The acid form, H A, is one color. The base form, A minus, is another.', cap: 'The acid form, HA, is one color. The base form, A⁻, is another.', gap: 0.5 },
      { say: 'Which form wins? It depends on the P H compared with the P K A.', cap: 'Which form wins? It depends on pH vs. pKa.', gap: 0.8 },
    ] },
    { id: 'compare', beats: [
      { say: 'So which form dominates?' },
      { say: "Compare the solution's P H with the acid's P K A.", cap: "Compare the solution's pH with the acid's pKa.", gap: 0.5 },
      { say: 'If the P H is lower than the P K A, the acid form, H A, dominates. It stays protonated.', cap: 'If pH < pKa, the acid form, HA, dominates. It stays protonated.', gap: 0.6 },
      { say: 'If the P H equals the P K A, the two forms are present in equal amounts.', cap: 'If pH = pKa, [HA] = [A⁻].', gap: 0.6 },
      { say: 'If the P H is higher than the P K A, the base form, A minus, dominates. It is deprotonated.', cap: 'If pH > pKa, the base form, A⁻, dominates. It is deprotonated.', gap: 0.6 },
      { say: 'So always ask one question. Is the P H above or below the P K A?', cap: 'So always ask one question: is the pH above or below the pKa?', gap: 0.8 },
    ] },
    { id: 'trick', beats: [
      { say: "Here's a trick: low P H means loaded with protons.", cap: "Here's a trick: low pH = loaded with protons.", gap: 0.5 },
      { say: 'When the P H is lower than the P K A, there are plenty of H plus ions around.', cap: 'When the pH is lower than the pKa, there are plenty of H⁺ ions around.', gap: 0.4 },
      { say: 'So the molecule keeps its proton. It stays H A.', cap: 'So the molecule keeps its proton. It stays HA.', gap: 0.5 },
      { say: 'When the P H is higher, H plus is scarce.', cap: 'When the pH is higher, H⁺ is scarce.', gap: 0.4 },
      { say: 'So the molecule loses its proton, and becomes A minus.', cap: 'So the molecule loses its proton, and becomes A⁻.', gap: 0.6 },
      { say: 'The bigger the gap between the P H and the P K A, the more lopsided the ratio.', cap: 'The bigger the gap between the pH and the pKa, the more lopsided the ratio.', gap: 0.4 },
      { say: 'Each P H unit means a ten times change in the ratio of A minus to H A.', cap: 'Each pH unit = a 10× change in [A⁻]/[HA].', gap: 0.5 },
      { say: 'One unit above the P K A, the base form outnumbers the acid form ten to one. Two units above, one hundred to one.', cap: 'One unit above the pKa, the base form outnumbers the acid form 10 to 1. Two units above, 100 to 1.', gap: 0.8 },
    ] },
    { id: 'indicator', beats: [
      { say: 'Now back to indicators.' },
      { say: 'An indicator changes color around its P K A.', cap: 'An indicator changes color around its pKa.', gap: 0.5 },
      { say: 'Take an indicator with a P K A of nine. Its acid form is colorless, and its base form is pink.', cap: 'Take an indicator with pKa 9. Its acid form is colorless, and its base form is pink.', gap: 0.5 },
      { say: 'At a P H of four, the P H is below the P K A. The acid form dominates, so the solution is colorless.', cap: 'At pH 4, the pH is below the pKa. The acid form dominates, so the solution is colorless.', gap: 0.5 },
      { say: 'Raise the P H well above nine, and the base form takes over. Now it is pink.', cap: 'Raise the pH well above 9, and the base form takes over. Now it is pink.', gap: 0.6 },
      { say: 'The color change shows once one form outnumbers the other by about ten to one.', cap: 'The color change shows once one form outnumbers the other by about 10 to 1.', gap: 0.4 },
      { say: 'So most indicators change color over a range of about one P H unit either side of the P K A.', cap: 'So most indicators change color over a range of about pKa ± 1.', gap: 0.8 },
    ] },
    { id: 'choose', beats: [
      { say: 'So which indicator should you use for a titration?' },
      { say: 'Pick an indicator whose P K A is close to the P H at the equivalence point.', cap: 'Pick an indicator whose pKa is close to the pH at the equivalence point.', gap: 0.5 },
      { say: 'For a strong acid and a strong base, the equivalence P H is about seven.', cap: 'For a strong acid and a strong base, the equivalence pH is about 7.', gap: 0.4 },
      { say: 'For a weak acid and a strong base, it is above seven. Phenolphthalein, which changes around P H eight to ten, works well.', cap: 'For a weak acid and a strong base, it is above 7. Phenolphthalein, which changes around pH 8–10, works well.', gap: 0.4 },
      { say: 'For a weak base and a strong acid, it is below seven.', cap: 'For a weak base and a strong acid, it is below 7.', gap: 0.6 },
      { say: 'Say a weak acid is titrated with sodium hydroxide, and the equivalence P H is about eight point seven.', cap: 'Say a weak acid is titrated with NaOH, and the equivalence pH is about 8.7.', gap: 0.5 },
      { say: 'Your indicators have P K A values of three point five, five, seven, and nine. Choose nine. It is the closest.', cap: 'Your indicators have pKa 3.5, 5.0, 7.0 and 9.0. Choose 9.0: it is the closest.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Acetic acid has a P K A of four point seven four. In a solution at P H seven point zero, which form predominates? Acetic acid, acetate, equal amounts, or neither?', cap: 'Acetic acid has pKa 4.74. In a solution at pH 7.0, which form predominates? CH₃COOH, CH₃COO⁻, equal amounts, or neither?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is acetate.', cap: 'The answer is CH₃COO⁻, acetate.', gap: 0.4 },
      { say: 'The P H, seven point zero, is higher than the P K A, four point seven four. So the deprotonated form, acetate, dominates.', cap: 'The pH, 7.0, is higher than the pKa, 4.74. So the deprotonated form, CH₃COO⁻, dominates.', gap: 0.5 },
      { say: 'Equal amounts would need the P H to equal the P K A.', cap: 'Equal amounts would need the pH to equal the pKa.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'When the P H is below the P K A, H A dominates. When the P H is above it, A minus dominates.', cap: 'pH < pKa → HA dominates. pH > pKa → A⁻ dominates.', gap: 0.5 },
      { say: 'Indicators have different colors in their H A and A minus forms.', cap: 'Indicators have different colors in their HA and A⁻ forms.', gap: 0.5 },
      { say: 'And pick an indicator with a P K A close to the equivalence point P H.', cap: 'Pick an indicator with pKa ≈ the equivalence-point pH.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
