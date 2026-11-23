// Narration for chem-1.3 "Composition of Pure Substances". Every fact comes from the lesson cards and
// quick checks in app/src/content/chem/u1.ts (and its book.ts prose). One entry per sentence: the
// voice reads `say`; captions show `cap` (or `say`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-1.3',
  title: 'Composition of Pure Substances',
  course: 'AP® Chemistry',
  unit: 'Unit 1 · Atomic Structure and Properties',
  unitId: 'chem-u1',
  unitTitle: 'Atomic Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Composition of pure substances.', gap: 0.5 },
      { say: "In the next few minutes, you'll see why a compound always has the same recipe, how to find a mass percent, and how to turn percents into a formula.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Take water from a glacier.', gap: 0.3 },
      { say: 'Now take water from your tap. Or even from Mars.', gap: 0.5 },
      { say: 'Every sample is eleven point two percent hydrogen and eighty-eight point eight percent oxygen, by mass.', cap: 'Every sample is 11.2% hydrogen and 88.8% oxygen, by mass.', gap: 0.5 },
      { say: 'That fixed recipe is a law of nature.', gap: 0.8 },
    ] },
    { id: 'law', beats: [
      { say: 'This is the law of definite proportions.', gap: 0.4 },
      { say: 'A pure compound always has the same ratio of masses of its elements.', gap: 0.5 },
      { say: 'Why? Because its atoms are always combined in the same fixed ratio. That ratio is its formula.', gap: 0.9 },
    ] },
    { id: 'percent', beats: [
      { say: 'Now let\'s turn that into a number. The mass percent of an element.', gap: 0.5 },
      { say: 'Take the mass of that element in one mole, divide by the molar mass, and multiply by one hundred.', gap: 0.5 },
      { say: 'Try it on water.', gap: 0.4 },
      { say: 'The oxygen in one mole of water is sixteen point zero zero grams.', cap: 'The oxygen in one mole of water is 16.00 g.', gap: 0.4 },
      { say: 'The molar mass of water is eighteen point zero two grams per mole.', cap: 'The molar mass of water is 18.02 g/mol.', gap: 0.4 },
      { say: 'Sixteen point zero zero divided by eighteen point zero two, times one hundred, is eighty-eight point eight percent oxygen.', cap: '16.00 ÷ 18.02 × 100 = 88.8% oxygen.', gap: 0.9 },
    ] },
    { id: 'formulas', beats: [
      { say: 'Next: two kinds of formula.', gap: 0.4 },
      { say: 'The empirical formula is the lowest whole-number ratio of atoms.', gap: 0.5 },
      { say: 'The molecular formula is the actual number of atoms in one molecule.', gap: 0.5 },
      { say: 'Take glucose. Its molecular formula is C six H twelve O six.', cap: 'Take glucose. Its molecular formula is C₆H₁₂O₆.', gap: 0.4 },
      { say: 'Divide everything by six, and the empirical formula is C H two O.', cap: 'Divide everything by 6, and the empirical formula is CH₂O.', gap: 0.5 },
      { say: 'Ionic formulas, like sodium chloride or calcium chloride, are usually written as the lowest whole-number ratio of ions.', gap: 0.9 },
    ] },
    { id: 'chant', beats: [
      { say: "Here's the trick for finding an empirical formula. It's a chant.", gap: 0.5 },
      { say: 'Percent to mass, mass to mole, divide by small, multiply till whole.', gap: 0.6 },
      { say: 'Step one: assume a one hundred gram sample, so the percents become grams.', cap: 'Step 1: assume a 100 g sample, so the percents become grams.', gap: 0.4 },
      { say: 'Step two: convert grams to moles. Divide by the molar mass.', cap: 'Step 2: convert grams to moles. Divide by the molar mass.', gap: 0.4 },
      { say: 'Step three: divide every mole number by the smallest.', cap: 'Step 3: divide every mole number by the smallest.', gap: 0.4 },
      { say: "Step four: if you get a point five, multiply everything by two. If you get a point three three or a point six seven, multiply everything by three.", cap: 'Step 4: if you get x.5, multiply everything by 2. If you get x.33 or x.67, multiply everything by 3.', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: "Let's use it.", gap: 0.3 },
      { say: 'A compound is forty percent carbon, six point seven percent hydrogen, and fifty-three point three percent oxygen. Its molar mass is one hundred eighty grams per mole.', cap: 'A compound is 40.0% C, 6.7% H and 53.3% O. Its molar mass is 180 g/mol.', gap: 0.5 },
      { say: 'Assume one hundred grams. That gives forty point zero grams of carbon, six point seven of hydrogen, and fifty-three point three of oxygen.', cap: 'Assume 100 g: 40.0 g C, 6.7 g H, 53.3 g O.', gap: 0.5 },
      { say: 'Convert to moles. Carbon is three point three three. Hydrogen is six point six. Oxygen is three point three three.', cap: 'Convert to moles: C = 3.33, H = 6.6, O = 3.33.', gap: 0.5 },
      { say: 'Divide by the smallest, three point three three. Carbon is one. Hydrogen is about two. Oxygen is one.', cap: 'Divide by the smallest, 3.33: C = 1, H ≈ 2, O = 1.', gap: 0.5 },
      { say: 'The empirical formula is C H two O. Its mass is thirty point oh three grams per mole.', cap: 'The empirical formula is CH₂O. Its mass is 30.03 g/mol.', gap: 0.5 },
      { say: 'Now divide the molar mass by that: one hundred eighty over thirty point oh three is about six.', cap: 'Now divide the molar mass by that: 180 ÷ 30.03 ≈ 6.', gap: 0.5 },
      { say: 'Multiply everything by six. The molecular formula is C six H twelve O six. That is glucose.', cap: 'Multiply everything by 6. The molecular formula is C₆H₁₂O₆. That is glucose.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'What is the mass percent of carbon in C O two? Carbon is twelve point oh one, and oxygen is sixteen point zero zero.', cap: 'What is the mass percent of carbon in CO₂? C = 12.01, O = 16.00.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is twenty-seven point three percent.', cap: 'The answer is 27.3%.', gap: 0.4 },
      { say: 'Mass of carbon in one mole, divided by the molar mass of C O two, times one hundred.', cap: 'Mass of carbon in 1 mol, divided by the molar mass of CO₂, times 100.', gap: 0.3 },
      { say: 'Twelve point oh one over forty-four point oh one, times one hundred, is twenty-seven point three percent.', cap: '12.01 ÷ 44.01 × 100 = 27.3%.', gap: 0.9 },
    ] },
    { id: 'frq', beats: [
      { say: 'One tip for free response.', gap: 0.4 },
      { say: 'If a question asks you to justify a formula from data, show the mole ratio explicitly.', gap: 0.5 },
      { say: 'For example: the mole ratio of carbon to hydrogen is three point three three to six point six, which is one to two.', cap: 'For example: the mole ratio of C : H is 3.33 : 6.6, which is 1 : 2.', gap: 0.5 },
      { say: 'Graders award points for showing the ratio, not just the final formula.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'A pure compound always has the same mass ratio of its elements.', gap: 0.5 },
      { say: 'Mass percent is the element mass in the formula, divided by the molar mass, times one hundred.', gap: 0.5 },
      { say: 'And for an empirical formula: percent to grams, grams to moles, divide by the smallest, then make whole numbers.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
