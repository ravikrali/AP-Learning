// Narration for chem-5.3 "Concentration vs. Time & Half-Life". Every fact comes from the lesson
// cards, quick checks and flashcards in app/src/content/chem/u5.ts; the 8.0-day isotope example and
// "only first order has a constant half-life" are from book.ts, the half-life definition from the
// lesson's glossary entry. One entry per sentence: the voice reads `say`; captions show `cap`.
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-5.3',
  title: 'Concentration vs. Time & Half-Life',
  course: 'AP® Chemistry',
  unit: 'Unit 5 · Kinetics',
  unitId: 'chem-u5',
  unitTitle: 'Kinetics',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Concentration versus time, and half-life.', cap: 'Concentration vs. Time & Half-Life.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn how to find a reaction's order from three graphs, and how to work with half-lives.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'How do archaeologists date an ancient bone?', gap: 0.5 },
      { say: 'They measure how much carbon fourteen is left in it.', cap: 'They measure how much carbon-14 is left in it.', gap: 0.5 },
      { say: 'That works because radioactive decay is first order.', gap: 0.4 },
      { say: 'And a first-order reaction has a constant half-life.', gap: 0.6 },
      { say: "Let's see what that means, starting with how concentration changes over time.", gap: 0.9 },
    ] },
    { id: 'laws', beats: [
      { say: "Integrated rate laws describe how a reactant's concentration changes over time.", gap: 0.4 },
      { say: "They're on your equation sheet, one for each order.", gap: 0.5 },
      { say: 'Zero order: the concentration of ay at time t, minus the starting concentration, equals minus kay t.', cap: 'Zero order: [A]ₜ − [A]₀ = −kt.', gap: 0.5 },
      { say: 'First order: the same idea, with the natural log of the concentration.', cap: 'First order: ln[A]ₜ − ln[A]₀ = −kt.', gap: 0.5 },
      { say: 'Second order: one over the concentration. And this time, the right side is plus kay t.', cap: 'Second order: 1/[A]ₜ − 1/[A]₀ = kt.', gap: 0.5 },
      { say: 'Each one gives a straight line, if you plot the right thing against time.', gap: 0.9 },
    ] },
    { id: 'plots', beats: [
      { say: 'So how do you find the order from data?', gap: 0.4 },
      { say: 'Make all three graphs: the concentration of ay, the natural log of ay, and one over ay, each against time.', cap: 'Make all three graphs: [A], ln[A] and 1/[A], each against time.', gap: 0.5 },
      { say: "Here's data for a first-order reaction.", gap: 0.4 },
      { say: 'The concentration graph curves.', cap: 'The [A] graph curves.', gap: 0.4 },
      { say: 'The one over ay graph curves too.', cap: 'The 1/[A] graph curves too.', gap: 0.4 },
      { say: 'Only the natural log graph is a straight line.', cap: 'Only the ln[A] graph is a straight line.', gap: 0.5 },
      { say: 'Whichever one is a straight line tells you the order.', gap: 0.4 },
      { say: 'Here it is first order, and the slope of that line is minus kay.', cap: 'Here it is first order, and the slope of that line is −k.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a quick way to remember which graph goes with which order: zero, log, flip.", cap: 'Here\'s a quick way to remember which graph goes with which order: "Zero, Log, Flip."', gap: 0.5 },
      { say: 'Order zero: plot the concentration as it is.', gap: 0.4 },
      { say: 'Order one: take the log.', gap: 0.4 },
      { say: 'Order two: flip it, and plot one over the concentration.', cap: 'Order two: flip it, and plot 1/[A].', gap: 0.5 },
      { say: 'The straight line wins.', gap: 0.5 },
      { say: 'And remember the slopes: minus kay, minus kay, and plus kay.', cap: 'And remember the slopes: −k, −k, and +k.', gap: 0.4 },
      { say: 'The second-order slope is positive, because one over ay grows as ay shrinks.', cap: 'The second-order slope is positive, because 1/[A] grows as [A] shrinks.', gap: 0.9 },
    ] },
    { id: 'halflife', beats: [
      { say: 'Now, half-life: the time needed for half of a reactant to be used up.', gap: 0.5 },
      { say: "For a first-order reaction, the half-life is constant. It doesn't depend on how much you start with.", gap: 0.5 },
      { say: 'Take a radioactive isotope with a half-life of eight point zero days.', cap: 'Take a radioactive isotope with a half-life of 8.0 days.', gap: 0.4 },
      { say: 'It starts at one hundred milligrams. After eight days, fifty point zero milligrams are left.', cap: 'It starts at 100. mg. After 8.0 days, 50.0 mg are left.', gap: 0.4 },
      { say: 'After sixteen days, twenty-five point zero. After twenty-four days, twelve point five.', cap: 'After 16 days, 25.0 mg. After 24 days, 12.5 mg.', gap: 0.5 },
      { say: 'Each half-life takes the same time, and leaves half of what was there.', gap: 0.5 },
      { say: 'After one half-life, one half is left. After two, one quarter. After three, one eighth.', cap: 'After 1 half-life, ½ is left. After 2, ¼. After 3, ⅛.', gap: 0.4 },
      { say: 'After n half-lives, one half to the power n remains.', cap: 'After n half-lives, (½)ⁿ remains.', gap: 0.5 },
      { say: 'And the equation is: t one half equals zero point six nine three, divided by kay.', cap: 'And the equation is: t½ = 0.693/k.', gap: 0.5 },
      { say: 'Remember, only first-order reactions have a constant half-life.', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: "Let's try a first-order calculation.", gap: 0.4 },
      { say: 'Kay is zero point zero five zero zero per second, and the starting concentration is zero point eight zero zero molar. Find the concentration after twenty point zero seconds, and the half-life.', cap: 'k = 0.0500 s⁻¹ and [A]₀ = 0.800 M. Find [A] after 20.0 s, and the half-life.', gap: 0.6 },
      { say: 'Step one: the natural log of ay equals the natural log of zero point eight zero zero, minus zero point zero five zero zero times twenty point zero.', cap: 'Step 1: ln[A] = ln(0.800) − (0.0500)(20.0)', gap: 0.4 },
      { say: "That's minus zero point two two three, minus one point zero zero zero, which is minus one point two two three.", cap: '= −0.223 − 1.000 = −1.223', gap: 0.5 },
      { say: 'Step two: undo the log. The concentration is e to the minus one point two two three, which is zero point two nine four molar.', cap: 'Step 2: undo the log. [A] = e^(−1.223) = 0.294 M.', gap: 0.5 },
      { say: 'Step three: the half-life is zero point six nine three, divided by zero point zero five zero zero. That is thirteen point nine seconds.', cap: 'Step 3: t½ = 0.693 ÷ 0.0500 = 13.9 s.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'A first-order reaction has a half-life of ten point zero minutes. What fraction of the reactant remains after thirty point zero minutes?', cap: 'A first-order reaction has a half-life of 10.0 min. What fraction of the reactant remains after 30.0 min?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is zero point one two five, which is one eighth.', cap: 'The answer is 0.125, which is ⅛.', gap: 0.4 },
      { say: 'Thirty divided by ten is three half-lives.', cap: '30 ÷ 10 = 3 half-lives.', gap: 0.4 },
      { say: 'And one half, cubed, is one eighth.', cap: 'And (½)³ = ⅛.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'The straight line tells you the order: the concentration for zero order, the natural log for first order, and one over the concentration for second order.', cap: 'The straight line tells you the order: [A] vs t for zero order, ln[A] vs t for first order, and 1/[A] vs t for second order.', gap: 0.5 },
      { say: 'The slopes are minus kay, minus kay, and plus kay.', cap: 'The slopes are −k, −k, and +k.', gap: 0.5 },
      { say: 'For first order, t one half equals zero point six nine three over kay, and the half-life is constant.', cap: 'For first order, t½ = 0.693/k, and the half-life is constant.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
