// Narration for chem-1.4 "Composition of Mixtures". Every fact comes from the lesson cards and
// quick checks in app/src/content/chem/u1.ts (and its book.ts prose). One entry per sentence.
export default {
  id: 'chem-1.4',
  title: 'Composition of Mixtures',
  course: 'AP® Chemistry',
  unit: 'Unit 1 · Atomic Structure and Properties',
  unitId: 'chem-u1',
  unitTitle: 'Atomic Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Composition of mixtures.', gap: 0.5 },
      { say: "In the next few minutes, you'll see how a pure substance differs from a mixture, how to check a sample's purity, and how to tell what kind of impurity is present.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'A company claims its supplement is pure.' },
      { say: 'How could you check, without seeing the atoms?', gap: 0.5 },
      { say: 'Measure how much of one element a sample contains.', gap: 0.5 },
      { say: 'Then compare it to what the pure compound should contain.', gap: 0.9 },
    ] },
    { id: 'pure', beats: [
      { say: 'First, two definitions.' },
      { say: 'A pure substance has only one type of atom, molecule, or formula unit. Its composition is fixed.', gap: 0.5 },
      { say: 'A mixture has two or more types mixed together, in proportions that can vary.', gap: 0.6 },
      { say: 'Salt water can be one percent salt, or twenty percent salt. It is still salt water.', cap: 'Salt water can be 1% salt, or 20% salt. It is still salt water.', gap: 0.5 },
      { say: 'But pure sodium chloride is always sixty point seven percent chlorine by mass.', cap: 'But pure NaCl is always 60.7% chlorine by mass.', gap: 0.9 },
    ] },
    { id: 'check', beats: [
      { say: 'This gives us a purity test, called elemental analysis.' },
      { say: 'Compare the measured mass percent of an element with the theoretical value for the pure compound.', gap: 0.5 },
      { say: "If they match, the sample is consistent with being pure.", gap: 0.5 },
      { say: "If they don't match, there is something else in the sample.", gap: 0.5 },
      { say: 'And which way it is off tells you what kind of impurity is present.', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: 'Try an example. How pure is this salt?' },
      { say: 'A two point zero zero gram sample contains sodium chloride, plus an impurity that has no chlorine.', cap: 'A 2.00 g sample contains NaCl, plus an impurity that has no chlorine.', gap: 0.5 },
      { say: 'Analysis finds zero point nine zero zero grams of chlorine.', cap: 'Analysis finds 0.900 g of chlorine.', gap: 0.5 },
      { say: 'What percent of the sample is sodium chloride?', cap: 'What percent of the sample is NaCl?', gap: 0.9 },
    ] },
    { id: 'steps', beats: [
      { say: 'Step one. Pure sodium chloride is thirty-five point four five over fifty-eight point four four. That is sixty point six six percent chlorine by mass.', cap: 'Step 1. Pure NaCl is 35.45 / 58.44. That is 60.66% chlorine by mass.', gap: 0.6 },
      { say: 'Step two. Find the mass of sodium chloride that would contain zero point nine zero zero grams of chlorine.', cap: 'Step 2. Find the mass of NaCl that would contain 0.900 g of chlorine.', gap: 0.4 },
      { say: 'Multiply by fifty-eight point four four grams of sodium chloride, per thirty-five point four five grams of chlorine.', cap: 'Multiply by 58.44 g NaCl per 35.45 g Cl.', gap: 0.4 },
      { say: 'That gives one point four eight grams of sodium chloride.', cap: 'That gives 1.48 g of NaCl.', gap: 0.6 },
      { say: 'Step three. Divide by the sample mass, two point zero zero grams, and multiply by one hundred.', cap: 'Step 3. Divide by the sample mass, 2.00 g, and multiply by 100.', gap: 0.5 },
      { say: 'The sample is about seventy-four point two percent sodium chloride.', cap: 'The sample is about 74.2% NaCl.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a quick trick: too high, or too low?", gap: 0.5 },
      { say: 'If the measured percent of an element is higher than in the pure compound, the impurity contains more of that element, by mass percent.', gap: 0.5 },
      { say: 'If it is lower, the impurity contains less of it, or none.', gap: 0.5 },
      { say: 'This comparison alone answers a lot of multiple-choice questions on the exam.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Pure potassium chloride is forty-seven point six percent chlorine by mass. A pure potassium chloride sample tests at fifty-two point zero percent chlorine. Which impurity could explain this?', cap: 'Pure KCl is 47.6% Cl by mass. A "pure KCl" sample tests at 52.0% Cl. Which impurity could explain this?', gap: 0.4 },
      { say: 'A: sodium chloride, sixty point seven percent chlorine. B: potassium bromide, zero percent. C: potassium iodide, zero percent. Or D: sand, silicon dioxide, zero percent.', cap: 'A: NaCl, 60.7% Cl. B: KBr, 0%. C: KI, 0%. Or D: sand, SiO₂, 0%.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is A.', gap: 0.4 },
      { say: 'Raising the chlorine percent above forty-seven point six needs an impurity with a higher chlorine percent than potassium chloride.', cap: 'Raising the Cl% above 47.6% needs an impurity with a higher Cl% than KCl.', gap: 0.3 },
      { say: 'Only sodium chloride does that. The others contain no chlorine, and would lower the percentage.', cap: 'Only NaCl does that. The others contain no Cl, and would lower the percentage.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Pure substances have fixed composition. Mixtures can vary.', gap: 0.5 },
      { say: 'Compare measured versus theoretical mass percent to judge purity.', gap: 0.5 },
      { say: 'Higher percent means the impurity is richer in that element. Lower percent means it is poorer.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
