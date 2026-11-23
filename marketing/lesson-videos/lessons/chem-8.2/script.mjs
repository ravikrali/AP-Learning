// Narration for chem-8.2 "Strong Acids & Strong Bases". Every fact comes from the lesson cards, quick
// checks and flashcards in app/src/content/chem/u8.ts (plus chem/book.ts: what "strong" means, and the
// tenfold-dilution example). The card says "Group 1 and Group 2 hydroxides"; the video names the Group 2
// examples the card gives (calcium and barium hydroxide) rather than claiming every Group 2 hydroxide.
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`). `gap` = silence after.
export default {
  id: 'chem-8.2',
  title: 'Strong Acids & Strong Bases',
  course: 'AP® Chemistry',
  unit: 'Unit 8 · Acids and Bases',
  unitId: 'chem-u8',
  unitTitle: 'Acids and Bases',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Strong acids and strong bases.', cap: 'Strong acids & strong bases.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn which acids and bases are strong, and how to get their pH in one step.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Strong acids are the easy ones.', gap: 0.4 },
      { say: 'They ionize one hundred percent.', cap: 'They ionize 100%.', gap: 0.5 },
      { say: 'Every acid molecule gives its proton to water, and makes a hydronium ion.', cap: 'Every acid molecule gives its proton to water, and makes an H₃O⁺ ion.', gap: 0.5 },
      { say: 'So the acid concentration is the hydronium concentration.', cap: 'So the acid concentration is the H₃O⁺ concentration.', gap: 0.5 },
      { say: 'One step, and you have the pH.', gap: 0.8 },
    ] },
    { id: 'acids', beats: [
      { say: 'There are six strong acids to memorize.', gap: 0.4 },
      { say: 'Hydrochloric, hydrobromic, and hydroiodic acid.', cap: 'HCl, HBr, and HI.', gap: 0.4 },
      { say: 'Perchloric acid, and nitric acid.', cap: 'HClO₄ and HNO₃.', gap: 0.4 },
      { say: 'And sulfuric acid.', cap: 'And H₂SO₄.', gap: 0.5 },
      { say: 'Each one is completely ionized, so the hydronium concentration equals the acid concentration.', cap: 'Each one is completely ionized, so [H₃O⁺] = [acid].', gap: 0.5 },
      { say: 'One detail: for sulfuric acid, only the first proton is strong.', cap: 'One detail: for H₂SO₄, only the first proton is strong.', gap: 0.8 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a quick way to remember them: So I Brought No Clean Clothes.", gap: 0.5 },
      { say: 'So, for sulfuric acid. I, for hydroiodic. Brought, for hydrobromic.', cap: 'So: H₂SO₄. I: HI. Brought: HBr.', gap: 0.4 },
      { say: 'No, for nitric. Clean, for hydrochloric. And Clothes, for perchloric.', cap: 'No: HNO₃. Clean: HCl. Clothes: HClO₄.', gap: 0.5 },
      { say: 'For AP Chemistry, treat any acid that is not on this list as weak.', cap: 'For AP® Chemistry, treat any acid that is not on this list as weak.', gap: 0.4 },
      { say: 'Like hydrofluoric acid, acetic acid, and carbonic acid.', cap: 'Like HF, CH₃COOH, and H₂CO₃.', gap: 0.8 },
    ] },
    { id: 'strong', beats: [
      { say: 'So what does strong really mean?', gap: 0.4 },
      { say: 'It describes how far the acid ionizes.', gap: 0.4 },
      { say: 'Not how concentrated it is, and not how dangerous it is.', gap: 0.5 },
      { say: 'A strong acid breaks up completely into ions.', gap: 0.4 },
      { say: 'A weak acid only partly ionizes. Most of it stays as molecules.', gap: 0.5 },
      { say: 'So a dilute solution of a strong acid can be less acidic than a concentrated solution of a weak acid.', gap: 0.8 },
    ] },
    { id: 'salts', beats: [
      { say: "There's a bonus.", gap: 0.4 },
      { say: "A strong acid's conjugate base, like chloride or nitrate, is so weak that it has no measurable effect on pH.", cap: "A strong acid's conjugate base, like Cl⁻ or NO₃⁻, is so weak that it has no measurable effect on pH.", gap: 0.5 },
      { say: 'That is why salts such as sodium chloride and potassium nitrate give neutral solutions.', cap: 'That is why salts such as NaCl and KNO₃ give neutral solutions.', gap: 0.8 },
    ] },
    { id: 'bases', beats: [
      { say: 'Now the strong bases: Group one hydroxides, and Group two hydroxides like calcium and barium hydroxide.', cap: 'Now the strong bases: Group 1 hydroxides, and Group 2 hydroxides like Ca(OH)₂ and Ba(OH)₂.', gap: 0.4 },
      { say: 'They dissociate completely too.', gap: 0.5 },
      { say: 'A Group one hydroxide, like sodium hydroxide or potassium hydroxide, gives one hydroxide ion per formula unit.', cap: 'A Group 1 hydroxide, like NaOH or KOH, gives one OH⁻ per formula unit.', gap: 0.3 },
      { say: 'So the hydroxide concentration equals the base concentration.', cap: 'So [OH⁻] = [base].', gap: 0.5 },
      { say: 'A Group two hydroxide gives two hydroxide ions.', cap: 'A Group 2 hydroxide gives two OH⁻ ions.', gap: 0.3 },
      { say: 'So the hydroxide concentration is two times the base concentration.', cap: 'So [OH⁻] = 2 × [base].', gap: 0.5 },
      { say: 'Zero point one zero molar calcium hydroxide gives zero point two zero molar hydroxide.', cap: '0.10 M Ca(OH)₂ gives [OH⁻] = 0.20 M.', gap: 0.8 },
    ] },
    { id: 'example', beats: [
      { say: "Let's try a Group two base. What is the pH of zero point zero zero five zero molar barium hydroxide?", cap: "Let's try a Group 2 base. What is the pH of 0.0050 M Ba(OH)₂?", gap: 0.5 },
      { say: 'Step one: two hydroxides per formula unit, so the hydroxide concentration is two times zero point zero zero five zero. That is zero point zero one zero molar.', cap: 'Step one: two OH⁻ per formula unit, so [OH⁻] = 2 × 0.0050 = 0.010 M.', gap: 0.5 },
      { say: 'Step two: pOH is the negative log of zero point zero one zero. That is two point zero zero.', cap: 'Step two: pOH = −log(0.010) = 2.00.', gap: 0.5 },
      { say: 'Step three: pH is fourteen point zero zero minus two point zero zero. The pH is twelve point zero zero.', cap: 'Step three: pH = 14.00 − 2.00 = 12.00.', gap: 0.6 },
      { say: 'Compare a Group one base: zero point zero zero one zero molar potassium hydroxide.', cap: 'Compare a Group 1 base: 0.0010 M KOH.', gap: 0.4 },
      { say: 'No doubling here. The hydroxide concentration is zero point zero zero one zero, pOH is three point zero zero, and pH is eleven point zero zero.', cap: 'No doubling here: [OH⁻] = 0.0010 M, pOH = 3.00, pH = 11.00.', gap: 0.8 },
    ] },
    { id: 'dilute', beats: [
      { say: 'Here is a handy pattern for strong acids.', gap: 0.4 },
      { say: 'Each tenfold dilution raises the pH by one unit.', gap: 0.5 },
      { say: 'Zero point zero one zero molar nitric acid has a pH of two point zero zero.', cap: '0.010 M HNO₃ has a pH of 2.00.', gap: 0.4 },
      { say: 'Dilute it tenfold to zero point zero zero one zero molar, and the pH is three point zero zero.', cap: 'Dilute it tenfold to 0.0010 M, and the pH is 3.00.', gap: 0.5 },
      { say: 'But there is a limit. However far you dilute an acid, the pH cannot rise above seven, because water itself contributes hydronium.', cap: 'But there is a limit. However far you dilute an acid, the pH cannot rise above 7, because water itself contributes H₃O⁺.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, a common trap.' },
      { say: 'Which of these is a weak acid? Hydrochloric, nitric, hydrofluoric, or perchloric?', cap: 'Which of these is a weak acid? HCl, HNO₃, HF, or HClO₄?', gap: 0.5 },
      { say: 'Hydrofluoric acid looks a lot like the others, but it is not one of the six.', cap: 'HF looks a lot like the others, but it is not one of the six.', gap: 0.4 },
      { say: "So it's weak: only partly ionized.", gap: 0.5 },
      { say: 'Remember the rule: if an acid is not on the list, treat it as weak.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'What is the pH of zero point zero two five molar nitric acid?', cap: 'What is the pH of 0.025 M HNO₃?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is one point six zero.', cap: 'The answer is 1.60.', gap: 0.4 },
      { say: 'Nitric acid is a strong acid, so the hydronium concentration is zero point zero two five molar.', cap: 'HNO₃ is a strong acid, so [H₃O⁺] = 0.025 M.', gap: 0.3 },
      { say: 'The negative log of zero point zero two five is one point six zero.', cap: 'pH = −log(0.025) = 1.60.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Six strong acids. For each one, the hydronium concentration equals the acid concentration.', cap: 'Six strong acids: [H₃O⁺] = [acid].', gap: 0.5 },
      { say: 'Group one hydroxides: hydroxide equals the base concentration. Group two: two times the base.', cap: 'Group 1 hydroxides: [OH⁻] = [base]. Group 2: [OH⁻] = 2[base].', gap: 0.5 },
      { say: 'And every other acid is weak.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
