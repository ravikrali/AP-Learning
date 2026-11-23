// Narration for chem-2.7b "Hybridization, Sigma/Pi Bonds & Polarity". Every fact comes from the lesson cards in
// app/src/content/chem/u2.ts. One entry per sentence: the voice reads `say`; captions show `cap`
// (or `say` when there is no `cap`). `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-2.7b',
  title: 'Hybridization, Sigma/Pi Bonds & Polarity',
  course: 'AP® Chemistry',
  unit: 'Unit 2 · Compound Structure and Properties',
  unitId: 'chem-u2', // with unitTitle, names the folder the video is stored under
  unitTitle: 'Compound Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Hybridization, sigma and pi bonds, and polarity.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn how to name hybridization from electron domains, how to count sigma and pi bonds, and how to tell when a molecule is polar.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "Two molecules can have the same polar bonds, yet one is polar and the other isn't.", gap: 0.5 },
      { say: "It's all about symmetry.", gap: 0.5 },
      { say: 'Think of a tug of war, where equal teams pull in opposite directions.', cap: 'Think of a tug-of-war, where equal teams pull in opposite directions.', gap: 0.6 },
      { say: "Keep that picture in mind. We'll come back to it.", gap: 0.9 },
    ] },
    { id: 'hybrid', beats: [
      { say: 'First, hybridization.', gap: 0.4 },
      { say: 'On the AP exam, hybridization is a naming code for the number of electron domains.', cap: 'On the AP® exam, hybridization is a naming code for the number of electron domains.', gap: 0.6 },
      { say: 'Two domains: S P. The ideal angle is one hundred eighty degrees.', cap: 'Two domains: sp. The ideal angle is 180°.', gap: 0.5 },
      { say: 'Three domains: S P two, at one hundred twenty degrees.', cap: 'Three domains: sp², at 120°.', gap: 0.5 },
      { say: 'Four domains: S P three, at one hundred nine point five degrees.', cap: 'Four domains: sp³, at 109.5°.', gap: 0.6 },
      { say: "You don't need to draw hybrid orbitals. And hybridization involving D orbitals, with five or six domains, isn't tested. For those, just know the shape.", cap: "You don't need to draw hybrid orbitals. And hybridization involving d orbitals, with 5 or 6 domains, isn't tested. For those, just know the shape.", gap: 0.9 },
    ] },
    { id: 'bonds', beats: [
      { say: 'Next, sigma and pi bonds.', gap: 0.4 },
      { say: 'A single bond is one sigma bond.', cap: 'A single bond is 1 σ bond.', gap: 0.4 },
      { say: 'A double bond is one sigma plus one pi.', cap: 'A double bond is 1 σ + 1 π.', gap: 0.4 },
      { say: 'A triple bond is one sigma plus two pi.', cap: 'A triple bond is 1 σ + 2 π.', gap: 0.6 },
      { say: 'Sigma bonds come from head on overlap, which is stronger. Pi bonds come from side by side overlap, which is weaker.', cap: 'Sigma bonds come from head-on overlap, which is stronger. Pi bonds come from side-by-side overlap, which is weaker.', gap: 0.4 },
      { say: 'So a sigma bond has greater bond energy than a pi bond.', gap: 0.6 },
      { say: 'A pi bond also locks rotation around the bond. That makes cis and trans, or geometric, isomers possible around a carbon double bond.', cap: 'A π bond also locks rotation around the bond. That makes cis/trans (geometric) isomers possible around C=C.', gap: 0.9 },
    ] },
    { id: 'polar', beats: [
      { say: 'Now, is the molecule polar?', gap: 0.4 },
      { say: "A molecule has a dipole moment, so it's polar, if it has polar bonds, and its shape is not symmetric, so the bond dipoles don't cancel.", gap: 0.6 },
      { say: 'Carbon dioxide has polar bonds, but it is symmetric and linear. Nonpolar.', cap: 'Carbon dioxide, CO₂, has polar bonds, but it is symmetric and linear. Nonpolar.', gap: 0.5 },
      { say: 'Water is bent, so not symmetric. Polar.', cap: 'Water, H₂O, is bent, so not symmetric. Polar.', gap: 0.5 },
      { say: 'Carbon tetrachloride is a symmetric tetrahedron. Nonpolar.', cap: 'Carbon tetrachloride, CCl₄, is a symmetric tetrahedron. Nonpolar.', gap: 0.5 },
      { say: 'Chloroform is not symmetric, so polar. Ammonia is pyramidal, so polar too.', cap: 'Chloroform, CHCl₃, is not symmetric, so polar. Ammonia, NH₃, is pyramidal, so polar too.', gap: 0.5 },
      { say: 'And boron trifluoride, trigonal planar and symmetric, is nonpolar.', cap: 'And boron trifluoride, BF₃, trigonal planar and symmetric, is nonpolar.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's the quick polarity test.", gap: 0.5 },
      { say: 'If the central atom has no lone pairs, and all the outer atoms are identical, the molecule is nonpolar.', gap: 0.5 },
      { say: "Otherwise, check it carefully. It's usually polar.", gap: 0.6 },
      { say: 'Methane is nonpolar. Methyl chloride, with one outer atom different, is polar. Ammonia, with a lone pair, is polar.', cap: 'CH₄ is nonpolar. CH₃Cl, with one outer atom different, is polar. NH₃, with a lone pair, is polar.', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: "Let's count sigma and pi bonds in ethene.", gap: 0.5 },
      { say: 'It has four carbon hydrogen single bonds, and one carbon carbon double bond.', cap: 'It has four C–H single bonds, and one C=C double bond.', gap: 0.6 },
      { say: 'The four single bonds give four sigma. The double bond adds one more sigma. That makes five sigma in total.', cap: 'The four single bonds give 4 σ. The double bond adds 1 more σ. That makes 5 σ in total.', gap: 0.6 },
      { say: 'The double bond also has one pi bond.', cap: 'The double bond also has 1 π bond.', gap: 0.6 },
      { say: "Each carbon has three domains, so it's S P two, at one hundred twenty degrees.", cap: "Each carbon has 3 domains, so it's sp², at 120°.", gap: 0.5 },
      { say: 'Five sigma bonds, one pi bond, and both carbons are S P two.', cap: '5 σ bonds, 1 π bond, and both carbons are sp².', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'What is the hybridization of carbon in carbon dioxide? S P, S P two, S P three, or none?', cap: 'What is the hybridization of C in CO₂? sp, sp², sp³, or none?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is S P.', cap: 'The answer is sp.', gap: 0.4 },
      { say: 'Carbon has two domains, from its two double bonds.', cap: 'Carbon has 2 domains, from its two double bonds.', gap: 0.4 },
      { say: 'So it is S P, linear, at one hundred eighty degrees.', cap: 'So it is sp, linear, at 180°.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Two domains is S P, three is S P two, and four is S P three.', cap: '2 domains = sp, 3 = sp², 4 = sp³.', gap: 0.5 },
      { say: 'Single is sigma. Double is sigma plus pi. Triple is sigma plus two pi. Sigma is stronger than pi, and pi prevents rotation.', cap: 'Single = σ. Double = σ + π. Triple = σ + 2π. σ is stronger than π, and π prevents rotation.', gap: 0.5 },
      { say: 'And a polar molecule needs polar bonds and an asymmetric shape.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
