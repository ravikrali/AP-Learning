// Narration for chem-3.8 "Drawing Solutions at the Particle Level". Every fact comes from the lesson
// cards, quick checks and flashcards in app/src/content/chem/u3.ts (hydrated ions, conductivity and
// molecular solutes are from book.ts). One entry per sentence: the voice reads `say`; captions show
// `cap` (or `say`). `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-3.8',
  title: 'Drawing Solutions at the Particle Level',
  course: 'AP® Chemistry',
  unit: 'Unit 3 · Properties of Substances and Mixtures',
  unitId: 'chem-u3',
  unitTitle: 'Properties of Substances and Mixtures',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Drawing solutions at the particle level.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the three rules of a good particle diagram, and a simple trick for drawing the water molecules.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'On the AP exam, you might be asked to draw what a solution looks like up close.', cap: 'On the AP® exam, you might be asked to draw what a solution looks like up close.', gap: 0.5 },
      { say: "A particle diagram shows what you can't see: the separate solute particles, how many there are, and how the water molecules surround them.", gap: 0.5 },
      { say: 'A few simple rules turn that into easy points.', gap: 0.4 },
      { say: "Let's take them one at a time.", gap: 0.8 },
    ] },
    { id: 'ratio', beats: [
      { say: 'Rule one: correct ratios.', gap: 0.4 },
      { say: 'Ionic solutes are drawn as separate ions.', gap: 0.4 },
      { say: 'Take a zero point one molar solution of magnesium chloride.', cap: 'Take a 0.1 M solution of MgCl₂.', gap: 0.4 },
      { say: 'You draw twice as many chloride ions as magnesium ions.', cap: 'You draw twice as many Cl⁻ ions as Mg²⁺ ions.', gap: 0.4 },
      { say: 'And you never draw them stuck together as magnesium chloride molecules.', cap: 'And you never draw them stuck together as "MgCl₂ molecules".', gap: 0.6 },
      { say: 'Potassium sulfate works the same way. It gives two potassium ions for every one sulfate ion.', cap: 'K₂SO₄ works the same way. It gives 2 K⁺ for every 1 SO₄²⁻.', gap: 0.4 },
      { say: "But sulfate is a polyatomic ion, so it stays together. Don't split it into separate sulfur and oxygen atoms.", gap: 0.9 },
    ] },
    { id: 'conc', beats: [
      { say: 'Rule two: relative concentration.', gap: 0.4 },
      { say: 'A more concentrated solution has more solute particles in the same space.', gap: 0.5 },
      { say: 'Beaker A shows four solute particles. Beaker B shows eight, in the same volume.', gap: 0.5 },
      { say: 'Twice as many solute particles in the same volume means double the concentration.', gap: 0.9 },
    ] },
    { id: 'water', beats: [
      { say: 'Rule three: the correct orientation of water.', gap: 0.4 },
      { say: "In a water molecule, the oxygen end is delta minus, and the two hydrogen ends are delta plus.", cap: 'In a water molecule, the O end is δ−, and the two H ends are δ+.', gap: 0.5 },
      { say: "Around a cation, a positive ion, water's oxygen end points toward the ion.", cap: "Around a cation (+), water's O end (δ−) points toward the ion.", gap: 0.5 },
      { say: 'Around an anion, a negative ion, the hydrogen ends point toward the ion.', cap: 'Around an anion (−), the H ends (δ+) point toward the ion.', gap: 0.5 },
      { say: 'These are ion dipole attractions, and they leave each ion surrounded by water molecules.', cap: 'These are ion–dipole attractions, and they leave each ion surrounded by water molecules.', gap: 0.5 },
      { say: "You don't need to draw every water molecule in the beaker. A few around each ion, facing the right way, is enough.", gap: 0.5 },
      { say: 'These hydrated ions move independently, which is why ionic solutions conduct electricity.', gap: 0.9 },
    ] },
    { id: 'molecular', beats: [
      { say: 'Not every solute splits into ions.', gap: 0.4 },
      { say: 'A molecular solute, like glucose or ethanol, dissolves as intact molecules.', gap: 0.4 },
      { say: 'So draw each molecule as a single particle, surrounded by water.', gap: 0.4 },
      { say: 'The molecules carry no net charge, so the solution does not conduct electricity.', gap: 0.5 },
      { say: 'Ions, or molecules? Getting that right is often the main thing a diagram question tests.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a trick to get the water right every time.", gap: 0.4 },
      { say: 'Picture water as a tiny head with two ears.', gap: 0.4 },
      { say: 'The oxygen is the face. It is delta minus.', cap: 'The O is the face. It is δ−.', gap: 0.3 },
      { say: 'The two hydrogen atoms are the ears. They are delta plus.', cap: 'The two H atoms are the ears. They are δ+.', gap: 0.5 },
      { say: 'Cation? Show it the face.', gap: 0.4 },
      { say: 'Anion? Show it the ears.', gap: 0.5 },
      { say: 'Opposites face each other.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: "And now some good news about what's not on the exam.", gap: 0.4 },
      { say: 'The AP exam does not test colligative properties, like freezing point depression.', cap: 'The AP® exam does not test colligative properties, like freezing point depression.', gap: 0.4 },
      { say: 'And it does not ask you to calculate molality, mass percent, or volume percent of solutions.', gap: 0.5 },
      { say: 'Molarity is the star.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'In a correct particle diagram of sodium chloride solution, how should water molecules be oriented around the chloride ion?', cap: 'In a correct particle diagram of NaCl(aq), how should water molecules be oriented around Cl⁻?', gap: 0.3 },
      { say: 'Oxygen atoms pointing toward it. Hydrogen atoms pointing toward it. Randomly. Or should water not be drawn near ions at all?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B: hydrogen atoms pointing toward the chloride ion.', cap: 'The answer is B: hydrogen atoms pointing toward Cl⁻.', gap: 0.4 },
      { say: 'Chloride is negative, so it attracts the delta plus hydrogen ends of water.', cap: 'Cl⁻ is negative, so it attracts the δ+ hydrogen ends of water.', gap: 0.4 },
      { say: 'Anion? Show it the ears.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Show ions separated, in the correct ratio.', gap: 0.5 },
      { say: 'More concentrated means more solute particles per volume.', gap: 0.5 },
      { say: 'And for water: the oxygen end faces cations, and the hydrogen ends face anions.', cap: 'And for water: the O end faces cations, and the H ends face anions.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
