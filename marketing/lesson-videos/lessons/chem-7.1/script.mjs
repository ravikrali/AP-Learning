// Narration for chem-7.1 "What Is Equilibrium?". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u7.ts (plus the lesson's prose in chem/book.ts: approaching
// equilibrium on a graph, and the radioactive iodine evidence that equilibrium is dynamic).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-7.1',
  title: 'What Is Equilibrium?',
  course: 'AP® Chemistry',
  unit: 'Unit 7 · Equilibrium',
  unitId: 'chem-u7',
  unitTitle: 'Equilibrium',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'What is equilibrium?', gap: 0.5 },
      { say: "In the next few minutes, you'll see what is really going on when a reaction seems to stop: two reactions, running at the same rate.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Picture a busy escalator.' },
      { say: 'People are going up, and people are going down, at the same rate.', gap: 0.5 },
      { say: 'The number of people on each floor stays the same.', gap: 0.5 },
      { say: 'But nobody has stopped. Everyone is still moving.', gap: 0.5 },
      { say: "That's dynamic equilibrium.", gap: 0.8 },
    ] },
    { id: 'twoway', beats: [
      { say: 'Many processes run both ways.' },
      { say: 'We show that with a double arrow.', gap: 0.5 },
      { say: 'Evaporation runs one way, and condensation runs back.', gap: 0.4 },
      { say: 'Dissolving runs one way, and precipitating runs back.', gap: 0.4 },
      { say: 'Proton transfer in acid base reactions, and electron transfer in redox reactions, run both ways too.', cap: 'Proton transfer in acid–base reactions, and electron transfer in redox reactions, run both ways too.', gap: 0.5 },
      { say: 'The reaction toward products is the forward reaction. The one back toward reactants is the reverse reaction.', gap: 0.8 },
    ] },
    { id: 'rates', beats: [
      { say: 'So which way does the system go? Compare the rates.' },
      { say: "If the forward rate is greater than the reverse rate, there's a net conversion of reactants into products.", gap: 0.5 },
      { say: 'That goes on until the rates become equal.', gap: 0.5 },
      { say: 'If the reverse rate is faster, products turn back into reactants.', gap: 0.5 },
      { say: 'And when the rates are equal, the system is at equilibrium.', gap: 0.8 },
    ] },
    { id: 'approach', beats: [
      { say: "Let's watch a reaction get there." },
      { say: 'Start with only reactants. The forward rate is high, and the reverse rate is zero.', gap: 0.5 },
      { say: 'As products build up, the forward rate falls, and the reverse rate rises.', gap: 0.4 },
      { say: 'Then the two rates meet. From here on, they stay equal.', gap: 0.6 },
      { say: 'Now look at the concentrations.', gap: 0.3 },
      { say: 'The reactant curve falls, the product curve rises, and both level off where equilibrium is reached.', gap: 0.5 },
      { say: 'Notice that the two levels are different.', gap: 0.4 },
      { say: 'Equilibrium means the curves go flat, not that they meet.', gap: 0.8 },
    ] },
    { id: 'features', beats: [
      { say: 'So at equilibrium, three things are true.' },
      { say: "One: there's no observable change. Concentrations and partial pressures stay constant.", gap: 0.5 },
      { say: 'Two: reactants and products are both present.', gap: 0.5 },
      { say: "Three: it's dynamic. The forward and reverse reactions keep happening, just at equal rates.", gap: 0.5 },
      { say: 'Particles keep changing, but the totals hold steady.', gap: 0.8 },
    ] },
    { id: 'bottle', beats: [
      { say: "Here's a classic example." },
      { say: 'Seal some water in a bottle, and keep the temperature constant.', gap: 0.4 },
      { say: 'After a while, the water level stops changing.', gap: 0.5 },
      { say: 'Has evaporation stopped? No.', gap: 0.5 },
      { say: 'Molecules keep evaporating and condensing, at equal rates.', gap: 0.4 },
      { say: "The molecules haven't stopped moving either. That's dynamic equilibrium.", gap: 0.8 },
    ] },
    { id: 'evidence', beats: [
      { say: 'How do we know the reactions keep going at equilibrium?' },
      { say: 'Take a saturated solution of silver iodide, and add a little solid silver iodide made with radioactive iodine.', gap: 0.5 },
      { say: 'Soon, radioactive iodide ions show up in the solution.', gap: 0.4 },
      { say: 'Yet the total amount of dissolved iodide does not change.', gap: 0.5 },
      { say: 'Some solid is dissolving, while an equal amount of dissolved ions precipitates.', gap: 0.5 },
      { say: 'The reactions continue. They simply balance.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, the number one equilibrium myth.' },
      { say: 'At equilibrium, the concentrations of reactants and products are equal.', gap: 0.5 },
      { say: 'Wrong.', gap: 0.5 },
      { say: "They're constant, not equal.", gap: 0.5 },
      { say: "It's the rates that are equal.", gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Which statement is true for a system at chemical equilibrium?', gap: 0.4 },
      { say: 'A: the reaction has stopped.', gap: 0.2 },
      { say: 'B: the concentration of reactants equals the concentration of products.', cap: 'B: [reactants] = [products].', gap: 0.2 },
      { say: 'C: the forward and reverse rates are equal.', gap: 0.2 },
      { say: 'D: only products are present.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is C. The forward and reverse rates are equal.', gap: 0.4 },
      { say: 'Equilibrium is dynamic: both reactions continue at equal rates.', gap: 0.3 },
      { say: 'So the concentrations stay constant, but they are usually not equal.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Equilibrium means the forward rate equals the reverse rate.', gap: 0.5 },
      { say: 'Concentrations are constant, not equal.', gap: 0.5 },
      { say: "And it's dynamic: both reactions keep going.", gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
