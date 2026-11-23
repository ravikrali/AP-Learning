// Narration for chem-3.3 "Solids, Liquids & Gases". Every fact comes from the lesson cards and
// quick checks in app/src/content/chem/u3.ts. One entry per sentence: the voice reads `say`;
// captions show `cap` (or `say`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-3.3',
  title: 'Solids, Liquids & Gases',
  course: 'AP® Chemistry',
  unit: 'Unit 3 · Properties of Substances and Mixtures',
  unitId: 'chem-u3',
  unitTitle: 'Properties of Substances and Mixtures',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Solids, liquids, and gases.', gap: 0.5 },
      { say: "In the next few minutes, you'll see how particles are arranged and how they move in each phase, what crystalline and amorphous solids are, and how to draw a particle diagram that earns full credit.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Ice. Water. Steam.', gap: 0.5 },
      { say: 'They are all H two O molecules.', cap: 'They are all H₂O molecules.', gap: 0.5 },
      { say: 'The molecules are identical!', gap: 0.5 },
      { say: 'The only differences are how close together the molecules are, and how much they move.', gap: 0.6 },
      { say: "Let's look at the three phases, particle by particle.", gap: 0.8 },
    ] },
    { id: 'phases', beats: [
      { say: 'Start with the solid.', gap: 0.4 },
      { say: 'The particles are touching, and they vibrate in place.', gap: 0.4 },
      { say: 'A solid has a definite shape, and a definite volume.', gap: 0.7 },
      { say: 'Now the liquid. The particles are still touching, but they slide past each other.', gap: 0.4 },
      { say: "A liquid takes the shape of its container. Its volume is still definite.", gap: 0.7 },
      { say: 'Now the gas. The particles are far apart, and they move fast, randomly, and constantly.', gap: 0.4 },
      { say: 'A gas fills its container. So it has no definite shape, and no definite volume.', gap: 0.9 },
    ] },
    { id: 'details', beats: [
      { say: 'Now, some key details the AP exam likes.', cap: 'Now, some key details the AP® exam likes.', gap: 0.5 },
      { say: 'Solids come in two kinds.', gap: 0.4 },
      { say: 'Crystalline solids have a regular, repeating arrangement, like salt.', gap: 0.4 },
      { say: 'Amorphous solids have no orderly arrangement, like glass.', gap: 0.4 },
      { say: "But in both kinds, the particles can't move past each other.", gap: 0.8 },
      { say: 'Next, molar volume. Solids and liquids have similar molar volumes, because the particles touch in both phases.', gap: 0.5 },
      { say: 'A gas takes up far more space.', gap: 0.8 },
      { say: 'In a gas, the spacing and the collision frequency depend on temperature, pressure, and volume.', gap: 0.5 },
      { say: 'And with little attraction between particles, a gas has no definite shape or volume.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: 'Here is a tip for free response questions.', gap: 0.4 },
      { say: 'Particle drawings are graded on the details.', gap: 0.5 },
      { say: "For a solid, draw the particles touching, in neat rows if it's crystalline.", gap: 0.5 },
      { say: "For a liquid, the particles are still touching, but jumbled. Don't space them out!", gap: 0.5 },
      { say: 'For a gas, draw few particles, far apart, randomly placed.', gap: 0.5 },
      { say: 'The most common mistake is drawing a liquid with gaps, like a gas.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Why do a solid and its liquid typically have similar molar volumes? A: the particles are the same size. B: in both phases the particles are in close contact. C: both have definite shapes. Or D: neither phase has intermolecular forces.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B.', gap: 0.4 },
      { say: 'Molar volume depends on spacing.', gap: 0.3 },
      { say: 'In both solids and liquids, particles are touching, so the volume per mole is similar. A gas takes up far more space.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Solid: fixed, vibrating. Liquid: touching, flowing. Gas: far apart, fast, and random.', gap: 0.5 },
      { say: 'Crystalline means ordered. Amorphous means disordered.', gap: 0.5 },
      { say: 'Solids and liquids have similar molar volumes. Gases are mostly empty space.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
