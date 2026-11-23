// Narration for chem-8.8 "Buffers: How They Work". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u8.ts (plus chem/book.ts: the blood buffer H2CO3 / HCO3-, the
// pH-of-water comparison and "works until one component is used up").
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-8.8',
  title: 'Buffers: How They Work',
  course: 'AP® Chemistry',
  unit: 'Unit 8 · Acids and Bases',
  unitId: 'chem-u8',
  unitTitle: 'Acids and Bases',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Buffers: how they work.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what a buffer is made of, how it handles added acid and added base, and how to spot a pair that is not a buffer.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Your blood stays at a P H of seven point four.', cap: 'Your blood stays at pH 7.4.', gap: 0.4 },
      { say: 'Even when you eat lemons, or exercise hard.', gap: 0.5 },
      { say: "If it shifted by just a few tenths, you'd be in serious trouble.", gap: 0.5 },
      { say: 'Buffers are the chemical shock absorbers that make that possible.', gap: 0.5 },
      { say: 'In your blood, the main buffer is carbonic acid and the hydrogen carbonate ion.', cap: 'In your blood, the main buffer is carbonic acid, H₂CO₃, and the hydrogen carbonate ion, HCO₃⁻.', gap: 0.5 },
      { say: "Let's see how buffers work.", gap: 0.8 },
    ] },
    { id: 'what', beats: [
      { say: 'So what is a buffer?' },
      { say: 'A buffer contains large amounts of both members of a conjugate acid base pair.', cap: 'A buffer contains large amounts of BOTH members of a conjugate acid–base pair.', gap: 0.5 },
      { say: 'One kind is a weak acid and its conjugate base, like acetic acid and acetate.', cap: 'One kind is a weak acid and its conjugate base, like CH₃COOH and CH₃COO⁻.', gap: 0.5 },
      { say: 'The other kind is a weak base and its conjugate acid, like ammonia and ammonium.', cap: 'The other kind is a weak base and its conjugate acid, like NH₃ and NH₄⁺.', gap: 0.5 },
      { say: 'The key word is both. Both partners, in large amounts, at the same time.', gap: 0.5 },
      { say: 'And each partner has one job.', gap: 0.8 },
    ] },
    { id: 'acid', beats: [
      { say: "First, let's add some acid." },
      { say: 'Hydronium ions pour into the buffer, ready to lower the P H.', cap: 'H₃O⁺ ions pour into the buffer, ready to lower the pH.', gap: 0.4 },
      { say: 'The conjugate base, acetate, catches them.', cap: 'The conjugate base, CH₃COO⁻, catches them.', gap: 0.4 },
      { say: 'Acetate plus hydronium makes acetic acid plus water.', cap: 'CH₃COO⁻(aq) + H₃O⁺(aq) → CH₃COOH(aq) + H₂O(l)', gap: 0.5 },
      { say: 'The strong acid has been turned into a weak acid, which hardly ionizes.', gap: 0.5 },
      { say: 'So the P H changes only slightly.', cap: 'So the pH changes only slightly.', gap: 0.8 },
    ] },
    { id: 'base', beats: [
      { say: 'Now add some base instead.' },
      { say: 'Hydroxide ions pour in, ready to raise the P H.', cap: 'OH⁻ ions pour in, ready to raise the pH.', gap: 0.4 },
      { say: 'This time, the weak acid, acetic acid, catches them.', cap: 'This time, the weak acid, CH₃COOH, catches them.', gap: 0.4 },
      { say: 'Acetic acid plus hydroxide makes acetate plus water.', cap: 'CH₃COOH(aq) + OH⁻(aq) → CH₃COO⁻(aq) + H₂O(l)', gap: 0.5 },
      { say: 'The strong base has been turned into a weak one.', gap: 0.5 },
      { say: 'That is why a little sodium hydroxide barely moves the P H of a buffer.', cap: 'That is why a little NaOH barely moves the pH of a buffer.', gap: 0.8 },
    ] },
    { id: 'why', beats: [
      { say: 'Compare that with pure water.' },
      { say: 'Add a strong acid to water, and the P H can drop by several units.', cap: 'Add a strong acid to water, and the pH can drop by several units.', gap: 0.5 },
      { say: 'Add the same acid to a buffer, and only the ratio of A minus to H A shifts a little.', cap: 'Add the same acid to a buffer, and only the [A⁻]/[HA] ratio shifts a little.', gap: 0.5 },
      { say: 'So the P H changes only slightly.', cap: 'So the pH changes only slightly.', gap: 0.5 },
      { say: 'In every case, a strong acid or base is swapped for a weak one.', gap: 0.5 },
      { say: 'This works until one of the partners is used up. That idea is buffer capacity, later in this unit.', gap: 0.8 },
    ] },
    { id: 'blood', beats: [
      { say: 'Now back to your blood.' },
      { say: 'If acid enters the blood, hydrogen carbonate converts it to carbonic acid.', cap: 'If acid enters the blood, HCO₃⁻ converts it to H₂CO₃.', gap: 0.5 },
      { say: 'If base enters, carbonic acid neutralizes it, forming hydrogen carbonate and water.', cap: 'If base enters, H₂CO₃ neutralizes it, forming HCO₃⁻ and water.', gap: 0.5 },
      { say: 'Both partners are present in large amounts, so small additions change their ratio only slightly.', gap: 0.5 },
      { say: 'And the P H stays close to seven point four.', cap: 'And the pH stays close to 7.4.', gap: 0.8 },
    ] },
    { id: 'ammonia', beats: [
      { say: 'The same logic works for a weak base buffer, like ammonia and ammonium.', cap: 'The same logic works for a weak base buffer, like NH₃ and NH₄⁺.' },
      { say: 'Add a little hydrochloric acid to an ammonia and ammonium buffer.', cap: 'Add a little HCl to an NH₃/NH₄⁺ buffer.', gap: 0.5 },
      { say: 'Which partner reacts? The base member, ammonia.', cap: 'Which partner reacts? The base member, NH₃.', gap: 0.4 },
      { say: 'Ammonia plus hydronium makes ammonium plus water.', cap: 'NH₃(aq) + H₃O⁺(aq) → NH₄⁺(aq) + H₂O(l)', gap: 0.5 },
      { say: 'Not ammonium. Ammonium is the acid member, so it cannot catch more acid.', cap: 'Not NH₄⁺. NH₄⁺ is the acid member, so it cannot catch more acid.', gap: 0.5 },
      { say: 'Added base would be caught by the acid member, ammonium.', cap: 'Added base would be caught by the acid member, NH₄⁺.', gap: 0.8 },
    ] },
    { id: 'trick', beats: [
      { say: "Here's a trick to remember it." },
      { say: 'Think of a buffer as two bodyguards standing at the door.', gap: 0.4 },
      { say: 'A minus catches H plus that tries to get in.', cap: 'A⁻ catches H⁺ that tries to get in.', gap: 0.4 },
      { say: 'H A catches O H minus.', cap: 'HA catches OH⁻.', gap: 0.4 },
      { say: 'Each guard catches only one kind of intruder.', gap: 0.4 },
      { say: 'Both need to be present in large amounts.', gap: 0.5 },
      { say: "That's why a strong acid with its conjugate base, like H C L and sodium chloride, is not a buffer.", cap: "That's why a strong acid with its conjugate base, like HCl + NaCl, is NOT a buffer.", gap: 0.4 },
      { say: 'Chloride is far too weak a base to catch anything.', cap: 'Cl⁻ is far too weak a base to catch anything.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Which pair makes a buffer? H C L and sodium chloride. Nitric acid and potassium nitrate. Hydrofluoric acid and sodium fluoride. Or sodium hydroxide and sodium chloride.', cap: 'Which pair makes a buffer? HCl and NaCl, HNO₃ and KNO₃, HF and NaF, or NaOH and NaCl?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is hydrofluoric acid and sodium fluoride.', cap: 'The answer is HF and NaF.', gap: 0.4 },
      { say: 'H F is a weak acid, and fluoride is its conjugate base. Strong acids with their salts do not buffer.', cap: "HF is a weak acid, and F⁻ is its conjugate base. Strong acids with their salts don't buffer.", gap: 0.5 },
      { say: 'The first two pairs are strong acids with their salts. The last pair has no weak acid at all.', cap: 'The first two pairs are strong acids with their salts. The last pair has no weak acid at all.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'A buffer is large amounts of a weak acid and its conjugate base, or a weak base and its conjugate acid.', gap: 0.5 },
      { say: 'The conjugate base neutralizes added acid. The weak acid neutralizes added base.', gap: 0.5 },
      { say: 'And a strong acid with its salt is not a buffer.', cap: 'And a strong acid + its salt is NOT a buffer.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
