import type { Unit } from '../types'

const log = Math.log10
const Ka_acetic = 1.8e-5

export const unit8: Unit = {
  id: 'chem-u8',
  number: 8,
  title: 'Acids and Bases',
  weight: '11–15%',
  blurb: 'pH, strong vs. weak acids and bases, titration curves, buffers and the Henderson–Hasselbalch equation. One of the most heavily tested units.',
  badge: { name: 'pH Pro', emoji: '🧪' },
  lessons: [
    // ---------------- FOUNDATION ----------------
    {
      id: 'chem-8.1',
      ced: ['8.1'],
      title: 'pH, pOH & Water',
      level: 'foundation',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'Lemon juice has a pH of about 2, and bleach is around 12. That 10-unit gap means lemon juice has about **10 billion times** more H₃O⁺ than bleach. The pH scale squeezes huge numbers into small, friendly ones.',
        },
        {
          kind: 'concept',
          title: 'The definitions (on your equation sheet)',
          body: '**pH = −log[H₃O⁺]**    **pOH = −log[OH⁻]**\n\nH₃O⁺ (hydronium) and H⁺ are used interchangeably. Both are accepted on the AP exam.\n\n- pH < 7: acidic\n- pH = 7: neutral (at 25 °C)\n- pH > 7: basic\n\nEach pH unit = a **10×** change in [H₃O⁺].',
        },
        {
          kind: 'concept',
          title: 'Water ionizes itself',
          body: '[[eq: 2H2O(l) <=> H3O^+(aq) + OH^-(aq)]]\n\n**Kw = [H₃O⁺][OH⁻] = 1.0 × 10^{-14}** at 25 °C\n**pH + pOH = 14** at 25 °C\n\nIn pure water [H₃O⁺] = [OH⁻], so pH = pOH = 7.0 at 25 °C. Kw depends on **temperature**, so at other temperatures neutral water\'s pH isn\'t exactly 7. It\'s still neutral, because [H₃O⁺] = [OH⁻].',
        },
        {
          kind: 'example',
          title: 'Go around the "pH square"',
          problem: 'A solution has [OH⁻] = **2.5 × 10^{-4} M**. Find pOH, pH and [H₃O⁺].',
          steps: [
            'pOH = −log(2.5 × 10^{-4}) = **3.60**',
            'pH = 14.00 − 3.60 = **10.40** (basic)',
            '[H₃O⁺] = 10^{-10.40} = **4.0 × 10^{-11} M**',
          ],
          answer: 'pOH 3.60, pH 10.40, [H₃O⁺] = 4.0 × 10⁻¹¹ M',
          verify: [
            { stated: 3.6, compute: () => -log(2.5e-4) },
            { stated: 10.4, compute: () => 14 + log(2.5e-4) },
            { stated: 4.0e-11, compute: () => 1e-14 / 2.5e-4 },
          ],
        },
        {
          kind: 'hack',
          title: 'The pH square',
          body: 'Picture four corners: **[H₃O⁺] ↔ pH ↔ pOH ↔ [OH⁻]**\n\n- [ ] → p: take **−log**\n- p → [ ]: take **10^{−p}**\n- pH ↔ pOH: **14 minus**\n- [H₃O⁺] ↔ [OH⁻]: **Kw ÷**\n\nSig fig trick: the number of **decimal places** in pH = the number of sig figs in the concentration.',
        },
        {
          kind: 'try',
          question: {
            id: 'c8.1-t1',
            type: 'num',
            prompt: 'What is the pH of a solution with [H₃O⁺] = **1.0 × 10^{-3} M**?',
            answer: 3.0,
            explain: 'pH = −log(1.0 × 10^{-3}) = **3.00**',
            compute: () => -log(1.0e-3),
          },
        },
        {
          kind: 'summary',
          points: [
            'pH = −log[H₃O⁺]. pOH = −log[OH⁻].',
            'Kw = 1.0 × 10⁻¹⁴ and pH + pOH = 14 at 25 °C.',
            'Kw changes with temperature. Neutral means [H₃O⁺] = [OH⁻].',
          ],
        },
      ],
      check: [
        {
          id: 'c8.1-q1',
          type: 'num',
          prompt: 'A solution has pH = 4.00. What is [OH⁻]?',
          answer: 1.0e-10,
          unit: 'M',
          explain: 'pOH = 14.00 − 4.00 = 10.00 → [OH⁻] = **1.0 × 10^{-10} M**',
          compute: () => 10 ** -(14 - 4),
        },
        {
          id: 'c8.1-q2',
          type: 'mcq',
          prompt: 'Solution A has pH 3 and solution B has pH 5. Compared to B, A has…',
          choices: ['2× more H₃O⁺', '20× more H₃O⁺', '100× more H₃O⁺', '2× less H₃O⁺'],
          answer: 2,
          explain: 'Each pH unit is 10×. Two units = 10² = **100×** more H₃O⁺.',
        },
        {
          id: 'c8.1-q3',
          type: 'mcq',
          prompt: 'At 50 °C, Kw = 5.5 × 10^{-14}, so pure water has a pH of about 6.6. This water is…',
          choices: ['acidic', 'basic', 'neutral', 'impossible'],
          answer: 2,
          explain: 'In pure water, [H₃O⁺] = [OH⁻] always, so it is **neutral**. Neutral pH is only exactly 7 at 25 °C.',
        },
      ],
      flashcards: [
        { front: 'pH definition', back: 'pH = −log[H₃O⁺]' },
        { front: 'Kw at 25 °C', back: '1.0 × 10⁻¹⁴ = [H₃O⁺][OH⁻]' },
        { front: 'pH + pOH = ? (25 °C)', back: '14' },
        { front: 'Is pure water at 50 °C (pH ≈ 6.6) acidic?', back: 'No. It\'s **neutral**, because [H₃O⁺] = [OH⁻]. Kw changes with temperature.' },
      ],
    },
    {
      id: 'chem-8.2',
      ced: ['8.2'],
      title: 'Strong Acids & Strong Bases',
      level: 'foundation',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Strong acids are the easy ones! They ionize **100%**, so the acid concentration *is* the H₃O⁺ concentration. One step, and you have the pH.',
        },
        {
          kind: 'concept',
          title: 'Memorize these',
          body: '**Strong acids (6):** HCl, HBr, HI, HClO₄, HNO₃, H₂SO₄\n→ completely ionized: **[H₃O⁺] = [acid]** (for H₂SO₄, only the first proton is strong)\n\n**Strong bases:** Group 1 and Group 2 hydroxides (NaOH, KOH, Ca(OH)₂, Ba(OH)₂…)\n→ completely dissociated:\n- Group 1: [OH⁻] = [base]\n- Group 2: [OH⁻] = **2 × [base]** (two OH⁻ per formula unit)',
        },
        {
          kind: 'hack',
          title: '"So I Brought No Clean Clothes"',
          body: 'A mnemonic for the strong acids:\n**S**o (H₂**S**O₄) **I** (HI) **Br**ought (HBr) **N**o (H**N**O₃) **Cl**ean (H**Cl**) **Cl**othes (H**Cl**O₄)\n\nFor AP purposes, treat any acid NOT on this list as **weak** (HF, CH₃COOH, H₂CO₃…).',
        },
        {
          kind: 'example',
          title: 'A Group 2 base',
          problem: 'What is the pH of **0.0050 M Ba(OH)₂**?',
          steps: ['[OH⁻] = 2 × 0.0050 = **0.010 M**', 'pOH = −log(0.010) = 2.00', 'pH = 14.00 − 2.00 = **12.00**'],
          answer: 'pH = 12.00',
          verify: [{ stated: 12.0, compute: () => 14 + log(2 * 0.005) }],
        },
        {
          kind: 'try',
          question: {
            id: 'c8.2-t1',
            type: 'num',
            prompt: 'What is the pH of **0.025 M HNO₃**?',
            answer: 1.602,
            tolerance: 0.01,
            explain: 'Strong acid → [H₃O⁺] = 0.025 M → pH = −log(0.025) = **1.60**',
            compute: () => -log(0.025),
          },
        },
        {
          kind: 'summary',
          points: [
            'Six strong acids: [H₃O⁺] = [acid].',
            'Group 1 hydroxides: [OH⁻] = [base]. Group 2: [OH⁻] = 2[base].',
            'Every other acid is weak.',
          ],
        },
      ],
      check: [
        {
          id: 'c8.2-q1',
          type: 'num',
          prompt: 'What is the pH of **0.0010 M KOH**?',
          answer: 11.0,
          explain: '[OH⁻] = 0.0010 → pOH = 3.00 → pH = **11.00**',
          compute: () => 14 + log(0.001),
        },
        {
          id: 'c8.2-q2',
          type: 'mcq',
          prompt: 'Which is a **weak** acid?',
          choices: ['HCl', 'HNO₃', 'HF', 'HClO₄'],
          answer: 2,
          explain: '**HF** is not among the six strong acids, so it\'s weak (only partly ionized).',
        },
      ],
      flashcards: [
        { front: 'The six strong acids', back: 'HCl, HBr, HI, HClO₄, HNO₃, H₂SO₄' },
        { front: '[OH⁻] in 0.10 M Ca(OH)₂?', back: '**0.20 M** (Group 2 → 2 OH⁻)' },
      ],
    },
    // ---------------- CORE ----------------
    {
      id: 'chem-8.3a',
      ced: ['8.3'],
      title: 'Weak Acids & Ka',
      level: 'core',
      minutes: 11,
      cards: [
        {
          kind: 'hook',
          body: 'Vinegar is acetic acid, but you can put it on salad! That\'s because only about **1%** of its molecules actually give up a proton. Weak acids are mostly "shy."',
        },
        {
          kind: 'concept',
          title: 'Ka: the acid dissociation constant',
          body: '[[eq: HA(aq) + H2O(l) <=> H3O^+(aq) + A^-(aq)]]\n\n**Ka = [H₃O⁺][A⁻] / [HA]**    **pKa = −log Ka**\n\n- Only a **small percentage** ionizes, so [H₃O⁺] ≪ [HA]_{initial}, and most HA stays as molecules.\n- **Larger Ka (smaller pKa) = stronger acid.**',
        },
        {
          kind: 'example',
          title: 'pH of 0.10 M acetic acid (Ka = 1.8 × 10⁻⁵)',
          problem: 'Find the pH and percent ionization of **0.10 M CH₃COOH**.',
          steps: [
            'ICE: [H₃O⁺] = [A⁻] = x, and [HA] = 0.10 − x ≈ **0.10** (x is small)',
            'x²/0.10 = 1.8 × 10^{-5} → x = √(1.8 × 10^{-6}) = **1.3 × 10^{-3} M**',
            'pH = −log(1.3 × 10^{-3}) = **2.87**',
            '% ionization = x/[HA]₀ × 100 = (1.3 × 10^{-3}/0.10) × 100 = **1.3%**',
          ],
          answer: 'pH = 2.87, 1.3% ionized',
          verify: [
            { stated: 1.3e-3, compute: () => Math.sqrt(Ka_acetic * 0.1), tol: 0.04 },
            { stated: 2.87, compute: () => -log(Math.sqrt(Ka_acetic * 0.1)) },
            { stated: 1.3, compute: () => (Math.sqrt(Ka_acetic * 0.1) / 0.1) * 100, tol: 0.04 },
          ],
        },
        {
          kind: 'hack',
          title: 'The shortcut: [H₃O⁺] ≈ √(Ka × C)',
          body: 'For a weak acid with initial concentration C:\n\n**[H₃O⁺] ≈ √(Ka · C)**\n\nIt\'s valid when x is small compared to C (under about 5%), which is true for most AP problems. On an FRQ, show the ICE setup and state the assumption.',
        },
        {
          kind: 'example',
          title: 'Ka from pH',
          problem: 'A **0.050 M** solution of a weak acid HA has **pH = 3.00**. Find Ka.',
          steps: ['[H₃O⁺] = [A⁻] = 10^{-3.00} = 1.0 × 10^{-3} M', '[HA] = 0.050 − 0.0010 = 0.049 M', 'Ka = (1.0 × 10^{-3})² / 0.049 = **2.0 × 10^{-5}**'],
          answer: 'Ka = 2.0 × 10⁻⁵',
          verify: [{ stated: 2.0e-5, compute: () => 1e-6 / 0.049, tol: 0.03 }],
        },
        {
          kind: 'trap',
          body: 'For a weak acid, [H₃O⁺] ≠ [HA]_{initial}! That shortcut only works for **strong** acids. Using it for acetic acid would give pH 1.00 instead of 2.87.',
        },
        {
          kind: 'summary',
          points: [
            'Ka = [H₃O⁺][A⁻]/[HA]. Bigger Ka = stronger acid.',
            'Weak acid: [H₃O⁺] ≈ √(Ka·C). Most HA stays un-ionized.',
            '% ionization = [H₃O⁺]_eq / [HA]_initial × 100.',
          ],
        },
      ],
      check: [
        {
          id: 'c8.3a-q1',
          type: 'num',
          prompt: 'Find the pH of **0.20 M HNO₂** (Ka = 4.0 × 10^{-4}).',
          answer: 2.05,
          tolerance: 0.01,
          hint: '[H₃O⁺] ≈ √(Ka × C)',
          explain: '[H₃O⁺] ≈ √(4.0 × 10^{-4} × 0.20) = √(8.0 × 10^{-5}) = 8.9 × 10^{-3} M → pH = **2.05**',
          compute: () => -log(Math.sqrt(4.0e-4 * 0.2)),
        },
        {
          id: 'c8.3a-q2',
          type: 'mcq',
          prompt: 'Which acid is **strongest**? HF (Ka 6.8 × 10⁻⁴), HNO₂ (Ka 4.0 × 10⁻⁴), CH₃COOH (Ka 1.8 × 10⁻⁵), HCN (Ka 6.2 × 10⁻¹⁰)',
          choices: ['HF', 'HNO₂', 'CH₃COOH', 'HCN'],
          answer: 0,
          explain: 'Largest Ka = strongest → **HF** (6.8 × 10⁻⁴).',
        },
        {
          id: 'c8.3a-q3',
          type: 'mcq',
          prompt: 'In 0.10 M CH₃COOH, which species has the **highest** concentration (besides water)?',
          choices: ['H₃O⁺', 'CH₃COO⁻', 'CH₃COOH', 'OH⁻'],
          answer: 2,
          explain: 'Only about 1% ionizes, so un-ionized **CH₃COOH** dominates.',
        },
      ],
      flashcards: [
        { front: 'Ka expression', back: 'Ka = [H₃O⁺][A⁻] / [HA]' },
        { front: 'Weak acid shortcut', back: '[H₃O⁺] ≈ √(Ka × C) (valid when x is small)' },
        { front: 'Percent ionization', back: '([H₃O⁺]_eq / [HA]_initial) × 100' },
      ],
    },
    {
      id: 'chem-8.3b',
      ced: ['8.3'],
      title: 'Weak Bases, Kb & Ka × Kb = Kw',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'Ammonia cleaner smells strong, but ammonia is a **weak** base. Only a tiny fraction of its molecules grab a proton from water. The math is the mirror image of weak acids.',
        },
        {
          kind: 'concept',
          title: 'Kb',
          body: '[[eq: NH3(aq) + H2O(l) <=> NH4^+(aq) + OH^-(aq)]]\n\n**Kb = [OH⁻][HB⁺] / [B]**    **pKb = −log Kb**\n\nSame idea as acids: only a small percentage reacts, so [OH⁻] ≪ [B]_{initial}.\nShortcut: **[OH⁻] ≈ √(Kb · C)**, then find pOH → pH.',
        },
        {
          kind: 'example',
          title: 'pH of 0.20 M NH₃ (Kb = 1.8 × 10⁻⁵)',
          problem: 'Find the pH.',
          steps: ['[OH⁻] ≈ √(1.8 × 10^{-5} × 0.20) = **1.9 × 10^{-3} M**', 'pOH = −log(1.9 × 10^{-3}) = 2.72', 'pH = 14.00 − 2.72 = **11.28**'],
          answer: 'pH = 11.28',
          verify: [
            { stated: 1.9e-3, compute: () => Math.sqrt(1.8e-5 * 0.2), tol: 0.01 },
            { stated: 11.28, compute: () => 14 + log(Math.sqrt(1.8e-5 * 0.2)) },
          ],
        },
        {
          kind: 'concept',
          title: 'Conjugate pairs: Ka × Kb = Kw',
          body: 'For any conjugate acid–base pair:\n\n**Ka × Kb = Kw = 1.0 × 10^{-14}**    **pKa + pKb = 14** (at 25 °C)\n\nSo a **stronger acid** has a **weaker conjugate base**, and vice versa.\n\nExample: Kb(NH₃) = 1.8 × 10^{-5} → Ka(NH₄⁺) = 1.0 × 10^{-14} / 1.8 × 10^{-5} = **5.6 × 10^{-10}**',
        },
        {
          kind: 'try',
          question: {
            id: 'c8.3b-t1',
            type: 'num',
            prompt: 'HF has Ka = 6.8 × 10^{-4}. What is Kb for its conjugate base, F⁻?',
            answer: 1.47e-11,
            hint: 'Kb = Kw / Ka',
            explain: 'Kb = 1.0 × 10^{-14} / 6.8 × 10^{-4} = **1.5 × 10^{-11}**',
            compute: () => 1e-14 / 6.8e-4,
          },
        },
        {
          kind: 'summary',
          points: [
            'Kb = [OH⁻][HB⁺]/[B]. [OH⁻] ≈ √(Kb·C), then pOH → pH.',
            'Ka × Kb = Kw. pKa + pKb = 14.',
            'Stronger acid ↔ weaker conjugate base.',
          ],
        },
      ],
      check: [
        {
          id: 'c8.3b-q1',
          type: 'mcq',
          prompt: 'Acid HX has pKa = 3. Acid HY has pKa = 9. Which has the **stronger conjugate base**?',
          choices: ['X⁻', 'Y⁻', 'Equal', 'Can\'t tell'],
          answer: 1,
          explain: 'HY is the weaker acid (larger pKa), so its conjugate base **Y⁻ is stronger** (pKb = 14 − 9 = 5 vs. 11).',
        },
        {
          id: 'c8.3b-q2',
          type: 'num',
          prompt: 'A weak base has pKb = 4.50. What is pKa of its conjugate acid?',
          answer: 9.5,
          explain: 'pKa = 14.00 − 4.50 = **9.50**',
          compute: () => 14 - 4.5,
        },
      ],
      flashcards: [
        { front: 'Kb expression', back: 'Kb = [OH⁻][HB⁺] / [B]' },
        { front: 'Relationship between Ka and Kb of a conjugate pair', back: 'Ka × Kb = Kw (pKa + pKb = 14 at 25 °C)' },
      ],
    },
    {
      id: 'chem-8.6',
      ced: ['8.6'],
      title: 'Structure & Acid Strength',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'Why is HClO₄ a strong acid while HClO is weak? They have the same atoms, just different numbers of oxygens. The secret is how **stable the conjugate base** is after the proton leaves.',
        },
        {
          kind: 'concept',
          title: 'The big idea: a stable conjugate base = a stronger acid',
          body: 'The more stable (the "happier") the negative charge left behind on A⁻, the more easily HA gives up H⁺.\n\nThings that stabilize A⁻:\n- **Electronegativity**: electronegative atoms hold the negative charge well (compare oxyacids, or atoms in the same row. For binary acids down a group, bond strength and size win: HF < HCl < HBr < HI).\n- **Inductive effect**: electronegative atoms nearby pull electron density away from the O–H bond.\n- **Resonance**: the charge spreads over several atoms.\n\nStrong acids have **very weak conjugate bases** (Cl⁻, NO₃⁻, ClO₄⁻…).',
        },
        {
          kind: 'concept',
          title: 'Patterns to know',
          body: '- **More O atoms (oxyacids):** HClO₄ > HClO₃ > HClO₂ > HClO. The extra O atoms pull electron density and give more resonance in the anion.\n- **More electronegative central atom:** HOCl > HOBr > HOI\n- **Electronegative substituents:** CCl₃COOH (trichloroacetic acid) is much stronger than CH₃COOH (inductive effect).\n- **Carboxylic acids (–COOH)** are a common class of **weak acid**. Their conjugate base (carboxylate) is stabilized by resonance.',
        },
        {
          kind: 'concept',
          title: 'Common bases',
          body: '- **Strong:** Group 1 and Group 2 hydroxides (their conjugate acid, water, is very weak).\n- **Weak:** nitrogen bases with a lone pair on N, like **ammonia** and amines (CH₃NH₂), and **carboxylate ions** (CH₃COO⁻).',
        },
        {
          kind: 'try',
          question: {
            id: 'c8.6-t1',
            type: 'mcq',
            prompt: 'Which is the **strongest** acid?',
            choices: ['HOI', 'HOBr', 'HOCl', 'All are equal'],
            answer: 2,
            explain: 'Cl is the most electronegative central atom. It pulls electron density from the O–H bond and best stabilizes the conjugate base → **HOCl** is the strongest.',
          },
        },
        {
          kind: 'frq',
          body: 'Explain acid strength through the **conjugate base**: "The additional electronegative oxygen atoms in HClO₃ withdraw electron density and delocalize the negative charge on ClO₃⁻ through resonance, stabilizing the conjugate base, so HClO₃ is a stronger acid than HClO₂."',
        },
        {
          kind: 'summary',
          points: [
            'A more stable conjugate base → a stronger acid.',
            'More O, a more electronegative central atom, and electronegative substituents → stronger.',
            'Carboxylic acids are weak acids. Ammonia/amines and carboxylates are weak bases.',
          ],
        },
      ],
      check: [
        {
          id: 'c8.6-q1',
          type: 'mcq',
          prompt: 'Which oxyacid is the strongest?',
          choices: ['HClO', 'HClO₂', 'HClO₃', 'HClO₄'],
          answer: 3,
          explain: '**HClO₄** has the most O atoms, giving the most electron withdrawal and resonance stabilization of ClO₄⁻.',
        },
        {
          id: 'c8.6-q2',
          type: 'mcq',
          prompt: 'Trichloroacetic acid (CCl₃COOH) is a much stronger acid than acetic acid (CH₃COOH) because…',
          choices: [
            'it has more hydrogen atoms',
            'the electronegative Cl atoms pull electron density away, stabilizing the conjugate base',
            'it is a larger molecule',
            'it has no resonance',
          ],
          answer: 1,
          explain: 'The **inductive effect** of three electronegative Cl atoms stabilizes the carboxylate anion, making the proton easier to lose.',
        },
      ],
      flashcards: [
        { front: 'Main reason one acid is stronger than another (structure)', back: 'Its conjugate base is more **stable** (electronegativity, inductive effect, resonance).' },
        { front: 'Oxyacid trend', back: 'More O atoms → stronger acid (HClO₄ > HClO₃ > HClO₂ > HClO).' },
      ],
    },
    {
      id: 'chem-8.4',
      ced: ['8.4'],
      title: 'Mixing Acids & Bases',
      level: 'core',
      minutes: 10,
      cards: [
        {
          kind: 'hook',
          body: 'Mix an acid and a base, and the first thing to ask is: **who wins, and what\'s left over?** Answer that, and every mixing problem becomes one of four simple cases.',
        },
        {
          kind: 'concept',
          title: 'Step 1: let them react completely (in moles!)',
          body: 'Strong acids/bases react **quantitatively** (completely):\n\n- strong + strong: [[eq: H^+(aq) + OH^-(aq) -> H2O(l)]]\n- weak acid + strong base: [[eq: HA(aq) + OH^-(aq) -> A^-(aq) + H2O(l)]]\n- weak base + strong acid: [[eq: B(aq) + H3O^+(aq) -> HB^+(aq) + H2O(l)]]\n\nUse **moles** (M × L), not molarity, for this step. Then figure out what\'s left over.',
        },
        {
          kind: 'concept',
          title: 'Step 2: what\'s left decides the pH',
          body: '| What remains after the reaction | How to get the pH |\n| excess **strong** acid or base | moles excess ÷ **total volume** → pH |\n| weak acid **and** its conjugate base | **buffer** → Henderson–Hasselbalch |\n| only the conjugate base A⁻ (equimolar weak acid + strong base) | slightly **basic**: A⁻ + H₂O ⇌ HA + OH⁻ |\n| only the conjugate acid HB⁺ (equimolar weak base + strong acid) | slightly **acidic**: HB⁺ + H₂O ⇌ B + H₃O⁺ |\n\nWeak acid + weak base → they react to an equilibrium: [[eq: HA(aq) + B(aq) <=> A^-(aq) + HB^+(aq)]]',
        },
        {
          kind: 'example',
          title: 'Strong + strong, with excess acid',
          problem: '**50.0 mL of 0.100 M HCl** is mixed with **30.0 mL of 0.100 M NaOH**. Find the pH.',
          steps: [
            'mol H⁺ = 0.100 × 0.0500 = 5.00 × 10^{-3}. mol OH⁻ = 0.100 × 0.0300 = 3.00 × 10^{-3}',
            'Excess H⁺ = 2.00 × 10^{-3} mol. Total volume = 80.0 mL = 0.0800 L',
            '[H⁺] = 2.00 × 10^{-3} / 0.0800 = 0.0250 M → pH = **1.60**',
          ],
          answer: 'pH = 1.60',
          verify: [{ stated: 1.6, compute: () => -log((0.1 * 0.05 - 0.1 * 0.03) / 0.08) }],
        },
        {
          kind: 'hack',
          title: '"Moles first, mix later"',
          body: 'Always convert to **moles** before reacting, and divide by the **new total volume** at the end. Forgetting that the volume grows when solutions are mixed is a classic point-loser.',
        },
        {
          kind: 'try',
          question: {
            id: 'c8.4-t1',
            type: 'mcq',
            prompt: 'Equal moles of CH₃COOH and NaOH are mixed. The resulting solution is…',
            choices: ['acidic', 'neutral', 'basic', 'a buffer'],
            answer: 2,
            explain: 'They react completely to make CH₃COO⁻ (+ H₂O). Acetate is a weak base, so the solution is slightly **basic**.',
          },
        },
        {
          kind: 'summary',
          points: [
            'React the strong species completely, in moles.',
            'Excess strong → pH from the excess. Weak + conjugate → buffer.',
            'Only A⁻ left → basic. Only HB⁺ left → acidic.',
          ],
        },
      ],
      check: [
        {
          id: 'c8.4-q1',
          type: 'num',
          prompt: '**25.0 mL of 0.20 M NaOH** is mixed with **25.0 mL of 0.10 M HCl**. What is the pH?',
          answer: 12.7,
          tolerance: 0.01,
          hint: 'mol OH⁻ = 0.0050 and mol H⁺ = 0.0025. The excess OH⁻ goes into 0.0500 L.',
          explain: 'Excess OH⁻ = 0.0050 − 0.0025 = 0.0025 mol in 0.0500 L → [OH⁻] = 0.050 M → pOH 1.30 → pH = **12.70**',
          compute: () => 14 + log((0.2 * 0.025 - 0.1 * 0.025) / 0.05),
        },
        {
          id: 'c8.4-q2',
          type: 'mcq',
          prompt: '0.10 mol NH₃ is mixed with 0.05 mol HCl. The solution is…',
          choices: ['strongly acidic', 'a buffer of NH₃ and NH₄⁺', 'neutral', 'only NH₄⁺'],
          answer: 1,
          explain: 'HCl converts 0.05 mol NH₃ into NH₄⁺, leaving 0.05 mol NH₃. A weak base plus its conjugate acid = a **buffer**.',
        },
      ],
      flashcards: [
        { front: 'Weak acid + strong base, equal moles → pH?', back: '**Basic** (the conjugate base A⁻ remains)' },
        { front: 'Weak acid in excess + strong base → what forms?', back: 'A **buffer** (HA + A⁻)' },
      ],
    },
    {
      id: 'chem-8.8',
      ced: ['8.8'],
      title: 'Buffers: How They Work',
      level: 'core',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Your blood stays at pH 7.4 even when you eat lemons or exercise hard. If it shifted by just a few tenths, you\'d be in serious trouble. **Buffers** are the chemical shock absorbers that make that possible.',
        },
        {
          kind: 'concept',
          title: 'What a buffer is',
          body: 'A buffer contains **large amounts of BOTH members of a conjugate acid–base pair**: a weak acid and its conjugate base (like CH₃COOH and CH₃COO⁻), or a weak base and its conjugate acid (like NH₃ and NH₄⁺).',
        },
        {
          kind: 'concept',
          title: 'Each partner neutralizes one intruder',
          body: '**Added acid** is consumed by the **conjugate base**:\n[[eq: CH3COO^-(aq) + H3O^+(aq) -> CH3COOH(aq) + H2O(l)]]\n\n**Added base** is consumed by the **weak acid**:\n[[eq: CH3COOH(aq) + OH^-(aq) -> CH3COO^-(aq) + H2O(l)]]\n\nThe strong acid or base gets converted into a weak one, so the pH changes only slightly.',
        },
        {
          kind: 'hack',
          title: 'Bodyguards 💂',
          body: 'Think of a buffer as two bodyguards:\n- **A⁻ catches H⁺** that tries to get in.\n- **HA catches OH⁻.**\n\nBoth need to be present in large amounts. That\'s why a strong acid with its conjugate base (like HCl + NaCl) is **not** a buffer: Cl⁻ is far too weak a base to catch anything.',
        },
        {
          kind: 'try',
          question: {
            id: 'c8.8-t1',
            type: 'mcq',
            prompt: 'Which pair makes a **buffer**?',
            choices: ['HCl and NaCl', 'HNO₃ and KNO₃', 'HF and NaF', 'NaOH and NaCl'],
            answer: 2,
            explain: '**HF (weak acid) + F⁻ (its conjugate base)** = a buffer. Strong acids with their salts don\'t buffer.',
          },
        },
        {
          kind: 'summary',
          points: [
            'Buffer = large amounts of a weak acid + its conjugate base (or a weak base + its conjugate acid).',
            'The conjugate base neutralizes added acid. The weak acid neutralizes added base.',
            'Strong acid + its salt is NOT a buffer.',
          ],
        },
      ],
      check: [
        {
          id: 'c8.8-q1',
          type: 'mcq',
          prompt: 'A small amount of HCl is added to an NH₃/NH₄⁺ buffer. Which reaction occurs?',
          choices: [
            '[[eq: NH4^+(aq) + OH^-(aq) -> NH3(aq) + H2O(l)]]',
            '[[eq: NH3(aq) + H3O^+(aq) -> NH4^+(aq) + H2O(l)]]',
            '[[eq: NH4^+(aq) + Cl^-(aq) -> NH4Cl(s)]]',
            'No reaction',
          ],
          answer: 1,
          explain: 'The base member of the buffer (**NH₃**) consumes the added H₃O⁺, forming NH₄⁺.',
        },
        {
          id: 'c8.8-q2',
          type: 'mcq',
          prompt: 'Why does a buffer\'s pH change only slightly when a little NaOH is added?',
          choices: [
            'NaOH does not dissolve',
            'The weak acid in the buffer converts the OH⁻ into water and its conjugate base',
            'The buffer contains strong acid',
            'pH never changes in water',
          ],
          answer: 1,
          explain: 'The weak acid **HA reacts with OH⁻** (HA + OH⁻ → A⁻ + H₂O), replacing a strong base with a weak one.',
        },
      ],
      flashcards: [
        { front: 'Buffer components', back: 'Large amounts of a weak acid and its conjugate base (or a weak base and its conjugate acid).' },
        { front: 'In an HA/A⁻ buffer, what neutralizes added acid?', back: 'The conjugate base **A⁻**' },
      ],
    },
    {
      id: 'chem-8.9',
      ced: ['8.9'],
      title: 'Henderson–Hasselbalch',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'Need a buffer at exactly pH 5.04? One equation tells you what to mix: the **Henderson–Hasselbalch** equation.',
        },
        {
          kind: 'concept',
          title: 'The equation (on your equation sheet)',
          body: '**pH = pKa + log([A⁻]/[HA])**\n\n- [A⁻] = [HA] → log 1 = 0 → **pH = pKa**\n- More base than acid → pH > pKa\n- More acid than base → pH < pKa\n\nBecause only the **ratio** matters, you can plug in **moles** instead of molarity (both are in the same volume).',
        },
        {
          kind: 'example',
          title: 'Acetic acid / acetate buffer',
          problem: 'A buffer is 0.10 M CH₃COOH and 0.20 M CH₃COO⁻ (pKa = 4.74). Find its pH.',
          steps: ['pH = 4.74 + log(0.20/0.10)', 'pH = 4.74 + log 2 = 4.74 + 0.30 = **5.04**'],
          answer: 'pH = 5.04',
          verify: [{ stated: 5.04, compute: () => 4.74 + log(0.2 / 0.1) }],
        },
        {
          kind: 'hack',
          title: 'Choose an acid with pKa ≈ the target pH',
          body: 'The best buffer for a target pH uses a weak acid whose **pKa is close to that pH** (within about ±1). Then the ratio [A⁻]/[HA] stays near 1, and the buffer can neutralize both added acid and added base well.',
        },
        {
          kind: 'trap',
          body: 'Small additions of acid or base barely change the [A⁻]/[HA] ratio, which is why the pH barely moves. (AP won\'t ask you to calculate the new pH after adding acid or base to a buffer, but you should be able to explain why it changes so little.)',
        },
        {
          kind: 'try',
          question: {
            id: 'c8.9-t1',
            type: 'num',
            prompt: 'A buffer contains 0.30 M HF and 0.30 M NaF. pKa(HF) = 3.17. What is the pH?',
            answer: 3.17,
            explain: 'Equal concentrations → log(1) = 0 → pH = pKa = **3.17**',
            compute: () => 3.17 + log(0.3 / 0.3),
          },
        },
        {
          kind: 'summary',
          points: [
            'pH = pKa + log([A⁻]/[HA]).',
            'Equal amounts of acid and base → pH = pKa.',
            'Pick a weak acid with pKa near the desired pH.',
          ],
        },
      ],
      check: [
        {
          id: 'c8.9-q1',
          type: 'num',
          prompt: 'A buffer has [NH₄⁺] = 0.50 M and [NH₃] = 0.050 M. pKa(NH₄⁺) = 9.25. What is the pH?',
          answer: 8.25,
          explain: 'Here NH₄⁺ is the acid and NH₃ is the base: pH = 9.25 + log(0.050/0.50) = 9.25 − 1.00 = **8.25**',
          compute: () => 9.25 + log(0.05 / 0.5),
        },
        {
          id: 'c8.9-q2',
          type: 'mcq',
          prompt: 'You need a buffer at pH 7.2. Which acid is the best choice?',
          choices: ['CH₃COOH (pKa 4.74)', 'H₂PO₄⁻ (pKa 7.21)', 'HCN (pKa 9.21)', 'HF (pKa 3.17)'],
          answer: 1,
          explain: 'Choose a pKa close to the target pH: **H₂PO₄⁻ (pKa 7.21)**.',
        },
      ],
      flashcards: [
        { front: 'Henderson–Hasselbalch equation', back: 'pH = pKa + log([A⁻]/[HA])' },
        { front: 'When [A⁻] = [HA], pH = ?', back: 'pKa' },
      ],
    },
    {
      id: 'chem-8.7',
      ced: ['8.7'],
      title: 'pH vs. pKa & Indicators',
      level: 'core',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Red cabbage juice turns pink in vinegar and green in baking soda. Indicators are weak acids whose two forms have different colors. Which form wins depends on **pH vs. pKa**.',
        },
        {
          kind: 'concept',
          title: 'Which form dominates?',
          body: 'Compare the **solution pH** with the acid\'s **pKa**:\n\n- **pH < pKa** → the **acid form (HA)** dominates (protonated)\n- **pH = pKa** → [HA] = [A⁻]\n- **pH > pKa** → the **base form (A⁻)** dominates (deprotonated)',
        },
        {
          kind: 'hack',
          title: '"Low pH = loaded with protons"',
          body: 'When the pH is **lower** than the pKa, there are plenty of H⁺ around, so the molecule keeps its proton (HA).\nWhen the pH is **higher**, H⁺ is scarce, so it loses it (A⁻).\n\nThe bigger the gap, the more lopsided the ratio: each pH unit = a 10× change in [A⁻]/[HA].',
        },
        {
          kind: 'concept',
          title: 'Choosing an indicator',
          body: 'An indicator changes color around its pKa. For an accurate titration, pick an indicator whose **pKa is close to the pH at the equivalence point**.\n\n- Strong acid + strong base: equivalence pH ≈ 7\n- Weak acid + strong base: equivalence pH > 7 (phenolphthalein, which changes around pH 8–10, works well)\n- Weak base + strong acid: equivalence pH < 7',
        },
        {
          kind: 'try',
          question: {
            id: 'c8.7-t1',
            type: 'mcq',
            prompt: 'Acetic acid has pKa 4.74. In a solution at **pH 7.0**, which form predominates?',
            choices: ['CH₃COOH', 'CH₃COO⁻', 'Equal amounts', 'Neither'],
            answer: 1,
            explain: 'pH (7.0) > pKa (4.74) → the deprotonated **CH₃COO⁻** dominates.',
          },
        },
        {
          kind: 'summary',
          points: [
            'pH < pKa → HA dominates. pH > pKa → A⁻ dominates.',
            'Indicators have different colors in their HA and A⁻ forms.',
            'Pick an indicator with pKa ≈ the equivalence-point pH.',
          ],
        },
      ],
      check: [
        {
          id: 'c8.7-q1',
          type: 'mcq',
          prompt: 'An indicator has pKa 9.0. Its acid form is colorless and its base form is pink. What color is it at pH 4?',
          choices: ['Pink', 'Colorless', 'Half pink', 'Blue'],
          answer: 1,
          explain: 'pH 4 < pKa 9 → the acid form dominates → **colorless**.',
        },
        {
          id: 'c8.7-q2',
          type: 'mcq',
          prompt: 'For titrating a weak acid with NaOH (equivalence pH ≈ 8.7), which indicator pKa is best?',
          choices: ['pKa 3.5', 'pKa 5.0', 'pKa 7.0', 'pKa 9.0'],
          answer: 3,
          explain: 'Choose the pKa nearest the equivalence pH (8.7) → **9.0**.',
        },
      ],
      flashcards: [
        { front: 'pH < pKa: which form dominates?', back: 'The **acid form (HA)**' },
        { front: 'How do you choose a titration indicator?', back: 'Its pKa should be close to the pH at the equivalence point.' },
      ],
    },
    // ---------------- ADVANCED ----------------
    {
      id: 'chem-8.5',
      ced: ['8.5'],
      title: 'Titration Curves',
      level: 'advanced',
      minutes: 11,
      cards: [
        {
          kind: 'hook',
          body: 'A titration curve is like a story with a plot twist: the pH creeps along, then suddenly **jumps** at the equivalence point. Learn its landmarks and you can read the whole story.',
        },
        {
          kind: 'concept',
          title: 'Landmarks on a weak acid + strong base curve',
          body: '1. **Start:** pH of the weak acid alone (fairly low).\n2. **Buffer region:** HA and A⁻ are both present, so the pH rises slowly.\n3. **Half-equivalence point:** half the HA has been converted, so [HA] = [A⁻] and **pH = pKa**. This is how pKa is measured!\n4. **Equivalence point:** mol OH⁻ added = mol HA at the start. Only A⁻ remains, so **pH > 7**.\n5. **After equivalence:** excess OH⁻ controls the pH.',
          diagram: 'titration-weak',
        },
        {
          kind: 'concept',
          title: 'pH at the equivalence point',
          body: '| Titration | Equivalence pH | Why |\n| strong acid + strong base | = 7 | only neutral ions + water |\n| weak acid + strong base | > 7 | conjugate base A⁻ reacts with water to make OH⁻ |\n| weak base + strong acid | < 7 | conjugate acid HB⁺ makes H₃O⁺ |\n\nAt the equivalence point of a monoprotic acid, **mol titrant = mol analyte**. Use this to find the unknown concentration.',
        },
        {
          kind: 'concept',
          title: 'Polyprotic acids',
          body: 'An acid with several acidic protons (like H₂CO₃ or H₃PO₄) shows **up to one equivalence point per acidic proton** on its titration curve (when the Ka values are well separated), each with its own buffer region and pKa.\n\nCount the jumps → count the acidic protons. (You won\'t need to calculate the concentration of every species in a polyprotic titration. Just identify the major species at each stage.)',
        },
        {
          kind: 'example',
          title: 'Finding pKa from a curve',
          problem: 'A weak acid is titrated with NaOH. The equivalence point is at **30.0 mL**, and the pH at **15.0 mL** is **4.20**. What are pKa and Ka?',
          steps: ['15.0 mL is half of 30.0 mL → the half-equivalence point → pH = pKa', 'pKa = **4.20**', 'Ka = 10^{-4.20} = **6.3 × 10^{-5}**'],
          answer: 'pKa = 4.20, Ka = 6.3 × 10⁻⁵',
          verify: [{ stated: 6.3e-5, compute: () => 10 ** -4.2 }],
        },
        {
          kind: 'try',
          question: {
            id: 'c8.5-t1',
            type: 'mcq',
            prompt: 'A titration curve shows **two** distinct equivalence points. The acid being titrated is most likely…',
            choices: ['HCl', 'CH₃COOH', 'H₂CO₃ (diprotic)', 'HNO₃'],
            answer: 2,
            explain: 'Two equivalence points → **two acidic protons** → a diprotic acid like H₂CO₃.',
          },
        },
        {
          kind: 'summary',
          points: [
            'Half-equivalence: pH = pKa.',
            'Equivalence: strong/strong = 7. Weak acid/strong base > 7. Weak base/strong acid < 7.',
            'Each acidic proton can give its own equivalence point (up to one per proton).',
          ],
        },
      ],
      check: [
        {
          id: 'c8.5-q1',
          type: 'mcq',
          prompt: 'At the equivalence point of the titration of NH₃ with HCl, the pH is…',
          choices: ['less than 7', 'exactly 7', 'greater than 7', 'equal to pKb'],
          answer: 0,
          explain: 'Only NH₄⁺ (a weak acid) remains at equivalence → **pH < 7**.',
        },
        {
          id: 'c8.5-q2',
          type: 'num',
          prompt: '**20.0 mL** of a weak monoprotic acid requires **16.0 mL of 0.125 M NaOH** to reach equivalence. What is the acid\'s concentration?',
          answer: 0.1,
          unit: 'M',
          explain: 'mol NaOH = 0.125 × 0.0160 = 0.00200 mol = mol HA. [HA] = 0.00200 / 0.0200 = **0.100 M**',
          compute: () => (0.125 * 0.016) / 0.02,
        },
        {
          id: 'c8.5-q3',
          type: 'mcq',
          prompt: 'In the buffer region of a weak acid titration, which species are present in large amounts?',
          choices: ['Only HA', 'Only A⁻', 'Both HA and A⁻', 'Only OH⁻'],
          answer: 2,
          explain: 'Between the start and the equivalence point, **both HA and A⁻** are present. That\'s why the pH changes slowly.',
        },
      ],
      flashcards: [
        { front: 'At the half-equivalence point of a weak acid titration…', back: '[HA] = [A⁻], so **pH = pKa**' },
        { front: 'Equivalence pH: weak acid titrated with strong base', back: '**> 7** (the conjugate base remains)' },
        { front: 'How many equivalence points does H₃PO₄ show?', back: 'Up to **3** (one per acidic proton)' },
      ],
    },
    {
      id: 'chem-8.10',
      ced: ['8.10'],
      title: 'Buffer Capacity',
      level: 'advanced',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: 'Two buffers can have the same pH, yet one can absorb ten times more acid before failing. That difference is **buffer capacity**.',
        },
        {
          kind: 'concept',
          title: 'Two rules',
          body: '1. **More concentrated components → more capacity.** 1.0 M HA / 1.0 M A⁻ has the **same pH** as 0.10 M / 0.10 M (same ratio), but can neutralize about **10× more** added acid or base.\n\n2. **The ratio decides which direction is stronger:**\n- more **acid** (HA) than base → greater capacity against added **base**\n- more **base** (A⁻) than acid → greater capacity against added **acid**',
        },
        {
          kind: 'hack',
          title: 'Capacity = how many "bodyguards"',
          body: 'pH depends on the **ratio** (H–H). Capacity depends on the **amounts**. Doubling both HA and A⁻ keeps the pH the same but doubles the protection.',
        },
        {
          kind: 'try',
          question: {
            id: 'c8.10-t1',
            type: 'mcq',
            prompt: 'Buffer X: 0.10 M HA / 0.10 M A⁻. Buffer Y: 0.50 M HA / 0.50 M A⁻. Which is true?',
            choices: [
              'Y has a lower pH',
              'They have the same pH, and Y has greater capacity',
              'X has greater capacity',
              'They have the same capacity',
            ],
            answer: 1,
            explain: 'The same ratio (1 : 1) gives the **same pH**. Y has 5× more of each component → **greater capacity**.',
          },
        },
        {
          kind: 'summary',
          points: [
            'Higher concentrations → greater capacity (same ratio → same pH).',
            'Excess HA → better at absorbing base. Excess A⁻ → better at absorbing acid.',
          ],
        },
      ],
      check: [
        {
          id: 'c8.10-q1',
          type: 'mcq',
          prompt: 'A buffer has [HA] = 0.40 M and [A⁻] = 0.10 M. It can neutralize more…',
          choices: ['added strong acid', 'added strong base', 'both equally', 'neither'],
          answer: 1,
          explain: 'There is more HA, the component that reacts with OH⁻, so it has greater capacity for added **base**.',
        },
        {
          id: 'c8.10-q2',
          type: 'mcq',
          prompt: 'Diluting a buffer 10-fold with water (ratio unchanged)…',
          choices: ['changes the pH a lot', 'keeps the pH about the same but lowers capacity', 'raises capacity', 'destroys the buffer completely'],
          answer: 1,
          explain: 'The ratio [A⁻]/[HA] is unchanged → about the same pH. Lower concentrations → **less capacity**.',
        },
      ],
      flashcards: [
        { front: 'What determines a buffer\'s pH vs. its capacity?', back: 'pH: the **ratio** [A⁻]/[HA] (and pKa). Capacity: the **amounts** (concentrations).' },
        { front: 'A buffer with more HA than A⁻ is better at neutralizing…', back: 'Added **base**' },
      ],
    },
    {
      id: 'chem-8.11',
      ced: ['8.11'],
      title: 'pH & Solubility',
      level: 'advanced',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: 'Acid rain slowly dissolves marble statues, which are made of CaCO₃. But it doesn\'t dissolve table salt any faster than plain water would. Why does acid matter for some salts and not others?',
        },
        {
          kind: 'concept',
          title: 'When pH affects solubility',
          body: 'A salt\'s solubility depends on pH when one of its ions is a **weak acid**, a **weak base**, or **hydroxide**.\n\n[[eq: CaCO3(s) <=> Ca^2+(aq) + CO3^2-(aq)]]\nAdding acid: H₃O⁺ reacts with CO₃²⁻ (a weak base), removing it → Le Châtelier shifts **right** → **more CaCO₃ dissolves**.\n\n[[eq: Mg(OH)2(s) <=> Mg^2+(aq) + 2OH^-(aq)]]\nAdding acid removes OH⁻ → **more dissolves**.',
        },
        {
          kind: 'concept',
          title: 'When pH doesn\'t matter',
          body: 'If the anion is the conjugate base of a **strong** acid (Cl⁻, Br⁻, I⁻, NO₃⁻), it doesn\'t react with H₃O⁺. So the solubility of AgCl, for example, is **not** affected by acid.',
        },
        {
          kind: 'try',
          question: {
            id: 'c8.11-t1',
            type: 'mcq',
            prompt: 'Which salt\'s solubility **increases** the most when HNO₃ is added?',
            choices: ['AgCl', 'AgBr', 'PbI₂', 'CaF₂'],
            answer: 3,
            explain: 'F⁻ is a weak base (HF is a weak acid), so acid removes F⁻ and shifts CaF₂ toward dissolving. Cl⁻, Br⁻ and I⁻ come from strong acids, so they aren\'t affected.',
          },
        },
        {
          kind: 'summary',
          points: [
            'Anion = a weak base or OH⁻ → acid increases solubility (Le Châtelier).',
            'Anion from a strong acid (Cl⁻, NO₃⁻…) → pH has no effect.',
            'Explain it qualitatively. These calculations aren\'t on the exam.',
          ],
        },
      ],
      check: [
        {
          id: 'c8.11-q1',
          type: 'mcq',
          prompt: 'The solubility of Fe(OH)₃ is greatest in a solution with pH…',
          choices: ['2', '7', '10', '13'],
          answer: 0,
          explain: 'Low pH = lots of H₃O⁺, which removes OH⁻ → the equilibrium shifts toward dissolving → greatest at **pH 2**.',
        },
        {
          id: 'c8.11-q2',
          type: 'mcq',
          prompt: 'Why is the solubility of AgCl essentially unchanged by adding acid?',
          choices: [
            'AgCl is very soluble',
            'Cl⁻ is the conjugate base of a strong acid and does not react with H₃O⁺',
            'Ag⁺ reacts with H₃O⁺',
            'Acids increase Ksp',
          ],
          answer: 1,
          explain: '**Cl⁻** is a negligible base (HCl is strong), so H₃O⁺ doesn\'t remove it and the equilibrium doesn\'t shift.',
        },
      ],
      flashcards: [
        { front: 'When is a salt\'s solubility pH-dependent?', back: 'When one of its ions is a weak acid, a weak base, or OH⁻.' },
        { front: 'Effect of acid on the solubility of CaCO₃', back: 'It **increases** (H₃O⁺ removes CO₃²⁻ → shift toward dissolving).' },
      ],
    },
  ],
  checkpoint: [
    {
      id: 'c8-cp1',
      type: 'num',
      prompt: 'What is the pH of **0.050 M NaOH**?',
      answer: 12.7,
      tolerance: 0.01,
      explain: 'pOH = −log(0.050) = 1.30 → pH = **12.70**',
      compute: () => 14 + log(0.05),
    },
    {
      id: 'c8-cp2',
      type: 'mcq',
      prompt: 'Which 0.10 M solution has the **lowest** pH?',
      choices: ['NaCl', 'CH₃COOH', 'HCl', 'NH₃'],
      answer: 2,
      explain: '**HCl** is a strong acid → fully ionized → [H₃O⁺] = 0.10 M → pH 1.',
    },
    {
      id: 'c8-cp3',
      type: 'num',
      prompt: 'A buffer is made with 0.20 mol HA and 0.10 mol NaA in 1.0 L. pKa = 6.00. What is the pH?',
      answer: 5.7,
      tolerance: 0.01,
      explain: 'pH = 6.00 + log(0.10/0.20) = 6.00 − 0.30 = **5.70**',
      compute: () => 6.0 + log(0.1 / 0.2),
    },
    {
      id: 'c8-cp4',
      type: 'mcq',
      prompt: 'In a titration of a weak acid with NaOH, at the half-equivalence point pH = 3.85. What is Ka?',
      choices: ['3.85', '1.4 × 10⁻⁴', '7.1 × 10⁻¹¹', '0.50'],
      answer: 1,
      explain: 'pKa = 3.85 → Ka = 10^{-3.85} = **1.4 × 10⁻⁴**',
    },
  ],
}
