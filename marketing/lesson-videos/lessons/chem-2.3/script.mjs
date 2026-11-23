// Narration for chem-2.3 "Structure of Ionic Solids". Every fact comes from the lesson cards and
// quick checks in app/src/content/chem/u2.ts (and its book.ts prose). One entry per sentence: the
// voice reads `say`; captions show `cap` (or `say`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-2.3',
  title: 'Structure of Ionic Solids',
  course: 'AP® Chemistry',
  unit: 'Unit 2 · Compound Structure and Properties',
  unitId: 'chem-u2',
  unitTitle: 'Compound Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Structure of ionic solids.', gap: 0.5 },
      { say: "In the next few minutes, you'll see how the ions in a crystal are arranged, why a crystal cracks instead of bending, and when an ionic compound conducts electricity.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Look at salt under a magnifying glass.' },
      { say: "You'll see tiny cubes.", gap: 0.5 },
      { say: 'That shape comes straight from how the ions stack.', gap: 0.5 },
      { say: "It's one pattern, repeated trillions of times.", gap: 0.6 },
      { say: "Let's zoom in on that pattern.", gap: 0.8 },
    ] },
    { id: 'lattice', beats: [
      { say: 'Think of an ionic crystal as a three-dimensional checkerboard.', cap: 'Think of an ionic crystal as a 3-D checkerboard.' },
      { say: 'The cations and anions are arranged in a systematic, repeating, three-dimensional pattern. That pattern is called a lattice.', cap: 'The cations and anions are arranged in a systematic, repeating, 3-D pattern. That pattern is called a lattice.', gap: 0.6 },
      { say: 'The lattice does two things.', gap: 0.4 },
      { say: 'First, it maximizes attractions. Each ion is surrounded by ions of the opposite charge.', gap: 0.5 },
      { say: 'In solid sodium chloride, each sodium ion is surrounded by chloride ions.', gap: 0.6 },
      { say: 'Second, it minimizes repulsions. Ions with the same charge are kept apart.', gap: 0.9 },
    ] },
    { id: 'melt', beats: [
      { say: 'This structure explains the properties of ionic solids.' },
      { say: 'Start with melting point. Ionic solids have high melting points.', gap: 0.5 },
      { say: 'Why? Because there are strong attractions throughout the whole lattice.', gap: 0.9 },
    ] },
    { id: 'brittle', beats: [
      { say: 'Next: ionic solids are hard, but brittle.' },
      { say: 'Remember, every ion in the lattice is surrounded by ions of the opposite charge.', gap: 0.5 },
      { say: 'Now a force pushes one layer of ions past another.', gap: 0.5 },
      { say: 'Suddenly, ions of the same charge line up next to each other.', gap: 0.5 },
      { say: 'Like charges repel. Their strong repulsion pushes the layers apart, and the crystal cracks.', gap: 0.6 },
      { say: "That's why salt crystals shatter rather than bend.", gap: 0.9 },
    ] },
    { id: 'conduct', beats: [
      { say: 'Now, electricity.' },
      { say: 'Conduction needs charged particles that can move.', gap: 0.5 },
      { say: "In the solid, the ions are locked in place. So an ionic solid doesn't conduct.", gap: 0.5 },
      { say: 'Melt it, and the ions are free to move. Now it conducts.', gap: 0.5 },
      { say: 'Dissolve it in water, and the same thing happens. The ions separate, and they can move toward electrodes of opposite charge.', gap: 0.6 },
      { say: "Take potassium bromide. The solid doesn't conduct, but molten potassium bromide does.", gap: 0.4 },
      { say: "Melting doesn't create free electrons. In the liquid, the potassium ions and bromide ions are free to move.", gap: 0.6 },
      { say: 'So for any conductivity question, ask two things: are there charged particles, and are they free to move?', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a quick trick for drawing an ionic solid on the exam. Follow three rules.", gap: 0.5 },
      { say: 'One: alternate the positive and negative ions, so no two like charges touch.', gap: 0.5 },
      { say: 'Two: draw the ions in reasonable relative sizes. Usually, anions are bigger than cations. The chloride ion is bigger than the sodium ion.', gap: 0.5 },
      { say: 'Three: keep the ratio right. For calcium chloride, draw twice as many chloride ions as calcium ions.', gap: 0.6 },
      { say: "And some good news: you don't need to memorize specific crystal structures. That's excluded from the exam.", gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Why are ionic crystals brittle? A: the electrons are delocalized. B: shifting a layer brings ions of the same charge next to each other, and they repel. C: ionic bonds are weaker than covalent bonds. Or D: the ions are too small.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B.', gap: 0.4 },
      { say: 'A sharp blow shifts the layers, so like charges line up.', gap: 0.3 },
      { say: 'The strong repulsion splits the crystal apart.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'An ionic lattice maximizes the attractions between positive and negative ions, and minimizes like-charge repulsions.', gap: 0.5 },
      { say: 'That structure gives ionic solids a high melting point, and makes them brittle.', gap: 0.5 },
      { say: 'And they conduct only when the ions can move: melted, or dissolved.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
