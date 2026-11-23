// Narration for chem-8.5 "Titration Curves". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u8.ts (plus chem/book.ts: strong vs. weak acid curves, "same equivalence
// volume", the equivalence point as the midpoint of the steep rise).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-8.5',
  title: 'Titration Curves',
  course: 'AP® Chemistry',
  unit: 'Unit 8 · Acids and Bases',
  unitId: 'chem-u8',
  unitTitle: 'Acids and Bases',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Titration curves.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the landmarks of a titration curve, the P H at the equivalence point, and how to read P K A and concentration from it.", cap: "In the next few minutes, you'll learn the landmarks of a titration curve, the pH at the equivalence point, and how to read pKa and concentration from it.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'A titration curve is a graph of P H against the volume of titrant added.', cap: 'A titration curve is a graph of pH against the volume of titrant added.', gap: 0.4 },
      { say: 'It reads like a story with a plot twist.', gap: 0.4 },
      { say: 'The P H creeps along.', cap: 'The pH creeps along.', gap: 0.6 },
      { say: 'Then, suddenly, it jumps, at the equivalence point.', gap: 0.6 },
      { say: 'Learn its landmarks, and you can read the whole story.', gap: 0.8 },
    ] },
    { id: 'start', beats: [
      { say: "Let's titrate a weak acid with a strong base, sodium hydroxide.", cap: "Let's titrate a weak acid with a strong base, NaOH.", gap: 0.4 },
      { say: 'Landmark one is the start.' },
      { say: 'Before any base is added, the P H is that of the weak acid alone. Fairly low.', cap: 'Before any base is added, the pH is that of the weak acid alone. Fairly low.', gap: 0.5 },
      { say: 'Landmark two is the buffer region.' },
      { say: 'As base is added, some H A is turned into A minus.', cap: 'As base is added, some HA is turned into A⁻.', gap: 0.4 },
      { say: 'Now H A and A minus are both present, so the P H rises slowly.', cap: 'Now HA and A⁻ are both present, so the pH rises slowly.', gap: 0.5 },
      { say: 'That gentle stretch is a buffer at work.', gap: 0.8 },
    ] },
    { id: 'half', beats: [
      { say: 'Landmark three is the half equivalence point.', cap: 'Landmark three is the half-equivalence point.' },
      { say: 'Here, half of the H A has been converted.', cap: 'Here, half of the HA has been converted.', gap: 0.4 },
      { say: 'So the concentration of H A equals the concentration of A minus.', cap: 'So [HA] = [A⁻].', gap: 0.4 },
      { say: 'And that means the P H equals the P K A.', cap: 'And that means pH = pKa.', gap: 0.5 },
      { say: 'This is how P K A is measured.', cap: 'This is how pKa is measured.', gap: 0.8 },
    ] },
    { id: 'equiv', beats: [
      { say: 'Landmark four is the equivalence point, the middle of the steep rise.', gap: 0.4 },
      { say: 'Here, the moles of hydroxide added equal the moles of H A at the start.', cap: 'Here, mol OH⁻ added = mol HA at the start.', gap: 0.4 },
      { say: 'Only A minus remains.', cap: 'Only A⁻ remains.', gap: 0.4 },
      { say: 'So the P H is greater than seven.', cap: 'So the pH is greater than 7.', gap: 0.5 },
      { say: 'Landmark five is after equivalence.' },
      { say: 'Now the excess hydroxide controls the P H.', cap: 'Now the excess OH⁻ controls the pH.', gap: 0.8 },
    ] },
    { id: 'eqph', beats: [
      { say: 'So what is the P H at the equivalence point? It depends on what you titrate.', cap: 'So what is the pH at the equivalence point? It depends on what you titrate.', gap: 0.4 },
      { say: 'Strong acid with strong base: seven. Only neutral ions and water remain.', cap: 'Strong acid + strong base: pH = 7. Only neutral ions and water remain.', gap: 0.5 },
      { say: 'Weak acid with strong base: above seven. The conjugate base reacts with water to make hydroxide.', cap: 'Weak acid + strong base: pH > 7. The conjugate base A⁻ reacts with water to make OH⁻.', gap: 0.5 },
      { say: 'Weak base with strong acid: below seven. The conjugate acid makes hydronium.', cap: 'Weak base + strong acid: pH < 7. The conjugate acid HB⁺ makes H₃O⁺.', gap: 0.5 },
      { say: 'For example, titrate ammonia with H C L. At equivalence only ammonium, a weak acid, remains. So the P H is less than seven.', cap: 'For example, titrate NH₃ with HCl. At equivalence only NH₄⁺, a weak acid, remains. So the pH is less than 7.', gap: 0.8 },
    ] },
    { id: 'compare', beats: [
      { say: 'Now compare a strong acid and a weak acid of the same concentration, each titrated with sodium hydroxide.', cap: 'Now compare a strong acid and a weak acid of the same concentration, each titrated with NaOH.', gap: 0.5 },
      { say: 'The weak acid starts at a higher P H, because it is only partly ionized.', cap: 'The weak acid starts at a higher pH, because it is only partly ionized.', gap: 0.4 },
      { say: 'It rises quickly at first, then flattens into a buffer region. The strong acid curve has none.', gap: 0.4 },
      { say: 'Its jump at equivalence is smaller, and centered above seven.', cap: 'Its jump at equivalence is smaller, and centered above pH 7.', gap: 0.4 },
      { say: 'But both reach equivalence at the same volume. The base needed depends only on the moles of acid, not on its strength.', gap: 0.8 },
    ] },
    { id: 'pka', beats: [
      { say: "Let's read a P K A from a curve.", cap: "Let's read a pKa from a curve." },
      { say: 'A weak acid is titrated with sodium hydroxide. The equivalence point is at thirty point zero milliliters.', cap: 'A weak acid is titrated with NaOH. The equivalence point is at 30.0 mL.', gap: 0.4 },
      { say: 'At fifteen point zero milliliters, the P H is four point two zero.', cap: 'At 15.0 mL, the pH is 4.20.', gap: 0.4 },
      { say: 'Fifteen is half of thirty, so this is the half equivalence point, where P H equals P K A.', cap: '15.0 mL is half of 30.0 mL, so this is the half-equivalence point, where pH = pKa.', gap: 0.4 },
      { say: 'So the P K A is four point two zero.', cap: 'So pKa = 4.20.', gap: 0.4 },
      { say: 'And K A is ten to the minus four point two zero, which is six point three times ten to the minus five.', cap: 'And Ka = 10⁻⁴·²⁰ = 6.3 × 10⁻⁵.', gap: 0.8 },
    ] },
    { id: 'conc', beats: [
      { say: 'The equivalence point also gives you a concentration.' },
      { say: 'For a monoprotic acid at equivalence, moles of titrant equal moles of analyte.', cap: 'For a monoprotic acid at equivalence, mol titrant = mol analyte.', gap: 0.4 },
      { say: 'Twenty point zero milliliters of a weak acid needs sixteen point zero milliliters of zero point one two five molar sodium hydroxide.', cap: '20.0 mL of a weak acid needs 16.0 mL of 0.125 M NaOH.', gap: 0.4 },
      { say: 'Moles of sodium hydroxide: zero point one two five, times zero point zero one six zero liters, is zero point zero zero two zero zero moles.', cap: 'mol NaOH = 0.125 × 0.0160 L = 0.00200 mol.', gap: 0.4 },
      { say: 'That equals the moles of H A.', cap: 'That equals mol HA.', gap: 0.4 },
      { say: 'Divide by zero point zero two zero zero liters, and the acid is zero point one zero zero molar.', cap: 'Divide by 0.0200 L, and the acid is 0.100 M.', gap: 0.8 },
    ] },
    { id: 'poly', beats: [
      { say: 'Some acids have several acidic protons, like carbonic acid or phosphoric acid.', cap: 'Some acids have several acidic protons, like H₂CO₃ or H₃PO₄.', gap: 0.4 },
      { say: 'Their curves show up to one equivalence point per acidic proton, when the K A values are well separated.', cap: 'Their curves show up to one equivalence point per acidic proton, when the Ka values are well separated.', gap: 0.4 },
      { say: 'Each one has its own buffer region and its own P K A.', cap: 'Each one has its own buffer region and its own pKa.', gap: 0.4 },
      { say: 'So count the jumps, and you count the acidic protons.', gap: 0.4 },
      { say: 'Phosphoric acid can show up to three.', cap: 'H₃PO₄ can show up to three.', gap: 0.4 },
      { say: "You won't need the concentration of every species. Just identify the major species at each stage.", gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'A titration curve shows two distinct equivalence points. The acid is most likely: H C L, acetic acid, carbonic acid, or nitric acid?', cap: 'A titration curve shows two distinct equivalence points. The acid is most likely: HCl, CH₃COOH, H₂CO₃ or HNO₃?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is carbonic acid.', cap: 'The answer is H₂CO₃.', gap: 0.4 },
      { say: 'Two equivalence points means two acidic protons, so it is a diprotic acid, like carbonic acid.', cap: 'Two equivalence points means two acidic protons, so it is a diprotic acid, like H₂CO₃.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'At the half equivalence point, P H equals P K A.', cap: 'At the half-equivalence point, pH = pKa.', gap: 0.5 },
      { say: 'At equivalence, strong with strong is seven. Weak acid with strong base is above seven. Weak base with strong acid is below seven.', cap: 'At equivalence: strong/strong = 7. Weak acid/strong base > 7. Weak base/strong acid < 7.', gap: 0.5 },
      { say: 'And each acidic proton can give its own equivalence point.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
