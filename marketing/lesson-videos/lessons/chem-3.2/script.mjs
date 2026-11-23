// Narration for chem-3.2 "Types of Solids & Their Properties". Every fact comes from the lesson
// cards, quick checks and flashcards in app/src/content/chem/u3.ts (why graphite conducts and the
// decision process for data questions are from book.ts). One entry per sentence: the voice reads
// `say`; captions show `cap` (or `say`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-3.2',
  title: 'Types of Solids & Their Properties',
  course: 'AP® Chemistry',
  unit: 'Unit 3 · Properties of Substances and Mixtures',
  unitId: 'chem-u3',
  unitTitle: 'Properties of Substances and Mixtures',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Types of solids and their properties.', gap: 0.5 },
      { say: "In the next few minutes, you'll meet the four types of solids, see what holds each one together, and learn to name a solid from its formula or its properties.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "Here's a puzzle.", gap: 0.3 },
      { say: 'Diamond is the hardest natural material.', gap: 0.4 },
      { say: 'Graphite is also pure carbon, yet it is soft enough to write with.', gap: 0.5 },
      { say: 'Same atoms. Different structure. Totally different properties.', gap: 0.6 },
      { say: 'To see why, we sort solids by two things: the particles they contain, and the forces between those particles.', gap: 0.8 },
    ] },
    { id: 'ionic', beats: [
      { say: 'First, ionic solids, like sodium chloride and magnesium oxide.', cap: 'First, ionic solids, like NaCl and MgO.', gap: 0.4 },
      { say: 'The particles are ions, held together by Coulombic attractions.', gap: 0.5 },
      { say: 'Ionic solids have high melting points and low vapor pressures.', gap: 0.4 },
      { say: 'They are brittle. Shift the layers, and the crystal shatters.', gap: 0.6 },
      { say: 'As a solid, an ionic compound does not conduct.', gap: 0.3 },
      { say: 'It conducts only when melted or dissolved, because then the ions can move.', gap: 0.8 },
    ] },
    { id: 'network', beats: [
      { say: 'Second, covalent network solids.', gap: 0.3 },
      { say: 'Here the particles are atoms, joined in a network of covalent bonds.', gap: 0.5 },
      { say: 'These form only from nonmetals and metalloids: elements like diamond or graphite, or binary compounds like silicon dioxide and silicon carbide.', cap: 'These form only from nonmetals and metalloids: elements like diamond or graphite, or binary compounds like SiO₂ and SiC.', gap: 0.5 },
      { say: 'They have very high melting points, because melting would require breaking covalent bonds.', gap: 0.5 },
      { say: 'The three-dimensional networks are very hard, and they do not conduct.', cap: 'The 3-D networks are very hard, and they do not conduct.', gap: 0.3 },
      { say: 'The one exception to that is graphite.', gap: 0.8 },
    ] },
    { id: 'carbon', beats: [
      { say: 'So, back to our puzzle.', gap: 0.3 },
      { say: "Diamond is a three-dimensional network with fixed bond angles, so it's rigid and super hard.", cap: "Diamond is a 3-D network with fixed bond angles, so it's rigid and super hard.", gap: 0.5 },
      { say: 'Graphite is built from flat, two-dimensional layers.', cap: 'Graphite is built from flat, 2-D layers.', gap: 0.3 },
      { say: 'The bonds within each layer are strong, but the layers are held together only weakly.', gap: 0.3 },
      { say: 'So the layers slide past each other easily, and graphite feels soft and slippery.', gap: 0.6 },
      { say: 'Graphite also conducts. Each carbon forms three bonds within its layer, and its fourth valence electron is spread across the layer, so electrons can move along it.', gap: 0.5 },
      { say: 'In diamond, every carbon forms four bonds. All its valence electrons are held in place, so diamond is an insulator.', gap: 0.8 },
    ] },
    { id: 'molecular', beats: [
      { say: 'Third, molecular solids, like ice, sugar, iodine, and solid carbon dioxide.', cap: 'Third, molecular solids, like ice, sugar, I₂, and CO₂(s).', gap: 0.4 },
      { say: 'The particles are molecules, held together by intermolecular forces.', gap: 0.5 },
      { say: 'Molecular solids are soft, with low melting points.', gap: 0.4 },
      { say: 'Solid iodine melts at just one hundred fourteen degrees Celsius. Its molecules are held only by London dispersion forces.', cap: 'Solid iodine, I₂, melts at just 114 °C. Its molecules are held only by London dispersion forces.', gap: 0.5 },
      { say: "And they don't conduct. Their electrons are held tightly in covalent bonds and lone pairs, so there are no mobile charges.", gap: 0.8 },
    ] },
    { id: 'metallic', beats: [
      { say: 'Fourth, metallic solids, like copper, iron, and alloys.', cap: 'Fourth, metallic solids, like Cu, Fe, and alloys.', gap: 0.4 },
      { say: 'The particles are metal cations in a sea of electrons.', gap: 0.5 },
      { say: 'Metals conduct heat and electricity.', gap: 0.4 },
      { say: 'They are also malleable and ductile.', gap: 0.4 },
      { say: 'Push on a metal, and the layers of cations slide within the electron sea.', gap: 0.5 },
      { say: 'Shift the layers of an ionic solid, and it shatters. Malleability belongs to metals, not to ionic solids.', gap: 0.8 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a quick trick: identify the solid from its formula.", gap: 0.5 },
      { say: 'A metal plus a nonmetal? Ionic.', gap: 0.4 },
      { say: 'Only metal atoms? Metallic.', gap: 0.4 },
      { say: 'Carbon, silicon, silicon dioxide, or silicon carbide? Covalent network. Memorize these!', cap: 'C, Si, SiO₂ or SiC? Covalent network. Memorize these!', gap: 0.4 },
      { say: 'Any other compound of nonmetals? Molecular.', gap: 0.8 },
    ] },
    { id: 'data', beats: [
      { say: 'Sometimes a question gives you properties instead of a formula. Ask four questions, in order.', gap: 0.5 },
      { say: 'Does it conduct as a solid? Metallic, or graphite.', gap: 0.4 },
      { say: 'Does it conduct only when melted or dissolved? Ionic.', gap: 0.4 },
      { say: 'Very high melting point, very hard, and never conducts? Covalent network.', gap: 0.4 },
      { say: 'Low melting point, soft, and never conducts? Molecular.', gap: 0.6 },
      { say: 'Then explain with particles and forces: the very high melting point shows that melting requires breaking strong covalent bonds throughout a network.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'A solid is very hard, melts above sixteen hundred degrees Celsius, and does not conduct electricity, as a solid or when melted. What type of solid is it most likely?', cap: 'A solid is very hard, melts above 1600 °C, and does not conduct electricity, as a solid or when melted. What type of solid is it most likely?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is covalent network.', gap: 0.4 },
      { say: 'Very hard, a very high melting point, and never conducting point to a network solid, like silicon dioxide, quartz.', cap: 'Very hard, a very high melting point, and never conducting point to a network solid, like SiO₂ (quartz).', gap: 0.3 },
      { say: 'An ionic solid would conduct when molten.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Ionic solids have high melting points, are brittle, and conduct only when their ions move.', gap: 0.5 },
      { say: "Covalent network solids have very high melting points and are hard. Graphite is soft because its layers slide.", gap: 0.5 },
      { say: "Molecular solids have low melting points and don't conduct. Metallic solids conduct, and they're malleable.", gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
