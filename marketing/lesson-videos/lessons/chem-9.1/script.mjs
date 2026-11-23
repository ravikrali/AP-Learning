// Narration for chem-9.1 "Introduction to Entropy". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u9.ts: entropy = dispersal of matter and energy; S rises for s -> l -> g,
// larger gas volume (constant T), more gas moles, higher T (KE distribution broadens), usually on dissolving;
// the gas-mole trick with the H2O2 example; the CaCO3 check; the N2 + 3H2 try; the three summary points.
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-9.1',
  title: 'Introduction to Entropy',
  course: 'AP® Chemistry',
  unit: 'Unit 9 · Thermodynamics and Electrochemistry',
  unitId: 'chem-u9',
  unitTitle: 'Thermodynamics and Electrochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Introduction to Entropy.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what entropy measures, what makes it go up, and the fastest way to predict its sign for a reaction.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Open a bottle of perfume in a room.', gap: 0.4 },
      { say: 'Soon, the whole room smells of it.', gap: 0.4 },
      { say: 'The perfume molecules spread out through the air.', gap: 0.4 },
      { say: 'And they never gather back into the bottle on their own.', gap: 0.5 },
      { say: 'Nature tends toward spreading out.', gap: 0.4 },
      { say: 'Entropy, written as a capital S, measures that spreading.', cap: 'Entropy (S) measures that spreading.', gap: 0.8 },
    ] },
    { id: 'meaning', beats: [
      { say: 'So what exactly is entropy?', gap: 0.4 },
      { say: 'Entropy is a measure of the dispersal of matter and energy.', gap: 0.5 },
      { say: 'Dispersal just means how spread out something is.', gap: 0.4 },
      { say: 'When matter becomes more spread out, entropy increases.', gap: 0.4 },
      { say: 'When energy becomes more spread out, entropy increases too.', gap: 0.5 },
      { say: "Let's look at the ways that happens.", gap: 0.8 },
    ] },
    { id: 'phases', beats: [
      { say: 'First, phase changes.', gap: 0.4 },
      { say: 'When a solid melts into a liquid, its particles become freer to move.', gap: 0.4 },
      { say: 'When a liquid becomes a gas, the particles are freer still, and they fill a much larger volume.', gap: 0.5 },
      { say: 'So entropy goes up from solid, to liquid, to gas.', gap: 0.4 },
      { say: 'And the jump to gas is the big one. The entropy of a gas is much greater than that of a liquid, which is greater than that of a solid.', cap: 'And the jump to gas is the big one: S(gas) ≫ S(liquid) > S(solid).', gap: 0.5 },
      { say: 'So for water, the gas has the highest standard molar entropy of the three.', cap: 'So for water, H₂O(g) has the highest standard molar entropy of the three.', gap: 0.8 },
    ] },
    { id: 'more', beats: [
      { say: 'Here are three more ways entropy goes up.', gap: 0.4 },
      { say: 'Give a gas a bigger volume at constant temperature, and its particles have more space to move in.', gap: 0.4 },
      { say: 'More space means more dispersal, so entropy increases.', gap: 0.5 },
      { say: 'Raise the temperature, and the distribution of kinetic energies gets broader.', gap: 0.4 },
      { say: 'The energy is more spread out, so entropy increases.', gap: 0.5 },
      { say: 'And dissolving a solid usually increases entropy, because the solute particles become more dispersed.', gap: 0.8 },
    ] },
    { id: 'gas', beats: [
      { say: 'Now for reactions.', gap: 0.4 },
      { say: 'Watch the moles of gas on each side of the arrow.', gap: 0.4 },
      { say: 'Gas particles are the most spread out of all.', gap: 0.4 },
      { say: 'So when the products have more moles of gas than the reactants, entropy increases.', gap: 0.5 },
      { say: 'And when the products have fewer moles of gas, entropy decreases.', gap: 0.8 },
    ] },
    { id: 'trick', beats: [
      { say: "Here's the trick: count the gas moles first.", gap: 0.4 },
      { say: 'Delta n gas equals the moles of gas products, minus the moles of gas reactants.', cap: 'Δn(gas) = (moles of gas products) − (moles of gas reactants).', gap: 0.5 },
      { say: 'If delta n gas is positive, delta S is positive.', cap: 'If Δn(gas) > 0, then ΔS > 0.', gap: 0.4 },
      { say: 'If delta n gas is negative, delta S is negative.', cap: 'If Δn(gas) < 0, then ΔS < 0.', gap: 0.5 },
      { say: 'Try it on hydrogen peroxide breaking down into water and oxygen.', cap: 'Try it on 2H₂O₂(l) → 2H₂O(l) + O₂(g).', gap: 0.4 },
      { say: 'The reactant is a liquid, so zero moles of gas. The products include one mole of oxygen gas.', cap: 'The reactant is a liquid, so 0 mol of gas. The products include 1 mol of O₂ gas.', gap: 0.4 },
      { say: 'Zero to one. Delta n gas is positive, so delta S is positive.', cap: '0 → 1. Δn(gas) > 0, so ΔS > 0.', gap: 0.5 },
      { say: 'Now calcium carbonate, a solid, breaking down into calcium oxide and carbon dioxide gas.', cap: 'Now CaCO₃(s) → CaO(s) + CO₂(g).', gap: 0.4 },
      { say: 'A gas forms from a solid. Zero to one again, so delta S is positive.', cap: 'A gas forms from a solid. 0 → 1 again, so ΔS > 0.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Which process has a negative delta S? A, ice melting. B, water evaporating. C, nitrogen gas plus three hydrogen gas, making two ammonia gas. D, dry ice subliming.', cap: 'Which process has ΔS < 0? A) ice melting B) water evaporating C) N₂(g) + 3H₂(g) → 2NH₃(g) D) dry ice subliming', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is C.', gap: 0.4 },
      { say: 'Four moles of gas become two moles of gas. Fewer gas particles means less dispersal, so delta S is negative.', cap: '4 mol of gas → 2 mol of gas. Fewer gas particles means less dispersal, so ΔS < 0.', gap: 0.4 },
      { say: 'The other three all increase dispersal.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Entropy measures the dispersal of matter and energy.', gap: 0.5 },
      { say: 'It increases from solid to liquid to gas, with a larger volume, with more moles of gas, and at a higher temperature.', gap: 0.5 },
      { say: 'And counting the gas moles is the quickest way to predict the sign of delta S.', cap: 'And Δn(gas) is the quickest way to predict the sign of ΔS.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
