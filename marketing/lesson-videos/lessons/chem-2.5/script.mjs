// Narration for chem-2.5 "Lewis Diagrams". Every fact comes from the lesson cards in
// app/src/content/chem/u2.ts. One entry per sentence: the voice reads `say`; captions show `cap`
// (or `say` when there is no `cap`). `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-2.5',
  title: 'Lewis Diagrams',
  course: 'AP® Chemistry',
  unit: 'Unit 2 · Compound Structure and Properties',
  unitId: 'chem-u2', // with unitTitle, names the folder the video is stored under
  unitTitle: 'Compound Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Lewis diagrams.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn a five step recipe for drawing them, the exceptions to the octet rule, and the number one mistake to avoid.", cap: "In the next few minutes, you'll learn a five-step recipe for drawing them, the exceptions to the octet rule, and the number one mistake to avoid.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "A Lewis diagram is a map of a molecule's valence electrons.", gap: 0.5 },
      { say: 'It shows them as bonds, drawn as lines, and lone pairs, drawn as dots.', gap: 0.6 },
      { say: "Once you can draw one, you can predict the molecule's shape, its polarity, and even its boiling point.", gap: 0.5 },
      { say: "It's the most used drawing in the whole course.", cap: "It's the most-used drawing in the whole course.", gap: 0.9 },
    ] },
    { id: 'recipe', beats: [
      { say: "Here's the five step recipe.", cap: "Here's the five-step recipe." },
      { say: 'Step one: count the total valence electrons. Add one for each negative charge, and subtract one for each positive charge.', gap: 0.6 },
      { say: 'Step two: the skeleton. Put the least electronegative atom in the center. Never hydrogen, because hydrogen only forms one bond.', gap: 0.4 },
      { say: 'Then connect the atoms with single bonds. Each bond is two electrons.', gap: 0.6 },
      { say: 'Step three: outer atoms first. Give each outer atom a full octet. Hydrogen gets just two.', gap: 0.6 },
      { say: 'Step four: leftover electrons go on the central atom, as lone pairs.', gap: 0.6 },
      { say: 'Step five: if the central atom is short of an octet, turn lone pairs from the outer atoms into double or triple bonds.', gap: 0.9 },
    ] },
    { id: 'co2', beats: [
      { say: "Let's try the recipe on carbon dioxide." },
      { say: 'Count. Carbon has four valence electrons. Each oxygen has six, so two oxygens give twelve. The total is sixteen.', cap: 'Count. Carbon has 4 valence electrons. Each oxygen has 6, so two oxygens give 12. The total is 16.', gap: 0.6 },
      { say: 'Skeleton. Carbon sits in the center, with a single bond to each oxygen. That uses four electrons, leaving twelve.', cap: 'Skeleton. Carbon sits in the center, with a single bond to each oxygen. That uses 4 electrons, leaving 12.', gap: 0.6 },
      { say: 'Outer atoms first. Give each oxygen three lone pairs. That is six electrons each, so all twelve are used.', cap: 'Outer atoms first. Give each oxygen three lone pairs. That is 6 electrons each, so all 12 are used.', gap: 0.6 },
      { say: 'Nothing is left over. But carbon has only four electrons around it.', cap: 'Nothing is left over. But carbon has only 4 electrons around it.', gap: 0.5 },
      { say: 'So move one lone pair from each oxygen into a bond.', gap: 0.6 },
      { say: 'Now there are two double bonds, with two lone pairs on each oxygen, and none on carbon.', gap: 0.6 },
      { say: 'Check: each atom has eight electrons, and the total is still sixteen.', cap: 'Check: each atom has 8 electrons, and the total is still 16.', gap: 0.9 },
    ] },
    { id: 'exceptions', beats: [
      { say: 'The octet rule is a model, and it has exceptions.', gap: 0.5 },
      { say: 'One: fewer than eight. In boron trifluoride, boron has only six electrons.', cap: 'One: fewer than 8. In boron trifluoride, BF₃, boron has only 6 electrons.', gap: 0.6 },
      { say: 'Two: more than eight. Atoms in period three or below can have expanded octets.', cap: 'Two: more than 8. Atoms in period 3 or below can have expanded octets.', gap: 0.5 },
      { say: 'Sulfur in sulfur hexafluoride has twelve electrons. Phosphorus in phosphorus pentachloride has ten.', cap: 'Sulfur in sulfur hexafluoride, SF₆, has 12 electrons. Phosphorus in phosphorus pentachloride, PCl₅, has 10.', gap: 0.6 },
      { say: 'Three: an odd number of electrons. Nitrogen monoxide has eleven valence electrons, so not every atom can have an octet.', cap: 'Three: an odd number of electrons. Nitrogen monoxide, NO, has 11 valence electrons, so not every atom can have an octet.', gap: 0.5 },
      { say: 'The Lewis model has limitations with odd electron species.', cap: 'The Lewis model has limitations with odd-electron species.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a quick way to check a drawing: the honk, one two three four rule.", cap: "Here's a quick way to check a drawing: the HONC 1234 rule.", gap: 0.5 },
      { say: 'In neutral, organic style molecules, atoms usually make this many bonds.', cap: 'In neutral, organic-style molecules, atoms usually make this many bonds.', gap: 0.4 },
      { say: 'Hydrogen, one. Oxygen, two. Nitrogen, three. Carbon, four.', cap: 'Hydrogen, 1. Oxygen, 2. Nitrogen, 3. Carbon, 4.', gap: 0.6 },
      { say: 'If your drawing gives carbon five bonds, or oxygen three, recheck it, or expect a formal charge. Formal charge comes in the next lessons.', cap: 'If your drawing gives carbon 5 bonds, or oxygen 3, recheck it, or expect a formal charge. Formal charge comes in the next lessons.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, the number one Lewis mistake: forgetting the charge on an ion.', gap: 0.5 },
      { say: 'Negative means add electrons. Positive means subtract.', gap: 0.6 },
      { say: 'Take the ammonium ion. Nitrogen brings five electrons, the four hydrogens bring four, and the positive charge takes one away.', cap: 'Take the ammonium ion, NH₄⁺. Nitrogen brings 5 electrons, the four hydrogens bring 4, and the positive charge takes 1 away.', gap: 0.5 },
      { say: 'Five plus four, minus one, is eight electrons.', cap: '5 + 4 − 1 = 8 electrons.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'How many total valence electrons are in the nitrate ion? Twenty-two, twenty-three, twenty-four, or twenty-five?', cap: 'How many total valence electrons are in the nitrate ion, NO₃⁻? 22, 23, 24, or 25?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is twenty-four.', cap: 'The answer is 24.', gap: 0.4 },
      { say: 'Nitrogen has five, and three oxygens with six each give eighteen. That makes twenty-three.', cap: 'Nitrogen has 5, and three oxygens with 6 each give 18. That makes 23.', gap: 0.4 },
      { say: 'Then add one for the negative charge.', cap: 'Then add 1 for the negative charge.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Count the valence electrons, and adjust for charge. Then: skeleton, outer octets, leftovers, and multiple bonds if needed.', gap: 0.5 },
      { say: 'The least electronegative atom goes in the center. Never hydrogen.', gap: 0.5 },
      { say: 'And know the exceptions: six electrons on boron in boron trifluoride, expanded octets in period three and below, and odd electron molecules.', cap: 'And know the exceptions: 6 electrons on boron in BF₃, expanded octets in period 3 and below, and odd-electron molecules.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
