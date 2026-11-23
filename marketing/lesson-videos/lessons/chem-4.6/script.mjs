// Narration for chem-4.6 "Introduction to Titration". Every fact comes from the lesson cards,
// quick checks and flashcards in app/src/content/chem/u4.ts (the one-line definition in the hook
// is from book.ts; the steep jump at equivalence is from the lesson's titration diagram).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-4.6',
  title: 'Introduction to Titration',
  course: 'AP® Chemistry',
  unit: 'Unit 4 · Chemical Reactions',
  unitId: 'chem-u4',
  unitTitle: 'Chemical Reactions',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Introduction to titration.', cap: 'Introduction to Titration.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the words of titration, the one equation you need at the equivalence point, and how lab mistakes change your answer.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'How much acid is in your orange juice?', gap: 0.6 },
      { say: 'A titration answers that, precisely.', gap: 0.5 },
      { say: 'You add a solution of known concentration, drop by drop, until the reaction is exactly complete.', gap: 0.5 },
      { say: 'The amount you needed tells you the amount of the unknown.', gap: 0.5 },
      { say: 'In short: a titration measures an unknown substance by reacting it completely with a solution of known concentration.', gap: 0.9 },
    ] },
    { id: 'vocab', beats: [
      { say: "First, the vocabulary. There are two solutions.", gap: 0.4 },
      { say: "The analyte is the solution you're investigating. Its amount is unknown.", gap: 0.5 },
      { say: 'The titrant is the solution of known concentration.', gap: 0.3 },
      { say: 'It is added from a buret, and it reacts specifically and completely with the analyte.', gap: 0.5 },
      { say: 'So: known goes in from the buret, unknown waits in the flask.', gap: 0.9 },
    ] },
    { id: 'points', beats: [
      { say: 'Next, two moments that sound alike, but are not the same.', gap: 0.5 },
      { say: 'The equivalence point is the moment the analyte is completely consumed.', gap: 0.3 },
      { say: 'The moles of titrant added exactly match the stoichiometry.', gap: 0.5 },
      { say: "On a titration curve, it sits in the middle of the steep jump.", gap: 0.5 },
      { say: "The endpoint is the observable change, like an indicator's color change, that signals the equivalence point.", gap: 0.5 },
      { say: 'Equivalence is the true stoichiometric point. The endpoint is what you see.', gap: 0.4 },
      { say: 'A good indicator makes them nearly the same.', gap: 0.9 },
    ] },
    { id: 'equation', beats: [
      { say: 'Now the key equation.', gap: 0.4 },
      { say: 'At the equivalence point, the moles of titrant and analyte are in the stoichiometric ratio.', gap: 0.5 },
      { say: 'For a one to one reaction, like H C l plus N a O H, the moles are equal.', cap: 'For a 1 : 1 reaction, like HCl + NaOH, the moles are equal.', gap: 0.4 },
      { say: 'So molarity of the acid times volume of the acid equals molarity of the base times volume of the base.', cap: 'So M(acid) × V(acid) = M(base) × V(base).', gap: 0.5 },
      { say: 'Molarity times volume is just moles.', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: "Let's find an unknown concentration.", gap: 0.4 },
      { say: 'Twenty-five point zero zero milliliters of H C l is titrated with zero point one zero zero molar N a O H. The endpoint is reached after eighteen point five zero milliliters. What is the concentration of H C l?', cap: '25.00 mL of HCl is titrated with 0.100 M NaOH. The endpoint is reached after 18.50 mL. What is [HCl]?', gap: 0.6 },
      { say: 'Step one: moles of N a O H. Zero point one zero zero molar, times zero point zero one eight five zero liters, is one point eight five times ten to the minus three moles.', cap: 'Step 1: mol NaOH = 0.100 M × 0.01850 L = 1.85 × 10⁻³ mol.', gap: 0.5 },
      { say: 'Step two: the ratio is one to one, so moles of H C l are also one point eight five times ten to the minus three.', cap: 'Step 2: the ratio is 1 : 1, so mol HCl = 1.85 × 10⁻³ mol.', gap: 0.5 },
      { say: 'Step three: divide by the volume of acid, zero point zero two five zero zero liters. The concentration of H C l is zero point zero seven four zero molar.', cap: 'Step 3: divide by the acid volume, 0.02500 L. [HCl] = 0.0740 M.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, the trap.', gap: 0.4 },
      { say: "Don't blindly apply M V equals M V!", cap: "Don't blindly apply MV = MV!", gap: 0.5 },
      { say: 'It only works for a one to one ratio. For other ratios, use the mole ratio.', cap: 'It only works for a 1 : 1 ratio. For other ratios, use the mole ratio.', gap: 0.5 },
      { say: 'Sulfuric acid reacts with two N a O H.', cap: 'H₂SO₄ reacts with 2NaOH.', gap: 0.4 },
      { say: 'Ten point zero zero milliliters of it needs twenty-four point zero zero milliliters of zero point one five zero molar N a O H.', cap: '10.00 mL of it needs 24.00 mL of 0.150 M NaOH.', gap: 0.5 },
      { say: 'Moles of N a O H: zero point zero zero three six zero.', cap: 'mol NaOH = 0.00360.', gap: 0.4 },
      { say: 'Divide by two for the acid: zero point zero zero one eight zero moles.', cap: 'Divide by 2 for the acid: 0.00180 mol.', gap: 0.4 },
      { say: 'Over zero point zero one zero zero zero liters, that is zero point one eight zero molar.', cap: 'Over 0.01000 L, that is 0.180 M.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Twenty point zero milliliters of N a O H is neutralized by fifteen point zero milliliters of zero point two zero zero molar H C l. What is the concentration of N a O H?', cap: '20.0 mL of NaOH is neutralized by 15.0 mL of 0.200 M HCl. What is [NaOH]?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is zero point one five zero molar.', cap: 'The answer is 0.150 M.', gap: 0.4 },
      { say: 'Moles of H C l: zero point two zero zero times zero point zero one five zero is zero point zero zero three zero zero moles. That equals the moles of N a O H.', cap: 'mol HCl = 0.200 × 0.0150 = 0.00300 mol = mol NaOH.', gap: 0.4 },
      { say: 'Then zero point zero zero three zero zero, divided by zero point zero two zero zero liters, is zero point one five zero molar.', cap: '0.00300 ÷ 0.0200 L = 0.150 M.', gap: 0.9 },
    ] },
    { id: 'frq', beats: [
      { say: 'One tip for free response questions.', cap: 'One tip for free-response questions.' },
      { say: 'The A P exam loves asking how a mistake affects the calculated result.', cap: 'The AP® exam loves asking how a mistake affects the calculated result.', gap: 0.5 },
      { say: 'An air bubble in the buret tip escapes during the titration. The recorded volume of titrant is too large, so the calculated concentration is too high.', gap: 0.5 },
      { say: 'Overshooting the endpoint adds too much titrant. Also too high.', gap: 0.5 },
      { say: 'Rinsing the buret with water instead of titrant dilutes the titrant. More volume is needed, so the result is too high.', gap: 0.5 },
      { say: 'Follow the chain: error, then the effect on the measured volume, then the effect on the result.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Titrant, of known concentration, is added to the unknown analyte until the equivalence point.', gap: 0.5 },
      { say: 'The equivalence point is when the analyte is completely consumed. The endpoint is the signal you observe, like a color change.', gap: 0.5 },
      { say: 'And at equivalence, use the mole ratio between titrant and analyte.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
