// Narration for chem-8.1 "pH, pOH & Water". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u8.ts (plus chem/book.ts: "every aqueous solution contains both
// ions", pH 3.00 -> [OH-] = 1.0 x 10^-11 M). One entry per sentence: the voice reads `say`; captions
// show `cap` (or `say`). `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-8.1',
  title: 'pH, pOH & Water',
  course: 'AP® Chemistry',
  unit: 'Unit 8 · Acids and Bases',
  unitId: 'chem-u8',
  unitTitle: 'Acids and Bases',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'P H, P O H, and water.', cap: 'pH, pOH & water.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what the P H scale measures, and how to move between P H, P O H, and the two ion concentrations.", cap: "In the next few minutes, you'll learn what the pH scale measures, and how to move between pH, pOH, and the two ion concentrations.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Lemon juice has a P H of about two.', cap: 'Lemon juice has a pH of about 2.', gap: 0.4 },
      { say: 'Bleach is around twelve.', cap: 'Bleach is around 12.', gap: 0.5 },
      { say: "That's a gap of ten units.", cap: "That's a 10-unit gap.", gap: 0.4 },
      { say: 'But it means lemon juice has about ten billion times more hydronium than bleach.', cap: 'But it means lemon juice has about 10 billion times more H₃O⁺ than bleach.', gap: 0.6 },
      { say: 'The P H scale squeezes huge numbers into small, friendly ones.', cap: 'The pH scale squeezes huge numbers into small, friendly ones.', gap: 0.8 },
    ] },
    { id: 'define', beats: [
      { say: 'Here are the two definitions. Both are on your equation sheet.', gap: 0.4 },
      { say: 'P H is the negative log of the hydronium concentration.', cap: 'pH = −log[H₃O⁺]', gap: 0.4 },
      { say: 'P O H is the negative log of the hydroxide concentration.', cap: 'pOH = −log[OH⁻]', gap: 0.5 },
      { say: 'Hydronium, H three O plus, and H plus are used interchangeably. Both are accepted on the A P exam.', cap: 'Hydronium (H₃O⁺) and H⁺ are used interchangeably. Both are accepted on the AP® exam.', gap: 0.6 },
      { say: 'Below seven is acidic. Seven is neutral, at twenty-five degrees Celsius. Above seven is basic.', cap: 'pH < 7: acidic. pH = 7: neutral (at 25 °C). pH > 7: basic.', gap: 0.5 },
      { say: 'And each P H unit is a ten times change in hydronium.', cap: 'And each pH unit is a 10× change in [H₃O⁺].', gap: 0.5 },
      { say: 'For example, if hydronium is one point zero times ten to the minus three molar, the P H is three point zero zero.', cap: 'For example, if [H₃O⁺] = 1.0 × 10⁻³ M, then pH = −log(1.0 × 10⁻³) = 3.00.', gap: 0.8 },
    ] },
    { id: 'water', beats: [
      { say: 'Now, water ionizes itself.', gap: 0.4 },
      { say: 'Two water molecules can make one hydronium ion and one hydroxide ion.', cap: '2H₂O(l) ⇌ H₃O⁺(aq) + OH⁻(aq)', gap: 0.5 },
      { say: 'Multiply the two ion concentrations, and you get K W.', cap: 'Kw = [H₃O⁺][OH⁻]', gap: 0.4 },
      { say: 'At twenty-five degrees Celsius, K W is one point zero times ten to the minus fourteen.', cap: 'At 25 °C, Kw = 1.0 × 10⁻¹⁴.', gap: 0.4 },
      { say: 'And P H plus P O H equals fourteen.', cap: 'And pH + pOH = 14 (at 25 °C).', gap: 0.5 },
      { say: 'In pure water, the two concentrations are equal, so P H and P O H are both seven.', cap: 'In pure water, [H₃O⁺] = [OH⁻], so pH = pOH = 7.0.', gap: 0.5 },
      { say: "Every water solution has both ions. Even at a P H of three, there's still a little hydroxide: one point zero times ten to the minus eleven molar.", cap: 'Every aqueous solution has both ions. Even at pH 3.00, [OH⁻] = 1.0 × 10⁻¹¹ M.', gap: 0.5 },
      { say: 'Acidic and basic tell you which ion is in excess.', gap: 0.8 },
    ] },
    { id: 'square', beats: [
      { say: "Here's the trick that ties it all together: the P H square.", cap: "Here's the trick that ties it all together: the pH square.", gap: 0.4 },
      { say: 'Picture four corners: hydronium, P H, P O H, and hydroxide.', cap: 'Picture four corners: [H₃O⁺], pH, pOH and [OH⁻].', gap: 0.5 },
      { say: 'To go from a concentration to a P value, take the negative log.', cap: 'Concentration → p value: take −log.', gap: 0.4 },
      { say: 'To go back, take ten to the minus P.', cap: 'p value → concentration: take 10^(−p).', gap: 0.5 },
      { say: 'Between P H and P O H, subtract from fourteen.', cap: 'pH ↔ pOH: 14 minus.', gap: 0.4 },
      { say: 'Between the two concentrations, divide K W by the one you know.', cap: '[H₃O⁺] ↔ [OH⁻]: Kw ÷ the one you know.', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's go around the square." },
      { say: 'A solution has a hydroxide concentration of two point five times ten to the minus four molar.', cap: 'A solution has [OH⁻] = 2.5 × 10⁻⁴ M.', gap: 0.5 },
      { say: 'Step one: P O H is the negative log of that: three point six zero.', cap: 'Step one: pOH = −log(2.5 × 10⁻⁴) = 3.60', gap: 0.5 },
      { say: 'Step two: P H is fourteen minus three point six zero: ten point four zero. The solution is basic.', cap: 'Step two: pH = 14.00 − 3.60 = 10.40. The solution is basic.', gap: 0.5 },
      { say: 'Step three: hydronium is ten to the minus ten point four zero: four point zero times ten to the minus eleven molar.', cap: 'Step three: [H₃O⁺] = 10^(−10.40) = 4.0 × 10⁻¹¹ M', gap: 0.6 },
      { say: 'And a sig fig trick: the number of decimal places in P H equals the number of sig figs in the concentration.', cap: 'And a sig fig trick: the number of decimal places in pH = the number of sig figs in the concentration.', gap: 0.4 },
      { say: 'Two point five has two sig figs, so the P O H gets two decimal places.', cap: '2.5 has two sig figs, so the pOH gets two decimal places: 3.60.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, a common trap.' },
      { say: 'At fifty degrees Celsius, K W is five point five times ten to the minus fourteen, so pure water has a P H of about six point six.', cap: 'At 50 °C, Kw = 5.5 × 10⁻¹⁴, so pure water has a pH of about 6.6.', gap: 0.5 },
      { say: 'Is that water acidic?', gap: 0.6 },
      { say: "No. It's neutral.", cap: "No. It's neutral.", gap: 0.5 },
      { say: 'In pure water, hydronium and hydroxide are always equal.', cap: 'In pure water, [H₃O⁺] = [OH⁻] always.', gap: 0.4 },
      { say: 'K W depends on temperature, so a neutral P H is exactly seven only at twenty-five degrees.', cap: 'Kw depends on temperature, so a neutral pH is exactly 7 only at 25 °C.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Solution A has a P H of three, and solution B has a P H of five. Compared to B, A has: two times more hydronium, twenty times more, one hundred times more, or two times less?', cap: 'Solution A has pH 3 and solution B has pH 5. Compared to B, A has: 2× more H₃O⁺, 20× more, 100× more, or 2× less?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is one hundred times more.', cap: 'The answer is 100× more.', gap: 0.4 },
      { say: 'Each P H unit is ten times. Two units is ten squared: one hundred times more hydronium.', cap: 'Each pH unit is 10×. Two units = 10² = 100× more H₃O⁺.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'P H is the negative log of hydronium. P O H is the negative log of hydroxide.', cap: 'pH = −log[H₃O⁺]. pOH = −log[OH⁻].', gap: 0.5 },
      { say: 'At twenty-five degrees, K W is one point zero times ten to the minus fourteen, and P H plus P O H equals fourteen.', cap: 'At 25 °C, Kw = 1.0 × 10⁻¹⁴ and pH + pOH = 14.', gap: 0.5 },
      { say: 'K W changes with temperature. Neutral means hydronium equals hydroxide.', cap: 'Kw changes with temperature. Neutral means [H₃O⁺] = [OH⁻].', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
