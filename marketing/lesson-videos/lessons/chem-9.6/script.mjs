// Narration for chem-9.6 "Free Energy of Dissolution". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u9.ts, plus chem/book.ts (lattice vs hydration are the two largest
// enthalpy terms, opposite in sign, both grow with ion charge and shrink with ion size, so for many salts they
// nearly cancel; water ordering works against dissolving, especially for small, highly charged ions).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-9.6',
  title: 'Free Energy of Dissolution',
  course: 'AP® Chemistry',
  unit: 'Unit 9 · Thermodynamics and Electrochemistry',
  unitId: 'chem-u9',
  unitTitle: 'Thermodynamics and Electrochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Free energy of dissolution.', gap: 0.5 },
      { say: "In the next few minutes, you'll see the three things that happen when a salt dissolves, why their effects partly cancel, and how a salt can dissolve even when the water gets colder.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Drop some salts into water, and the water gets colder.', gap: 0.4 },
      { say: "That means dissolving absorbs heat. It's endothermic, an uphill process.", gap: 0.4 },
      { say: 'Yet these salts still dissolve readily.', gap: 0.4 },
      { say: 'How can an uphill process be favored?', gap: 0.5 },
      { say: 'Entropy to the rescue.', gap: 0.8 },
    ] },
    { id: 'lattice', beats: [
      { say: 'Three things happen when a salt dissolves. First, the solid breaks up.', gap: 0.4 },
      { say: 'The ions must overcome the attractions holding the lattice together.', gap: 0.4 },
      { say: 'That costs energy, so delta H for this step is positive.', cap: 'That costs energy, so ΔH for this step is positive.', gap: 0.4 },
      { say: 'And the ions become more dispersed, so delta S is positive.', cap: 'And the ions become more dispersed, so ΔS is positive.', gap: 0.4 },
      { say: 'Freeing ions from a crystal greatly increases their dispersal, and that favors dissolving.', gap: 0.8 },
    ] },
    { id: 'water', beats: [
      { say: 'Second, the solvent reorganizes around the ions.', gap: 0.4 },
      { say: 'Water molecules cluster around each ion, and some of them become more ordered.', gap: 0.4 },
      { say: 'That often makes delta S negative, especially for small, highly charged ions.', cap: 'That often makes ΔS negative, especially for small, highly charged ions.', gap: 0.5 },
      { say: 'Third, ion solvent attractions form. These are ion dipole attractions.', cap: 'Third, ion–solvent attractions form. These are ion–dipole attractions.', gap: 0.4 },
      { say: 'Forming attractions releases energy, so delta H for this step is negative.', cap: 'Forming attractions releases energy, so ΔH for this step is negative.', gap: 0.5 },
      { say: 'Remember: breaking attractions costs energy. Forming them releases it.', gap: 0.8 },
    ] },
    { id: 'balance', beats: [
      { say: 'Delta G of dissolution is the sum of these contributions.', cap: 'ΔG° of dissolution is the sum of these contributions.', gap: 0.4 },
      { say: 'The two biggest enthalpy terms have opposite signs: breaking the lattice costs energy, and hydration releases it.', gap: 0.4 },
      { say: 'Both grow with ion charge and shrink with ion size, so for many salts they nearly cancel.', gap: 0.5 },
      { say: 'The entropy terms pull in opposite directions too.', gap: 0.4 },
      { say: 'Because the contributions partly cancel, predicting the overall result is often hard.', gap: 0.4 },
      { say: "That's why some salts dissolve and others don't.", gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Here's a classic example: sodium nitrate in water.", cap: "Here's a classic example: NaNO₃ in water.", gap: 0.4 },
      { say: 'Dissolving it makes the water colder, yet sodium nitrate is very soluble.', cap: 'Dissolving it makes the water colder, yet NaNO₃ is very soluble.', gap: 0.5 },
      { say: 'The water cools, so the process absorbs heat. Delta H is positive, which is unfavorable.', cap: 'The water cools, so the process absorbs heat. ΔH > 0, which is unfavorable.', gap: 0.4 },
      { say: 'The ions spread out from an ordered lattice into solution. Delta S is positive, which is favorable.', cap: 'The ions spread out from an ordered lattice into solution. ΔS > 0, which is favorable.', gap: 0.4 },
      { say: 'At room temperature, T delta S is bigger than delta H.', cap: 'At room temperature, TΔS > ΔH.', gap: 0.4 },
      { say: 'So delta G, which is delta H minus T delta S, is negative, and dissolving is favored.', cap: 'So ΔG = ΔH − TΔS < 0, and dissolving is favored.', gap: 0.4 },
      { say: 'Dissolving sodium nitrate is entropy driven.', cap: 'Dissolving NaNO₃ is entropy-driven.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: "Now the trap: don't let the thermometer decide for you." },
      { say: 'A colder solution tells you the sign of delta H. It does not tell you the sign of delta G.', cap: 'A colder solution tells you the sign of ΔH. It does not tell you the sign of ΔG.', gap: 0.5 },
      { say: 'Endothermic dissolving can still be favored, if delta S is positive and T delta S is bigger than delta H.', cap: 'Endothermic dissolving can still be favored, if ΔS > 0 and TΔS > ΔH.', gap: 0.5 },
      { say: 'So if a salt is endothermic but very soluble, delta S must be positive.', cap: 'So if a salt is endothermic but very soluble, ΔS must be positive.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'A salt dissolves readily, and the solution gets warmer. Which must be true?', gap: 0.3 },
      { say: 'A, delta H is greater than zero. B, delta H is less than zero. C, delta S must be negative. Or D, delta G is greater than zero.', cap: 'A: ΔH > 0. B: ΔH < 0 for the dissolution. C: ΔS must be negative. D: ΔG > 0.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B: delta H is less than zero.', cap: 'The answer is B: ΔH < 0.', gap: 0.5 },
      { say: 'The solution warms, so heat is released, and delta H is negative.', cap: 'The solution warms, so heat is released: ΔH < 0.', gap: 0.4 },
      { say: 'And since the salt dissolves readily, delta G is negative too.', cap: 'And since the salt dissolves readily, ΔG < 0 too.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Dissolving means breaking the lattice, which costs energy, reorganizing the solvent, and forming ion solvent attractions, which releases energy.', cap: 'Dissolving = break the lattice (+ΔH) + reorganize the solvent + form ion–solvent attractions (−ΔH).', gap: 0.5 },
      { say: 'These contributions partly cancel, so delta G is hard to predict.', cap: 'These contributions partly cancel, so ΔG is hard to predict.', gap: 0.5 },
      { say: 'And endothermic dissolving can still be favored if delta S is positive, like sodium nitrate.', cap: 'And endothermic dissolving can still be favored if ΔS > 0, like NaNO₃.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
