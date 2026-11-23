// Narration for chem-9.3 "Gibbs Free Energy & Favorability". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u9.ts (and book.ts): the ice hook; dG° = dH° - TdS°; dG° < 0 favored,
// > 0 reverse favored; "thermodynamically favored" not "spontaneous" (favored can be slow); the sign table;
// water freezing (-,-) low T below 0 °C, NaNO3 dissolving (+,+) entropy wins; dG from formation values; the
// NH3 example (-92.2 kJ, -198.7 J/K, 298 K -> -33.0 kJ, crossover ~464 K); the tug-of-war hack, T = dH/dS;
// the kJ vs J/K warning; the (+50 kJ, +150 J/K) try (~333 K); the three summary points.
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-9.3',
  title: 'Gibbs Free Energy & Favorability',
  course: 'AP® Chemistry',
  unit: 'Unit 9 · Thermodynamics and Electrochemistry',
  unitId: 'chem-u9',
  unitTitle: 'Thermodynamics and Electrochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Gibbs Free Energy and Favorability.', cap: 'Gibbs Free Energy & Favorability.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what delta G tells you, how to read the sign table, and when temperature decides.", cap: "In the next few minutes, you'll learn what ΔG tells you, how to read the sign table, and when temperature decides.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Ice melts on a warm day.', gap: 0.4 },
      { say: "But in the freezer, it doesn't melt.", gap: 0.4 },
      { say: 'Same process, different outcome.', gap: 0.5 },
      { say: 'So what decides which way nature goes?', gap: 0.5 },
      { say: 'Gibbs free energy, written delta G.', cap: 'Gibbs free energy, ΔG.', gap: 0.4 },
      { say: 'It combines enthalpy, entropy and temperature into one answer.', gap: 0.8 },
    ] },
    { id: 'equation', beats: [
      { say: "Here's the equation.", gap: 0.3 },
      { say: 'Delta G naught equals delta H naught, minus T times delta S naught.', cap: 'ΔG° = ΔH° − TΔS°.', gap: 0.5 },
      { say: 'If delta G is negative, the process is thermodynamically favored. The products are favored.', cap: 'If ΔG° < 0, the process is thermodynamically favored. The products are favored.', gap: 0.4 },
      { say: 'If delta G is positive, it is not favored. The reverse is favored instead.', cap: 'If ΔG° > 0, it is not favored. The reverse is favored instead.', gap: 0.5 },
      { say: 'Notice the words: thermodynamically favored.', gap: 0.3 },
      { say: 'AP Chemistry uses them instead of spontaneous.', cap: 'AP® Chemistry uses them instead of “spontaneous.”', gap: 0.3 },
      { say: 'Spontaneous sounds like it happens instantly.', cap: '“Spontaneous” sounds like it happens instantly.', gap: 0.3 },
      { say: 'But a favored reaction can be extremely slow.', gap: 0.8 },
    ] },
    { id: 'table', beats: [
      { say: 'Now, the signs.', gap: 0.3 },
      { say: 'Delta H and delta S can each be positive or negative, so there are four cases.', cap: 'ΔH and ΔS can each be positive or negative, so there are four cases.', gap: 0.5 },
      { say: 'Delta H negative, delta S positive: favored at all temperatures.', cap: 'ΔH° −, ΔS° +: favored at all temperatures.', gap: 0.4 },
      { say: 'Delta H positive, delta S negative: favored at no temperature.', cap: 'ΔH° +, ΔS° −: favored at no temperature.', gap: 0.4 },
      { say: 'Both positive: favored at high temperature, where the entropy term wins.', gap: 0.4 },
      { say: 'Both negative: favored at low temperature, where the enthalpy term wins.', gap: 0.5 },
      { say: 'In the first two rows, no calculation is needed.', gap: 0.8 },
    ] },
    { id: 'real', beats: [
      { say: 'Here are two real examples.', gap: 0.3 },
      { say: 'Water freezing: delta H is negative, and delta S is negative.', cap: 'Water freezing: ΔH < 0 and ΔS < 0.', gap: 0.4 },
      { say: 'Both negative, so freezing is favored only at low temperature, below zero degrees Celsius.', cap: 'Both negative, so freezing is favored only at low T, below 0 °C.', gap: 0.4 },
      { say: "That's the freezer.", gap: 0.3 },
      { say: 'Above zero degrees, the reverse is favored, so ice melts.', cap: 'Above 0 °C, the reverse is favored, so ice melts.', gap: 0.5 },
      { say: 'Now, sodium nitrate dissolving in water.', cap: 'Now, NaNO₃ dissolving in water.', gap: 0.3 },
      { say: 'Delta H is positive. It actually cools the water.', cap: 'ΔH > 0. It actually cools the water.', gap: 0.3 },
      { say: 'But delta S is positive too. The entropy term wins, so dissolving is favored.', cap: 'But ΔS > 0 too. The entropy term wins, so dissolving is favored.', gap: 0.5 },
      { say: 'You can also find delta G from formation values: the sum for the products, minus the sum for the reactants.', cap: 'You can also find ΔG° from formation values: ΔG°rxn = ΣΔG°f(products) − ΣΔG°f(reactants).', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's run the numbers on one reaction.", gap: 0.3 },
      { say: 'Is forming ammonia from nitrogen and hydrogen favored at two hundred ninety-eight kelvin?', cap: 'Is N₂(g) + 3H₂(g) → 2NH₃(g) favored at 298 K?', gap: 0.4 },
      { say: 'Delta H is minus ninety-two point two kilojoules. Delta S is minus one hundred ninety-eight point seven joules per kelvin.', cap: 'ΔH° = −92.2 kJ. ΔS° = −198.7 J/K.', gap: 0.5 },
      { say: 'Step one: convert delta S to kilojoules. Minus zero point one nine eight seven kilojoules per kelvin.', cap: 'Step 1: convert ΔS° to kJ. −0.1987 kJ/K.', gap: 0.4 },
      { say: 'Step two: plug in. Minus ninety-two point two, minus two hundred ninety-eight times minus zero point one nine eight seven.', cap: 'Step 2: plug in. ΔG° = −92.2 − (298)(−0.1987).', gap: 0.4 },
      { say: "That's minus ninety-two point two, plus fifty-nine point two.", cap: "That's −92.2 + 59.2.", gap: 0.4 },
      { say: 'Delta G is minus thirty-three point zero kilojoules. Negative, so forming ammonia is favored.', cap: 'ΔG° = −33.0 kJ. Negative, so forming NH₃ is favored.', gap: 0.8 },
    ] },
    { id: 'tug', beats: [
      { say: "Here's a way to remember the table: think of a tug-of-war.", gap: 0.4 },
      { say: 'Delta H pulls toward favored when it goes down, when it is negative.', cap: 'ΔH pulls toward favored when it goes down (negative).', gap: 0.3 },
      { say: 'The minus T delta S term pulls toward favored when delta S goes up, when it is positive.', cap: 'The −TΔS term pulls toward favored when ΔS goes up (positive).', gap: 0.4 },
      { say: 'When they agree, the process is always favored.', gap: 0.4 },
      { say: 'When they disagree, temperature is the referee.', gap: 0.3 },
      { say: 'A high temperature makes the T delta S term bigger, so entropy wins.', cap: 'A high T makes the TΔS term bigger, so entropy wins.', gap: 0.5 },
      { say: 'The crossover temperature, where delta G equals zero, is T equals delta H over delta S.', cap: 'The crossover temperature, where ΔG° = 0, is T = ΔH°/ΔS°.', gap: 0.4 },
      { say: "For ammonia, that's minus ninety-two point two, over minus zero point one nine eight seven. About four hundred sixty-four kelvin.", cap: "For NH₃, that's (−92.2)/(−0.1987) ≈ 464 K.", gap: 0.4 },
      { say: 'Both signs are negative, so it is favored only below that temperature.', gap: 0.8 },
    ] },
    { id: 'units', beats: [
      { say: 'Now, the trap: units.', gap: 0.3 },
      { say: 'Delta H is in kilojoules. Delta S is in joules per kelvin.', cap: 'ΔH is in kJ. ΔS is in J/K.', gap: 0.4 },
      { say: 'Divide delta S by one thousand before you combine them.', cap: 'Divide ΔS by 1000 before you combine them.', gap: 0.4 },
      { say: 'Skip that step, and the T delta S term comes out a thousand times too big.', cap: 'Skip that step, and the TΔS term comes out 1000 times too big.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'A reaction has a delta H of plus fifty kilojoules, and a delta S of plus one hundred fifty joules per kelvin. When is it thermodynamically favored? A, at all temperatures. B, at no temperature. C, only at high temperatures. D, only at low temperatures.', cap: 'ΔH° = +50 kJ, ΔS° = +150 J/K. When is it thermodynamically favored? A) at all temperatures B) at no temperature C) only at high temperatures D) only at low temperatures', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is C.', gap: 0.4 },
      { say: 'Both signs are positive, so temperature decides.', gap: 0.3 },
      { say: 'Above fifty over zero point one five zero, about three hundred thirty-three kelvin, T delta S outweighs delta H.', cap: 'Above 50/0.150 ≈ 333 K, TΔS outweighs ΔH.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Delta G equals delta H minus T delta S, and a negative delta G means thermodynamically favored.', cap: 'ΔG° = ΔH° − TΔS°. ΔG° < 0 means thermodynamically favored.', gap: 0.5 },
      { say: 'Minus, plus: always favored. Plus, minus: never. Both plus: high temperature. Both minus: low temperature.', cap: '(−,+) always favored. (+,−) never. (+,+) high T. (−,−) low T.', gap: 0.5 },
      { say: 'And convert delta S from joules to kilojoules!', cap: 'And convert ΔS from J to kJ!', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
