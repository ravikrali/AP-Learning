// Narration for chem-8.11 "pH & Solubility". Every fact comes from the lesson cards, quick checks and
// flashcards in app/src/content/chem/u8.ts (plus chem/book.ts: the three-link explanation with Q and Ksp,
// and acid rain dissolving marble because carbonate is a basic anion).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-8.11',
  title: 'pH & Solubility',
  course: 'AP® Chemistry',
  unit: 'Unit 8 · Acids and Bases',
  unitId: 'chem-u8',
  unitTitle: 'Acids and Bases',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'P H and solubility.', cap: 'pH and solubility.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn when acid makes a salt more soluble, when it makes no difference, and how to explain it.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Acid rain slowly dissolves marble statues.', gap: 0.3 },
      { say: 'Marble is calcium carbonate.', cap: 'Marble is calcium carbonate, CaCO₃.', gap: 0.5 },
      { say: "But acid doesn't dissolve table salt any faster than plain water would.", gap: 0.5 },
      { say: 'So why does acid matter for some salts and not for others?', gap: 0.8 },
    ] },
    { id: 'when', beats: [
      { say: "Here's the rule." },
      { say: "A salt's solubility depends on P H when one of its ions is a weak acid, a weak base, or hydroxide.", cap: "A salt's solubility depends on pH when one of its ions is a weak acid, a weak base, or hydroxide.", gap: 0.5 },
      { say: 'Why? Because those ions can react with the acid or base you add.', gap: 0.4 },
      { say: 'And when an ion is removed, the solubility equilibrium shifts.', gap: 0.8 },
    ] },
    { id: 'carbonate', beats: [
      { say: 'Start with calcium carbonate.', gap: 0.3 },
      { say: 'A little of the solid dissolves into calcium ions and carbonate ions.', cap: 'A little of the solid dissolves into Ca²⁺ ions and CO₃²⁻ ions.', gap: 0.4 },
      { say: 'Carbonate is a weak base.', cap: 'Carbonate, CO₃²⁻, is a weak base.', gap: 0.4 },
      { say: 'Now add acid. Hydronium reacts with the carbonate and removes it.', cap: 'Now add acid. H₃O⁺ reacts with the CO₃²⁻ and removes it.', gap: 0.4 },
      { say: "By Le Chatelier's principle, the equilibrium shifts right, to replace what was removed.", cap: "By Le Châtelier's principle, the equilibrium shifts right, to replace what was removed.", gap: 0.4 },
      { say: 'So more calcium carbonate dissolves. That is what acid rain does to marble.', cap: 'So more CaCO₃ dissolves. That is what acid rain does to marble.', gap: 0.8 },
    ] },
    { id: 'hydroxide', beats: [
      { say: 'Hydroxides work the same way.' },
      { say: 'Magnesium hydroxide dissolves into one magnesium ion and two hydroxide ions.', cap: 'Mg(OH)₂ dissolves into one Mg²⁺ ion and two OH⁻ ions.', gap: 0.4 },
      { say: 'Adding acid removes hydroxide, so more of the solid dissolves.', cap: 'Adding acid removes OH⁻, so more of the solid dissolves.', gap: 0.5 },
      { say: 'This means a lower P H gives a higher solubility.', cap: 'This means a lower pH gives a higher solubility.', gap: 0.4 },
      { say: 'For example, iron three hydroxide is most soluble at P H two, not at P H seven, ten or thirteen.', cap: 'For example, Fe(OH)₃ is most soluble at pH 2, not at pH 7, 10 or 13.', gap: 0.4 },
      { say: 'Low P H means lots of hydronium, to pull away the hydroxide.', cap: 'Low pH means lots of H₃O⁺, to pull away the OH⁻.', gap: 0.8 },
    ] },
    { id: 'explain', beats: [
      { say: 'On the exam, explain it in three links.', gap: 0.4 },
      { say: 'One: in acid, hydronium reacts with hydroxide from the dissolved solid, forming water.', cap: 'One: in acid, H₃O⁺ reacts with OH⁻ from the dissolved solid, forming water.', gap: 0.4 },
      { say: 'Two: this lowers the hydroxide concentration, so Q becomes less than K s p.', cap: 'Two: this lowers [OH⁻], so Q = [Mg²⁺][OH⁻]² becomes less than Ksp.', gap: 0.4 },
      { say: 'Three: more magnesium hydroxide dissolves, until Q again equals K s p.', cap: 'Three: more Mg(OH)₂ dissolves, until Q again equals Ksp.', gap: 0.5 },
      { say: 'Keep it qualitative. These calculations are not on the exam.', gap: 0.8 },
    ] },
    { id: 'nochange', beats: [
      { say: 'Now the salts that acid leaves alone.', gap: 0.3 },
      { say: 'Look at the anion. If it is the conjugate base of a strong acid, like chloride, bromide, iodide or nitrate, it does not react with hydronium.', cap: 'Look at the anion. If it is the conjugate base of a strong acid, like Cl⁻, Br⁻, I⁻ or NO₃⁻, it does not react with H₃O⁺.', gap: 0.4 },
      { say: 'Take silver chloride.', cap: 'Take AgCl.', gap: 0.3 },
      { say: 'Hydrochloric acid is strong, so chloride is a negligible base.', cap: 'HCl is strong, so Cl⁻ is a negligible base.', gap: 0.4 },
      { say: 'The hydronium does not remove it, so the equilibrium does not shift.', cap: 'The H₃O⁺ does not remove it, so the equilibrium does not shift.', gap: 0.4 },
      { say: 'The solubility of silver chloride is not affected by acid. Table salt is the same story.', cap: 'The solubility of AgCl is not affected by acid. Table salt is the same story.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: "Here's the trap." },
      { say: 'Adding acid does not raise K s p.', cap: 'Adding acid does not raise Ksp.', gap: 0.4 },
      { say: 'Acid only matters when it can remove an ion, and that shifts the equilibrium.', gap: 0.4 },
      { say: 'So ask one question about the anion: does it come from a weak acid or a strong one?', gap: 0.4 },
      { say: 'Weak acid, like carbonate or fluoride: acid helps it dissolve.', cap: 'Weak acid, like CO₃²⁻ or F⁻: acid helps it dissolve.', gap: 0.4 },
      { say: 'Strong acid, like chloride or nitrate: no effect.', cap: 'Strong acid, like Cl⁻ or NO₃⁻: no effect.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: "Which salt's solubility increases the most when nitric acid is added?", cap: "Which salt's solubility increases the most when HNO₃ is added?", gap: 0.5 },
      { say: 'A: silver chloride.', cap: 'A: AgCl', gap: 0.3 },
      { say: 'B: silver bromide.', cap: 'B: AgBr', gap: 0.3 },
      { say: 'C: lead two iodide.', cap: 'C: PbI₂', gap: 0.3 },
      { say: 'D: calcium fluoride.', cap: 'D: CaF₂', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is D.', gap: 0.4 },
      { say: 'H F is a weak acid, so fluoride is a weak base. Acid removes it and shifts calcium fluoride toward dissolving.', cap: 'HF is a weak acid, so F⁻ is a weak base. Acid removes it and shifts CaF₂ toward dissolving.', gap: 0.4 },
      { say: "Chloride, bromide and iodide come from strong acids, so they aren't affected.", cap: "Cl⁻, Br⁻ and I⁻ come from strong acids, so they aren't affected.", gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: "If the anion is a weak base or hydroxide, acid increases solubility, by Le Chatelier's principle.", cap: "If the anion is a weak base or OH⁻, acid increases solubility, by Le Châtelier's principle.", gap: 0.5 },
      { say: 'If the anion comes from a strong acid, like chloride or nitrate, P H has no effect.', cap: 'If the anion comes from a strong acid, like Cl⁻ or NO₃⁻, pH has no effect.', gap: 0.5 },
      { say: "Explain it qualitatively. These calculations aren't on the exam.", gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
