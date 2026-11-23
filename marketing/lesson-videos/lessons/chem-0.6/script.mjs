// Narration for chem-0.6 "Logs & Exponents for Chemistry". Every fact comes from the lesson
// cards in app/src/content/chem/u0.ts. One entry per sentence: the voice reads `say`; captions show
// `cap` (or `say` when there is no `cap`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-0.6',
  title: 'Logs & Exponents for Chemistry',
  course: 'AP® Chemistry',
  unit: 'Unit 0 · Chemistry Toolkit',
  unitId: 'chem-u0',
  unitTitle: 'Chemistry Toolkit',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Logs and exponents for chemistry.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what a log really asks, how to undo it, and how to estimate one without a calculator.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'p H, p K a, rate laws, and the Nernst equation all use logarithms.', cap: 'pH, pKa, rate laws, and the Nernst equation all use logarithms.', gap: 0.6 },
      { say: 'Logs look scary.', gap: 0.5 },
      { say: 'But they ask one simple question.', gap: 0.5 },
      { say: 'Ten to what power gives me this number?', gap: 0.9 },
    ] },
    { id: 'meaning', beats: [
      { say: 'Here is what a log means.', gap: 0.5 },
      { say: 'The log of one thousand is three, because ten to the third power is one thousand.', cap: 'log(1000) = 3, because 10³ = 1000.', gap: 0.6 },
      { say: 'The log of zero point zero one is negative two, because ten to the negative two is zero point zero one.', cap: 'log(0.01) = −2, because 10⁻² = 0.01.', gap: 0.6 },
      { say: 'And there is an undo button.', gap: 0.4 },
      { say: 'If log of x equals y, then x equals ten to the y.', cap: 'If log(x) = y, then x = 10^y.', gap: 0.9 },
    ] },
    { id: 'ln', beats: [
      { say: 'You will also see l n, the natural log.', cap: 'You will also see ln, the natural log.', gap: 0.5 },
      { say: 'It uses base e, about two point seven one eight, instead of ten.', cap: 'It uses base e, about 2.718, instead of 10.', gap: 0.6 },
      { say: 'It shows up in kinetics and thermodynamics.', gap: 0.5 },
      { say: 'It works the same way. If l n of x equals y, then x equals e to the y.', cap: 'It works the same way. If ln(x) = y, then x = e^y.', gap: 0.9 },
    ] },
    { id: 'rules', beats: [
      { say: 'Three log rules are worth knowing.', gap: 0.5 },
      { say: 'The log of a times b is log a plus log b.', cap: 'log(a × b) = log a + log b.', gap: 0.6 },
      { say: 'The log of a divided by b is log a minus log b.', cap: 'log(a / b) = log a − log b.', gap: 0.6 },
      { say: 'The log of a to the n is n times log a.', cap: 'log(aⁿ) = n log a.', gap: 0.6 },
      { say: 'The most useful consequence: the log of ten to the n is just n.', cap: 'The most useful consequence: log(10ⁿ) = n.', gap: 0.5 },
      { say: 'So for any number written as one times ten to the negative n, the log is just negative n.', cap: 'So for any number written as 1 × 10⁻ⁿ, the log is just −n.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: 'Here is a trick: estimate p H style logs in your head.', cap: 'Here is a trick: estimate pH-style logs in your head.', gap: 0.5 },
      { say: 'Take three point two times ten to the negative five.', cap: 'Take 3.2 × 10⁻⁵.', gap: 0.6 },
      { say: 'Negative log of one times ten to the negative five is five.', cap: '−log(1 × 10⁻⁵) = 5.', gap: 0.5 },
      { say: 'Negative log of ten times ten to the negative five is four.', cap: '−log(10 × 10⁻⁵) = 4.', gap: 0.5 },
      { say: 'So the negative log of three point two times ten to the negative five is between four and five.', cap: 'So −log(3.2 × 10⁻⁵) is between 4 and 5.', gap: 0.6 },
      { say: 'Calculators are allowed on the exam, but this estimate is faster, catches calculator slips, and lets you eliminate wrong choices instantly.', cap: 'Calculators are allowed on the AP® exam, but this estimate is faster, catches calculator slips, and lets you eliminate wrong choices instantly.', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: 'Now, from a log back to a number.', gap: 0.5 },
      { say: 'If negative log x equals three point zero zero, what is x?', cap: 'If −log x = 3.00, what is x?', gap: 0.6 },
      { say: 'Negative log x equals three means log x equals negative three.', cap: '−log x = 3.00 means log x = −3.00.', gap: 0.6 },
      { say: 'Undo the log. x equals ten to the negative three.', cap: 'Undo the log. x = 10⁻³.', gap: 0.6 },
      { say: 'That is zero point zero zero one zero, or one point zero times ten to the negative three.', cap: 'That is 0.0010, or 1.0 × 10⁻³.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Without a calculator, negative log of six times ten to the negative nine is between what? Six and seven, eight and nine, nine and ten, or negative nine and negative eight?', cap: 'Without a calculator: −log(6 × 10⁻⁹) is between… 6 and 7, 8 and 9, 9 and 10, or −9 and −8?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is eight and nine.', cap: 'The answer is 8 and 9.', gap: 0.4 },
      { say: 'Six times ten to the negative nine is between one times ten to the negative nine and one times ten to the negative eight.', cap: '6 × 10⁻⁹ is between 1 × 10⁻⁹ and 1 × 10⁻⁸.', gap: 0.4 },
      { say: 'So the negative log is between eight and nine.', cap: 'So the −log is between 8 and 9.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'The log of x is the power of ten that gives x. Undo it with x equals ten to the log x.', cap: 'log(x) is the power of 10 that gives x. Undo it with x = 10^(log x).', gap: 0.5 },
      { say: 'The log of ten to the n is n.', cap: 'log(10ⁿ) = n.', gap: 0.5 },
      { say: 'To estimate the negative log of a times ten to the negative n, it falls between n minus one and n.', cap: 'To estimate −log of a × 10⁻ⁿ: it falls between n − 1 and n.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
