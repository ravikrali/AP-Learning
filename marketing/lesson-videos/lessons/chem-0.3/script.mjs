// Narration for chem-0.3 "Atoms, Isotopes & Ions". Every fact comes from the lesson cards and quick checks
// in app/src/content/chem/u0.ts. One entry per sentence: the voice reads `say`; captions show `cap`
// (or `say` when there is no `cap`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-0.3',
  title: 'Atoms, Isotopes & Ions',
  course: 'AP® Chemistry',
  unit: 'Unit 0 · Chemistry Toolkit',
  unitId: 'chem-u0', // with unitTitle, names the folder the video is stored under
  unitTitle: 'Chemistry Toolkit',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Atoms, isotopes, and ions.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what an atom is made of, what makes an isotope, and how an atom becomes an ion.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Every carbon atom in the universe has exactly six protons.', cap: 'Every carbon atom in the universe has exactly 6 protons.', gap: 0.6 },
      { say: 'Change the protons, and you change the element.', gap: 0.6 },
      { say: 'Change the neutrons, and you get an isotope.', gap: 0.6 },
      { say: 'Change the electrons, and you get an ion.', gap: 0.9 },
    ] },
    { id: 'particles', beats: [
      { say: 'An atom is built from three particles.', gap: 0.5 },
      { say: 'The proton has a charge of plus one. It sits in the nucleus, and its mass is about one atomic mass unit.', cap: 'The proton has a charge of +1. It sits in the nucleus, and its mass is about 1 amu.', gap: 0.6 },
      { say: 'The neutron has no charge. It also sits in the nucleus, with a mass of about one atomic mass unit.', cap: 'The neutron has no charge. It also sits in the nucleus, with a mass of about 1 amu.', gap: 0.6 },
      { say: 'The electron has a charge of minus one. It moves around the nucleus, and its mass is tiny.', cap: 'The electron has a charge of −1. It moves around the nucleus, and its mass is tiny.', gap: 0.9 },
    ] },
    { id: 'numbers', beats: [
      { say: 'Two numbers describe an atom.', gap: 0.5 },
      { say: 'The atomic number is the number of protons. This defines the element.', gap: 0.6 },
      { say: 'The mass number is protons plus neutrons.', gap: 0.6 },
      { say: 'And a neutral atom has electrons equal to protons.', gap: 0.9 },
    ] },
    { id: 'iso', beats: [
      { say: 'Isotopes are the same element, so the same protons, but different neutrons.', gap: 0.6 },
      { say: 'Carbon twelve has six neutrons. Carbon fourteen has eight.', cap: 'Carbon-12 has 6 neutrons. Carbon-14 has 8.', gap: 0.6 },
      { say: 'Both have six protons, so both are carbon.', cap: 'Both have 6 protons, so both are carbon.', gap: 0.9 },
    ] },
    { id: 'ions', beats: [
      { say: 'Ions are atoms that gained or lost electrons.', gap: 0.6 },
      { say: 'Lose electrons, and you have more protons than electrons. The ion is positive. We call it a cation, like sodium plus.', cap: 'Lose electrons, and you have more protons than electrons. The ion is positive. We call it a cation, like Na⁺.', gap: 0.6 },
      { say: 'Gain electrons, and the ion is negative. We call it an anion, like chloride minus.', cap: 'Gain electrons, and the ion is negative. We call it an anion, like Cl⁻.', gap: 0.6 },
      { say: 'Protons never change in chemical reactions. Only electrons move.', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: 'Let us count the particles in iron fifty six, with a three plus charge.', cap: 'Let us count the particles in ⁵⁶Fe³⁺.', gap: 0.6 },
      { say: 'Iron is element twenty six on the periodic table, so it has twenty six protons.', cap: 'Iron is element 26 on the periodic table, so it has 26 protons.', gap: 0.6 },
      { say: 'Neutrons equal the mass number minus the protons. Fifty six minus twenty six is thirty neutrons.', cap: 'Neutrons = mass number − protons. 56 − 26 = 30 neutrons.', gap: 0.6 },
      { say: 'The three plus charge means it lost three electrons. Twenty six minus three is twenty three electrons.', cap: 'The 3+ charge means it lost 3 electrons. 26 − 3 = 23 electrons.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: 'Here is a trick to remember the names.', gap: 0.5 },
      { say: 'Cations have a t that looks like a plus sign. Cations are positive.', cap: 'Cations have a t that looks like a + sign. Cations are positive.', gap: 0.6 },
      { say: 'Anions are negative.', gap: 0.5 },
      { say: 'And remember, losing a negative thing, an electron, makes you more positive.', gap: 0.9 },
    ] },
    { id: 'table', beats: [
      { say: 'Now, the periodic table map.', gap: 0.5 },
      { say: 'Rows are periods. Columns are groups, or families, with similar properties.', gap: 0.6 },
      { say: 'Metals are on the left and center, nonmetals on the upper right, with metalloids along the staircase.', gap: 0.6 },
      { say: 'Group one is the alkali metals. Group two, the alkaline earth metals. Group seventeen, the halogens. Group eighteen, the noble gases.', cap: 'Group 1 is the alkali metals. Group 2, the alkaline earth metals. Group 17, the halogens. Group 18, the noble gases.', gap: 0.6 },
      { say: 'Typical ion charges: group one forms plus one. Group two, plus two. Aluminum, plus three. Group sixteen, minus two. Group seventeen, minus one.', cap: 'Typical ion charges: Group 1 → +1. Group 2 → +2. Al → +3. Group 16 → −2. Group 17 → −1.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'What ion does magnesium, in group two, usually form? Magnesium plus, magnesium two plus, magnesium two minus, or magnesium minus?', cap: 'What ion does magnesium (Group 2) usually form? Mg⁺, Mg²⁺, Mg²⁻, or Mg⁻?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is magnesium two plus.', cap: 'The answer is Mg²⁺.', gap: 0.4 },
      { say: 'Group two metals lose their two outer electrons.', cap: 'Group 2 metals lose their 2 outer electrons.', gap: 0.4 },
      { say: 'Losing electrons makes the ion positive.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Protons decide the element. Neutrons decide the isotope. Electrons decide the charge.', gap: 0.5 },
      { say: 'Mass number equals protons plus neutrons.', gap: 0.5 },
      { say: 'Positive ion, lost electrons. Negative ion, gained electrons.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
