// Narration for chem-5.4 "Elementary Reactions". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u5.ts; the "why molecularity sets the rate law" counting
// argument and the four-molecule / slowest-step lines are from book.ts ('chem-5.4').
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-5.4',
  title: 'Elementary Reactions',
  course: 'AP® Chemistry',
  unit: 'Unit 5 · Kinetics',
  unitId: 'chem-u5',
  unitTitle: 'Kinetics',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Elementary reactions.', cap: 'Elementary Reactions.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what an elementary step is, how to read its rate law straight from its equation, and the one place that shortcut fails.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "Most reactions don't happen in one big event.", gap: 0.4 },
      { say: 'They happen in several small steps, like a relay race.', gap: 0.5 },
      { say: 'Each leg of the race is one single collision, or one single breakup.', gap: 0.5 },
      { say: 'Each of those steps is called an elementary reaction.', gap: 0.5 },
      { say: 'And elementary reactions have a special property: you can read the rate law straight from the equation.', gap: 0.9 },
    ] },
    { id: 'what', beats: [
      { say: 'An elementary reaction is a single molecular event.', gap: 0.5 },
      { say: 'Its equation tells you exactly which particles come together in that one event.', gap: 0.5 },
      { say: 'The number of particles colliding is called the molecularity.', gap: 0.5 },
      { say: 'One particle breaking up on its own is unimolecular.', gap: 0.4 },
      { say: 'Two particles colliding is bimolecular.', gap: 0.4 },
      { say: 'Three particles colliding at the same moment is termolecular.', gap: 0.9 },
    ] },
    { id: 'table', beats: [
      { say: 'Now the shortcut. For an elementary step only, the rate law comes from the number of particles colliding.', gap: 0.5 },
      { say: 'A unimolecular step, ay goes to products, has the rate law: rate equals kay, times the concentration of ay.', cap: 'A unimolecular step, A → products, has the rate law rate = k[A].', gap: 0.5 },
      { say: 'A bimolecular step, ay plus bee goes to products: rate equals kay, times ay, times bee.', cap: 'A bimolecular step, A + B → products: rate = k[A][B].', gap: 0.5 },
      { say: 'If two ay particles collide, two ay goes to products: rate equals kay, times ay squared.', cap: 'If two A particles collide, 2A → products: rate = k[A]².', gap: 0.6 },
      { say: 'So for an elementary step, the exponents in the rate law equal the coefficients in the equation.', gap: 0.9 },
    ] },
    { id: 'why', beats: [
      { say: 'Why does that work? Picture the bimolecular step, ay plus bee.', cap: 'Why does that work? Picture the bimolecular step, A + B.', gap: 0.5 },
      { say: 'Every reaction needs one ay particle to collide with one bee particle.', cap: 'Every reaction needs one A particle to collide with one B particle.', gap: 0.5 },
      { say: 'Double the concentration of ay, and you double the number of ay bee collisions per second.', cap: 'Double [A], and you double the number of A–B collisions per second.', gap: 0.5 },
      { say: 'Double bee, and the same thing happens.', cap: 'Double [B], and the same thing happens.', gap: 0.5 },
      { say: 'So the rate is proportional to ay times bee.', cap: 'So the rate is proportional to [A][B].', gap: 0.5 },
      { say: 'The rate law of an elementary step simply counts the particles that must come together.', gap: 0.9 },
    ] },
    { id: 'rare', beats: [
      { say: 'What about three particles at once?', gap: 0.4 },
      { say: 'A termolecular step, ay plus bee plus see, would give: rate equals kay, times ay, times bee, times see.', cap: 'A termolecular step, A + B + C → products, gives rate = k[A][B][C].', gap: 0.5 },
      { say: 'But termolecular steps are rare.', gap: 0.5 },
      { say: "That's about as likely as three billiard balls meeting at the exact same spot, at the exact same time.", gap: 0.5 },
      { say: 'Three particles colliding at the same instant, with the right energy and the right orientation, is very unlikely.', gap: 0.5 },
      { say: 'Unimolecular and bimolecular steps are the common ones.', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: "Let's read one together.", gap: 0.4 },
      { say: 'The elementary step: two N O two goes to N O three plus N O.', cap: 'The elementary step: 2NO₂ → NO₃ + NO.', gap: 0.5 },
      { say: "It's elementary, so look at what collides: two N O two molecules.", cap: "It's elementary, so look at what collides: two NO₂ molecules.", gap: 0.5 },
      { say: "That's bimolecular, so the rate law is: rate equals kay, times N O two squared.", cap: "That's bimolecular, so the rate law is rate = k[NO₂]².", gap: 0.5 },
      { say: 'The products, N O three and N O, are not in it. Only the particles that collide count.', cap: 'The products, NO₃ and NO, are not in it. Only the particles that collide count.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now the trap.', gap: 0.4 },
      { say: 'This shortcut only works for elementary steps.', gap: 0.5 },
      { say: 'Take the overall reaction: two H two plus two N O gives N two plus two H two O.', cap: 'Take the overall reaction: 2H₂ + 2NO → N₂ + 2H₂O.', gap: 0.5 },
      { say: "It's tempting to write: rate equals kay, times H two squared, times N O squared.", cap: "It's tempting to write rate = k[H₂]²[NO]².", gap: 0.4 },
      { say: 'You cannot do that.', gap: 0.5 },
      { say: 'In a single step, this would need four molecules to collide at once, which is effectively impossible.', gap: 0.5 },
      { say: 'The reaction really goes through several elementary steps, each involving only one or two molecules.', gap: 0.5 },
      { say: 'The experimental rate law reflects the slowest of those steps.', gap: 0.5 },
      { say: 'So an overall rate law must come from experiment, or from a mechanism.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'What is the rate law for the elementary step: N O plus O three gives N O two plus O two?', cap: 'What is the rate law for the elementary step NO + O₃ → NO₂ + O₂?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer: rate equals kay, times N O, times O three.', cap: 'The answer: rate = k[NO][O₃].', gap: 0.4 },
      { say: "It's elementary and bimolecular: one N O meets one O three.", cap: "It's elementary and bimolecular: one NO meets one O₃.", gap: 0.3 },
      { say: 'So each exponent is one.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'For an elementary step, the exponents in the rate law equal the coefficients: the molecularity.', gap: 0.5 },
      { say: 'Unimolecular and bimolecular steps are common. Termolecular steps are rare.', gap: 0.5 },
      { say: 'And never do this for an overall reaction! Its rate law comes from experiment.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
