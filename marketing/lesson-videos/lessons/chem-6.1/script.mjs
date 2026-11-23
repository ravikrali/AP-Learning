// Narration for chem-6.1 "Endothermic vs. Exothermic". Every fact comes from the lesson cards, quick
// checks and flashcards in app/src/content/chem/u6.ts, plus the lesson's prose in chem/book.ts.
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-6.1',
  title: 'Endothermic vs. Exothermic',
  course: 'AP® Chemistry',
  unit: 'Unit 6 · Thermochemistry',
  unitId: 'chem-u6',
  unitTitle: 'Thermochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Endothermic versus exothermic.', cap: 'Endothermic vs. exothermic.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn which way heat flows, how a thermometer tells you, and what the sign of delta H means.", cap: "In the next few minutes, you'll learn which way heat flows, how a thermometer tells you, and what the sign of ΔH means.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Snap a hand warmer, and it gets hot.', gap: 0.5 },
      { say: 'Squeeze an instant cold pack, and it gets icy.', gap: 0.6 },
      { say: 'One process releases energy. The other absorbs it.', gap: 0.5 },
      { say: 'Chemists call these exothermic and endothermic.', gap: 0.5 },
      { say: 'To tell them apart, you first need to know where to look.', gap: 0.9 },
    ] },
    { id: 'system', beats: [
      { say: 'Every energy question starts with two words: system and surroundings.', gap: 0.5 },
      { say: "The system is the reaction or process you're studying. That's the chemicals.", gap: 0.5 },
      { say: 'The surroundings are everything else: the water, the beaker, your hand.', gap: 0.5 },
      { say: 'Energy moves between the two.', gap: 0.4 },
      { say: 'When the system loses energy, the surroundings gain it. When the system gains energy, the surroundings lose it.', gap: 0.9 },
    ] },
    { id: 'signs', beats: [
      { say: 'In an exothermic process, the system loses energy.', gap: 0.4 },
      { say: 'The surroundings gain it, and they warm up.', gap: 0.4 },
      { say: 'Delta H is less than zero.', cap: 'ΔH < 0.', gap: 0.6 },
      { say: 'In an endothermic process, the system gains energy from the surroundings.', gap: 0.4 },
      { say: 'So the surroundings cool down.', gap: 0.4 },
      { say: 'Delta H is greater than zero.', cap: 'ΔH > 0.', gap: 0.6 },
      { say: 'Here is the key idea: the sign of delta H always describes the system, never the surroundings.', cap: 'Here is the key idea: the sign of ΔH always describes the system, never the surroundings.', gap: 0.5 },
      { say: 'That is why a reaction that heats the water around it has a negative delta H.', cap: 'That is why a reaction that heats the water around it has a negative ΔH.', gap: 0.9 },
    ] },
    { id: 'diagram', beats: [
      { say: 'You can see the same idea on an energy diagram.', gap: 0.4 },
      { say: "It shows the system's energy before and after the process.", gap: 0.5 },
      { say: 'In an exothermic process, the products sit lower than the reactants.', gap: 0.4 },
      { say: 'The difference is released to the surroundings, so delta H is negative.', cap: 'The difference is released to the surroundings, so ΔH is negative.', gap: 0.6 },
      { say: 'In an endothermic process, the products sit higher.', gap: 0.4 },
      { say: 'That energy is absorbed from the surroundings, so delta H is positive.', cap: 'That energy is absorbed from the surroundings, so ΔH is positive.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Now here's a quick trick: follow the thermometer.", gap: 0.5 },
      { say: 'The thermometer sits in the surroundings, in the water, not in the reaction itself.', gap: 0.5 },
      { say: 'If the thermometer goes up, heat flowed out of the system. That is exothermic.', gap: 0.5 },
      { say: 'If the thermometer goes down, heat flowed into the system. That is endothermic.', gap: 0.5 },
      { say: 'To remember it: exit, exothermic. The heat exits the system.', cap: '“Exit = exothermic”: the heat exits the system.', gap: 0.9 },
    ] },
    { id: 'phase', beats: [
      { say: 'Physical changes have a delta H too, not just chemical reactions.', cap: 'Physical changes have a ΔH too, not just chemical reactions.', gap: 0.5 },
      { say: 'Melting and boiling are endothermic.', gap: 0.3 },
      { say: 'Energy has to go in to overcome the attractions between the molecules.', gap: 0.5 },
      { say: 'Freezing and condensing are exothermic. They release energy.', gap: 0.5 },
      { say: 'So ice melting is endothermic, while steam condensing and wood burning both release energy.', gap: 0.9 },
    ] },
    { id: 'dissolve', beats: [
      { say: 'Dissolving can go either way.', gap: 0.4 },
      { say: 'It depends on the balance of interactions.', gap: 0.5 },
      { say: 'Energy is absorbed to separate the solute particles, breaking the solute to solute attractions, and to make room in the solvent.', cap: 'Energy is absorbed to separate the solute particles, breaking the solute–solute attractions, and to make room in the solvent.', gap: 0.5 },
      { say: 'Energy is released when new solute to solvent attractions form, like ion dipole attractions.', cap: 'Energy is released when new solute–solvent attractions form, like ion–dipole attractions.', gap: 0.6 },
      { say: 'If the new attractions are stronger, dissolving is exothermic. Calcium chloride in water heats up.', cap: 'If the new attractions are stronger, dissolving is exothermic. CaCl₂ in water heats up.', gap: 0.5 },
      { say: 'If they are weaker, it is endothermic. Ammonium nitrate in water cools down.', cap: 'If they are weaker, it is endothermic. NH₄NO₃ in water cools down.', gap: 0.4 },
      { say: "That's how cold packs work.", gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'A salt dissolves in water, and the temperature of the solution drops.', gap: 0.3 },
      { say: 'Is the dissolving process exothermic, endothermic, neither, or a physical change with no energy?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is endothermic, with delta H greater than zero.', cap: 'The answer is endothermic, with ΔH > 0.', gap: 0.4 },
      { say: 'The water, which is the surroundings, got colder, because it gave energy to the dissolving process.', gap: 0.4 },
      { say: 'Thermometer down means endothermic.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Exothermic: the system releases heat, the surroundings warm, and delta H is less than zero.', cap: 'Exothermic: the system releases heat, the surroundings warm, and ΔH < 0.', gap: 0.5 },
      { say: 'Endothermic: the system absorbs heat, the surroundings cool, and delta H is greater than zero.', cap: 'Endothermic: the system absorbs heat, the surroundings cool, and ΔH > 0.', gap: 0.5 },
      { say: 'And dissolving can be exothermic or endothermic, depending on the attractions broken versus formed.', cap: 'And dissolving can be exothermic or endothermic, depending on the attractions broken vs. formed.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
