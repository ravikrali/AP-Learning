// Narration for chem-5.2 "Rate Laws & the Method of Initial Rates". Every fact comes from the
// lesson cards, quick checks and flashcards in app/src/content/chem/u5.ts.
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// Single letters are spelled for the voice ("ay", "bee", "kay", "em", "en") so they are not read
// as words or units. `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-5.2',
  title: 'Rate Laws & the Method of Initial Rates',
  course: 'AP® Chemistry',
  unit: 'Unit 5 · Kinetics',
  unitId: 'chem-u5',
  unitTitle: 'Kinetics',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Rate laws and the method of initial rates.', cap: 'Rate Laws & the Method of Initial Rates.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what a rate law says, how to find the orders from experiments, and how to get the rate constant and its units.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "Here's a puzzle.", gap: 0.4 },
      { say: 'Double the concentration of a reactant. How much faster does the reaction go?', gap: 0.6 },
      { say: 'It might go two times faster, four times faster, or not change at all!', cap: 'It might go 2× faster, 4× faster, or not change at all!', gap: 0.5 },
      { say: 'The rate law tells you which.', gap: 0.4 },
      { say: 'And you can only find it by experiment.', gap: 0.9 },
    ] },
    { id: 'ratelaw', beats: [
      { say: "Here's the rate law.", gap: 0.4 },
      { say: 'Rate equals kay, times the concentration of ay to the em, times the concentration of bee to the en.', cap: 'rate = k[A]ᵐ[B]ⁿ', gap: 0.6 },
      { say: 'The exponents, em and en, are the orders with respect to ay and bee. They are usually zero, one, or two.', cap: 'The exponents, m and n, are the orders with respect to A and B. They are usually 0, 1 or 2.', gap: 0.5 },
      { say: 'Add them up, and you get the overall order.', cap: 'Add them up, and you get the overall order: m + n.', gap: 0.5 },
      { say: 'Kay is the rate constant.', cap: 'k is the rate constant.', gap: 0.3 },
      { say: 'It depends on temperature, not on concentration. And its units depend on the overall order.', gap: 0.9 },
    ] },
    { id: 'order', beats: [
      { say: 'So what does an order actually mean?', gap: 0.4 },
      { say: 'Watch what happens to the rate when you double the concentration of ay.', cap: 'Watch what happens to the rate when you double [A].', gap: 0.5 },
      { say: 'Order zero: no change. The rate stays the same.', cap: 'Order 0: no change. The rate stays the same (×1).', gap: 0.5 },
      { say: 'Order one: the rate doubles.', cap: 'Order 1: the rate doubles (×2).', gap: 0.5 },
      { say: 'Order two: the rate quadruples. Four times faster.', cap: 'Order 2: the rate quadruples. 4× faster.', gap: 0.6 },
      { say: 'In general, if the concentration is multiplied by some factor, the rate is multiplied by that factor to the power of the order.', cap: 'In general: if [A] is multiplied by x, the rate is multiplied by x^order.', gap: 0.9 },
    ] },
    { id: 'table', beats: [
      { say: 'Now, the method of initial rates.', gap: 0.4 },
      { say: 'Here are three experiments. Each one lists the starting concentrations of ay and bee, and the initial rate.', cap: 'Here are three experiments. Each one lists the starting [A] and [B], and the initial rate.', gap: 0.5 },
      { say: 'The key is to compare two experiments where only one concentration changes.', gap: 0.6 },
      { say: 'Experiments one and two: ay doubles, and bee stays the same. The rate goes up four times.', cap: 'Exp 1 → 2: [A] doubles, [B] stays the same. The rate goes ×4.', gap: 0.4 },
      { say: 'Two to the em equals four, so em equals two.', cap: '2ᵐ = 4, so m = 2.', gap: 0.6 },
      { say: "Experiments one and three: bee doubles, and ay stays the same. The rate doesn't change.", cap: "Exp 1 → 3: [B] doubles, [A] stays the same. The rate doesn't change.", gap: 0.4 },
      { say: 'Two to the en equals one, so en equals zero.', cap: '2ⁿ = 1, so n = 0.', gap: 0.6 },
      { say: 'So the rate law is: rate equals kay times ay squared. Second order overall.', cap: 'So the rate law is rate = k[A]². Second order overall.', gap: 0.9 },
    ] },
    { id: 'findk', beats: [
      { say: "Now let's find kay, using experiment one.", cap: "Now let's find k, using experiment 1.", gap: 0.4 },
      { say: 'Rearrange the rate law: kay equals the rate, divided by the concentration of ay squared.', cap: 'Rearrange the rate law: k = rate / [A]².', gap: 0.5 },
      { say: 'The rate is two point zero times ten to the minus three molar per second, and the concentration of ay is zero point one zero molar.', cap: 'The rate is 2.0 × 10⁻³ M/s, and [A] is 0.10 M.', gap: 0.5 },
      { say: 'Two point zero times ten to the minus three, divided by zero point one zero squared, is zero point two zero.', cap: '(2.0 × 10⁻³) ÷ (0.10)² = 0.20', gap: 0.5 },
      { say: 'So kay equals zero point two zero, per molar per second.', cap: 'So k = 0.20 M⁻¹s⁻¹.', gap: 0.9 },
    ] },
    { id: 'units', beats: [
      { say: "Here's a quick trick for the units of kay.", cap: "Here's a quick trick for the units of k.", gap: 0.4 },
      { say: "Rate is always in molar per second, so kay's units have to make that work out.", cap: "Rate is always in M/s, so k's units have to make that work out.", gap: 0.5 },
      { say: 'Zero order: molar per second.', cap: 'Zero order: M s⁻¹.', gap: 0.3 },
      { say: 'First order: per second.', cap: 'First order: s⁻¹.', gap: 0.3 },
      { say: 'Second order: per molar per second.', cap: 'Second order: M⁻¹ s⁻¹.', gap: 0.3 },
      { say: 'Third order: per molar squared, per second.', cap: 'Third order: M⁻² s⁻¹.', gap: 0.5 },
      { say: 'The pattern is molar, to the power of one minus the order, times per second.', cap: 'The pattern: M^(1 − order) s⁻¹.', gap: 0.5 },
      { say: 'So if kay is in per second, the reaction is first order.', cap: 'So if k is in s⁻¹, the reaction is first order.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, the trap.', gap: 0.4 },
      { say: "Don't read the orders from the balanced equation's coefficients.", gap: 0.5 },
      { say: 'The orders come from experimental data.', gap: 0.4 },
      { say: 'The only exception is a reaction that happens in a single elementary step.', gap: 0.6 },
      { say: 'One more: changing a concentration changes the rate, but not kay.', cap: 'One more: changing a concentration changes the rate, but not k.', gap: 0.4 },
      { say: 'To change the value of kay, change the temperature, or add a catalyst.', cap: 'To change the value of k, change the temperature, or add a catalyst.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'The rate equals kay, times ex, times why squared. If why is tripled and ex is unchanged, the rate becomes: three times, six times, nine times, or twenty-seven times?', cap: 'rate = k[X][Y]². If [Y] is tripled and [X] is unchanged, the rate becomes: 3×, 6×, 9× or 27×?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is nine times.', cap: 'The answer is 9×.', gap: 0.4 },
      { say: 'The reaction is second order in why, so multiply by three squared.', cap: 'The reaction is second order in Y, so multiply by 3².', gap: 0.3 },
      { say: 'Three squared is nine, so the rate goes nine times faster.', cap: '3² = 9, so the rate goes 9× faster.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Rate equals kay times ay to the em, times bee to the en. The orders come from experiment.', cap: 'rate = k[A]ᵐ[B]ⁿ. The orders come from experiment.', gap: 0.5 },
      { say: 'Compare experiments where only one concentration changes: the factor, raised to the order, equals the rate factor.', cap: 'Compare experiments where only one concentration changes: (factor)^order = rate factor.', gap: 0.5 },
      { say: 'Kay depends on temperature. Its units depend on the overall order.', cap: 'k depends on temperature. Its units depend on the overall order.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
