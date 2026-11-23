// Narration for chem-8.10 "Buffer Capacity". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u8.ts (plus chem/book.ts: the definition, "when a buffer fails" with
// 0.010 mol / 0.10 mol, and "a process expected to produce acid -> somewhat more conjugate base").
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-8.10',
  title: 'Buffer Capacity',
  course: 'AP® Chemistry',
  unit: 'Unit 8 · Acids and Bases',
  unitId: 'chem-u8',
  unitTitle: 'Acids and Bases',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Buffer capacity.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what buffer capacity is, what makes it bigger, and why a buffer can be stronger against acid than against base.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Here are two buffers with the same P H.', cap: 'Here are two buffers with the same pH.', gap: 0.4 },
      { say: 'Now add acid to both, a little at a time.', gap: 0.5 },
      { say: 'One buffer fails early, and its P H suddenly drops.', cap: 'One buffer fails early, and its pH suddenly drops.', gap: 0.4 },
      { say: 'The other keeps going. It absorbs ten times more acid before it fails.', gap: 0.5 },
      { say: 'Same P H, very different protection. That difference is buffer capacity.', cap: 'Same pH, very different protection. That difference is buffer capacity.', gap: 0.8 },
    ] },
    { id: 'define', beats: [
      { say: 'So what is buffer capacity?' },
      { say: 'It is the amount of acid or base a buffer can absorb before its P H changes significantly.', cap: 'It is the amount of acid or base a buffer can absorb before its pH changes significantly.', gap: 0.5 },
      { say: 'Remember who does the work. The weak acid, H A, neutralizes added base. Its conjugate base, A minus, neutralizes added acid.', cap: 'Remember who does the work. The weak acid, HA, neutralizes added base. Its conjugate base, A⁻, neutralizes added acid.', gap: 0.5 },
      { say: 'So capacity depends on the amounts of these two partners, not only on their ratio.', gap: 0.8 },
    ] },
    { id: 'conc', beats: [
      { say: 'Rule one: more concentrated components give more capacity.', gap: 0.4 },
      { say: 'Take a buffer that is zero point one oh molar H A and zero point one oh molar A minus.', cap: 'Take a buffer that is 0.10 M HA and 0.10 M A⁻.', gap: 0.3 },
      { say: 'Compare it with one that is one point oh molar of each.', cap: 'Compare it with one that is 1.0 M of each.', gap: 0.4 },
      { say: 'The ratio is the same, one to one, so the P H is the same.', cap: 'The ratio is the same, 1 : 1, so the pH is the same.', gap: 0.5 },
      { say: 'But the concentrated buffer can neutralize about ten times more added acid or base.', gap: 0.8 },
    ] },
    { id: 'fail', beats: [
      { say: 'Why does that happen? A buffer fails when one of its partners is nearly used up.', gap: 0.4 },
      { say: 'Say a buffer holds zero point zero one zero moles of A minus.', cap: 'Say a buffer holds 0.010 mol of A⁻.', gap: 0.3 },
      { say: 'Add zero point zero one zero moles of strong acid, and all of that A minus is used up.', cap: 'Add 0.010 mol of strong acid, and all of that A⁻ is used up.', gap: 0.4 },
      { say: 'Now any more acid lowers the P H sharply, just like in unbuffered water.', cap: 'Now any more acid lowers the pH sharply, just like in unbuffered water.', gap: 0.5 },
      { say: 'A buffer with zero point one oh moles of each partner could absorb ten times as much acid before reaching that point.', cap: 'A buffer with 0.10 mol of each partner could absorb ten times as much acid before reaching that point.', gap: 0.4 },
      { say: 'Even though both buffers start at the same P H.', cap: 'Even though both buffers start at the same pH.', gap: 0.8 },
    ] },
    { id: 'dilute', beats: [
      { say: 'The same idea explains dilution.' },
      { say: 'Dilute a buffer ten-fold with water.', cap: 'Dilute a buffer 10-fold with water.', gap: 0.4 },
      { say: 'The ratio of A minus to H A is unchanged, so the P H stays about the same.', cap: 'The ratio [A⁻]/[HA] is unchanged, so the pH stays about the same.', gap: 0.5 },
      { say: 'But the concentrations are lower, so the capacity is lower.', gap: 0.4 },
      { say: 'It is still a buffer. It just has less capacity.', gap: 0.8 },
    ] },
    { id: 'direction', beats: [
      { say: 'Rule two: the ratio decides which direction is stronger.', gap: 0.4 },
      { say: 'With more H A than A minus, the buffer has greater capacity against added base.', cap: 'With more HA than A⁻, the buffer has greater capacity against added base.', gap: 0.4 },
      { say: 'With more A minus than H A, it has greater capacity against added acid.', cap: 'With more A⁻ than HA, it has greater capacity against added acid.', gap: 0.5 },
      { say: 'Take a buffer with zero point four oh molar H A and zero point one oh molar A minus.', cap: 'Take a buffer with [HA] = 0.40 M and [A⁻] = 0.10 M.', gap: 0.4 },
      { say: 'There is more H A, the partner that reacts with hydroxide, so it can neutralize more added base.', cap: 'There is more HA, the partner that reacts with OH⁻, so it can neutralize more added base.', gap: 0.5 },
      { say: 'So if a process is expected to produce acid, choose a buffer with somewhat more conjugate base than acid.', gap: 0.8 },
    ] },
    { id: 'trick', beats: [
      { say: "Here's a way to keep it all straight." },
      { say: 'Think of the two buffer partners as bodyguards.', gap: 0.4 },
      { say: 'The P H depends on the ratio, from the Henderson Hasselbalch equation.', cap: 'The pH depends on the ratio, from the Henderson–Hasselbalch equation.', gap: 0.4 },
      { say: 'The capacity depends on the amounts: how many bodyguards there are.', gap: 0.5 },
      { say: 'Double both H A and A minus. The ratio stays the same, so the P H stays the same.', cap: 'Double both HA and A⁻. The ratio stays the same, so the pH stays the same.', gap: 0.4 },
      { say: 'But there are twice as many bodyguards, so the protection doubles.', gap: 0.5 },
      { say: "So don't fall for the trap: the same P H does not mean the same capacity.", cap: "So don't fall for the trap: the same pH does not mean the same capacity.", gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Buffer X is zero point one oh molar H A and zero point one oh molar A minus. Buffer Y is zero point five oh molar of each. Which is true?', cap: 'Buffer X: 0.10 M HA / 0.10 M A⁻. Buffer Y: 0.50 M HA / 0.50 M A⁻. Which is true?', gap: 0.5 },
      { say: 'A: Y has a lower P H.', cap: 'A: Y has a lower pH.', gap: 0.3 },
      { say: 'B: they have the same P H, and Y has greater capacity.', cap: 'B: They have the same pH, and Y has greater capacity.', gap: 0.3 },
      { say: 'C: X has greater capacity.', gap: 0.3 },
      { say: 'D: they have the same capacity.', cap: 'D: They have the same capacity.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B.', gap: 0.4 },
      { say: 'Both ratios are one to one, so the P H is the same.', cap: 'Both ratios are 1 : 1, so the pH is the same.', gap: 0.4 },
      { say: 'Y has five times more of each partner, so Y has greater capacity.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Higher concentrations give greater capacity, and the same ratio gives the same P H.', cap: 'Higher concentrations give greater capacity, and the same ratio gives the same pH.', gap: 0.5 },
      { say: 'Extra H A is better at absorbing base. Extra A minus is better at absorbing acid.', cap: 'Extra HA is better at absorbing base. Extra A⁻ is better at absorbing acid.', gap: 0.5 },
      { say: 'The ratio sets the P H. The amounts set the capacity.', cap: 'The ratio sets the pH. The amounts set the capacity.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
