// Narration for chem-2.2 "Bonds & Potential Energy". Every fact comes from the lesson cards in
// app/src/content/chem/u2.ts. One entry per sentence: the voice reads `say`; captions show `cap`
// (or `say` when there is no `cap`). `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-2.2',
  title: 'Bonds & Potential Energy',
  course: 'AP® Chemistry',
  unit: 'Unit 2 · Compound Structure and Properties',
  unitId: 'chem-u2', // with unitTitle, names the folder the video is stored under
  unitTitle: 'Compound Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Bonds and potential energy.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn to read one graph that explains why bonds form, how strong they are, and how long they are.", gap: 0.8 },
    ] },
    { id: 'myth', beats: [
      { say: "Let's start by busting a myth." },
      { say: 'A lot of students think that breaking a bond releases energy.', gap: 0.5 },
      { say: 'It never does.', gap: 0.5 },
      { say: 'Breaking a bond always costs energy.', gap: 0.6 },
      { say: 'Energy is released when a bond forms.', gap: 0.7 },
      { say: 'A potential energy graph makes this crystal clear.', gap: 0.8 },
    ] },
    { id: 'curve', beats: [
      { say: 'Take two hydrogen atoms, and slowly bring them together.' },
      { say: "We'll track their potential energy as the distance between the two nuclei changes.", gap: 0.5 },
      { say: "When the atoms are far apart, they don't interact, so we call the energy zero.", gap: 0.5 },
      { say: "As they move closer, each nucleus attracts the other atom's electron, and the energy drops.", gap: 0.5 },
      { say: 'But push them too close, and the two positive nuclei repel each other. The energy shoots straight up.', gap: 0.6 },
      { say: 'In between is a sweet spot: the bottom of the well.', gap: 0.4 },
      { say: "That's the most stable distance, and it's called the bond length. For hydrogen, it's seventy-four picometers.", cap: "That's the most stable distance, and it's called the bond length. For hydrogen, it's 74 picometers.", gap: 0.6 },
      { say: 'The depth of the well is the bond energy: four hundred thirty-six kilojoules per mole.', cap: 'The depth of the well is the bond energy: 436 kilojoules per mole.', gap: 0.4 },
      { say: "That's the energy you need to pull the atoms apart.", gap: 0.8 },
    ] },
    { id: 'well', beats: [
      { say: 'Now the myth is easy to see.' },
      { say: 'To break the bond, you have to climb out of the well. That takes energy in.', gap: 0.6 },
      { say: 'When the bond forms, the atoms fall into the well, and that same energy is released.', gap: 0.9 },
    ] },
    { id: 'order', beats: [
      { say: 'Next: single, double, and triple bonds.' },
      { say: "The more electron pairs two atoms share, the closer they're pulled, and the tighter they're held.", gap: 0.5 },
      { say: 'A carbon to carbon single bond is one hundred fifty-four picometers long, and takes about three hundred forty-seven kilojoules per mole to break.', cap: 'A carbon–carbon single bond is 154 picometers long, and takes about 347 kilojoules per mole to break.', gap: 0.5 },
      { say: 'The double bond is shorter, one hundred thirty-four picometers, and stronger: about six hundred fourteen.', cap: 'The double bond is shorter, 134 picometers, and stronger: about 614.', gap: 0.5 },
      { say: 'The triple bond is the shortest and strongest of all: one hundred twenty picometers, and about eight hundred thirty-nine kilojoules per mole.', cap: 'The triple bond is the shortest and strongest of all: 120 picometers, and about 839 kilojoules per mole.', gap: 0.6 },
      { say: 'So remember: higher bond order means shorter, and stronger.', gap: 0.7 },
      { say: 'Atom size matters too. Bigger atoms make longer bonds, so the bond in hydrogen iodide is longer than the bond in hydrogen fluoride.', gap: 0.9 },
    ] },
    { id: 'coulomb', beats: [
      { say: "Ionic bonds follow Coulomb's law." },
      { say: 'The attraction between a positive ion and a negative ion gets stronger in two ways.', gap: 0.5 },
      { say: 'One: bigger charges.', gap: 0.3 },
      { say: 'Magnesium oxide, with two plus and two minus ions, is held far more strongly than sodium chloride, with one plus and one minus.', cap: 'Magnesium oxide, with 2+ and 2− ions, is held far more strongly than sodium chloride, with 1+ and 1−.', gap: 0.6 },
      { say: 'Two: smaller ions.', gap: 0.3 },
      { say: 'Smaller ions let the nuclei get closer together, so sodium fluoride is held more strongly than sodium iodide.', gap: 0.6 },
      { say: 'Charge usually matters most, so compare it first. Then compare size.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a quick trick for a classic exam question: which ionic compound has the higher melting point?", gap: 0.5 },
      { say: 'Step one: multiply the charges. The bigger product wins.', gap: 0.5 },
      { say: 'Magnesium oxide: two times two is four. Sodium chloride: one times one is one. So magnesium oxide melts higher.', cap: 'Magnesium oxide: 2 × 2 = 4. Sodium chloride: 1 × 1 = 1. So magnesium oxide melts higher.', gap: 0.6 },
      { say: 'Step two: if the charges tie, the smaller ions win.', gap: 0.5 },
      { say: "That's why sodium fluoride beats sodium chloride, then sodium bromide, then sodium iodide.", gap: 0.3 },
      { say: 'The negative ion gets bigger as you go down the group.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Which of these has the strongest attraction between its ions? Potassium chloride, sodium chloride, calcium oxide, or potassium bromide?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is calcium oxide.', gap: 0.4 },
      { say: 'Its ions are two plus and two minus. All the others are one plus and one minus.', cap: 'Its ions are 2+ and 2−. All the others are 1+ and 1−.', gap: 0.3 },
      { say: 'Bigger charges mean a much stronger attraction.', gap: 0.9 },
    ] },
    { id: 'frq', beats: [
      { say: 'One tip for free response questions.', cap: 'One tip for free-response questions.' },
      { say: "When you're asked to explain using Coulomb's law, name three things: the charges, the distance, and the result.", gap: 0.5 },
      { say: 'For example: the magnesium ion has a greater charge than the sodium ion, and a smaller radius, so its attraction to the oxide ion is greater.', gap: 0.3 },
      { say: 'That gives magnesium oxide a higher melting point.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'On the potential energy curve, the bottom of the well is the bond length, and the depth of the well is the bond energy.', gap: 0.5 },
      { say: 'Breaking bonds costs energy. Forming bonds releases it.', gap: 0.5 },
      { say: 'Higher bond order means shorter, stronger bonds. And ionic attraction is stronger with bigger charges and smaller ions.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
