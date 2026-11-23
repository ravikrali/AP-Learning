// Narration for chem-9.7 "Coupled Reactions". Every fact comes from the lesson cards, quick checks and flashcards
// in app/src/content/chem/u9.ts plus the lesson's book.ts prose: cells build proteins (uphill, unfavored) by pairing
// them with ATP breakdown (strongly downhill), a counterweight elevator; two ways to drive an unfavored reaction:
// external energy (electricity: electrolytic cells, recharging batteries; light: photosynthesis, CO2 + H2O -> glucose,
// large positive dG on its own; energy supplied at least as large as the positive dG) and coupling (dG > 0 with
// dG << 0, a common intermediate, free energies add like Hess's law, overall dG = sum, < 0 -> favored; in cells often a
// phosphorylated species formed from ATP); the +14 / -30.5 / -16.5 kJ example and the +22 -> -8.5 kJ check; the
// "must actually be linked, side by side does not help" point; the +40 / -25 try; the three summary points.
// The try card's "more negative than +40" is said correctly as "more negative than -40 kJ".
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-9.7',
  title: 'Coupled Reactions',
  course: 'AP® Chemistry',
  unit: 'Unit 9 · Thermodynamics and Electrochemistry',
  unitId: 'chem-u9',
  unitTitle: 'Thermodynamics and Electrochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Coupled Reactions.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn two ways to make an unfavored reaction happen, how to add free energies, and the one condition that coupling needs.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Your cells build proteins all day long.', gap: 0.4 },
      { say: 'That is an uphill process. On its own, it is unfavored.', gap: 0.4 },
      { say: 'So how do your cells do it?', gap: 0.5 },
      { say: 'They pair it with a strongly downhill reaction: breaking down A T P.', cap: 'They pair it with a strongly downhill reaction: breaking down ATP.', gap: 0.5 },
      { say: 'Think of a counterweight elevator.', gap: 0.4 },
      { say: 'A heavy weight going down pulls the car up.', gap: 0.5 },
      { say: "Chemistry's version of this is called coupling.", gap: 0.8 },
    ] },
    { id: 'external', beats: [
      { say: 'There are two ways to drive an unfavored reaction.', gap: 0.4 },
      { say: 'The first is an external energy source.', gap: 0.4 },
      { say: 'Electricity is one. It drives electrolytic cells, and it recharges batteries.', gap: 0.5 },
      { say: 'Light is another. It drives photosynthesis.', gap: 0.4 },
      { say: 'Plants use light energy to turn carbon dioxide and water into glucose.', cap: 'Plants use light energy to turn CO₂ and H₂O into glucose.', gap: 0.4 },
      { say: 'On its own, that process has a large positive delta G standard.', cap: 'On its own, that process has a large positive ΔG°.', gap: 0.5 },
      { say: 'In both cases, the energy supplied must be at least as large as the positive delta G being driven.', cap: 'In both cases, the energy supplied must be at least as large as the positive ΔG being driven.', gap: 0.8 },
    ] },
    { id: 'coupling', beats: [
      { say: 'The second way is coupling.', gap: 0.4 },
      { say: 'Take an unfavored reaction, with delta G greater than zero.', cap: 'Take an unfavored reaction, with ΔG > 0.', gap: 0.4 },
      { say: 'Combine it with a strongly favored one, with delta G much less than zero.', cap: 'Combine it with a strongly favored one, with ΔG ≪ 0.', gap: 0.4 },
      { say: 'The two must share a common intermediate, a species that links them into one overall process.', gap: 0.5 },
      { say: "Free energy changes add, just like enthalpy changes in Hess's law.", gap: 0.4 },
      { say: 'So the overall delta G is the sum of the two.', cap: 'So the overall ΔG is the sum of the two.', gap: 0.4 },
      { say: 'If that sum is less than zero, the combined process is favored.', cap: 'If that sum is < 0, the combined process is favored.', gap: 0.5 },
      { say: 'In cells, the common intermediate is often a phosphorylated species formed from A T P.', cap: 'In cells, the common intermediate is often a phosphorylated species formed from ATP.', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's put numbers on it.", gap: 0.4 },
      { say: 'Reaction A has a delta G standard of plus fourteen kilojoules. It is unfavored.', cap: 'Reaction A: ΔG° = +14 kJ. It is unfavored.', gap: 0.4 },
      { say: 'Breaking down A T P to A D P has a delta G standard of minus thirty point five kilojoules.', cap: 'ATP → ADP: ΔG° = −30.5 kJ.', gap: 0.4 },
      { say: 'The two are coupled through a shared intermediate.', gap: 0.4 },
      { say: 'Add the free energies. Plus fourteen, plus minus thirty point five, gives minus sixteen point five kilojoules.', cap: 'Add the free energies: +14 + (−30.5) = −16.5 kJ.', gap: 0.5 },
      { say: 'The overall delta G standard is negative, so the coupled process is favored.', cap: 'The overall ΔG° is negative, so the coupled process is favored.', gap: 0.5 },
      { say: 'Same idea for reaction X, at plus twenty-two kilojoules.', cap: 'Same idea for reaction X, at +22 kJ.', gap: 0.3 },
      { say: 'Coupled to A T P, the sum is minus eight point five kilojoules. Favored again.', cap: 'Coupled to ATP: +22 + (−30.5) = −8.5 kJ. Favored again.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: "Now, here's the trap.", gap: 0.4 },
      { say: 'The two reactions must actually be linked by a common species.', gap: 0.5 },
      { say: 'Simply running them side by side in the same container does not help.', gap: 0.5 },
      { say: 'Without that link, nothing drives the unfavored reaction.', gap: 0.5 },
      { say: 'And always check the sum. The overall delta G must be less than zero.', cap: 'And always check the sum. The overall ΔG must be < 0.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'An unfavored reaction, with delta G standard of plus forty kilojoules, is coupled with a favored one, at minus twenty-five kilojoules. The overall process is what?', cap: 'An unfavored reaction (ΔG° = +40 kJ) is coupled with a favored one (ΔG° = −25 kJ). The overall process is…', gap: 0.3 },
      { say: 'A, favored, at minus fifteen kilojoules. B, not favored, at plus fifteen. C, favored, at minus sixty-five. D, at equilibrium.', cap: 'A) favored (ΔG° = −15 kJ) B) not favored (ΔG° = +15 kJ) C) favored (ΔG° = −65 kJ) D) at equilibrium', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B.', gap: 0.4 },
      { say: 'Plus forty, plus minus twenty-five, is plus fifteen kilojoules.', cap: '+40 + (−25) = +15 kJ.', gap: 0.4 },
      { say: 'The sum is still positive, so the process is still not favored.', gap: 0.4 },
      { say: 'To drive it, the favored reaction would need a delta G more negative than minus forty kilojoules.', cap: 'To drive it, the favored reaction would need a ΔG° more negative than −40 kJ.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'External energy, like electricity or light, can drive unfavored processes.', gap: 0.5 },
      { say: 'For coupling, add the delta G values. The overall process must have delta G less than zero.', cap: 'For coupling, add the ΔG values. The overall process must have ΔG < 0.', gap: 0.5 },
      { say: 'Coupled reactions share a common intermediate. In cells, it is often a phosphorylated species formed from A T P.', cap: 'Coupled reactions share a common intermediate. In cells, it is often a phosphorylated species formed from ATP.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
