// Narration for chem-9.2 "Calculating ΔS°". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u9.ts, plus chem/book.ts ("a perfect crystal at 0 K has zero entropy",
// S°(gas) > S°(liquid) > S°(solid) for a given substance).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-9.2',
  title: 'Calculating ΔS°',
  course: 'AP® Chemistry',
  unit: 'Unit 9 · Thermodynamics and Electrochemistry',
  unitId: 'chem-u9',
  unitTitle: 'Thermodynamics and Electrochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Calculating delta S naught.', cap: 'Calculating ΔS°.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the equation for the entropy change of a reaction, how to use it with a table of standard entropies, and the trap that catches students with elements.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "Here's something different about entropy.", gap: 0.4 },
      { say: 'Unlike enthalpy, entropy has absolute values.', gap: 0.5 },
      { say: 'A perfect crystal at zero kelvin has zero entropy. That is the starting point.', cap: 'A perfect crystal at 0 K has zero entropy. That is the starting point.', gap: 0.5 },
      { say: 'Every substance at room temperature is more spread out than that, even the elements.', gap: 0.4 },
      { say: 'So every pure element and compound has a standard molar entropy, S naught, greater than zero.', cap: 'So every pure element and compound has a standard molar entropy, S°, greater than zero.', gap: 0.5 },
      { say: 'And for one substance, the gas has more entropy than the liquid.', gap: 0.5 },
      { say: 'Because these values are absolute, calculating delta S naught is just products minus reactants, the same pattern as delta H naught of formation.', cap: 'Because these values are absolute, calculating ΔS° is just products minus reactants, the same pattern as ΔH°f.', gap: 0.8 },
    ] },
    { id: 'equation', beats: [
      { say: 'Here is the equation.' },
      { say: 'Delta S naught of reaction equals the sum of S naught for the products, minus the sum of S naught for the reactants.', cap: 'ΔS°rxn = ΣS°(products) − ΣS°(reactants)', gap: 0.5 },
      { say: 'Multiply each S naught by its coefficient in the balanced equation. Two moles of ammonia count its S naught twice.', cap: 'Multiply each S° by its coefficient in the balanced equation. Two moles of NH₃ count its S° twice.', gap: 0.5 },
      { say: 'Watch the units: joules per mole kelvin.', cap: 'Watch the units: J/(mol·K).', gap: 0.4 },
      { say: "That's joules, not kilojoules!", gap: 0.5 },
      { say: 'And unlike delta H naught of formation, elements do not have an S naught of zero.', cap: 'And unlike ΔH°f, elements do not have S° = 0.', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's try it on making ammonia." },
      { say: 'Nitrogen plus three hydrogen gives two ammonia, all as gases.', cap: 'N₂(g) + 3H₂(g) → 2NH₃(g)', gap: 0.4 },
      { say: 'The table gives S naught for nitrogen, one hundred ninety-one point six. Hydrogen, one hundred thirty point seven. Ammonia, one hundred ninety-two point five.', cap: 'S° in J/(mol·K): N₂ 191.6, H₂ 130.7, NH₃ 192.5.', gap: 0.5 },
      { say: 'Products first. Two times one hundred ninety-two point five is three hundred eighty-five point oh.', cap: 'Products: 2(192.5) = 385.0', gap: 0.5 },
      { say: 'Reactants. One hundred ninety-one point six, plus three times one hundred thirty point seven, because hydrogen has a coefficient of three. That gives five hundred eighty-three point seven.', cap: 'Reactants: 191.6 + 3(130.7) = 583.7, because H₂ has a coefficient of 3.', gap: 0.5 },
      { say: 'Now products minus reactants.', gap: 0.3 },
      { say: 'Delta S naught is minus one hundred ninety-eight point seven joules per kelvin.', cap: 'ΔS° = 385.0 − 583.7 = −198.7 J/K', gap: 0.8 },
    ] },
    { id: 'check', beats: [
      { say: 'Now check the sign. It should match the change in dispersal.' },
      { say: 'Four moles of gas became two moles of gas.', gap: 0.4 },
      { say: 'Fewer gas particles means less dispersal, so a negative delta S naught is just what we expected.', cap: 'Fewer gas particles means less dispersal, so a negative ΔS° is just what we expected.', gap: 0.6 },
      { say: 'It works the other way, too. Take water boiling.', gap: 0.4 },
      { say: 'Liquid water has an S naught of sixty-nine point nine. Water vapor, one hundred eighty-eight point eight.', cap: 'H₂O(l): S° = 69.9. H₂O(g): 188.8 J/(mol·K).', gap: 0.4 },
      { say: 'So delta S naught is plus one hundred eighteen point nine joules per kelvin. Liquid to gas, so positive, as expected.', cap: 'So ΔS° = 188.8 − 69.9 = +118.9 J/K. Liquid → gas, so positive, as expected.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now the trap.' },
      { say: 'Elements like oxygen and hydrogen gas have a standard entropy that is not zero.', cap: 'Elements like O₂ and H₂ have S° ≠ 0.', gap: 0.5 },
      { say: 'Here is a typical quick check. What is the standard molar entropy of oxygen gas?', cap: 'Here is a typical quick check. What is the standard molar entropy of O₂(g)?', gap: 0.5 },
      { say: "Zero, because it's an element? No. That is the trap.", gap: 0.5 },
      { say: 'It is a positive value: two hundred five point oh joules per mole kelvin.', cap: 'It is a positive value: 205.0 J/(mol·K).', gap: 0.5 },
      { say: 'Only their delta H naught of formation and delta G naught of formation are zero.', cap: 'Only their ΔH°f and ΔG°f are zero.', gap: 0.5 },
      { say: "So don't drop an element from an entropy calculation!", gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Find delta S naught for two S O two plus O two, giving two S O three.', cap: 'Find ΔS° for 2SO₂(g) + O₂(g) → 2SO₃(g).', gap: 0.4 },
      { say: 'S naught for sulfur dioxide is two hundred forty-eight point two. Oxygen, two hundred five point oh. Sulfur trioxide, two hundred fifty-six point eight.', cap: 'S°: SO₂ 248.2, O₂ 205.0, SO₃ 256.8 J/(mol·K).', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'Delta S naught is minus one hundred eighty-seven point eight joules per kelvin.', cap: 'ΔS° = −187.8 J/K.', gap: 0.5 },
      { say: 'Products: two times two hundred fifty-six point eight is five hundred thirteen point six. Reactants: two times two hundred forty-eight point two, plus two hundred five point oh, is seven hundred one point four.', cap: 'Products: 2(256.8) = 513.6. Reactants: 2(248.2) + 205.0 = 701.4.', gap: 0.5 },
      { say: 'Five hundred thirteen point six minus seven hundred one point four is minus one hundred eighty-seven point eight. And the oxygen counted, even though it is an element.', cap: '513.6 − 701.4 = −187.8 J/K. And the O₂ counted, even though it is an element.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Delta S naught equals the sum for the products minus the sum for the reactants, times the coefficients.', cap: 'ΔS° = ΣS°(products) − ΣS°(reactants), × coefficients.', gap: 0.5 },
      { say: 'The units are joules per mole kelvin.', cap: 'Units: J/(mol·K).', gap: 0.5 },
      { say: 'And elements have S naught values that are not zero.', cap: 'And elements have nonzero S°.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
