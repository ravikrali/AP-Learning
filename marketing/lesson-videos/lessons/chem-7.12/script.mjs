// Narration for chem-7.12 "The Common-Ion Effect". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u7.ts (plus chem/book.ts: "only a tiny concentration of Ag+ can
// exist alongside it before Q reaches Ksp", and the "far less than 5% of 0.10" check of the shortcut).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`). `gap` = seconds of
// silence after the sentence (default 0.35).
export default {
  id: 'chem-7.12',
  title: 'The Common-Ion Effect',
  course: 'AP® Chemistry',
  unit: 'Unit 7 · Equilibrium',
  unitId: 'chem-u7',
  unitTitle: 'Equilibrium',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'The common ion effect.', cap: 'The common-ion effect.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn why a salt dissolves less when one of its ions is already in the water, and how to work out how much less.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Try dissolving silver chloride in two beakers.', cap: 'Try dissolving AgCl in two beakers.' },
      { say: 'One holds pure water. The other holds salt water.', gap: 0.5 },
      { say: 'In the salt water, even less silver chloride dissolves.', cap: 'In the salt water, even less AgCl dissolves.', gap: 0.5 },
      { say: 'The chloride ions already in the water get in the way.', cap: 'The Cl⁻ ions already in the water "get in the way."', gap: 0.5 },
      { say: "That's the common ion effect.", cap: "That's the common-ion effect.", gap: 0.8 },
    ] },
    { id: 'why', beats: [
      { say: "Here's why it happens." },
      { say: 'Silver chloride solid is in equilibrium with silver ions and chloride ions.', cap: 'AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq)', gap: 0.5 },
      { say: 'Now add chloride, from sodium chloride.', cap: 'Now add Cl⁻, from NaCl.', gap: 0.4 },
      { say: 'That raises Q above K s p.', cap: 'That raises Q above Ksp.', gap: 0.5 },
      { say: "By Le Chatelier's principle, the equilibrium shifts left, toward the solid.", cap: "By Le Châtelier's principle, the equilibrium shifts left, toward the solid.", gap: 0.5 },
      { say: 'So less silver chloride dissolves.', cap: 'So less AgCl dissolves.', gap: 0.5 },
      { say: 'The rule: a common ion lowers solubility.', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's put a number on it." },
      { say: 'K s p of silver chloride is one point eight times ten to the negative tenth. Find its solubility in zero point one zero molar sodium chloride.', cap: 'Ksp(AgCl) = 1.8 × 10⁻¹⁰. Find its solubility in 0.10 M NaCl.', gap: 0.5 },
      { say: 'Silver ion is s.', cap: '[Ag⁺] = s', gap: 0.3 },
      { say: 'Chloride is zero point one zero plus s, which is about zero point one zero, because s is tiny.', cap: '[Cl⁻] = 0.10 + s ≈ 0.10, because s is tiny.', gap: 0.5 },
      { say: 'So K s p equals s times zero point one zero, which equals one point eight times ten to the negative tenth.', cap: 'So Ksp = s(0.10) = 1.8 × 10⁻¹⁰.', gap: 0.4 },
      { say: 'Divide, and s is one point eight times ten to the negative ninth molar.', cap: 'Divide, and s = 1.8 × 10⁻⁹ M.', gap: 0.8 },
    ] },
    { id: 'compare', beats: [
      { say: 'Compare that with pure water.' },
      { say: 'There, the solubility is one point three times ten to the negative fifth molar.', cap: 'There, the solubility is 1.3 × 10⁻⁵ M.', gap: 0.5 },
      { say: 'In the salt water, it is about seven thousand five hundred times less.', cap: 'In the salt water, it is about 7,500 times less.', gap: 0.5 },
      { say: 'The chloride concentration is already high, so only a tiny amount of silver ion can exist alongside it before Q reaches K s p.', cap: 'The Cl⁻ concentration is already high, so only a tiny amount of Ag⁺ can exist alongside it before Q reaches Ksp.', gap: 0.8 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's the shortcut that made that easy: ignore the tiny s." },
      { say: "When the common ion's concentration is much bigger than s, drop the plus s.", cap: "When the common ion's concentration is much bigger than s, drop the \"+ s\".", gap: 0.5 },
      { say: 'Zero point one zero plus one point eight times ten to the negative ninth is still about zero point one zero.', cap: '0.10 + 1.8 × 10⁻⁹ ≈ 0.10', gap: 0.5 },
      { say: 'That turns a cubic or a quadratic into simple division.', gap: 0.5 },
      { say: 'Check it after you solve: s is far less than five percent of zero point one zero, so the shortcut is excellent.', cap: 'Check it after you solve: s is far less than 5% of 0.10, so the shortcut is excellent.', gap: 0.8 },
    ] },
    { id: 'squared', beats: [
      { say: 'Watch out when the common ion is squared.' },
      { say: 'K s p of calcium fluoride is three point nine times ten to the negative eleventh. Find its solubility in zero point zero one zero molar sodium fluoride.', cap: 'Ksp of CaF₂ = 3.9 × 10⁻¹¹. Find its solubility in 0.010 M NaF.', gap: 0.5 },
      { say: 'K s p equals calcium ion, times fluoride ion squared.', cap: 'Ksp = [Ca²⁺][F⁻]²', gap: 0.4 },
      { say: 'Calcium is s, and fluoride is about zero point zero one zero.', cap: '[Ca²⁺] = s, and [F⁻] ≈ 0.010.', gap: 0.4 },
      { say: 'So s times zero point zero one zero squared equals three point nine times ten to the negative eleventh.', cap: 's(0.010)² = 3.9 × 10⁻¹¹', gap: 0.4 },
      { say: 'Divide by one point zero times ten to the negative fourth, and s is three point nine times ten to the negative seventh molar.', cap: 's = 3.9 × 10⁻¹¹ / 1.0 × 10⁻⁴ = 3.9 × 10⁻⁷ M', gap: 0.8 },
    ] },
    { id: 'precip', beats: [
      { say: 'A common ion can also make a solid appear.' },
      { say: 'Add sodium sulfate to a saturated solution of barium sulfate.', cap: 'Add Na₂SO₄ to a saturated BaSO₄ solution.', gap: 0.5 },
      { say: 'The extra sulfate makes Q greater than K s p.', cap: 'The extra SO₄²⁻ makes Q > Ksp.', gap: 0.4 },
      { say: 'The equilibrium shifts left, and barium sulfate precipitates.', cap: 'The equilibrium shifts left, and BaSO₄ precipitates.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, a common trap.' },
      { say: 'Does a common ion change K s p?', cap: 'Does a common ion change Ksp?', gap: 0.5 },
      { say: 'No. At the same temperature, K s p stays the same.', cap: 'No. At the same temperature, Ksp stays the same.', gap: 0.5 },
      { say: 'Only the solubility changes.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'In which solution is lead two chloride least soluble? Pure water, zero point one zero molar sodium nitrate, zero point one zero molar sodium chloride, or zero point one zero molar nitric acid?', cap: 'In which solution is PbCl₂ least soluble? Pure water, 0.10 M NaNO₃, 0.10 M NaCl, or 0.10 M HNO₃?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is sodium chloride.', cap: 'The answer is NaCl.', gap: 0.4 },
      { say: 'It supplies chloride, a common ion, which shifts the equilibrium to the left.', cap: 'It supplies Cl⁻, a common ion, which shifts PbCl₂(s) ⇌ Pb²⁺ + 2Cl⁻ to the left.', gap: 0.3 },
      { say: 'The others contain no common ion.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: "A common ion lowers solubility. Le Chatelier's principle shifts the equilibrium toward the solid.", cap: "A common ion lowers solubility. Le Châtelier's principle shifts the equilibrium toward the solid.", gap: 0.5 },
      { say: 'K s p stays the same. Only the solubility changes.', cap: 'Ksp stays the same. Only the solubility changes.', gap: 0.5 },
      { say: 'And the common ion concentration plus s is about the common ion concentration.', cap: 'And [common ion] + s ≈ [common ion].', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
