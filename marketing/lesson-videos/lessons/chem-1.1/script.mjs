// Narration for chem-1.1 "Moles and Molar Mass". Every fact comes from the lesson cards and
// quick checks in app/src/content/chem/u1.ts (and its book.ts prose). One entry per sentence: the
// voice reads `say`; captions show `cap` (or `say`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-1.1',
  title: 'Moles and Molar Mass',
  course: 'AP® Chemistry',
  unit: 'Unit 1 · Atomic Structure and Properties',
  unitId: 'chem-u1',
  unitTitle: 'Atomic Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Moles and molar mass.', gap: 0.5 },
      { say: "In the next few minutes, you'll see what a mole is, how to turn grams into moles, and how to count particles by weighing.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "You can't count atoms one by one.", gap: 0.4 },
      { say: 'A single grain of salt has more than ten to the seventeenth of them!', cap: 'A single grain of salt has more than 10^17 of them!', gap: 0.5 },
      { say: 'So chemists count by weighing.', gap: 0.5 },
      { say: 'It works the same way a bank weighs a bag of coins, instead of counting each one.', gap: 0.9 },
    ] },
    { id: 'mole', beats: [
      { say: 'Think of the mole as a chemist\'s dozen.', gap: 0.5 },
      { say: 'A dozen is twelve things.', gap: 0.4 },
      { say: "A mole is six point oh two two times ten to the twenty-third things. That's Avogadro's number.", cap: "A mole is 6.022 × 10^23 things. That's Avogadro's number.", gap: 0.6 },
      { say: 'One mole of carbon atoms is that many carbon atoms.', gap: 0.4 },
      { say: 'One mole of water molecules is that many water molecules.', gap: 0.9 },
    ] },
    { id: 'molar', beats: [
      { say: 'Why this number?', gap: 0.5 },
      { say: 'It makes the mass in grams match the mass in A M U.', cap: 'It makes the mass in grams match the mass in amu.', gap: 0.5 },
      { say: 'One water molecule has a mass of about eighteen point oh two A M U.', cap: 'One water molecule has a mass of about 18.02 amu.', gap: 0.5 },
      { say: 'So one mole of water has a mass of eighteen point oh two grams.', cap: 'So 1 mole of water has a mass of 18.02 g.', gap: 0.5 },
      { say: 'That is the molar mass. We write it capital M, in grams per mole.', cap: 'That is the molar mass, M, in g/mol.', gap: 0.9 },
    ] },
    { id: 'equation', beats: [
      { say: 'Here is the one equation to know.', gap: 0.4 },
      { say: 'n equals m over M.', cap: 'n = m / M', gap: 0.5 },
      { say: 'n is moles. m is mass in grams. M is molar mass in grams per mole.', gap: 0.5 },
      { say: 'To find M, add up the atomic masses from the periodic table.', gap: 0.6 },
      { say: 'For carbon dioxide: twelve point oh one, plus two times sixteen point oh oh.', cap: 'For CO₂: 12.01 + 2(16.00)', gap: 0.5 },
      { say: 'That gives forty-four point oh one grams per mole.', cap: 'That gives 44.01 g/mol.', gap: 0.9 },
    ] },
    { id: 'hub', beats: [
      { say: 'Here is a quick trick. Picture a train station, with the mole in the middle.', gap: 0.5 },
      { say: 'Grams on one side. Particles on the other.', gap: 0.5 },
      { say: 'Grams to moles: divide by M.', gap: 0.4 },
      { say: 'Moles to grams: multiply by M.', gap: 0.4 },
      { say: 'Moles to particles: multiply by Avogadro\'s number.', gap: 0.4 },
      { say: 'Particles to moles: divide by Avogadro\'s number.', gap: 0.5 },
      { say: 'You can never jump straight from grams to particles. Always pass through moles!', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: 'Let\'s try it. How many molecules are in thirty-six point oh grams of water?', cap: "Let's try it. How many molecules are in 36.0 g of water?", gap: 0.5 },
      { say: 'Step one: the molar mass of water is two times one point oh oh eight, plus sixteen point oh oh. That is eighteen point oh two grams per mole.', cap: 'Step 1: the molar mass of H₂O is 2(1.008) + 16.00 = 18.02 g/mol.', gap: 0.5 },
      { say: 'Step two: moles. Thirty-six point oh grams divided by eighteen point oh two grams per mole is two point oh oh moles.', cap: 'Step 2: moles. 36.0 g ÷ 18.02 g/mol = 2.00 mol.', gap: 0.5 },
      { say: 'Step three: molecules. Two point oh oh moles times six point oh two two times ten to the twenty-third per mole.', cap: 'Step 3: molecules. 2.00 mol × 6.022 × 10^23 per mol.', gap: 0.5 },
      { say: 'The answer: one point two oh times ten to the twenty-fourth water molecules.', cap: 'The answer: 1.20 × 10^24 water molecules.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, a trap. Count atoms and molecules carefully.', gap: 0.5 },
      { say: 'One mole of water contains one mole of molecules, but three moles of atoms. Two hydrogen, and one oxygen.', gap: 0.5 },
      { say: 'And oxygen gas is O two. So its molar mass is thirty-two point oh oh grams per mole, not sixteen point oh oh.', cap: 'And oxygen gas is O₂. So its molar mass is 32.00 g/mol, not 16.00.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'How many moles are in ten point oh grams of sodium hydroxide? Sodium is twenty-two point nine nine. Oxygen is sixteen point oh oh. Hydrogen is one point oh oh eight.', cap: 'How many moles are in 10.0 g of NaOH? Na = 22.99, O = 16.00, H = 1.008.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is zero point two five oh moles.', cap: 'The answer is 0.250 mol.', gap: 0.4 },
      { say: 'The molar mass is twenty-two point nine nine, plus sixteen point oh oh, plus one point oh oh eight. That is forty point oh oh grams per mole.', cap: 'M = 22.99 + 16.00 + 1.008 = 40.00 g/mol.', gap: 0.3 },
      { say: 'Ten point oh divided by forty point oh oh is zero point two five oh moles.', cap: '10.0 ÷ 40.00 = 0.250 mol.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'One mole is six point oh two two times ten to the twenty-third particles. It is on your equation sheet.', cap: 'One mole is 6.022 × 10^23 particles. It is on your equation sheet.', gap: 0.5 },
      { say: 'n equals m over M. The molar mass in grams per mole has the same number as the particle\'s mass in A M U.', cap: "n = m/M. The molar mass in g/mol has the same number as the particle's mass in amu.", gap: 0.5 },
      { say: 'And always go through moles: grams, moles, particles.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
