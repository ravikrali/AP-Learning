// Narration for chem-8.4 "Mixing Acids & Bases". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u8.ts (plus chem/book.ts: acetic acid part-way and all the way with
// NaOH, pH 4.74 and about 8.72). One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-8.4',
  title: 'Mixing Acids & Bases',
  course: 'AP® Chemistry',
  unit: 'Unit 8 · Acids and Bases',
  unitId: 'chem-u8',
  unitTitle: 'Acids and Bases',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Mixing acids and bases.', cap: 'Mixing acids & bases.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the two steps that solve every acid and base mixing problem: react, then look at what's left.", cap: "In the next few minutes, you'll learn the two steps that solve every acid–base mixing problem: react, then look at what's left.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'You mix an acid and a base. What is the P H?', cap: 'You mix an acid and a base. What is the pH?', gap: 0.5 },
      { say: 'The first thing to ask is: who wins, and what is left over?', gap: 0.5 },
      { say: 'The acid and the base react, and one of them runs out first.', gap: 0.5 },
      { say: 'Answer that question, and the problem becomes one of four simple cases.', gap: 0.8 },
    ] },
    { id: 'react', beats: [
      { say: 'Step one: let them react completely.' },
      { say: 'Strong acids and strong bases react quantitatively. That means completely.', gap: 0.5 },
      { say: 'Strong plus strong: H plus and O H minus make water.', cap: 'Strong + strong: H⁺(aq) + OH⁻(aq) → H₂O(l)', gap: 0.4 },
      { say: 'Weak acid plus strong base: H A and O H minus make A minus and water.', cap: 'Weak acid + strong base: HA(aq) + OH⁻(aq) → A⁻(aq) + H₂O(l)', gap: 0.4 },
      { say: 'Weak base plus strong acid: B and hydronium make H B plus and water.', cap: 'Weak base + strong acid: B(aq) + H₃O⁺(aq) → HB⁺(aq) + H₂O(l)', gap: 0.5 },
      { say: 'Do this step in moles, not molarity. Moles equal molarity times liters.', cap: 'Do this step in moles, not molarity. Moles = M × L.', gap: 0.4 },
      { say: "Then figure out what's left over.", gap: 0.8 },
    ] },
    { id: 'left', beats: [
      { say: "Step two: what's left decides the P H.", cap: "Step two: what's left decides the pH." },
      { say: 'Case one: extra strong acid or strong base. Divide the moles left over by the total volume, then find the P H.', cap: 'Case one: excess strong acid or base. Moles excess ÷ total volume, then pH.', gap: 0.5 },
      { say: "Case two: a weak acid and its conjugate base are both left. That's a buffer, so use Henderson Hasselbalch.", cap: "Case two: a weak acid and its conjugate base are both left. That's a buffer, so use Henderson–Hasselbalch.", gap: 0.5 },
      { say: 'Case three: only the conjugate base, A minus, is left. A minus reacts with water to make some hydroxide, so the solution is slightly basic.', cap: 'Case three: only the conjugate base A⁻ is left. A⁻ + H₂O ⇌ HA + OH⁻, so the solution is slightly basic.', gap: 0.5 },
      { say: 'Case four: only the conjugate acid, H B plus, is left. It makes some hydronium, so the solution is slightly acidic.', cap: 'Case four: only the conjugate acid HB⁺ is left. HB⁺ + H₂O ⇌ B + H₃O⁺, so the solution is slightly acidic.', gap: 0.5 },
      { say: "And a weak acid with a weak base? They don't react completely. They react to an equilibrium.", cap: 'Weak acid + weak base: HA(aq) + B(aq) ⇌ A⁻(aq) + HB⁺(aq), an equilibrium.', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's try one." },
      { say: 'Fifty point zero milliliters of zero point one zero zero molar hydrochloric acid is mixed with thirty point zero milliliters of zero point one zero zero molar sodium hydroxide.', cap: '50.0 mL of 0.100 M HCl is mixed with 30.0 mL of 0.100 M NaOH.', gap: 0.5 },
      { say: 'Moles of H plus: zero point one zero zero times zero point zero five zero zero. That is five point zero zero times ten to the minus three.', cap: 'mol H⁺ = 0.100 × 0.0500 = 5.00 × 10⁻³', gap: 0.4 },
      { say: 'Moles of O H minus: three point zero zero times ten to the minus three.', cap: 'mol OH⁻ = 0.100 × 0.0300 = 3.00 × 10⁻³', gap: 0.5 },
      { say: 'The acid wins. Two point zero zero times ten to the minus three moles of H plus are left over.', cap: 'The acid wins. Excess H⁺ = 2.00 × 10⁻³ mol.', gap: 0.5 },
      { say: 'The total volume is now eighty point zero milliliters, or zero point zero eight zero zero liters.', cap: 'Total volume = 80.0 mL = 0.0800 L', gap: 0.4 },
      { say: 'So H plus is zero point zero two five zero molar, and the P H is one point six zero.', cap: '[H⁺] = 2.00 × 10⁻³ / 0.0800 = 0.0250 M, so pH = 1.60', gap: 0.8 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's the trick: moles first, mix later." },
      { say: 'Always convert to moles before you react. At the end, divide by the new total volume.', gap: 0.5 },
      { say: 'When you mix two solutions, the volume grows. Forgetting that is a classic point loser.', gap: 0.5 },
      { say: 'Twenty-five point zero milliliters of zero point two zero molar sodium hydroxide is mixed with twenty-five point zero milliliters of zero point one zero molar hydrochloric acid.', cap: '25.0 mL of 0.20 M NaOH is mixed with 25.0 mL of 0.10 M HCl.', gap: 0.4 },
      { say: 'The base wins. Zero point zero zero two five moles of O H minus are left over.', cap: 'The base wins: 0.0050 − 0.0025 = 0.0025 mol OH⁻ left over.', gap: 0.4 },
      { say: 'They go into fifty point zero milliliters, not twenty-five.', cap: 'They go into 50.0 mL, not 25.', gap: 0.5 },
      { say: 'So O H minus is zero point zero five zero molar. The P O H is one point three zero, and the P H is twelve point seven zero.', cap: '[OH⁻] = 0.050 M, so pOH = 1.30 and pH = 12.70.', gap: 0.8 },
    ] },
    { id: 'weak', beats: [
      { say: 'Now a weak acid with a strong base.' },
      { say: 'Start with fifty point zero milliliters of zero point one zero zero molar acetic acid. That is five point zero zero millimoles.', cap: 'Start with 50.0 mL of 0.100 M CH₃COOH: 5.00 mmol.', gap: 0.5 },
      { say: 'Add two point five zero millimoles of sodium hydroxide. Half the acid turns into acetate.', cap: 'Add 2.50 mmol NaOH. Half the acid turns into acetate.', gap: 0.4 },
      { say: 'Equal amounts of acid and base make a buffer. The P H equals the P K A: four point seven four.', cap: 'Equal amounts of acid and base make a buffer: pH = pKa = 4.74.', gap: 0.6 },
      { say: 'Add five point zero zero millimoles instead, and all the acid turns into acetate.', cap: 'Add 5.00 mmol instead, and all the acid turns into acetate.', gap: 0.4 },
      { say: 'Only a weak base is left, so the P H is about eight point seven two. Slightly basic.', cap: 'Only a weak base is left, so the pH is about 8.72. Slightly basic.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Equal moles of acetic acid and sodium hydroxide are mixed. Is the solution acidic, neutral, basic, or a buffer?', cap: 'Equal moles of CH₃COOH and NaOH are mixed. Is the solution acidic, neutral, basic, or a buffer?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is basic.', gap: 0.4 },
      { say: 'They react completely to make acetate and water. Nothing else is left.', gap: 0.3 },
      { say: 'Acetate is a weak base, so the solution is slightly basic.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'React the strong species completely, in moles.', gap: 0.5 },
      { say: 'Excess strong acid or base? Get the P H from the excess. A weak acid with its conjugate base? That is a buffer.', cap: 'Excess strong → pH from the excess. Weak + conjugate → buffer.', gap: 0.5 },
      { say: 'Only A minus left? Basic. Only H B plus left? Acidic.', cap: 'Only A⁻ left → basic. Only HB⁺ left → acidic.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
