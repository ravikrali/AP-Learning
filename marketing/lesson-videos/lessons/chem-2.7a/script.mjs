// Narration for chem-2.7a "VSEPR: Shapes of Molecules". Every fact comes from the lesson cards and
// quick checks in app/src/content/chem/u2.ts (and its book.ts prose). One entry per sentence: the
// voice reads `say`; captions show `cap` (or `say`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-2.7a',
  title: 'VSEPR: Shapes of Molecules',
  course: 'AP® Chemistry',
  unit: 'Unit 2 · Compound Structure and Properties',
  unitId: 'chem-u2',
  unitTitle: 'Compound Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'V S E P R: shapes of molecules.', cap: 'VSEPR: shapes of molecules.', gap: 0.5 },
      { say: "In the next few minutes, you'll see how electron domains decide a molecule's shape, how to read the shape table, and why lone pairs squeeze bond angles.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Why is water bent instead of straight?', gap: 0.5 },
      { say: 'If it were straight, it would be nonpolar.', gap: 0.5 },
      { say: "And water wouldn't dissolve salt, form oceans, or keep you alive.", gap: 0.5 },
      { say: 'Shape is destiny in chemistry.', gap: 0.5 },
      { say: "Let's see how to predict it.", gap: 0.8 },
    ] },
    { id: 'vsepr', beats: [
      { say: "Here's the whole idea in one sentence.", gap: 0.4 },
      { say: 'Electron domains around the central atom spread out as far apart as possible, because electron pairs repel each other.', gap: 0.6 },
      { say: 'An electron domain is a lone pair, a single bond, a double bond, or a triple bond.', gap: 0.5 },
      { say: 'A multiple bond counts as one domain.', gap: 0.6 },
      { say: 'First, count the domains to get the electron geometry.', gap: 0.4 },
      { say: 'Then look at atoms only, to name the molecular shape.', gap: 0.9 },
    ] },
    { id: 'shapes', beats: [
      { say: "Here's the shape table.", gap: 0.5 },
      { say: 'Two domains, no lone pairs: linear, one hundred eighty degrees, like C O two.', cap: 'Two domains, no lone pairs: linear, 180°, like CO₂.', gap: 0.5 },
      { say: 'Three domains, no lone pairs: trigonal planar, one hundred twenty degrees, like B F three.', cap: 'Three domains, no lone pairs: trigonal planar, 120°, like BF₃.', gap: 0.5 },
      { say: 'Add a lone pair, and it becomes bent, with an angle under one hundred twenty degrees, like S O two.', cap: 'Add a lone pair, and it becomes bent, with an angle under 120°, like SO₂.', gap: 0.5 },
      { say: 'Four domains, no lone pairs: tetrahedral, one hundred nine point five degrees, like C H four.', cap: 'Four domains, no lone pairs: tetrahedral, 109.5°, like CH₄.', gap: 0.5 },
      { say: 'One lone pair gives trigonal pyramidal, like N H three. Two lone pairs give bent, like H two O.', cap: 'One lone pair gives trigonal pyramidal, like NH₃. Two lone pairs give bent, like H₂O.', gap: 0.5 },
      { say: 'Five and six domains have their own shapes too: trigonal bipyramidal, seesaw, T-shaped, octahedral, square pyramidal, and square planar.', gap: 0.9 },
    ] },
    { id: 'fat', beats: [
      { say: "Here's a trick for the angles.", gap: 0.4 },
      { say: 'Lone pairs are fat. They take up more space than bonding pairs.', gap: 0.5 },
      { say: 'So they squeeze the bond angles smaller.', gap: 0.5 },
      { say: 'Look at four domains. C H four has no lone pairs: one hundred nine point five degrees.', cap: 'Look at four domains. CH₄ has no lone pairs: 109.5°.', gap: 0.5 },
      { say: 'N H three has one lone pair: about one hundred seven degrees.', cap: 'NH₃ has one lone pair: about 107°.', gap: 0.5 },
      { say: 'H two O has two lone pairs: about one hundred four point five degrees.', cap: 'H₂O has two lone pairs: about 104.5°.', gap: 0.5 },
      { say: 'Each extra lone pair on a tetrahedral arrangement squeezes the angle a bit more.', gap: 0.9 },
    ] },
    { id: 'nh3', beats: [
      { say: "Let's predict the shape of N H three.", cap: "Let's predict the shape of NH₃.", gap: 0.5 },
      { say: 'The Lewis diagram shows nitrogen with three bonds to hydrogen, and one lone pair.', gap: 0.5 },
      { say: 'Three bonds plus one lone pair is four domains. That means a tetrahedral electron geometry.', gap: 0.5 },
      { say: 'Now name the shape by atoms only. Three atoms around nitrogen, in a pyramid: trigonal pyramidal.', gap: 0.5 },
      { say: 'The lone pair squeezes the angles, so it is about one hundred seven degrees, a bit less than one hundred nine point five.', cap: 'The lone pair squeezes the angles, so it is about 107°, a bit less than 109.5°.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: "Here's a classic trap.", gap: 0.4 },
      { say: 'Students often call C O two and H two O the same shape, because both are A X two.', cap: 'Students often call CO₂ and H₂O the same shape, because both are AX₂.', gap: 0.5 },
      { say: 'But H two O has two lone pairs on oxygen. That is four domains, so it is bent.', cap: 'But H₂O has two lone pairs on oxygen. That is four domains, so it is bent.', gap: 0.5 },
      { say: 'C O two has none on carbon. That is two domains, so it is linear.', cap: 'CO₂ has none on carbon. That is two domains, so it is linear.', gap: 0.5 },
      { say: 'Always draw the Lewis diagram first.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'What is the molecular shape of S O two? The sulfur has one lone pair and is bonded to two oxygen atoms. A: linear. B: bent. C: trigonal planar. Or D: tetrahedral.', cap: 'What is the molecular shape of SO₂? The sulfur has one lone pair and is bonded to two oxygen atoms. A: linear. B: bent. C: trigonal planar. Or D: tetrahedral.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B, bent.', gap: 0.4 },
      { say: 'Count the domains: two bonds plus one lone pair is three. That is a trigonal planar electron geometry.', gap: 0.3 },
      { say: 'With atoms only, it is bent, with an angle a little under one hundred twenty degrees.', cap: 'With atoms only, it is bent, with an angle a little under 120°.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'One: count the electron domains. A multiple bond is one domain. Domains spread out as far as they can.', gap: 0.5 },
      { say: 'Two: name the shape using atoms only. Lone pairs are invisible, but they take up space.', gap: 0.5 },
      { say: 'Three: lone pairs shrink bond angles, from one hundred nine point five, to one hundred seven, to one hundred four point five degrees.', cap: 'Three: lone pairs shrink bond angles, from 109.5°, to 107°, to 104.5°.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
