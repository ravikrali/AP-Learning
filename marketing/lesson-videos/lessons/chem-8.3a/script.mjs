// Narration for chem-8.3a "Weak Acids & Ka". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u8.ts (plus chem/book.ts: the 5% check on the approximation).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-8.3a',
  title: 'Weak Acids & Ka',
  course: 'AP® Chemistry',
  unit: 'Unit 8 · Acids and Bases',
  unitId: 'chem-u8',
  unitTitle: 'Acids and Bases',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Weak acids and K A.', cap: 'Weak acids & Ka.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what K A tells you, how to find the P H of a weak acid, and how to work backward from P H to K A.", cap: "In the next few minutes, you'll learn what Ka tells you, how to find the pH of a weak acid, and how to work backward from pH to Ka.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Vinegar is acetic acid.', gap: 0.4 },
      { say: 'But you can put it on a salad.', gap: 0.5 },
      { say: "That's because fewer than one percent of its molecules actually give up a proton.", cap: "That's because fewer than 1% of its molecules actually give up a proton.", gap: 0.5 },
      { say: 'The rest stay whole.', gap: 0.4 },
      { say: 'Weak acids are mostly shy.', gap: 0.8 },
    ] },
    { id: 'ka', beats: [
      { say: 'Here is what a weak acid does in water.' },
      { say: 'The acid, H A, gives a proton to water. That makes hydronium and the ion A minus.', cap: 'HA(aq) + H₂O(l) ⇌ H₃O⁺(aq) + A⁻(aq)', gap: 0.5 },
      { say: 'The arrows go both ways. This is an equilibrium.', gap: 0.5 },
      { say: 'Its constant is K A, the acid dissociation constant.', cap: 'Its constant is Ka, the acid dissociation constant.', gap: 0.4 },
      { say: 'K A equals hydronium times A minus, divided by H A.', cap: 'Ka = [H₃O⁺][A⁻] / [HA]', gap: 0.5 },
      { say: 'Only a small percentage ionizes, so most H A stays as molecules.', cap: 'Only a small percentage ionizes, so most HA stays as molecules.', gap: 0.4 },
      { say: 'That means hydronium is much smaller than the starting acid concentration.', cap: 'That means [H₃O⁺] ≪ [HA]initial.', gap: 0.8 },
    ] },
    { id: 'strength', beats: [
      { say: 'So how do you compare weak acids?' },
      { say: 'A larger K A means a stronger acid.', cap: 'A larger Ka means a stronger acid.', gap: 0.5 },
      { say: 'You may also see P K A, the negative log of K A.', cap: 'You may also see pKa = −log Ka.', gap: 0.4 },
      { say: 'It runs the other way: a smaller P K A means a stronger acid.', cap: 'It runs the other way: a smaller pKa means a stronger acid.', gap: 0.5 },
      { say: 'Here are four acids, from the largest K A to the smallest: hydrofluoric acid, nitrous acid, acetic acid, and hydrocyanic acid.', cap: 'Here are four acids, from the largest Ka to the smallest: HF, HNO₂, CH₃COOH and HCN.', gap: 0.5 },
      { say: 'Hydrofluoric acid has the largest K A, so it is the strongest of the four.', cap: 'HF has the largest Ka (6.8 × 10⁻⁴), so it is the strongest of the four.', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's find the P H of a weak acid.", cap: "Let's find the pH of a weak acid." },
      { say: 'Take zero point one zero molar acetic acid. Its K A is one point eight times ten to the minus five.', cap: 'Take 0.10 M acetic acid, CH₃COOH. Its Ka is 1.8 × 10⁻⁵.', gap: 0.5 },
      { say: 'Set up an ICE table. Hydronium and A minus both become x.', cap: 'Set up an ICE table. [H₃O⁺] and [A⁻] both become x.', gap: 0.4 },
      { say: 'The acid becomes zero point one zero minus x. Since x is small, that is about zero point one zero.', cap: '[HA] becomes 0.10 − x. Since x is small, that is about 0.10.', gap: 0.5 },
      { say: 'So x squared over zero point one zero equals one point eight times ten to the minus five.', cap: 'So x² / 0.10 = 1.8 × 10⁻⁵.', gap: 0.4 },
      { say: 'Then x is one point three four times ten to the minus three molar.', cap: 'Then x = 1.34 × 10⁻³ M.', gap: 0.5 },
      { say: 'The P H is the negative log of that: two point eight seven.', cap: 'pH = −log(1.34 × 10⁻³) = 2.87', gap: 0.5 },
      { say: 'And percent ionization is x over the starting concentration, times one hundred: about one point three percent.', cap: '% ionization = x / [HA]₀ × 100 = 1.3%', gap: 0.8 },
    ] },
    { id: 'shortcut', beats: [
      { say: "Here's the shortcut." },
      { say: 'For a weak acid with starting concentration C, hydronium is about the square root of K A times C.', cap: 'For a weak acid with starting concentration C: [H₃O⁺] ≈ √(Ka · C)', gap: 0.5 },
      { say: 'It works when x is small compared to C, under about five percent.', cap: 'It works when x is small compared to C: under about 5%.', gap: 0.4 },
      { say: 'That is true for most A P problems. For our acetic acid, x was only one point three percent of C.', cap: 'That is true for most AP® problems. For our acetic acid, x was only 1.3% of C.', gap: 0.5 },
      { say: 'On a free response question, show the ICE setup and state the assumption.', cap: 'On a free-response question, show the ICE setup and state the assumption.', gap: 0.8 },
    ] },
    { id: 'reverse', beats: [
      { say: 'Now work backward, from P H to K A.', cap: 'Now work backward, from pH to Ka.' },
      { say: 'A zero point zero five zero molar weak acid has a P H of three point zero zero.', cap: 'A 0.050 M weak acid HA has a pH of 3.00.', gap: 0.5 },
      { say: 'Step one: hydronium and A minus are both ten to the minus three: one point zero times ten to the minus three molar.', cap: 'Step one: [H₃O⁺] = [A⁻] = 10⁻³·⁰⁰ = 1.0 × 10⁻³ M', gap: 0.5 },
      { say: 'Step two: the acid left is zero point zero five zero minus zero point zero zero one zero: zero point zero four nine molar.', cap: 'Step two: [HA] = 0.050 − 0.0010 = 0.049 M', gap: 0.5 },
      { say: 'Step three: K A is one point zero times ten to the minus three, squared, over zero point zero four nine.', cap: 'Step three: Ka = (1.0 × 10⁻³)² / 0.049', gap: 0.4 },
      { say: 'That gives two point zero times ten to the minus five.', cap: 'Ka = 2.0 × 10⁻⁵', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, a common trap.' },
      { say: 'For a weak acid, hydronium is not equal to the starting acid concentration.', cap: 'For a weak acid, [H₃O⁺] ≠ [HA]initial!', gap: 0.5 },
      { say: 'That shortcut only works for strong acids.', gap: 0.5 },
      { say: 'Use it for zero point one zero molar acetic acid, and you get a P H of one point zero zero.', cap: 'Use it for 0.10 M acetic acid, and you get pH 1.00.', gap: 0.4 },
      { say: 'The real answer is two point eight seven.', cap: 'The real answer is 2.87.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'In zero point one zero molar acetic acid, which species has the highest concentration, besides water? Hydronium, acetate, acetic acid, or hydroxide?', cap: 'In 0.10 M CH₃COOH, which species has the highest concentration (besides water)? H₃O⁺, CH₃COO⁻, CH₃COOH or OH⁻?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is acetic acid itself.', cap: 'The answer is CH₃COOH itself.', gap: 0.4 },
      { say: 'Only about one percent ionizes, so the un-ionized acid dominates.', cap: 'Only about 1% ionizes, so un-ionized CH₃COOH dominates.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'K A equals hydronium times A minus, over H A. A bigger K A means a stronger acid.', cap: 'Ka = [H₃O⁺][A⁻] / [HA]. Bigger Ka = stronger acid.', gap: 0.5 },
      { say: 'For a weak acid, hydronium is about the square root of K A times C. Most H A stays un-ionized.', cap: 'Weak acid: [H₃O⁺] ≈ √(Ka · C). Most HA stays un-ionized.', gap: 0.5 },
      { say: 'Percent ionization is hydronium at equilibrium, over the starting acid, times one hundred.', cap: '% ionization = [H₃O⁺]eq / [HA]initial × 100', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
