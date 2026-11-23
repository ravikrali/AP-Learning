// Narration for chem-9.11 "Electrolysis & Faraday's Law". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u9.ts, plus chem/book.ts and chem/glossary.ts (electrolysis definition;
// "Faraday's law can be run in reverse to find the time or current needed").
// The hook card says the amount deposited depends on "just two things: current and time"; that holds for a
// given metal (ion charge and molar mass matter too), so the narration says "for a given metal".
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-9.11',
  title: "Electrolysis & Faraday's Law",
  course: 'AP® Chemistry',
  unit: 'Unit 9 · Thermodynamics and Electrochemistry',
  unitId: 'chem-u9',
  unitTitle: 'Thermodynamics and Electrochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: "Electrolysis and Faraday's law.", cap: "Electrolysis & Faraday's Law.", gap: 0.5 },
      { say: "In the next few minutes, you'll learn how to turn a current and a time into grams of metal, with one short chain of steps.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Gold-plated jewelry, chrome bumpers and aluminum cans are all made with electrolysis.', gap: 0.4 },
      { say: 'Electrolysis uses an electric current to drive a chemical reaction that would not happen by itself.', gap: 0.4 },
      { say: 'In plating, metal ions in the solution pick up electrons and come out as solid metal.', gap: 0.4 },
      { say: 'For a given metal, the amount deposited depends on just two things: current, and time.', gap: 0.5 },
      { say: 'So how do you get from amps and minutes to grams?', gap: 0.8 },
    ] },
    { id: 'charge', beats: [
      { say: 'Start with charge.' },
      { say: 'Charge, q, equals current, I, times time, t.', cap: 'q = I × t', gap: 0.5 },
      { say: 'Charge is in coulombs, current is in amps, and time must be in seconds.', gap: 0.4 },
      { say: 'So coulombs equal amps times seconds.', cap: 'C = A × s', gap: 0.4 },
      { say: 'More current, or more time, means more charge, and more metal.', gap: 0.8 },
    ] },
    { id: 'faraday', beats: [
      { say: 'Next, turn that charge into electrons.' },
      { say: "Faraday's constant, F, is the charge of one mole of electrons.", gap: 0.3 },
      { say: 'It is ninety-six thousand, four hundred eighty-five coulombs per mole of electrons.', cap: 'F = 96,485 C per mole of electrons.', gap: 0.5 },
      { say: 'So moles of electrons equals q, divided by F.', cap: 'mol e⁻ = q ÷ F', gap: 0.5 },
      { say: 'Every time you have a charge in coulombs, dividing by F tells you how many moles of electrons moved.', gap: 0.8 },
    ] },
    { id: 'ratio', beats: [
      { say: 'Now, how many electrons does each metal atom need?' },
      { say: 'Read it from the half-reaction.' },
      { say: 'Copper two plus, plus two electrons, gives solid copper.', cap: 'Cu²⁺ + 2e⁻ → Cu(s)', gap: 0.4 },
      { say: 'So it takes two moles of electrons for every mole of copper.', gap: 0.5 },
      { say: 'The number of electrons per atom equals the charge of the ion.', gap: 0.4 },
      { say: 'Silver one plus needs one. Copper two plus needs two. Aluminum three plus needs three.', cap: 'Ag⁺ needs 1. Cu²⁺ needs 2. Al³⁺ needs 3.', gap: 0.5 },
      { say: 'So the same charge deposits only half as many moles of copper as of silver.', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's plate some copper." },
      { say: 'A current of two point oh oh amps runs for thirty point oh minutes through a copper two plus solution.', cap: 'A current of 2.00 A runs for 30.0 min through a Cu²⁺ solution.', gap: 0.4 },
      { say: 'First, minutes to seconds: thirty times sixty is eighteen hundred seconds.', cap: 'First, minutes to seconds: 30.0 × 60 = 1800 s.', gap: 0.4 },
      { say: 'The charge is two point oh oh times eighteen hundred: thirty-six hundred coulombs.', cap: 'q = 2.00 × 1800 = 3600 C.', gap: 0.4 },
      { say: "Divide by Faraday's constant: zero point oh three seven three moles of electrons.", cap: '3600 ÷ 96,485 = 0.0373 mol e⁻.', gap: 0.4 },
      { say: 'Copper takes two electrons per atom, so divide by two: zero point oh one eight seven moles of copper.', cap: 'Cu takes 2 e⁻ per atom: 0.0373 ÷ 2 = 0.0187 mol Cu.', gap: 0.4 },
      { say: 'Times sixty-three point five five grams per mole gives one point one nine grams of copper.', cap: '0.0187 × 63.55 g/mol = 1.19 g Cu.', gap: 0.8 },
    ] },
    { id: 'chain', beats: [
      { say: "Here's the trick: every one of these problems is the same four-step chain." },
      { say: 'Amps times seconds gives coulombs.', gap: 0.3 },
      { say: 'Coulombs divided by F gives moles of electrons.', gap: 0.3 },
      { say: 'Divide by the electrons per atom to get moles of metal.', gap: 0.3 },
      { say: 'Multiply by the molar mass to get grams.', gap: 0.5 },
      { say: 'And watch the time. If it is given in minutes, convert to seconds first.', gap: 0.5 },
      { say: 'The chain also runs backward, to find the time or the current you need.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'How many grams of silver are deposited by zero point five oh oh amps for nine hundred sixty-five seconds?', cap: 'How many grams of silver are deposited by 0.500 A for 965 s?', gap: 0.3 },
      { say: 'Silver one plus takes one electron, and the molar mass of silver is one hundred seven point eight seven.', cap: 'Ag⁺ + e⁻ → Ag(s), and Ag = 107.87 g/mol.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is zero point five three nine grams.', cap: 'The answer is 0.539 g.', gap: 0.5 },
      { say: 'The charge is zero point five oh oh times nine hundred sixty-five: four hundred eighty-two point five coulombs.', cap: 'q = 0.500 × 965 = 482.5 C.', gap: 0.4 },
      { say: "That's zero point oh oh five oh oh moles of electrons, and the same number of moles of silver.", cap: '482.5 ÷ 96,485 = 0.00500 mol e⁻ = 0.00500 mol Ag.', gap: 0.4 },
      { say: 'Times one hundred seven point eight seven gives zero point five three nine grams.', cap: '0.00500 × 107.87 = 0.539 g.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Charge equals current times time, in seconds. Moles of electrons equals charge over F.', cap: 'q = It (seconds!). mol e⁻ = q/F.', gap: 0.5 },
      { say: "Electrons per atom equals the ion's charge.", cap: "e⁻ per atom = the ion's charge.", gap: 0.5 },
      { say: 'And the chain: amp seconds, to coulombs, to moles of electrons, to moles of metal, to grams.', cap: 'Chain: A·s → C → mol e⁻ → mol metal → g.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
