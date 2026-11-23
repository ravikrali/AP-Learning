// Narration for chem-1.5 "Atomic Structure & Electron Configuration". Every fact comes from the lesson
// cards and quick checks in app/src/content/chem/u1.ts. One entry per sentence: the voice reads `say`;
// captions show `cap` (or `say`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-1.5',
  title: 'Atomic Structure & Electron Configuration',
  course: 'AP® Chemistry',
  unit: 'Unit 1 · Atomic Structure and Properties',
  unitId: 'chem-u1',
  unitTitle: 'Atomic Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Atomic structure and electron configuration.', gap: 0.5 },
      { say: "In the next few minutes, you'll see the force that holds an atom together, how electrons fill their shells, and how to write a configuration for an atom or an ion.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Why is sodium wildly reactive, while neon does nothing at all?', gap: 0.5 },
      { say: 'They differ by just one electron.', gap: 0.6 },
      { say: 'Where electrons sit, and how tightly they are held, explains almost all of chemistry.', gap: 0.6 },
      { say: "Let's start with the force behind it all.", gap: 0.8 },
    ] },
    { id: 'coulomb', beats: [
      { say: 'The atom is a positive nucleus, made of protons and neutrons, with negative electrons around it.', gap: 0.4 },
      { say: 'Opposite charges attract.', gap: 0.5 },
      { say: "That pull follows Coulomb's law. The force is proportional to q one times q two, divided by r squared.", cap: "That pull follows Coulomb's law. The force is proportional to q₁ × q₂, divided by r².", gap: 0.6 },
      { say: 'Bigger charges mean a stronger attraction.', gap: 0.5 },
      { say: 'A bigger distance, r, means a much weaker attraction.', gap: 0.5 },
      { say: 'Doubling r cuts the force to one quarter.', cap: 'Doubling r cuts the force to 1/4.', gap: 0.6 },
      { say: 'You will use this idea to explain trends all year. More protons, stronger pull. Electron farther away, weaker pull.', gap: 0.9 },
    ] },
    { id: 'shells', beats: [
      { say: 'Electrons are arranged in shells. n equals one, two, three, and so on.', cap: 'Electrons are arranged in shells: n = 1, 2, 3, and so on.', gap: 0.5 },
      { say: 'Each shell contains subshells.', gap: 0.5 },
      { say: 'An s subshell holds at most two electrons. A p subshell, six. A d subshell, ten. And an f subshell, fourteen.', gap: 0.6 },
      { say: 'The Aufbau principle says: fill the lowest-energy subshells first.', gap: 0.5 },
      { say: 'One s, two s, two p, three s, three p, then four s, before three d. Then four p, five s, four d, five p, and so on.', cap: '1s, 2s, 2p, 3s, 3p, then 4s before 3d. Then 4p, 5s, 4d, 5p, and so on.', gap: 0.6 },
      { say: 'Core electrons are in the inner shells. Valence electrons are in the outermost shell, and they do the chemistry.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a trick. The periodic table is the filling order.", gap: 0.5 },
      { say: 'Read the table left to right, top to bottom.', gap: 0.5 },
      { say: 'Groups one and two are the s block. Groups thirteen to eighteen are the p block.', cap: 'Groups 1–2 are the s block. Groups 13–18 are the p block.', gap: 0.5 },
      { say: 'The transition metals are the d block, and the shell number is one less than the row. Row four fills three d.', cap: 'The transition metals are the d block, and the shell number is one less than the row. Row 4 fills 3d.', gap: 0.6 },
      { say: 'So to write a configuration, walk across the table to your element, writing each block as you pass it.', gap: 0.9 },
    ] },
    { id: 'sulfur', beats: [
      { say: 'Try it with sulfur, which has sixteen electrons.', cap: 'Try it with sulfur, which has 16 electrons.', gap: 0.5 },
      { say: 'Fill in order. One s two makes two. Two s two makes four. Two p six makes ten. Three s two makes twelve. Three p four makes sixteen.', cap: 'Fill in order: 1s² makes 2. 2s² makes 4. 2p⁶ makes 10. 3s² makes 12. 3p⁴ makes 16.', gap: 0.6 },
      { say: 'The full form is one s two, two s two, two p six, three s two, three p four.', cap: 'The full form is 1s² 2s² 2p⁶ 3s² 3p⁴.', gap: 0.5 },
      { say: "For noble-gas shorthand, neon covers the first ten electrons. So it's neon, three s two, three p four.", cap: "For noble-gas shorthand, neon covers the first 10 electrons. So it's [Ne] 3s² 3p⁴.", gap: 0.5 },
      { say: "That's six valence electrons.", cap: "That's 6 valence electrons.", gap: 0.9 },
    ] },
    { id: 'ions', beats: [
      { say: 'Now, ions.', gap: 0.4 },
      { say: 'Anions add electrons to the next open spot. Chloride is neon, three s two, three p six. That is the same as argon.', cap: 'Anions add electrons to the next open spot. Cl⁻ is [Ne] 3s² 3p⁶, the same as argon.', gap: 0.5 },
      { say: 'Cations remove electrons from the highest shell, n, first.', gap: 0.5 },
      { say: 'Watch out. Transition metals lose their four s electrons before three d, even though four s filled first.', cap: 'Watch out: transition metals lose their 4s electrons before 3d, even though 4s filled first.', gap: 0.5 },
      { say: 'Iron is argon, four s two, three d six. Iron two plus is argon, three d six. Not argon, four s two, three d four.', cap: 'Fe is [Ar] 4s² 3d⁶. Fe²⁺ is [Ar] 3d⁶. Not [Ar] 4s² 3d⁴.', gap: 0.9 },
    ] },
    { id: 'ie', beats: [
      { say: 'Next, ionization energy. That is the energy needed to remove an electron.', gap: 0.5 },
      { say: 'It is larger when the electron is closer to the nucleus, with a smaller r.', gap: 0.5 },
      { say: 'It is also larger when the electron is attracted by a larger effective nuclear charge.', gap: 0.5 },
      { say: 'That is the nuclear charge, minus the shielding from the inner, core electrons.', gap: 0.5 },
      { say: 'So core electrons need far more energy to remove than valence electrons.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'And some good news.', gap: 0.4 },
      { say: 'The exam does not test quantum numbers. Those are n, l, m sub l, and m sub s.', cap: 'The exam does not test quantum numbers: n, l, mₗ and mₛ.', gap: 0.5 },
      { say: 'It also does not ask you to write configurations for the exception elements, like chromium and copper.', gap: 0.5 },
      { say: 'Focus on Aufbau, noble-gas shorthand, and ions.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'What is the electron configuration of calcium two plus? A: argon, four s two. B: argon. C: argon, four s two, three d two. Or D: neon, three s two.', cap: 'What is the electron configuration of Ca²⁺? A: [Ar] 4s². B: [Ar]. C: [Ar] 4s² 3d². Or D: [Ne] 3s².', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B.', gap: 0.4 },
      { say: 'Calcium is argon, four s two. Losing the two four s electrons leaves argon.', cap: 'Calcium is [Ar] 4s². Losing the two 4s electrons leaves [Ar].', gap: 0.3 },
      { say: 'That is one s two, two s two, two p six, three s two, three p six.', cap: 'That is 1s² 2s² 2p⁶ 3s² 3p⁶.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: "Coulomb's law: the force is proportional to q one q two over r squared. More charge, stronger pull. More distance, weaker pull.", cap: "Coulomb's law: F ∝ q₁q₂/r². More charge, stronger pull. More distance, weaker pull.", gap: 0.5 },
      { say: 'Fill subshells in order: s two, p six, d ten. Use the periodic table as your map.', gap: 0.5 },
      { say: 'And cations lose electrons from the highest n first: four s before three d.', cap: 'And cations lose electrons from the highest n first: 4s before 3d.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
