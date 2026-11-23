// Narration for chem-2.4 "Metals & Alloys". Every fact comes from the lesson cards, quick checks,
// flashcards and glossary in app/src/content/chem/ (u2.ts, book.ts, glossary.ts). One entry per
// sentence: the voice reads `say`; captions show `cap` (or `say` when there is no `cap`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-2.4',
  title: 'Metals & Alloys',
  course: 'AP® Chemistry',
  unit: 'Unit 2 · Compound Structure and Properties',
  unitId: 'chem-u2', // with unitTitle, names the folder the video is stored under
  unitTitle: 'Compound Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Metals and alloys.', gap: 0.5 },
      { say: "In the next few minutes, you'll see what holds a metal together, why a metal can be hammered into a sheet, and how the two kinds of alloys are built.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Pure iron is fairly soft.', gap: 0.5 },
      { say: 'Add a little carbon, and you get steel: strong enough for skyscrapers.', gap: 0.5 },
      { say: 'Add zinc to copper, and you get brass, for trumpets.', gap: 0.5 },
      { say: 'Mixing metals at the atomic level changes everything.', gap: 0.5 },
      { say: 'To see why, start with what a metal looks like inside.', gap: 0.8 },
    ] },
    { id: 'sea', beats: [
      { say: 'This is the electron sea model.', cap: 'This is the electron-sea model.', gap: 0.5 },
      { say: 'A metal is an array of positive metal ions.', gap: 0.5 },
      { say: 'Around them is a sea of delocalized valence electrons.', gap: 0.5 },
      { say: 'Those electrons are not stuck in place. They are free to move.', gap: 0.5 },
      { say: 'The attraction between the positive ions and the electron sea is the metallic bond.', gap: 0.5 },
      { say: 'That one picture explains how metals behave.', gap: 0.8 },
    ] },
    { id: 'conduct', beats: [
      { say: 'First, metals conduct electricity.', gap: 0.4 },
      { say: 'Apply a voltage, and the delocalized electrons move freely through the metal.', gap: 0.6 },
      { say: 'Metals conduct heat, too.', gap: 0.4 },
      { say: 'The mobile electrons carry kinetic energy quickly through the solid.', gap: 0.6 },
      { say: 'On an exam, name the delocalized electrons, and link them to the property.', gap: 0.8 },
    ] },
    { id: 'slide', beats: [
      { say: 'Second, metals are malleable and ductile.', gap: 0.4 },
      { say: 'You can hammer a metal into a sheet without shattering it.', gap: 0.5 },
      { say: "Here's why. Layers of positive ions can slide past each other.", gap: 0.5 },
      { say: 'And the electron sea still holds them together.', gap: 0.6 },
      { say: 'Compare that with an ionic solid.', gap: 0.4 },
      { say: 'Shift a layer there, and like charges clash.', gap: 0.6 },
      { say: 'In a metal, there is no like-charge clash.', gap: 0.8 },
    ] },
    { id: 'alloys', beats: [
      { say: 'Now, alloys.', gap: 0.4 },
      { say: 'An alloy is a mixture of a metal with one or more other elements.', gap: 0.5 },
      { say: 'There are two kinds.', gap: 0.5 },
      { say: 'In a substitutional alloy, atoms of similar size replace host atoms in the lattice.', gap: 0.5 },
      { say: 'Brass is the example. Zinc atoms substitute for some of the copper atoms.', gap: 0.7 },
      { say: 'In an interstitial alloy, much smaller atoms fit into the gaps between the host atoms.', gap: 0.5 },
      { say: 'Steel is the example. Small carbon atoms sit between the iron atoms.', gap: 0.8 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's the shortcut: size decides the type.", gap: 0.5 },
      { say: 'Similar radii means substitutional. Think: swap places.', gap: 0.5 },
      { say: 'Very different radii means interstitial. Think: in the gaps.', gap: 0.7 },
      { say: 'And the type changes the properties.', gap: 0.4 },
      { say: 'Interstitial alloys are usually harder and less malleable.', gap: 0.5 },
      { say: "The small atoms jam the layers, so they can't slide as easily.", gap: 0.5 },
      { say: "That's why steel is harder and less malleable than pure iron.", gap: 0.6 },
      { say: 'An alloy usually keeps its shine and its conductivity, because the electron sea remains.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Boron atoms are much smaller than iron atoms. A boron iron alloy is most likely: substitutional, interstitial, ionic, or a molecular solid?', cap: 'Boron atoms are much smaller than iron atoms. A boron–iron alloy is most likely: substitutional, interstitial, ionic, or a molecular solid?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is interstitial.', gap: 0.4 },
      { say: 'The sizes are very different.', gap: 0.3 },
      { say: 'So the small boron atoms fit into the gaps between the larger iron atoms.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'A metal is positive ions in a sea of delocalized electrons. That makes it conductive and malleable.', gap: 0.5 },
      { say: 'In a substitutional alloy, atoms of similar size swap in, like brass. In an interstitial alloy, small atoms sit in the gaps, like steel.', gap: 0.5 },
      { say: 'And interstitial alloys are typically harder and less malleable.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
