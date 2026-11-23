// Narration for chem-7.8 "Particle Diagrams of Equilibrium". Every fact comes from the lesson cards,
// quick checks and flashcards in app/src/content/chem/u7.ts, plus the lesson's prose in chem/book.ts
// (the 4 A2 / 4 B2 / 4 AB box with Q = 1 < K = 16, and atoms conserved in every frame). The frame
// sequence 4,4,4 -> 3,3,6 -> 2,2,8 applies the book's rule (two AB form, one A2 and one B2 disappear)
// and ends at the lesson's own equilibrium box (Q = 16 = K). One entry per sentence: the voice reads
// `say`; captions show `cap` (or `say`). `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-7.8',
  title: 'Particle Diagrams of Equilibrium',
  course: 'AP® Chemistry',
  unit: 'Unit 7 · Equilibrium',
  unitId: 'chem-u7',
  unitTitle: 'Equilibrium',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Particle diagrams of equilibrium.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn to find K straight from a box of molecules, and to tell whether that box is at equilibrium yet.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "Some questions don't give you any concentrations at all." },
      { say: 'Instead, AP shows equilibrium as a box of molecules.', cap: 'Instead, AP® shows equilibrium as a box of molecules.', gap: 0.4 },
      { say: 'Then it asks you for K, or whether the box has reached equilibrium yet.', gap: 0.5 },
      { say: "It looks tricky, but it isn't.", gap: 0.4 },
      { say: 'Counting particles turns a picture into numbers.', gap: 0.8 },
    ] },
    { id: 'volume', beats: [
      { say: "Here's the key idea." },
      { say: 'All the particles in a box share the same volume.', gap: 0.5 },
      { say: 'So each particle count is proportional to its concentration.', gap: 0.5 },
      { say: 'Twice as many particles in the same box means twice the concentration.', gap: 0.5 },
      { say: 'Each particle stands for a fixed concentration, so the counts can stand in for concentrations.', gap: 0.8 },
    ] },
    { id: 'convert', beats: [
      { say: "Let's try it." },
      { say: 'Take A two plus B two, in equilibrium with two A B.', cap: 'Take A₂(g) + B₂(g) ⇌ 2AB(g).', gap: 0.4 },
      { say: 'An equilibrium box shows two A two, two B two, and eight A B.', cap: 'An equilibrium box shows 2 A₂, 2 B₂ and 8 AB.', gap: 0.4 },
      { say: 'The question says each particle stands for zero point one zero molar.', cap: 'The question says each particle stands for 0.10 M.', gap: 0.5 },
      { say: 'So convert the counts. A two is zero point two zero molar, B two is zero point two zero molar, and A B is zero point eight zero molar.', cap: 'So convert the counts: [A₂] = 0.20 M, [B₂] = 0.20 M, [AB] = 0.80 M.', gap: 0.5 },
      { say: 'Now plug them into K: the A B concentration squared, over A two times B two.', cap: 'Now plug them into K = [AB]² / ([A₂][B₂]).', gap: 0.4 },
      { say: "That's zero point eight zero squared, over zero point two zero times zero point two zero.", cap: "That's (0.80)² / (0.20 × 0.20).", gap: 0.4 },
      { say: 'K equals sixteen.', cap: 'K = 16.', gap: 0.5 },
      { say: "That's greater than one, so the equilibrium mixture is mostly product.", gap: 0.8 },
    ] },
    { id: 'cancel', beats: [
      { say: "Here's a shortcut." },
      { say: 'Look at the exponents in K. On top, two. On the bottom, one plus one, which is also two.', gap: 0.5 },
      { say: 'When the exponents on the top and bottom add up to the same total, the volume cancels.', gap: 0.4 },
      { say: 'So the raw counts give K directly.', gap: 0.4 },
      { say: 'Eight squared is sixty-four. Two times two is four. Sixty-four over four is sixteen. Same answer.', cap: '8² = 64. 2 × 2 = 4. 64 / 4 = 16. Same answer.', gap: 0.6 },
      { say: 'Another one. For X going to Y, an equilibrium box shows three X and nine Y.', cap: 'Another one. For X(g) ⇌ Y(g), an equilibrium box shows 3 X and 9 Y.', gap: 0.4 },
      { say: 'Same volume, so K is nine over three, which is three.', cap: 'Same volume, so K = [Y]/[X] = 9/3 = 3.', gap: 0.5 },
      { say: "But if the numbers of gas particles on each side differ, you'd need the actual concentrations.", gap: 0.8 },
    ] },
    { id: 'qbox', beats: [
      { say: 'Now the other question: is this box at equilibrium?' },
      { say: 'Same reaction, with K equal to sixteen.', cap: 'Same reaction, with K = 16.', gap: 0.4 },
      { say: 'This box holds four A two, four B two, and four A B.', cap: 'This box holds 4 A₂, 4 B₂ and 4 AB.', gap: 0.5 },
      { say: 'The totals of the exponents match, so use the counts to find Q.', gap: 0.4 },
      { say: 'Four squared, over four times four. Q equals one.', cap: 'Q = 4² / (4 × 4) = 1.', gap: 0.5 },
      { say: 'One is less than sixteen, so Q is less than K.', cap: '1 < 16, so Q < K.', gap: 0.4 },
      { say: 'The box is not at equilibrium yet.', gap: 0.4 },
      { say: 'The reaction proceeds forward, forming more A B, until Q equals sixteen.', cap: 'The reaction proceeds forward, forming more AB, until Q = 16.', gap: 0.8 },
    ] },
    { id: 'frames', beats: [
      { say: "Watch it get there, one frame at a time. And here's a rule that catches impossible diagrams." },
      { say: 'Every frame must contain the same number of each kind of atom.', gap: 0.5 },
      { say: 'So if two A B molecules form, one A two and one B two must have disappeared.', cap: 'So if two AB molecules form, one A₂ and one B₂ must have disappeared.', gap: 0.5 },
      { say: 'Four, four, and four becomes three, three, and six.', cap: '4, 4, 4 becomes 3, 3, 6.', gap: 0.5 },
      { say: 'Then two, two, and eight.', cap: 'Then 2, 2, 8.', gap: 0.5 },
      { say: 'Now Q is eight squared over two times two: sixteen. That equals K.', cap: 'Now Q = 8² / (2 × 2) = 16. That equals K.', gap: 0.5 },
      { say: 'In the next frame, nothing changes.', gap: 0.4 },
      { say: 'When the counts stop changing, the system has reached equilibrium.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'A sequence of particle diagrams shows the number of product molecules: two, five, seven, seven, seven. When was equilibrium reached?', cap: 'A sequence of particle diagrams shows the number of product molecules: 2, 5, 7, 7, 7. When was equilibrium reached?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer: when the count first reached seven.', cap: 'The answer: when the count first reached 7.', gap: 0.4 },
      { say: 'Equilibrium means no further change.', gap: 0.3 },
      { say: 'The count stops changing once it first reaches seven.', cap: 'The count stops changing once it first reaches 7.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Convert particle counts to concentrations, or ratios, then plug them into K.', gap: 0.5 },
      { say: 'Find Q from the counts and compare it with K, to see whether a box is at equilibrium.', gap: 0.5 },
      { say: 'And equilibrium means the counts stop changing.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
