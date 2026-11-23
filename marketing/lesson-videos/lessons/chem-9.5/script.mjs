// Narration for chem-9.5 "Free Energy & Equilibrium". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u9.ts, plus chem/book.ts (every 5.7 kJ/mol of ΔG° changes K by a
// factor of 10 at 298 K: −5.7 → about 10, −11.4 → about 100; forgetting kJ → J gives ln K ≈ 0.013, K ≈ 1).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-9.5',
  title: 'Free Energy & Equilibrium',
  course: 'AP® Chemistry',
  unit: 'Unit 9 · Thermodynamics and Electrochemistry',
  unitId: 'chem-u9',
  unitTitle: 'Thermodynamics and Electrochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Free energy and equilibrium.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the one equation that links delta G naught to K, how to read its signs, and how to estimate K without a calculator.", cap: "In the next few minutes, you'll learn the one equation that links ΔG° to K, how to read its signs, and how to estimate K without a calculator.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Two units meet in this lesson.', gap: 0.4 },
      { say: 'Unit seven is about equilibrium, and its key number is K.', cap: 'Unit 7 is about equilibrium, and its key number is K.', gap: 0.4 },
      { say: 'Unit nine is about thermodynamics, and its key number is delta G naught.', cap: 'Unit 9 is about thermodynamics, and its key number is ΔG°.', gap: 0.5 },
      { say: 'One equation connects the two.', gap: 0.4 },
      { say: 'Know the sign of one, and you instantly know the size of the other.', gap: 0.8 },
    ] },
    { id: 'equation', beats: [
      { say: 'Here it is.' },
      { say: 'Delta G naught equals minus R T, times the natural log of K.', cap: 'ΔG° = −RT ln K', gap: 0.5 },
      { say: 'R is eight point three one four joules per mole kelvin, and T is the temperature in kelvin.', cap: 'R = 8.314 J/(mol·K), and T is the temperature in kelvin.', gap: 0.4 },
      { say: 'Because R is in joules, delta G naught must be in joules too.', cap: 'Because R is in joules, ΔG° must be in joules too.', gap: 0.5 },
      { say: 'Rearranged, K equals e, raised to minus delta G naught over R T.', cap: 'Rearranged: K = e^(−ΔG°/RT)', gap: 0.5 },
      { say: 'So the more negative delta G naught is, the bigger K gets.', cap: 'So the more negative ΔG° is, the bigger K gets.', gap: 0.8 },
    ] },
    { id: 'signs', beats: [
      { say: 'Now read the signs.' },
      { say: 'If delta G naught is less than zero, K is greater than one, and equilibrium favors the products.', cap: 'If ΔG° < 0, then K > 1, and equilibrium favors the products.', gap: 0.5 },
      { say: 'If delta G naught equals zero, K equals one, and equilibrium favors neither side.', cap: 'If ΔG° = 0, then K = 1, and equilibrium favors neither side.', gap: 0.5 },
      { say: 'If delta G naught is greater than zero, K is less than one, and equilibrium favors the reactants.', cap: 'If ΔG° > 0, then K < 1, and equilibrium favors the reactants.', gap: 0.5 },
      { say: 'So "thermodynamically favored", meaning delta G naught below zero, means the products are favored at equilibrium.', cap: '"Thermodynamically favored" (ΔG° < 0) means products are favored at equilibrium (K > 1).', gap: 0.8 },
    ] },
    { id: 'estimate', beats: [
      { say: "Here's a trick for estimating K without a calculator." },
      { say: 'At two hundred ninety-eight kelvin, R T is about two point five kilojoules per mole.', cap: 'At 298 K, RT ≈ 2.5 kJ/mol.', gap: 0.5 },
      { say: 'If delta G naught is near zero, just a few kilojoules, K is close to one.', cap: 'If ΔG° is near zero, just a few kJ, K is close to 1.', gap: 0.5 },
      { say: 'If it is much bigger than R T, tens of kilojoules or more, K is far from one: either huge, or tiny.', cap: 'If it is much bigger than RT, tens of kJ or more, K is far from 1: either huge, or tiny.', gap: 0.5 },
      { say: 'A handy rule: every five point seven kilojoules per mole of delta G naught changes K by a factor of ten.', cap: 'A handy rule: every 5.7 kJ/mol of ΔG° changes K by a factor of 10.', gap: 0.4 },
      { say: 'So minus five point seven gives K of about ten, and minus eleven point four gives about one hundred.', cap: 'So −5.7 kJ/mol gives K ≈ 10, and −11.4 kJ/mol gives K ≈ 100.', gap: 0.5 },
      { say: 'That kind of reasoning is exactly what you are expected to do.', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's find K for making ammonia at two hundred ninety-eight kelvin." },
      { say: 'Delta G naught is minus thirty-three point oh kilojoules per mole.', cap: 'ΔG° = −33.0 kJ/mol.', gap: 0.4 },
      { say: 'First, convert to joules: minus thirty-three thousand.', cap: 'First, convert to joules: −33,000 J.', gap: 0.4 },
      { say: 'Then the natural log of K equals minus delta G naught, over R T.', cap: 'Then ln K = −ΔG°/RT.', gap: 0.4 },
      { say: "That's thirty-three thousand, divided by eight point three one four times two hundred ninety-eight. About thirteen point three.", cap: '33,000 ÷ (8.314 × 298) = 13.3', gap: 0.5 },
      { say: 'So K is e to the thirteen point three, roughly six times ten to the fifth.', cap: 'So K = e^13.3 ≈ 6 × 10⁵.', gap: 0.5 },
      { say: 'Products are strongly favored, just as the estimate predicts for tens of kilojoules.', cap: 'Products are strongly favored, just as the estimate predicts for tens of kJ.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now the trap: units.' },
      { say: 'Forget to convert kilojoules to joules, and you divide thirty-three by R T instead.', cap: 'Forget to convert kJ to J, and you divide 33 by RT instead.', gap: 0.5 },
      { say: 'Then the natural log of K comes out at about zero point oh one three, and K is about one.', cap: 'Then ln K ≈ 0.013, and K ≈ 1.', gap: 0.5 },
      { say: 'That says neither side is favored. A very different conclusion, and a wrong one.', gap: 0.5 },
      { say: 'So always put delta G naught in joules before you divide by R T.', cap: 'So always put ΔG° in joules before you divide by RT.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'A reaction has K equal to three point two times ten to the minus eight, at two hundred ninety-eight kelvin.', cap: 'A reaction has K = 3.2 × 10⁻⁸ at 298 K.', gap: 0.3 },
      { say: 'Is its delta G naught negative, positive, zero, or impossible to determine?', cap: 'Is its ΔG° negative, positive, zero, or impossible to determine?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is positive.', gap: 0.5 },
      { say: 'K is less than one, so the natural log of K is negative.', cap: 'K < 1, so ln K < 0.', gap: 0.4 },
      { say: 'Then minus R T, times a negative number, is positive. The reactants are favored.', cap: 'Then ΔG° = −RT ln K > 0. The reactants are favored.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Delta G naught equals minus R T ln K, with delta G naught in joules.', cap: 'ΔG° = −RT ln K, with ΔG° in joules.', gap: 0.5 },
      { say: 'Delta G naught below zero goes with K above one: products are favored.', cap: 'ΔG° < 0 goes with K > 1: products are favored.', gap: 0.5 },
      { say: 'And delta G naught near zero means K is close to one.', cap: 'And ΔG° near 0 means K ≈ 1.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
