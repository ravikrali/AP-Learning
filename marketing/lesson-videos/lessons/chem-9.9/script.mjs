// Narration for chem-9.9 "Cell Potential & Free Energy". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u9.ts, plus chem/book.ts (1 V = 1 J/C; doubling the reaction doubles
// energy and charge, voltage unchanged; the amount shows up in ΔG° through n; copper wire in silver nitrate
// gets coated with silver).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-9.9',
  title: 'Cell Potential & Free Energy',
  course: 'AP® Chemistry',
  unit: 'Unit 9 · Thermodynamics and Electrochemistry',
  unitId: 'chem-u9',
  unitTitle: 'Thermodynamics and Electrochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Cell potential and free energy.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn how to find a cell's voltage from reduction potentials, and how that voltage tells you delta G naught.", cap: "In the next few minutes, you'll learn how to find a cell's voltage from reduction potentials, and how that voltage tells you ΔG°.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Why does a lead acid cell give about two volts, while a double A cell gives one point five?', cap: 'Why does a lead–acid cell give about 2 V, while a AA cell gives 1.5 V?', gap: 0.5 },
      { say: 'A car battery is just six of those lead acid cells, in series.', cap: 'A car battery is just six of those lead–acid cells, in series.', gap: 0.5 },
      { say: 'The voltage comes straight from the chemistry.', gap: 0.4 },
      { say: 'It comes from the difference in how badly each half-reaction wants electrons.', gap: 0.8 },
    ] },
    { id: 'potentials', beats: [
      { say: 'Every half-reaction has a standard reduction potential, called E naught.', cap: 'Every half-reaction has a standard reduction potential, E°.', gap: 0.4 },
      { say: 'A more positive E naught means a stronger tendency to be reduced.', cap: 'A more positive E° means a stronger tendency to be reduced.', gap: 0.5 },
      { say: 'Copper two plus, gaining two electrons to become copper, has an E naught of plus zero point three four volts.', cap: 'Cu²⁺ + 2e⁻ → Cu has E° = +0.34 V.', gap: 0.4 },
      { say: 'Zinc two plus, becoming zinc, has an E naught of minus zero point seven six volts.', cap: 'Zn²⁺ + 2e⁻ → Zn has E° = −0.76 V.', gap: 0.5 },
      { say: 'The half-reaction with the higher E naught is reduced. That electrode is the cathode.', cap: 'The half-reaction with the higher E° is reduced. That electrode is the cathode.', gap: 0.4 },
      { say: 'The other one runs in reverse, as an oxidation. That is the anode.', gap: 0.5 },
      { say: 'So copper ions are reduced, and zinc metal is oxidized.', gap: 0.8 },
    ] },
    { id: 'cell', beats: [
      { say: 'Now find the cell potential.' },
      { say: 'E naught cell equals E naught cathode, minus E naught anode.', cap: 'E°cell = E°cathode − E°anode', gap: 0.4 },
      { say: 'Use both values as reduction potentials, just as they are listed.', gap: 0.5 },
      { say: 'For the zinc copper cell, that is zero point three four, minus negative zero point seven six.', cap: 'For the Zn/Cu cell: 0.34 − (−0.76)', gap: 0.4 },
      { say: 'So E naught cell is plus one point one oh volts.', cap: 'So E°cell = +1.10 V.', gap: 0.5 },
      { say: 'On the ladder, that is the distance between the two half-reactions.', gap: 0.5 },
      { say: 'And a positive cell potential means the reaction is favored.', gap: 0.8 },
    ] },
    { id: 'dg', beats: [
      { say: 'That voltage links straight to free energy.' },
      { say: 'Delta G naught equals minus n F E naught.', cap: 'ΔG° = −nFE°', gap: 0.5 },
      { say: 'n is the moles of electrons transferred, in the balanced equation.', gap: 0.4 },
      { say: "F is Faraday's constant: ninety-six thousand, four hundred eighty-five coulombs per mole of electrons.", cap: "F is Faraday's constant: 96,485 C/mol e⁻.", gap: 0.5 },
      { say: 'For the zinc copper cell, n is two.', cap: 'For the Zn/Cu cell, n = 2.', gap: 0.4 },
      { say: 'So delta G naught equals minus two, times ninety-six thousand, four hundred eighty-five, times one point one oh.', cap: 'So ΔG° = −(2)(96,485)(1.10)', gap: 0.4 },
      { say: 'That is minus two hundred twelve thousand joules, or minus two hundred twelve kilojoules.', cap: '= −212,000 J = −212 kJ', gap: 0.6 },
      { say: 'Now notice the signs.' },
      { say: 'A positive E naught gives a negative delta G naught. The reaction is thermodynamically favored, and the cell is galvanic.', cap: 'A positive E° gives a negative ΔG°. The reaction is thermodynamically favored, and the cell is galvanic.', gap: 0.5 },
      { say: 'A negative E naught gives a positive delta G naught. That reaction needs an external voltage, so the cell is electrolytic.', cap: 'A negative E° gives a positive ΔG°. That reaction needs an external voltage, so the cell is electrolytic.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now the trap: coefficients.' },
      { say: 'To balance a redox equation, you often multiply a half-reaction by a number.', gap: 0.4 },
      { say: "Never multiply E naught by that number. Potentials don't scale with amount.", cap: "Never multiply E° by that number. Potentials don't scale with amount.", gap: 0.5 },
      { say: 'A volt is energy per unit of charge: one joule per coulomb.', cap: 'A volt is energy per unit of charge: 1 V = 1 J/C.', gap: 0.4 },
      { say: 'Double the amount of reaction, and you double both the energy and the charge.', gap: 0.4 },
      { say: 'Their ratio, the voltage, stays the same.', gap: 0.5 },
      { say: 'The amount shows up in delta G naught instead, through n.', cap: 'The amount shows up in ΔG° instead, through n.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Silver ion plus one electron gives silver, with an E naught of plus zero point eight oh volts.', cap: 'Ag⁺ + e⁻ → Ag, E° = +0.80 V', gap: 0.3 },
      { say: 'Copper two plus plus two electrons gives copper, with plus zero point three four volts.', cap: 'Cu²⁺ + 2e⁻ → Cu, E° = +0.34 V', gap: 0.3 },
      { say: 'What is E naught cell for the favored reaction between them?', cap: 'What is E°cell for the favored reaction between them?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is plus zero point four six volts.', cap: 'The answer is +0.46 V.', gap: 0.5 },
      { say: 'Silver has the higher E naught, so it is the cathode, and copper is the anode.', cap: 'Silver has the higher E°, so it is the cathode, and copper is the anode.', gap: 0.4 },
      { say: 'Zero point eight oh, minus zero point three four, is zero point four six.', cap: '0.80 − 0.34 = 0.46', gap: 0.4 },
      { say: 'Two silver ions are needed, but E naught is not doubled.', cap: 'Two Ag⁺ are needed, but E° is not doubled.', gap: 0.5 },
      { say: 'That is why a copper wire in silver nitrate solution becomes coated with silver.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'E naught cell equals E naught cathode minus E naught anode. The higher E naught is reduced.', cap: 'E°cell = E°cathode − E°anode. The higher E° is reduced.', gap: 0.5 },
      { say: 'Never multiply E naught by coefficients.', cap: 'Never multiply E° by coefficients.', gap: 0.5 },
      { say: 'And delta G naught equals minus n F E naught. A positive E naught means favored.', cap: 'ΔG° = −nFE°. E° > 0 means favored.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
