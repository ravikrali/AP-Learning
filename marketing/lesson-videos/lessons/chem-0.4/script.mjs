// Narration for chem-0.4 "Naming Compounds & Polyatomic Ions". Every fact comes from the lesson cards and quick checks
// in app/src/content/chem/u0.ts. One entry per sentence: the voice reads `say`; captions show `cap`
// (or `say` when there is no `cap`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-0.4',
  title: 'Naming Compounds & Polyatomic Ions',
  course: 'AP® Chemistry',
  unit: 'Unit 0 · Chemistry Toolkit',
  unitId: 'chem-u0', // with unitTitle, names the folder the video is stored under
  unitTitle: 'Chemistry Toolkit',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Naming compounds and polyatomic ions.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn how to name ionic compounds, how to remember the polyatomic ions, and how to name molecular compounds.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'N a C l is table salt.', cap: 'NaCl is table salt.', gap: 0.6 },
      { say: 'N a C l O is bleach.', cap: 'NaClO is bleach.', gap: 0.6 },
      { say: 'One oxygen atom makes a big difference!', gap: 0.6 },
      { say: 'Names and formulas are the vocabulary of chemistry. Once you know them, problems become much easier to read.', gap: 0.9 },
    ] },
    { id: 'ionic', beats: [
      { say: 'An ionic compound is a cation, usually a metal, plus an anion.', gap: 0.6 },
      { say: 'The total charge must be zero.', gap: 0.6 },
      { say: 'To name it, say the cation name, then the anion name.', gap: 0.6 },
      { say: 'Sodium chloride. Single-atom anions end in i d e.', cap: 'NaCl = sodium chloride. Single-atom anions end in -ide.', gap: 0.6 },
      { say: 'A metal with more than one possible charge gets a Roman numeral. F e C l three is iron three chloride.', cap: 'FeCl₃ = iron(III) chloride.', gap: 0.9 },
    ] },
    { id: 'criss', beats: [
      { say: 'Now, writing the formula. Use the criss-cross trick.', gap: 0.6 },
      { say: 'Aluminum three plus, and oxide two minus. Cross the charge numbers, and you get A l two O three.', cap: 'Al³⁺ and O²⁻. Cross the charge numbers: Al₂O₃.', gap: 0.6 },
      { say: 'Then reduce if you can.', gap: 0.6 },
      { say: 'Magnesium two plus and oxide two minus gives M g two O two. Reduce it, and it is just M g O.', cap: 'Mg²⁺ and O²⁻ gives Mg₂O₂. Reduce it: MgO.', gap: 0.9 },
    ] },
    { id: 'poly', beats: [
      { say: 'Some anions are groups of atoms. These are polyatomic ions, and you need to memorize them.', gap: 0.6 },
      { say: 'Ammonium, N H four plus.', cap: 'Ammonium, NH₄⁺.', gap: 0.5 },
      { say: 'Hydroxide, O H minus. Nitrate, N O three minus. Nitrite, N O two minus.', cap: 'Hydroxide, OH⁻. Nitrate, NO₃⁻. Nitrite, NO₂⁻.', gap: 0.5 },
      { say: 'Sulfate, S O four two minus. Sulfite, S O three two minus. Carbonate, C O three two minus.', cap: 'Sulfate, SO₄²⁻. Sulfite, SO₃²⁻. Carbonate, CO₃²⁻.', gap: 0.5 },
      { say: 'Phosphate, P O four three minus. Acetate, C two H three O two minus.', cap: 'Phosphate, PO₄³⁻. Acetate, C₂H₃O₂⁻.', gap: 0.5 },
      { say: 'And more: permanganate, dichromate, and cyanide.', cap: 'And more: permanganate MnO₄⁻, dichromate Cr₂O₇²⁻, cyanide CN⁻.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: 'Here is a memory trick. Nick the Camel ate a Clam for Supper in Phoenix.', gap: 0.6 },
      { say: 'The consonants in each word are the number of oxygens. The vowels are the negative charge.', gap: 0.6 },
      { say: 'Nick has three consonants and one vowel. That is nitrate, N O three minus.', cap: 'Nick: 3 consonants, 1 vowel. Nitrate, NO₃⁻.', gap: 0.6 },
      { say: 'Camel has three consonants and two vowels. Carbonate, C O three two minus.', cap: 'Camel: 3 consonants, 2 vowels. Carbonate, CO₃²⁻.', gap: 0.6 },
      { say: 'Clam is chlorate. Supper is sulfate, four oxygens, two minus. Phoenix is phosphate, four oxygens, three minus.', cap: 'Clam: chlorate, ClO₃⁻. Supper: sulfate, SO₄²⁻. Phoenix: phosphate, PO₄³⁻.', gap: 0.6 },
      { say: 'Then, i t e means one fewer oxygen, with the same charge. N O two minus is nitrite.', cap: 'Then -ite means one fewer oxygen, same charge. NO₂⁻ is nitrite.', gap: 0.9 },
    ] },
    { id: 'mol', beats: [
      { say: 'Molecular compounds are two nonmetals. These use Greek prefixes.', gap: 0.6 },
      { say: 'Mono, di, tri, tetra, penta, hexa.', gap: 0.6 },
      { say: 'C O two is carbon dioxide.', cap: 'CO₂ is carbon dioxide.', gap: 0.5 },
      { say: 'N two O four is dinitrogen tetroxide.', cap: 'N₂O₄ is dinitrogen tetroxide.', gap: 0.5 },
      { say: 'C O is carbon monoxide. We skip mono on the first element.', cap: 'CO is carbon monoxide. We skip "mono" on the first element.', gap: 0.6 },
      { say: 'But no prefixes for ionic compounds! C a C l two is calcium chloride, not calcium dichloride.', cap: 'No prefixes for ionic compounds! CaCl₂ is calcium chloride, not calcium dichloride.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, a common trap.', gap: 0.5 },
      { say: "Don't change the formula inside a polyatomic ion to balance charges.", gap: 0.6 },
      { say: 'Sulfate is always S O four.', cap: 'Sulfate is always SO₄.', gap: 0.6 },
      { say: 'To get two of them, write S O four in parentheses, with a two. Never S two O eight.', cap: 'To get two of them, write (SO₄)₂. Never S₂O₈.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'What is the formula of calcium phosphate? Ca P O four, Ca three P O four twice, Ca two P O four three times, or Ca P O four twice?', cap: 'What is the formula of calcium phosphate? CaPO₄, Ca₃(PO₄)₂, Ca₂(PO₄)₃, or Ca(PO₄)₂?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B, Ca three, P O four, twice.', cap: 'The answer is B, Ca₃(PO₄)₂.', gap: 0.4 },
      { say: 'Three calcium two plus ions make plus six. Two phosphate three minus ions make minus six. The total is zero.', cap: '3 Ca²⁺ = +6. 2 PO₄³⁻ = −6. The total is 0.', gap: 0.4 },
      { say: 'Use parentheses when you need more than one polyatomic ion.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Ionic: charges must add to zero. Use the criss-cross trick, then reduce.', gap: 0.5 },
      { say: 'Memorize the polyatomic ions with Nick the Camel. i t e has one less oxygen than a t e.', gap: 0.5 },
      { say: 'Molecular, nonmetal plus nonmetal: use prefixes.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
