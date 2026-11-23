// Narration for chem-2.1 "Types of Chemical Bonds". Every fact comes from the lesson cards, quick
// checks and flashcards in app/src/content/chem/u2.ts (and the lesson's prose in chem/book.ts).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say` when there is no
// `cap`). `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-2.1',
  title: 'Types of Chemical Bonds',
  course: 'AP® Chemistry',
  unit: 'Unit 2 · Compound Structure and Properties',
  unitId: 'chem-u2', // with unitTitle, names the folder the video is stored under
  unitTitle: 'Compound Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Types of chemical bonds.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn to tell covalent, ionic, and metallic bonds apart, and to spot which atom in a bond is partly negative.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Salt shatters.', gap: 0.3 },
      { say: 'Copper bends.', gap: 0.3 },
      { say: 'And wax melts in your hand.', gap: 0.5 },
      { say: 'All three are made of atoms stuck together. So why are they so different?', gap: 0.5 },
      { say: 'The answer is how the atoms share, or trade, their electrons.', gap: 0.9 },
    ] },
    { id: 'tug', beats: [
      { say: 'Every bond is a tug-of-war between two atoms, over the shared valence electrons.', gap: 0.5 },
      { say: 'Electronegativity measures how hard an atom pulls.', gap: 0.6 },
      { say: "If the two atoms pull about equally, the electrons are shared equally. That's a nonpolar covalent bond, like the bond between two chlorine atoms.", cap: "If the two atoms pull about equally, the electrons are shared equally. That's a nonpolar covalent bond, like Cl–Cl.", gap: 0.6 },
      { say: "If one atom pulls harder, the electrons are shared unequally. That's a polar covalent bond, like hydrogen bonded to chlorine, or oxygen bonded to hydrogen.", cap: "If one atom pulls harder, the electrons are shared unequally. That's a polar covalent bond, like H–Cl or O–H.", gap: 0.6 },
      { say: "And if the pull is very unequal, usually a metal with a nonmetal, the electrons are essentially transferred. That's an ionic bond, like sodium chloride.", gap: 0.9 },
    ] },
    { id: 'partial', beats: [
      { say: 'Now zoom in on a polar bond: hydrogen chloride.', gap: 0.5 },
      { say: 'Chlorine is the more electronegative atom, so the shared electrons spend more time near it.', gap: 0.5 },
      { say: 'That gives chlorine a partial negative charge, written delta minus.', cap: 'That gives chlorine a partial negative charge, written δ−.', gap: 0.5 },
      { say: 'Hydrogen is left with a partial positive charge: delta plus.', cap: 'Hydrogen is left with a partial positive charge: δ+.', gap: 0.6 },
      { say: 'The bigger the electronegativity difference, the bigger the bond dipole.', gap: 0.6 },
      { say: 'So of these four bonds to hydrogen, the bond to fluorine is the most polar. Fluorine is the most electronegative element.', gap: 0.5 },
      { say: 'One special case: a carbon to hydrogen bond counts as effectively nonpolar, even though carbon is slightly more electronegative than hydrogen.', cap: 'One special case: a C–H bond counts as effectively nonpolar, even though carbon is slightly more electronegative than hydrogen.', gap: 0.9 },
    ] },
    { id: 'continuum', beats: [
      { say: "Here's something students often miss." },
      { say: 'There is no sharp line between polar covalent and ionic.', gap: 0.5 },
      { say: "It's a continuum.", gap: 0.5 },
      { say: 'Every polar bond has some ionic character.', gap: 0.9 },
    ] },
    { id: 'metal', beats: [
      { say: 'Metals bond in a different way.' },
      { say: "In a metal, the valence electrons aren't owned by any single atom.", gap: 0.5 },
      { say: 'They are delocalized, and roam freely among positive metal ions. Chemists call it a sea of electrons.', gap: 0.6 },
      { say: "That's why metals conduct electricity, and can be bent or hammered into shape.", gap: 0.6 },
      { say: 'Solid copper is exactly this: copper cations, surrounded by delocalized valence electrons.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a quick bond type sorter.", cap: "Here's a quick bond-type sorter." },
      { say: 'Metal plus nonmetal: usually ionic.', gap: 0.5 },
      { say: "Nonmetal plus nonmetal: covalent. And it's polar if the electronegativities differ.", gap: 0.5 },
      { say: 'Metal plus metal: metallic.', gap: 0.9 },
    ] },
    { id: 'evidence', beats: [
      { say: "Now the fine print. Electronegativity difference isn't the only factor.", gap: 0.5 },
      { say: "The best evidence of bond type is the compound's properties.", gap: 0.6 },
      { say: 'Conducts electricity as a solid, and is malleable? That suggests metallic bonding.', gap: 0.5 },
      { say: "Doesn't conduct as a solid, but conducts when melted or dissolved? That suggests ionic bonding.", gap: 0.4 },
      { say: "The ions can't move in the solid, but they can move once it's melted or dissolved.", gap: 0.5 },
      { say: "Doesn't conduct in any state, and has a low melting point? That suggests covalent molecules.", gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'In an oxygen to hydrogen bond, which atom carries the partial negative charge?', cap: 'In an O–H bond, which atom carries the partial negative charge?', gap: 0.5 },
      { say: "A: hydrogen, because it's smaller. B: oxygen, because it's more electronegative. C: neither, because the bond is nonpolar. Or D: both share it equally.", gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B: oxygen.', gap: 0.4 },
      { say: 'Oxygen is much more electronegative than hydrogen, so the shared electrons spend more time near oxygen.', gap: 0.4 },
      { say: 'Oxygen is delta minus, and hydrogen is delta plus.', cap: 'Oxygen is δ−, and hydrogen is δ+.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Nonpolar covalent means equal sharing. Polar covalent means unequal sharing. Ionic is essentially a transfer.', gap: 0.5 },
      { say: 'The more electronegative atom is delta minus, and a bigger electronegativity difference means a bigger dipole.', cap: 'The more electronegative atom is δ−, and a bigger electronegativity difference means a bigger dipole.', gap: 0.5 },
      { say: 'Metallic bonding is cations in a sea of delocalized electrons.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
