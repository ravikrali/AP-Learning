# AP Chemistry: accuracy report

Source: AP Chemistry CED, effective Fall 2024, with the Equations and Constants sheet "effective 2025" printed in its
Appendix 2 (`source/`, downloaded 2026-10-19).

## What the tests guarantee (`cd app && npm test`)

- Every numeric answer and worked-example number that carries a `compute` / `verify` is recomputed by code from
  `app/src/lib/chem.ts` (molar masses from the periodic table data, constants R, F, h, c, N_A, K_w).
- Every `[[eq: …]]` equation is balanced in atoms and charge, and every `{{formula}}` parses.
- Every one of the CED topics 1.1–9.11 is taught, only real topic numbers are used, unit titles and weights equal the
  CED, and every lesson is tagged with the course's CED edition (`cedVersion: 'Fall 2024'`).
- FRQs: 3 long × 10 points and 4 short × 4 points, as on the exam; FRQ numbers are recomputed and FRQ equations balance.
- Glossary: at least 100 unique terms, every unit covered, and each term (or its `find` text) appears in the lesson it
  links to. The test checks that the word appears, not that the definition is right; the definitions were checked by
  hand below. Some `find` strings are very short (`K`, `Q`, `pi`, `rate`), so for those terms the test proves little.
- Every unit has smart tricks (hack cards) to show behind the bulb.

## Wording decisions taken from the CED

- "Thermodynamically favored", not "spontaneous" (9.3.A.2).
- The only solubility rule taught for memorizing: all Na⁺, K⁺, NH₄⁺ and NO₃⁻ salts are soluble (4.7.A.5 and its
  exclusion statement). Ksp > 1 is linked to "soluble" (7.11.A.3).
- Strong acids: HCl, HBr, HI, HClO₄, H₂SO₄, HNO₃; strong bases: Group 1 and 2 hydroxides (8.2.A.1–2, 8.6.A.1).
- H₃O⁺ and H⁺ are both accepted (8.1.A.1).
- Le Châtelier's principle is not used for working electrochemical cells; reasoning uses Q, K and the Nernst equation
  qualitatively (9.10.A.2, 9.10.A.4).
- "London dispersion forces" is not used as a synonym for "van der Waals forces" (3.1.A.1.iii).
- Exclusions are stated as such in the lessons: quantum numbers and aufbau exceptions (1.5, 1.7), mass spectra of
  more than one element (1.2), specific crystal structures (2.3), d-orbital hybridization and hybrid-orbital drawings
  (2.7), phase diagrams (3.3), colligative properties, molality and mass/volume percent (3.8), "oxidizing/reducing
  agent" (4.7), Lewis acids (4.8), Arrhenius calculations (5.6), Kc ↔ Kp conversion (7.3), pH change after adding acid
  or base to a buffer (8.9), solubility-vs-pH calculations (8.11), labeling electrodes + or − (9.8).
- Statements that a formula is "on your equation sheet" were checked against Appendix 2; all are correct (metric
  prefixes, both R values, STP and 22.4 L/mol, the integrated rate laws, pH/pOH, Henderson–Hasselbalch, ΔG° = −RT ln K).

## Known CED inconsistency

None found.

## Copyright

All lessons, questions and FRQs are original. The CED's two sample free-response questions (a photoelectron spectrum
of an unknown element; sulfur and its compounds) are not reused. Some multiple-choice items share a topic with CED
sample questions (Kw at a temperature other than 25 °C, a common-ion AgCl comparison, an E°cell from two half-cells), but
the contexts and numbers differ.

## Independent review pass, 2026-10-19

I checked the glossary, all 104 hack and trap cards (the "tips" shown behind the bulb come from these cards and the
lesson summaries, see `app/src/lib/tips.ts`), the 7 FRQs, and every lesson in units 0–9 (98 lessons, 391 questions,
including the checkpoint pools that the mock exam draws from), against the topic pages of the Fall 2024 CED
(`source/ced-compact.txt`) and its equation sheet. I did not write the course.

**What changed after the 2026-10-08 reviews.** I diffed `app/src/content/chem/` from the first commit (`f8c72b2`,
2026-10-08) to `main`. The only new content is `glossary.ts` (130 terms) and `youtube.ts` (video links). The lesson files
gained only the `cedVersion` tags. The change to `frq.ts` in `3ecf7c6` moved the `Frq` / `FrqPart` types to
`content/types.ts`; no FRQ text changed. The hack and trap cards date from 2026-10-08, but they are now shown on their
own as tips, so I read every one.

**Scope.** Every lesson maps to a real topic number. Nothing outside the CED is taught as testable; the excluded
material is labeled as excluded. The equivalence-pH and indicator examples, PES reading, the Maxwell–Boltzmann
description, the IMF ranking and the electrochemistry conventions all match the topic pages.

**Checked against the CED and found correct:** all 130 glossary definitions (each one read for correctness, not just
presence; two corrected, see below); every hack and trap card; conditions and sign conventions for ΔH, ΔS, ΔG, E° and K
(6.1, 6.6, 9.1–9.5, 9.9); the ΔH°/ΔS° sign table (9.3.A.6); the catalysis types (5.11.A.3–5); rate-law, integrated-rate-law
and half-life rules (5.2–5.3); mechanism and pre-equilibrium reasoning (5.7–5.9); buffer and buffer-capacity statements
(8.8–8.10); the pH-and-solubility rule (8.11.A.1); concentration cells (9.10.A.3).
I recomputed by hand the numbers that `verify` doesn't cover, including: every FRQ number and the rubric point totals
(10 / 10 / 10 / 4 / 4 / 4 / 4); the equivalence-point pH of the weak-acid FRQ (8.73, so phenolphthalein is right); the
crossover temperatures (464 K, 1110 K, 333 K, 400 K); K = e^{13.3} ≈ 6 × 10⁵; Cu plating (1.19 g) and the Al time (2,890 s).
I also checked the physical data quoted in the text: boiling points (CH₄, H₂O, HF, HCl, H₂S, I₂, n-pentane, neopentane,
dimethyl ether), melting points (NaF, NaI, I₂, quartz), bond lengths and energies (C–C, C=C, C≡C, H–H, Cl–Cl, H–Cl,
F–F, H–F, C–H, C–Cl), successive ionization energies (Mg, Al), isotope abundances (Cl, B, Mg, Cu), ΔH°f and S° values,
ΔH_fus and ΔH_vap of water, Ka/Kb/pKa values (acetic acid, HF, HNO₂, HCN, NH₃/NH₄⁺, H₂PO₄⁻), Ksp values (AgCl, AgBr,
AgI, CaF₂), standard reduction potentials (Ag, Cu, Zn, Ni) and ATP hydrolysis (−30.5 kJ/mol).

**Fixed:**

| Where | Problem | Fix | CED |
|---|---|---|---|
| Lesson 1.6 (PES), hack "Decode any PES in 3 steps" | Listed peaks from high to low binding energy as "…3p, 4s, 3d". The 3d peak lies at higher binding energy than 4s, so a student reading a transition-metal spectrum in that order would assign the peaks wrongly | Now "…3p, then 3d before 4s", with the reason (it is why 4s electrons are removed first, as lesson 1.5 teaches) | 1.6.A.1, 1.5.A.4 |
| Glossary, "Bond energy" | "Shorter bonds and multiple bonds are stronger" is false across different atom pairs (F–F, 142 pm, is weaker than C–C, 154 pm) | Now "Between the same two atoms, a higher bond order (double or triple) gives a shorter, stronger bond" | 2.2.A.2 |
| Glossary, "Hydrogen bonding" | Mentioned only a nearby molecule | Adds "or of another part of the same molecule" | 3.1.A.4 |
| Lesson 2.1, hack "Quick bond-type sorter" | "Ionic solids conduct when melted or dissolved, and molecular substances don't": some molecular substances (HCl, other acids) do conduct once dissolved | Now compares conduction when **melted** only | 2.1.A.4, 3.2.A.3, 3.2.A.5 |
| Lesson 8.3a, hook | "Only about 1% of vinegar's molecules give up a proton": at vinegar strength (about 0.8 M) it is about 0.5% | Now "fewer than 1%" | 8.3.A.1 |
| Lesson 8.3a, worked example | pH computed as −log(1.3 × 10⁻³) = 2.87, but that expression is 2.89; 2.87 comes from the unrounded x | Shows x = 1.34 × 10⁻³ M in every step; `verify` updated to match | 8.3.A.2 |
| FRQ "A Weak Acid Titration" (d) | "pKa = −log(1.8 × 10⁻⁵) = 4.75", but that is 4.74; 4.75 comes from the unrounded Ka (1.76 × 10⁻⁵) | Answer shows −log(1.76 × 10⁻⁵) = 4.75 and says the rounded Ka gives 4.74; rubric accepts either | 8.5.A.3 |
| Lesson 4.5a, check question q1 | Explanation showed 0.499 mol × 44.01 = 21.9 g (that product is 22.0) | Shows 8.00 ÷ 16.042 = 0.4987 mol → 21.9 g | 4.5.A.2 |

**Left as is (owner decision):**

- `youtube.ts` (video links added after 2026-10-08) was not reviewed. It contains links, not chemistry; a test checks
  that each lesson has two well-formed links.
- Lesson 5.10 says the step with the larger activation energy is rate-determining. That is the usual AP-level reading
  of a multistep energy profile and is consistent with 5.10.A.1. A stricter reading compares the heights of the transition
  states, not only each step's own climb. No change made.
- The glossary `find` strings `K`, `Q`, `pi` and `rate` make the "term appears in the lesson" test pass trivially. If the
  owner wants the test to mean more, change them to `equilibrium constant`, `reaction quotient`, `π bond` and
  `reaction rate` (each appears in its lesson).

`cd app && npm test`: 8 files, 147 tests passed (2026-10-19, after the fixes).
