// Narration for chem-8.9 "Henderson–Hasselbalch". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u8.ts (plus chem/book.ts: "gives the pH of a buffer from the pKa of the
// weak acid and the ratio of conjugate base to acid").
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-8.9',
  title: 'Henderson–Hasselbalch',
  course: 'AP® Chemistry',
  unit: 'Unit 8 · Acids and Bases',
  unitId: 'chem-u8',
  unitTitle: 'Acids and Bases',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Henderson Hasselbalch.', cap: 'Henderson–Hasselbalch.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the equation that gives the P H of a buffer, how to use it, and how to choose the right acid for a buffer.", cap: "In the next few minutes, you'll learn the equation that gives the pH of a buffer, how to use it, and how to choose the right acid for a buffer.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Say you need a buffer at exactly P H five point oh four.', cap: 'Say you need a buffer at exactly pH 5.04.', gap: 0.4 },
      { say: 'What should you mix, and how much of each?', gap: 0.5 },
      { say: 'One equation tells you: the Henderson Hasselbalch equation.', cap: 'One equation tells you: the Henderson–Hasselbalch equation.', gap: 0.4 },
      { say: "It's on your equation sheet, so you don't have to memorize it.", gap: 0.4 },
      { say: 'But you do need to know how to read it.', gap: 0.8 },
    ] },
    { id: 'equation', beats: [
      { say: 'Here it is.' },
      { say: 'P H equals P K A, plus the log of A minus over H A.', cap: 'pH = pKa + log([A⁻]/[HA])', gap: 0.5 },
      { say: 'P K A comes from the weak acid.', cap: 'pKa comes from the weak acid.', gap: 0.4 },
      { say: 'On top is A minus, the conjugate base. On the bottom is H A, the weak acid.', cap: 'On top is A⁻, the conjugate base. On the bottom is HA, the weak acid.', gap: 0.5 },
      { say: 'So the P H of a buffer depends on two things: the P K A, and the ratio of base to acid.', cap: 'So the pH of a buffer depends on two things: the pKa, and the ratio of base to acid.', gap: 0.8 },
    ] },
    { id: 'ratio', beats: [
      { say: 'Now watch what the ratio does.' },
      { say: 'When A minus equals H A, the ratio is one.', cap: 'When [A⁻] = [HA], the ratio is 1.', gap: 0.4 },
      { say: 'The log of one is zero. So the P H equals the P K A.', cap: 'log 1 = 0. So pH = pKa.', gap: 0.6 },
      { say: 'With more base than acid, the P H is above the P K A.', cap: 'With more base than acid, pH > pKa.', gap: 0.6 },
      { say: 'With more acid than base, the P H is below the P K A.', cap: 'With more acid than base, pH < pKa.', gap: 0.8 },
    ] },
    { id: 'moles', beats: [
      { say: "Here's a useful shortcut." },
      { say: 'Only the ratio matters.', gap: 0.4 },
      { say: 'Both partners are in the same volume, so the volume cancels out of the ratio.', gap: 0.5 },
      { say: 'That means you can plug in moles instead of molarity.', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's try one." },
      { say: 'A buffer is zero point one oh molar acetic acid and zero point two oh molar acetate.', cap: 'A buffer is 0.10 M CH₃COOH and 0.20 M CH₃COO⁻.', gap: 0.4 },
      { say: 'The P K A is four point seven four.', cap: 'The pKa is 4.74.', gap: 0.5 },
      { say: 'Plug in. P H equals four point seven four, plus the log of zero point two oh over zero point one oh.', cap: 'Plug in: pH = 4.74 + log(0.20/0.10).', gap: 0.5 },
      { say: 'That ratio is two, and the log of two is zero point three oh.', cap: 'That ratio is 2, and log 2 = 0.30.', gap: 0.5 },
      { say: 'So the P H is five point oh four. That is the buffer from the start.', cap: 'So the pH is 5.04. That is the buffer from the start.', gap: 0.5 },
      { say: 'More base than acid, so the P H is above the P K A, just as expected.', cap: 'More base than acid, so pH > pKa, just as expected.', gap: 0.8 },
    ] },
    { id: 'basepair', beats: [
      { say: 'The same equation works for a weak base buffer.' },
      { say: 'Take ammonium at zero point five oh molar, and ammonia at zero point oh five oh molar.', cap: 'Take [NH₄⁺] = 0.50 M and [NH₃] = 0.050 M.', gap: 0.4 },
      { say: 'The P K A of ammonium is nine point two five.', cap: 'pKa(NH₄⁺) = 9.25.', gap: 0.5 },
      { say: 'Careful: here ammonium is the acid, and ammonia is the base.', cap: 'Careful: here NH₄⁺ is the acid, and NH₃ is the base.', gap: 0.5 },
      { say: 'So the ratio is zero point oh five oh over zero point five oh. Its log is minus one.', cap: 'So pH = 9.25 + log(0.050/0.50) = 9.25 − 1.00.', gap: 0.5 },
      { say: 'The P H is eight point two five, below the P K A, because there is more acid than base.', cap: 'The pH is 8.25, below the pKa, because there is more acid than base.', gap: 0.8 },
    ] },
    { id: 'trick', beats: [
      { say: "Here's the trick for choosing a buffer." },
      { say: 'Pick a weak acid whose P K A is close to the P H you want, within about one unit.', cap: 'Pick a weak acid whose pKa is close to the pH you want, within about ±1.', gap: 0.4 },
      { say: 'Then the ratio of base to acid stays near one.', gap: 0.4 },
      { say: 'And the buffer can neutralize both added acid and added base well.', gap: 0.5 },
      { say: 'Say you need a P H of seven point two.', cap: 'Say you need a pH of 7.2.', gap: 0.4 },
      { say: 'Hydrofluoric acid has a P K A of three point one seven. Acetic acid, four point seven four. H C N, nine point two one.', cap: 'HF has a pKa of 3.17. CH₃COOH, 4.74. HCN, 9.21.', gap: 0.5 },
      { say: 'Dihydrogen phosphate is seven point two one. That is the best choice.', cap: 'H₂PO₄⁻ is 7.21. That is the best choice.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: "Now a trap to avoid." },
      { say: 'Why does the P H of a buffer barely move when you add a little acid or base?', cap: 'Why does the pH of a buffer barely move when you add a little acid or base?', gap: 0.5 },
      { say: 'Because small additions barely change the ratio of A minus to H A.', cap: 'Because small additions barely change the [A⁻]/[HA] ratio.', gap: 0.5 },
      { say: 'And the P H follows the log of that ratio, so the P H barely moves either.', cap: 'And the pH follows the log of that ratio, so the pH barely moves either.', gap: 0.5 },
      { say: "You won't be asked to calculate the new P H after an addition. But you should be able to explain why it changes so little.", cap: "You won't be asked to calculate the new pH after an addition. But you should be able to explain why it changes so little.", gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'A buffer contains zero point three oh molar H F and zero point three oh molar sodium fluoride. The P K A of H F is three point one seven. What is the P H?', cap: 'A buffer contains 0.30 M HF and 0.30 M NaF. pKa(HF) = 3.17. What is the pH?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The P H is three point one seven.', cap: 'The pH is 3.17.', gap: 0.4 },
      { say: 'The concentrations are equal, so the log of one is zero, and the P H equals the P K A.', cap: 'The concentrations are equal, so log 1 = 0, and pH = pKa.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'P H equals P K A, plus the log of A minus over H A.', cap: 'pH = pKa + log([A⁻]/[HA]).', gap: 0.5 },
      { say: 'Equal amounts of acid and base give a P H equal to the P K A.', cap: 'Equal amounts of acid and base → pH = pKa.', gap: 0.5 },
      { say: 'And pick a weak acid with a P K A near the P H you want.', cap: 'And pick a weak acid with pKa near the desired pH.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
