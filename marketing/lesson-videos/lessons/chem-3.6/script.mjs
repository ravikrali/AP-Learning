// Narration for chem-3.6 "Real Gases vs. Ideal Gases". Every fact comes from the lesson cards, quick
// checks and flashcards in app/src/content/chem/u3.ts (the "opposite directions" and CH4 / CCl4 lines
// are from book.ts). One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-3.6',
  title: 'Real Gases vs. Ideal Gases',
  course: 'AP® Chemistry',
  unit: 'Unit 3 · Properties of Substances and Mixtures',
  unitId: 'chem-u3',
  unitTitle: 'Properties of Substances and Mixtures',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Real gases versus ideal gases.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the two assumptions behind the ideal gas law, when they break down, and which gases behave the most ideally.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'The ideal gas law, P V equals n R T, makes two big assumptions.', cap: 'The ideal gas law, PV = nRT, makes two big assumptions.', gap: 0.5 },
      { say: 'It pretends gas particles have no volume.', gap: 0.4 },
      { say: 'And it pretends they have no attractions for each other.', gap: 0.6 },
      { say: "That's a great approximation most of the time.", gap: 0.4 },
      { say: 'Until you squeeze a gas really hard.', gap: 0.4 },
      { say: "Or cool it until it's about to turn into a liquid.", gap: 0.5 },
      { say: "Then real gases stop following the law. Let's see why.", gap: 0.8 },
    ] },
    { id: 'volume', beats: [
      { say: 'Assumption one: particles have no volume.', gap: 0.5 },
      { say: 'At low pressure, the particles are spread out through the container.', gap: 0.5 },
      { say: "Their own volume is negligible, so ignoring it works just fine.", gap: 0.5 },
      { say: 'Now squeeze the gas to a very high pressure.', gap: 0.4 },
      { say: 'The particles are crammed together.', gap: 0.4 },
      { say: 'Their own volume becomes a real fraction of the container, so there is less empty space available.', gap: 0.6 },
      { say: 'The result: the actual volume is larger than P V equals n R T predicts.', cap: 'The result: the actual volume is larger than PV = nRT predicts.', gap: 0.9 },
    ] },
    { id: 'attract', beats: [
      { say: "Assumption two: particles don't attract each other.", gap: 0.5 },
      { say: "At high temperature, the particles move fast, and attractions don't matter.", gap: 0.5 },
      { say: 'Now cool the gas down, close to the point where it condenses.', gap: 0.4 },
      { say: 'The particles move slowly, so attractions matter.', gap: 0.4 },
      { say: 'A particle heading for the wall gets pulled back by its neighbors.', gap: 0.4 },
      { say: 'So particles hit the walls less hard, and less often.', gap: 0.6 },
      { say: 'The result: the actual pressure is lower than predicted.', gap: 0.6 },
      { say: "That's why carbon dioxide near its condensation point shows a lower pressure than P V equals n R T predicts.", cap: 'That\'s why CO₂ near its condensation point shows a lower pressure than PV = nRT predicts.', gap: 0.9 },
    ] },
    { id: 'opposite', beats: [
      { say: 'Notice that the two failed assumptions push in opposite directions.', gap: 0.5 },
      { say: 'Particle volume makes the real value larger than predicted.', gap: 0.4 },
      { say: 'Attractions make the real pressure smaller than predicted.', gap: 0.5 },
      { say: 'Which one wins depends on the conditions.', gap: 0.4 },
      { say: 'At very high pressure, particle volume tends to win. At low temperature, attractions tend to win.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a memory trick: gases are most ideal when they're hot and lonely.", gap: 0.5 },
      { say: 'Hot means high temperature, so attractions hardly matter.', gap: 0.4 },
      { say: 'Lonely means low pressure, so particle volume is negligible.', gap: 0.6 },
      { say: 'The most ideal gases are also small and nonpolar. Helium is the champion: tiny atoms, very weak dispersion forces.', gap: 0.6 },
      { say: 'The least ideal: low temperature, high pressure, and large or polar particles with strong intermolecular forces.', gap: 0.4 },
      { say: 'Think water vapor or ammonia, which form hydrogen bonds.', gap: 0.6 },
      { say: 'Even among nonpolar gases, size matters. Carbon tetrachloride deviates more than methane, because its molecules are larger, with stronger dispersion forces.', cap: 'Even among nonpolar gases, size matters. CCl₄ deviates more than CH₄, because its molecules are larger, with stronger dispersion forces.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Which gas would deviate most from ideal behavior under the same conditions? Helium, neon, methane, or ammonia?', cap: 'Which gas would deviate most from ideal behavior under the same conditions? He, Ne, CH₄, or NH₃?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is ammonia.', cap: 'The answer is NH₃.', gap: 0.4 },
      { say: 'Ammonia is polar, and it forms hydrogen bonds.', cap: 'NH₃ is polar, and it forms hydrogen bonds.', gap: 0.3 },
      { say: 'Its particles attract each other strongly, so it shows the biggest deviation from ideal behavior.', gap: 0.9 },
    ] },
    { id: 'frq', beats: [
      { say: 'One tip for free response questions.', cap: 'One tip for free-response questions.' },
      { say: 'To explain a deviation, connect three things: the condition, the assumption, and the direction.', gap: 0.5 },
      { say: 'For example: at high pressure, the volume of the gas particles is no longer negligible compared with the container volume, so the measured volume is greater than the ideal gas law predicts.', gap: 0.5 },
      { say: 'Or: at low temperature, attractions between particles reduce the force of collisions with the walls, so the measured pressure is lower than predicted.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'High pressure means particle volume matters, so the actual volume is greater than ideal.', gap: 0.5 },
      { say: 'Low temperature, or strong intermolecular forces, means attractions matter, so the actual pressure is less than ideal.', gap: 0.5 },
      { say: 'And the most ideal gases: high temperature, low pressure, small and nonpolar.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
