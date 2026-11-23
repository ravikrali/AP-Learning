// Narration for chem-6.7 "Bond Enthalpies". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u6.ts (plus the lesson's prose in chem/book.ts: the
// methane combustion example and why the result is only an estimate).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-6.7',
  title: 'Bond Enthalpies',
  course: 'AP® Chemistry',
  unit: 'Unit 6 · Thermochemistry',
  unitId: 'chem-u6',
  unitTitle: 'Thermochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Bond enthalpies.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn to estimate the heat of a reaction by counting the bonds that break and the bonds that form.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "Here's the big truth from Unit 2.", gap: 0.4 },
      { say: 'Breaking bonds costs energy.', gap: 0.4 },
      { say: 'Forming bonds releases energy.', gap: 0.5 },
      { say: 'A reaction does both: it breaks the bonds in the reactants, and forms the bonds in the products.', gap: 0.5 },
      { say: 'Add up both, and you can predict whether the reaction will release heat.', gap: 0.8 },
    ] },
    { id: 'rule', beats: [
      { say: 'Here is the rule.' },
      { say: 'Delta H is approximately the sum of the bonds broken, minus the sum of the bonds formed.', cap: 'ΔH is approximately Σ(bonds broken) − Σ(bonds formed).', gap: 0.5 },
      { say: 'Bonds broken are in the reactants. Breaking them takes energy in, so they count as plus.', gap: 0.5 },
      { say: 'Bonds formed are in the products. Forming them sends energy out, so they count as minus.', gap: 0.5 },
      { say: 'If more energy is released forming bonds than is used breaking them, the reaction is exothermic.', gap: 0.5 },
      { say: "If more energy is needed to break them, it's endothermic.", gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's try it with hydrogen and chlorine." },
      { say: 'One hydrogen molecule and one chlorine molecule make two hydrogen chloride molecules.', cap: 'H₂(g) + Cl₂(g) → 2HCl(g)', gap: 0.4 },
      { say: 'The bond enthalpies are: hydrogen to hydrogen, four hundred thirty-six. Chlorine to chlorine, two hundred forty-two. And hydrogen to chlorine, four hundred thirty-one kilojoules per mole.', cap: 'Bond enthalpies: H–H 436, Cl–Cl 242, H–Cl 431 kJ/mol.', gap: 0.5 },
      { say: 'Break: one hydrogen to hydrogen bond and one chlorine to chlorine bond. Four hundred thirty-six plus two hundred forty-two is six hundred seventy-eight kilojoules.', cap: 'Break: one H–H and one Cl–Cl. 436 + 242 = 678 kJ.', gap: 0.5 },
      { say: 'Make: two hydrogen to chlorine bonds. Two times four hundred thirty-one is eight hundred sixty-two kilojoules.', cap: 'Make: two H–Cl. 2 × 431 = 862 kJ.', gap: 0.5 },
      { say: 'Delta H equals six hundred seventy-eight minus eight hundred sixty-two: negative one hundred eighty-four kilojoules.', cap: 'ΔH = 678 − 862 = −184 kJ.', gap: 0.4 },
      { say: 'More energy came out than went in, so the reaction is exothermic.', gap: 0.8 },
    ] },
    { id: 'sign', beats: [
      { say: 'Now a quick check on the sign.' },
      { say: 'A reaction breaks bonds totaling fifteen hundred kilojoules, and forms bonds totaling twelve hundred.', cap: 'A reaction breaks bonds totaling 1500 kJ, and forms bonds totaling 1200 kJ.', gap: 0.5 },
      { say: 'Break minus make: fifteen hundred minus twelve hundred is plus three hundred kilojoules.', cap: 'Break minus make: 1500 − 1200 = +300 kJ.', gap: 0.5 },
      { say: 'More energy went in than came out, so this reaction is endothermic.', gap: 0.5 },
      { say: "And don't add the two totals together. You subtract.", gap: 0.8 },
    ] },
    { id: 'count', beats: [
      { say: 'Real molecules have more bonds, so draw the Lewis structures first.' },
      { say: 'Take the burning of methane: one methane and two oxygen molecules make carbon dioxide and two water molecules.', cap: 'Take the burning of methane: CH₄ + 2O₂ → CO₂ + 2H₂O(g).', gap: 0.5 },
      { say: 'Break: four carbon to hydrogen bonds, and two oxygen to oxygen double bonds. That totals two thousand six hundred forty-two kilojoules.', cap: 'Break: 4 C–H + 2 O=O = 2642 kJ.', gap: 0.5 },
      { say: 'Make: two carbon to oxygen double bonds, and four oxygen to hydrogen bonds. That totals three thousand four hundred fifty kilojoules.', cap: 'Make: 2 C=O + 4 O–H = 3450 kJ.', gap: 0.5 },
      { say: 'So delta H is about negative eight hundred eight kilojoules, close to the measured value of about negative eight hundred two for forming water vapor.', cap: 'So ΔH ≈ −808 kJ, close to the measured value of about −802 kJ for forming water vapor.', gap: 0.5 },
      { say: 'Count every bond, including each double and triple bond.', gap: 0.8 },
    ] },
    { id: 'estimate', beats: [
      { say: 'Notice the word: approximately.', gap: 0.4 },
      { say: 'A bond enthalpy table lists average values.', gap: 0.4 },
      { say: 'A carbon to hydrogen bond in methane is slightly different from one in ethane or in chloroform, because neighboring atoms affect it.', cap: 'A C–H bond in methane is slightly different from one in ethane or in chloroform, because neighboring atoms affect it.', gap: 0.5 },
      { say: 'Bond enthalpies also apply only to gases. When something is a liquid or a solid, the energy of the phase change is left out.', gap: 0.5 },
      { say: 'So the result is an estimate. For accurate values, use enthalpies of formation.', gap: 0.4 },
      { say: 'Bond enthalpies are best for understanding why a reaction is exothermic or endothermic.', gap: 0.8 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's the trick to keep the order straight." },
      { say: 'Delta H equals break minus make.', cap: 'ΔH = BREAK − MAKE.', gap: 0.5 },
      { say: 'With bond energies, it is always reactants first.', gap: 0.5 },
      { say: 'This one trips people up, because enthalpies of formation use the opposite order: products minus reactants.', gap: 0.5 },
      { say: 'So, bonds: break minus make. Formation: products minus reactants.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Estimate delta H for hydrogen plus fluorine making two hydrogen fluoride. Use hydrogen to hydrogen, four hundred thirty-six. Fluorine to fluorine, one hundred fifty-five. And hydrogen to fluorine, five hundred sixty-seven kilojoules per mole.', cap: 'Estimate ΔH for H₂(g) + F₂(g) → 2HF(g). Use H–H 436, F–F 155, H–F 567 kJ/mol.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is negative five hundred forty-three kilojoules.', cap: 'The answer is −543 kJ.', gap: 0.4 },
      { say: 'Break: four hundred thirty-six plus one hundred fifty-five is five hundred ninety-one.', cap: 'Break: 436 + 155 = 591.', gap: 0.3 },
      { say: 'Make: two times five hundred sixty-seven is one thousand one hundred thirty-four.', cap: 'Make: 2 × 567 = 1134.', gap: 0.3 },
      { say: 'Five hundred ninety-one minus one thousand one hundred thirty-four is negative five hundred forty-three kilojoules.', cap: '591 − 1134 = −543 kJ.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Breaking bonds absorbs energy. Forming bonds releases it.', gap: 0.5 },
      { say: 'Delta H is approximately the bonds broken minus the bonds formed: break minus make.', cap: 'ΔH ≈ Σ broken − Σ formed: BREAK − MAKE.', gap: 0.5 },
      { say: 'And average bond enthalpies give an estimate.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
