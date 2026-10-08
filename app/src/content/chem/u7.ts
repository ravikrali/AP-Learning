import type { Unit } from '../types'

// H2 + I2 <=> 2HI ICE example (K = 50.0, start 0.100 M each)
const iceX = (() => {
  const r = Math.sqrt(50.0)
  return (0.1 * r) / (2 + r)
})()

export const unit7: Unit = {
  id: 'chem-u7',
  number: 7,
  title: 'Equilibrium',
  weight: '7–9%',
  blurb: 'Reactions that go both ways: K and Q, ICE tables, Le Châtelier\'s principle and solubility (Ksp).',
  badge: { name: 'Balance Keeper', emoji: '⚖️' },
  lessons: [
    // ---------------- FOUNDATION ----------------
    {
      id: 'chem-7.1',
      ced: ['7.1', '7.2'],
      title: 'What Is Equilibrium?',
      level: 'foundation',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Picture a busy escalator: people going up, people going down, at the same rate. The number of people on each floor stays the same, but everyone is still moving. That\'s **dynamic equilibrium**.',
        },
        {
          kind: 'concept',
          title: 'Reversible processes',
          body: 'Many processes run both ways (⇌):\n- evaporation ⇌ condensation\n- dissolving ⇌ precipitating\n- proton transfer (acid–base) and electron transfer (redox)\n\nIf the **forward rate > reverse rate**, there\'s a net conversion of reactants into products. If the reverse is faster, products turn back into reactants. When the **rates are equal**, the system is at **equilibrium**.',
        },
        {
          kind: 'concept',
          title: 'At equilibrium',
          body: '- **No observable change**: concentrations and partial pressures stay **constant**.\n- Reactants and products are **both present**.\n- It\'s **dynamic**: the forward and reverse reactions **keep happening**, just at **equal rates**.',
          diagram: 'equilibrium-approach',
        },
        {
          kind: 'trap',
          body: 'The #1 equilibrium myth: "At equilibrium, the concentrations of reactants and products are **equal**." ❌ They\'re **constant**, not equal. It\'s the **rates** that are equal.',
        },
        {
          kind: 'try',
          question: {
            id: 'c7.1-t1',
            type: 'mcq',
            prompt: 'Which statement is TRUE for a system at chemical equilibrium?',
            choices: [
              'The reaction has stopped',
              '[reactants] = [products]',
              'The forward and reverse rates are equal',
              'Only products are present',
            ],
            answer: 2,
            explain: 'Equilibrium is dynamic: both reactions continue at **equal rates**, so the concentrations stay constant (but are usually not equal).',
          },
        },
        {
          kind: 'summary',
          points: [
            'Equilibrium: forward rate = reverse rate.',
            'Concentrations are constant, not equal.',
            'Dynamic: both reactions keep going.',
          ],
        },
      ],
      check: [
        {
          id: 'c7.1-q1',
          type: 'mcq',
          prompt: 'In a sealed bottle of water at constant temperature, the water level stops changing. Which is happening at the particle level?',
          choices: [
            'Evaporation has stopped',
            'Evaporation and condensation happen at equal rates',
            'Only condensation occurs',
            'The water molecules have stopped moving',
          ],
          answer: 1,
          explain: 'Molecules keep evaporating and condensing, at **equal rates**: dynamic equilibrium.',
        },
        {
          id: 'c7.1-q2',
          type: 'mcq',
          prompt: 'Before equilibrium is reached, the forward rate is greater than the reverse rate. What happens?',
          choices: [
            'Net conversion of products into reactants',
            'Net conversion of reactants into products',
            'No change',
            'The reaction stops',
          ],
          answer: 1,
          explain: 'Forward faster than reverse → **net formation of products**, until the rates become equal.',
        },
      ],
      flashcards: [
        { front: 'Definition of dynamic equilibrium', back: 'Forward and reverse rates are equal, so concentrations stay constant while both reactions continue.' },
        { front: 'At equilibrium, are [reactants] and [products] equal?', back: 'Not necessarily. They are **constant**, not equal.' },
      ],
    },
    {
      id: 'chem-7.3',
      ced: ['7.3'],
      title: 'Writing K and Q',
      level: 'foundation',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'Every reaction at equilibrium has a "magic ratio" of products to reactants at a given temperature. That ratio is the **equilibrium constant, K**.',
        },
        {
          kind: 'concept',
          title: 'The law of mass action',
          body: 'For **aA + bB ⇌ cC + dD**:\n\n**K_{c} = [C]^{c}[D]^{d} / [A]^{a}[B]^{b}**\n\n- Products on top, reactants on the bottom.\n- Each concentration is **raised to its coefficient**.\n- For gases, you can use partial pressures instead: **K_{p} = (P_{C})^{c}(P_{D})^{d} / (P_{A})^{a}(P_{B})^{b}**\n\nConverting between Kc and Kp isn\'t tested, but notice which one a question uses.',
        },
        {
          kind: 'concept',
          title: 'Leave out solids and pure liquids',
          body: 'Solids (s) and pure liquids (l) **don\'t appear** in K or Q, because their "concentration" doesn\'t change with amount.\n\n[[eq: CaCO3(s) <=> CaO(s) + CO2(g)]] → **K_{p} = P_{CO₂}**\n\n[[eq: NH3(aq) + H2O(l) <=> NH4^+(aq) + OH^-(aq)]] → **K = [NH₄⁺][OH⁻] / [NH₃]** (no water!)',
        },
        {
          kind: 'concept',
          title: 'Q: the same formula, at any moment',
          body: 'The **reaction quotient, Q**, uses the same expression with the **current** concentrations (not necessarily at equilibrium).\n\nAs a reaction proceeds, Q moves **toward** K. At equilibrium, **Q = K**.',
        },
        {
          kind: 'try',
          question: {
            id: 'c7.3-t1',
            type: 'mcq',
            prompt: 'What is K_{c} for [[eq: N2(g) + 3H2(g) <=> 2NH3(g)]]?',
            choices: ['[NH₃]/[N₂][H₂]', '[NH₃]²/[N₂][H₂]³', '[N₂][H₂]³/[NH₃]²', '2[NH₃]/[N₂]3[H₂]'],
            answer: 1,
            explain: 'Products over reactants, each raised to its coefficient: **[NH₃]² / [N₂][H₂]³**.',
          },
        },
        {
          kind: 'summary',
          points: [
            'K = products^{coefficients} / reactants^{coefficients}.',
            'Omit solids and pure liquids.',
            'Q has the same form at any moment. At equilibrium, Q = K.',
          ],
        },
      ],
      check: [
        {
          id: 'c7.3-q1',
          type: 'mcq',
          prompt: 'What is the equilibrium expression for [[eq: AgCl(s) <=> Ag^+(aq) + Cl^-(aq)]]?',
          choices: ['[Ag⁺][Cl⁻]/[AgCl]', '[Ag⁺][Cl⁻]', '[AgCl]/[Ag⁺][Cl⁻]', '[Ag⁺] + [Cl⁻]'],
          answer: 1,
          explain: 'AgCl is a solid, so leave it out: **K = [Ag⁺][Cl⁻]** (this is Ksp).',
        },
        {
          id: 'c7.3-q2',
          type: 'mcq',
          prompt: 'Which is K_{p} for [[eq: 2SO2(g) + O2(g) <=> 2SO3(g)]]?',
          choices: [
            '(P_{SO₃})² / (P_{SO₂})²(P_{O₂})',
            '(P_{SO₂})²(P_{O₂}) / (P_{SO₃})²',
            '2P_{SO₃} / (2P_{SO₂} + P_{O₂})',
            '(P_{SO₃}) / (P_{SO₂})(P_{O₂})',
          ],
          answer: 0,
          explain: 'Products over reactants with exponents equal to the coefficients: **(P_SO₃)² / (P_SO₂)²(P_O₂)**.',
        },
      ],
      flashcards: [
        { front: 'Equilibrium expression for aA + bB ⇌ cC + dD', back: 'K = [C]^c[D]^d / [A]^a[B]^b' },
        { front: 'Which phases are left out of K and Q?', back: 'Solids (s) and pure liquids (l)' },
        { front: 'Q vs. K', back: 'Same expression. Q uses current concentrations. Q = K at equilibrium.' },
      ],
    },
    // ---------------- CORE ----------------
    {
      id: 'chem-7.4',
      ced: ['7.4', '7.5'],
      title: 'Calculating K & What Its Size Means',
      level: 'core',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'K can be as huge as 10^{50} or as tiny as 10^{-50}. One glance at its size tells you whether a reaction makes mostly products, or barely happens at all.',
        },
        {
          kind: 'example',
          title: 'K from equilibrium data',
          problem: '[[eq: N2O4(g) <=> 2NO2(g)]] At equilibrium at a certain temperature, [N₂O₄] = 0.0450 M and [NO₂] = 0.0160 M. Find K_{c}.',
          steps: ['K_{c} = [NO₂]² / [N₂O₄]', 'K_{c} = (0.0160)² / 0.0450 = **5.69 × 10^{-3}**'],
          answer: 'K_c = 5.69 × 10⁻³',
          verify: [{ stated: 5.69e-3, compute: () => 0.016 ** 2 / 0.045 }],
        },
        {
          kind: 'concept',
          title: 'Reading the size of K',
          body: '| K | Meaning at equilibrium |\n| K ≫ 1 (like 10^{10}) | **mostly products**: the reaction goes essentially to completion |\n| K ≈ 1 | significant amounts of both |\n| K ≪ 1 (like 10^{-10}) | **mostly reactants**: the reaction barely proceeds |\n\nK is unitless as used in AP Chemistry, and it **only changes with temperature**.',
        },
        {
          kind: 'hack',
          title: 'K is a "product-favored" meter',
          body: 'Since products are on top: **big K → big numerator → mostly products.**\n\nBut careful: K says **nothing** about speed. A reaction with K = 10^{40} can still be incredibly slow (that\'s kinetics, not equilibrium).',
        },
        {
          kind: 'try',
          question: {
            id: 'c7.4-t1',
            type: 'mcq',
            prompt: 'For a reaction, K = 2.5 × 10^{-12}. At equilibrium, the mixture contains…',
            choices: ['mostly products', 'mostly reactants', 'equal amounts', 'nothing: the reaction is complete'],
            answer: 1,
            explain: 'K ≪ 1 → the numerator (products) is tiny → **mostly reactants**.',
          },
        },
        {
          kind: 'summary',
          points: [
            'Plug the equilibrium concentrations into the K expression.',
            'K ≫ 1: mostly products. K ≪ 1: mostly reactants.',
            'K tells you the extent of a reaction, not its speed.',
          ],
        },
      ],
      check: [
        {
          id: 'c7.4-q1',
          type: 'num',
          prompt: '[[eq: H2(g) + I2(g) <=> 2HI(g)]] At equilibrium: [H₂] = 0.020 M, [I₂] = 0.020 M, [HI] = 0.14 M. What is K_{c}?',
          answer: 49,
          explain: 'K = (0.14)² / (0.020)(0.020) = 0.0196 / 0.00040 = **49**',
          compute: () => 0.14 ** 2 / (0.02 * 0.02),
        },
        {
          id: 'c7.4-q2',
          type: 'mcq',
          prompt: 'Which change alters the value of K for a reaction?',
          choices: ['Adding more reactant', 'Changing the temperature', 'Adding a catalyst', 'Compressing the container'],
          answer: 1,
          explain: 'K depends only on **temperature**. Concentration and pressure changes shift the position of equilibrium but don\'t change K.',
        },
      ],
      flashcards: [
        { front: 'K ≫ 1 means…', back: 'Mostly products at equilibrium (the reaction goes essentially to completion).' },
        { front: 'K ≪ 1 means…', back: 'Mostly reactants at equilibrium.' },
        { front: 'What changes K?', back: 'Only **temperature**.' },
      ],
    },
    {
      id: 'chem-7.6',
      ced: ['7.6'],
      title: 'Manipulating K',
      level: 'core',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: 'Just like Hess\'s law for ΔH, there are rules for combining K values, but with a twist: K values **multiply** instead of add.',
        },
        {
          kind: 'concept',
          title: 'Three rules',
          body: '| Do this to the equation | Do this to K |\n| **Reverse** it | **K_{new} = 1/K** |\n| **Multiply** coefficients by c | **K_{new} = K^{c}** |\n| **Add** equations | **K_{new} = K₁ × K₂** |\n\nThe same rules apply to Q, since it has the same form.',
        },
        {
          kind: 'hack',
          title: 'Compare with Hess\'s law',
          body: '| | ΔH | K |\n| reverse | −ΔH | 1/K |\n| ×c | c·ΔH | K^{c} |\n| add | ΔH₁ + ΔH₂ | K₁ × K₂ |\n\n"ΔH adds, K multiplies."',
        },
        {
          kind: 'try',
          question: {
            id: 'c7.6-t1',
            type: 'num',
            prompt: 'For [[eq: N2(g) + 3H2(g) <=> 2NH3(g)]], K = 4.0 × 10^{2}. What is K for [[eq: 2NH3(g) <=> N2(g) + 3H2(g)]]?',
            answer: 2.5e-3,
            hint: 'The reaction is reversed.',
            explain: 'Reversed → K = 1/(4.0 × 10²) = **2.5 × 10^{-3}**',
            compute: () => 1 / 400,
          },
        },
        {
          kind: 'summary',
          points: ['Reverse → 1/K.', 'Multiply by c → K^c (½ → square root).', 'Add equations → multiply the Ks.'],
        },
      ],
      check: [
        {
          id: 'c7.6-q1',
          type: 'num',
          prompt: 'For [[eq: 2NO2(g) <=> N2O4(g)]], K = 6.0. What is K for [[eq: NO2(g) <=> 1/2N2O4(g)]]?',
          answer: 2.449,
          explain: 'Multiplying by ½ → K^{1/2} = √6.0 = **2.4**',
          compute: () => Math.sqrt(6.0),
        },
        {
          id: 'c7.6-q2',
          type: 'num',
          prompt: 'Reaction 1 has K₁ = 3.0 and reaction 2 has K₂ = 5.0. They add up to an overall reaction. What is K_{overall}?',
          answer: 15,
          explain: 'Adding reactions → multiply: 3.0 × 5.0 = **15**',
          compute: () => 3.0 * 5.0,
        },
      ],
      flashcards: [
        { front: 'Reverse a reaction: new K?', back: '1/K' },
        { front: 'Multiply a reaction by c: new K?', back: 'K^c' },
        { front: 'Add two reactions: new K?', back: 'K₁ × K₂' },
      ],
    },
    {
      id: 'chem-7.7',
      ced: ['7.7'],
      title: 'Q vs. K & ICE Tables',
      level: 'core',
      minutes: 11,
      cards: [
        {
          kind: 'hook',
          body: 'Mix some chemicals and ask: which way will the reaction go, and where will it stop? Compare Q to K for the direction. Use an **ICE table** for the final amounts.',
        },
        {
          kind: 'concept',
          title: 'Which way will it go?',
          body: '- **Q < K** → too few products → the reaction shifts **forward (→)**, making products.\n- **Q > K** → too many products → it shifts **in reverse (←)**, making reactants.\n- **Q = K** → already at equilibrium. Forward and reverse rates are equal.',
        },
        {
          kind: 'hack',
          title: 'Alphabet trick 🔤',
          body: 'Put Q and K on a number line in alphabetical order: **Q … K**.\nIf Q is to the left of K (Q < K), the reaction moves **right** (→) toward K.\nIf Q > K, it moves **left** (←).\n\nThe reaction always moves Q toward K.',
        },
        {
          kind: 'concept',
          title: 'The ICE table',
          body: '**I**nitial, **C**hange, **E**quilibrium: one row each, one column per species.\n\n1. Fill in the **initial** concentrations.\n2. Write the **changes** as ±(coefficient)·x. Reactants go down and products go up (if Q < K).\n3. **Equilibrium** row = I + C.\n4. Plug the E row into the K expression and solve for x.',
        },
        {
          kind: 'example',
          title: 'H₂ + I₂ ⇌ 2HI, K = 50.0',
          problem: '0.100 M H₂ and 0.100 M I₂ are mixed (no HI at the start). Find the equilibrium concentrations.',
          steps: [
            '| | H₂ | I₂ | HI |\n| I | 0.100 | 0.100 | 0 |\n| C | −x | −x | +2x |\n| E | 0.100 − x | 0.100 − x | 2x |',
            '50.0 = (2x)² / (0.100 − x)². Take the square root of both sides: 7.07 = 2x/(0.100 − x)',
            '7.07(0.100 − x) = 2x → 0.707 = 9.07x → **x = 0.0780**',
            '[HI] = 2x = **0.156 M**. [H₂] = [I₂] = 0.100 − 0.0780 = **0.022 M**',
          ],
          answer: '[HI] = 0.156 M. [H₂] = [I₂] = 0.022 M.',
          verify: [
            { stated: 0.078, compute: () => iceX },
            { stated: 0.156, compute: () => 2 * iceX },
            { stated: 0.022, compute: () => 0.1 - iceX, tol: 0.01 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 'c7.7-t1',
            type: 'mcq',
            prompt: 'For a reaction, K = 10. At some moment, Q = 25. Which way does the reaction proceed?',
            choices: ['Forward (toward products)', 'Reverse (toward reactants)', 'It\'s at equilibrium', 'It can\'t be determined'],
            answer: 1,
            explain: 'Q > K → too many products → the reaction runs in **reverse** until Q drops to K.',
          },
        },
        {
          kind: 'trap',
          body: 'ICE tables use **concentrations (M)** or **partial pressures**, not moles or grams. If you\'re given moles and a volume, divide first!',
        },
        {
          kind: 'summary',
          points: [
            'Q < K → forward. Q > K → reverse. Q = K → equilibrium.',
            'ICE: Initial, Change (use the coefficients × x), Equilibrium.',
            'Substitute the E row into K and solve for x.',
          ],
        },
      ],
      check: [
        {
          id: 'c7.7-q1',
          type: 'mcq',
          prompt: '[[eq: N2O4(g) <=> 2NO2(g)]] K_c = 0.0059. A flask has [N₂O₄] = 0.10 M and [NO₂] = 0.010 M. Which way will the reaction shift?',
          choices: ['Toward NO₂ (forward)', 'Toward N₂O₄ (reverse)', 'No shift', 'Can\'t tell'],
          answer: 0,
          hint: 'Q = (0.010)² / 0.10',
          explain: 'Q = 0.00010/0.10 = 0.0010 < 0.0059 = K → it shifts **forward**, making NO₂.',
        },
        {
          id: 'c7.7-q2',
          type: 'num',
          prompt: '{{A(g) <=> 2B(g)}} Initially [A] = 1.00 M and [B] = 0. At equilibrium, [B] = 0.40 M. What is [A] at equilibrium?',
          answer: 0.8,
          unit: 'M',
          hint: '2x = 0.40, so x = 0.20.',
          explain: '2x = 0.40 → x = 0.20. [A] = 1.00 − 0.20 = **0.80 M**',
          compute: () => 1.0 - 0.4 / 2,
        },
        {
          id: 'c7.7-q3',
          type: 'num',
          prompt: 'Using the values in the previous question, what is K_{c}?',
          answer: 0.2,
          explain: 'K = [B]²/[A] = (0.40)² / 0.80 = **0.20**',
          compute: () => 0.4 ** 2 / 0.8,
        },
      ],
      flashcards: [
        { front: 'Q < K', back: 'The reaction proceeds **forward** (makes more products).' },
        { front: 'Q > K', back: 'The reaction proceeds in **reverse** (makes more reactants).' },
        { front: 'ICE stands for…', back: 'Initial, Change, Equilibrium' },
      ],
    },
    {
      id: 'chem-7.8',
      ced: ['7.8'],
      title: 'Particle Diagrams of Equilibrium',
      level: 'core',
      minutes: 5,
      cards: [
        {
          kind: 'hook',
          body: 'AP sometimes shows equilibrium as a box of molecules and asks you for K, or whether the box is at equilibrium yet. Counting particles turns a picture into numbers.',
        },
        {
          kind: 'concept',
          title: 'From picture to K',
          body: 'All the particles in a box share the **same volume**, so each particle count is proportional to its concentration.\n\n- If the question says each particle = a certain concentration (like 0.10 M), convert the counts to concentrations and plug them into K.\n- If the exponents on the top and bottom of K add up to the same total, the volume cancels, so the raw counts give K directly.\n\nIf a series of pictures shows the counts **no longer changing**, the system has reached equilibrium.',
        },
        {
          kind: 'example',
          title: 'Count and calculate',
          problem: 'For [[eq: A2(g) + B2(g) <=> 2AB(g)]], an equilibrium box shows **2 A₂, 2 B₂ and 8 AB** (each particle = 0.10 M). Find K.',
          steps: [
            'Concentrations: [A₂] = 0.20 M, [B₂] = 0.20 M, [AB] = 0.80 M',
            'K = [AB]² / [A₂][B₂] = (0.80)² / (0.20 × 0.20) = **16**',
          ],
          answer: 'K = 16. The value is greater than 1, so the equilibrium mixture is mostly product.',
          verify: [{ stated: 16, compute: () => 0.8 ** 2 / (0.2 * 0.2) }],
        },
        {
          kind: 'try',
          question: {
            id: 'c7.8-t1',
            type: 'mcq',
            prompt: 'A sequence of particle diagrams shows the number of product molecules: 2, 5, 7, 7, 7. When was equilibrium reached?',
            choices: ['At the first box', 'When the count first reached 7', 'Never', 'At the last box only'],
            answer: 1,
            explain: 'Equilibrium = **no further change**. The count stops changing once it first reaches 7.',
          },
        },
        {
          kind: 'summary',
          points: [
            'Convert particle counts to concentrations (or ratios), then plug into K.',
            'Equilibrium = the counts stop changing.',
          ],
        },
      ],
      check: [
        {
          id: 'c7.8-q1',
          type: 'mcq',
          prompt: 'For {{X(g) <=> Y(g)}}, an equilibrium box shows 3 X and 9 Y particles. What is K?',
          choices: ['1/3', '3', '9', '27'],
          answer: 1,
          explain: 'Same volume, so K = [Y]/[X] = 9/3 = **3**.',
        },
        {
          id: 'c7.8-q2',
          type: 'mcq',
          prompt: 'For {{X(g) <=> Y(g)}} with K = 3, a box contains 6 X and 6 Y. Which way will the reaction proceed?',
          choices: ['Forward (more Y)', 'Reverse (more X)', 'It\'s at equilibrium', 'Can\'t tell'],
          answer: 0,
          explain: 'Q = 6/6 = 1 < K = 3 → it proceeds **forward**, making more Y.',
        },
      ],
      flashcards: [
        { front: 'How do you know from particle diagrams that equilibrium is reached?', back: 'The numbers of each particle **stop changing** over time.' },
        { front: 'In a same-volume particle diagram, what can you use in place of concentrations?', back: 'Particle **counts** (each particle = a fixed concentration).' },
      ],
    },
    {
      id: 'chem-7.9',
      ced: ['7.9', '7.10'],
      title: 'Le Châtelier\'s Principle',
      level: 'core',
      minutes: 11,
      cards: [
        {
          kind: 'hook',
          body: 'Push on a system at equilibrium and it **pushes back**. That\'s Le Châtelier\'s principle, and it\'s how chemical plants squeeze the most ammonia out of N₂ and H₂ to make fertilizer for the world.',
        },
        {
          kind: 'concept',
          title: 'The rule',
          body: 'If a stress is applied to a system at equilibrium, the system **shifts to counteract** the stress and reaches a new equilibrium.\n\nIn Q-and-K terms: a disturbance makes **Q ≠ K**, and the reaction proceeds in the direction that brings **Q back to K**.',
        },
        {
          kind: 'concept',
          title: 'Stress → response, for N₂ + 3H₂ ⇌ 2NH₃ (ΔH < 0)',
          body: '| Stress | Shift | Why |\n| Add N₂ | → | Q < K, so use up the extra N₂ |\n| Remove NH₃ | → | Q < K, so replace the NH₃ |\n| Decrease volume (increase pressure) | → | toward **fewer gas moles** (4 → 2) |\n| Increase temperature | ← | heat acts like a "product" of an exothermic reaction |\n| Add a catalyst | no shift | it speeds up both directions equally |\n| Add an inert gas (constant V) | no shift | no partial pressures change |',
        },
        {
          kind: 'hack',
          title: 'Temperature is the special one 🌡️',
          body: 'Write heat into the equation as a reactant or product:\n- Exothermic: A ⇌ B + **heat**\n- Endothermic: A + **heat** ⇌ B\n\nAdding heat pushes away from the "heat" side.\n\n⚠️ **Only temperature changes the value of K.** Concentration, pressure and volume changes alter **Q only**. Raising T for an exothermic reaction **decreases K**.',
        },
        {
          kind: 'example',
          title: 'A color-change equilibrium',
          problem: '[[eq: Co(H2O)6^2+(aq) + 4Cl^-(aq) <=> CoCl4^2-(aq) + 6H2O(l)]]\nPink on the left, blue on the right. The forward reaction is endothermic. What color appears when the solution is heated, and when HCl is added?',
          steps: [
            'Heating: endothermic forward → heat acts as a reactant → shifts **right** → turns **blue**.',
            'Adding HCl adds Cl⁻ (a reactant) → Q < K → shifts **right** → also **blue**.',
            'Cooling in an ice bath would shift it left → **pink**.',
          ],
          answer: 'Both heating and adding HCl turn the solution blue.',
        },
        {
          kind: 'concept',
          title: 'Dilution of solutions',
          body: 'Adding water to an aqueous equilibrium lowers all the dissolved concentrations. The system shifts toward the side with **more dissolved particles** to partly make up for it.',
        },
        {
          kind: 'try',
          question: {
            id: 'c7.9-t1',
            type: 'mcq',
            prompt: '[[eq: 2SO2(g) + O2(g) <=> 2SO3(g)]] The container volume is **increased** at constant temperature. The equilibrium shifts…',
            choices: ['right (toward SO₃)', 'left (toward SO₂ + O₂)', 'not at all', 'right, and K increases'],
            answer: 1,
            hint: 'Bigger volume → lower pressure → shift toward more gas moles.',
            explain: 'Bigger volume favors the side with **more gas moles**: left has 3 and right has 2 → it shifts **left**. K is unchanged.',
          },
        },
        {
          kind: 'frq',
          body: 'For full credit, explain with **Q vs. K**, not just "Le Châtelier says so":\n\n"Adding N₂ increases the denominator of Q, so **Q < K**. The reaction proceeds in the forward direction, consuming N₂ and H₂ and producing NH₃, until Q = K again."',
        },
        {
          kind: 'summary',
          points: [
            'The system shifts to counteract a stress, so Q returns to K.',
            'Volume ↓ → shift toward fewer gas moles. Catalysts and inert gases → no shift.',
            'Only temperature changes K.',
          ],
        },
      ],
      check: [
        {
          id: 'c7.9-q1',
          type: 'mcq',
          prompt: '[[eq: N2(g) + O2(g) <=> 2NO(g)]] ΔH > 0. Which change increases the amount of NO at equilibrium?',
          choices: ['Decreasing the temperature', 'Increasing the temperature', 'Decreasing the volume', 'Adding a catalyst'],
          answer: 1,
          hint: 'Endothermic: heat is a "reactant".',
          explain: 'Endothermic → raising T shifts it **right** (and increases K). Volume has no effect here, since there are 2 gas moles on each side. A catalyst doesn\'t shift equilibrium.',
        },
        {
          id: 'c7.9-q2',
          type: 'mcq',
          prompt: 'Which stress changes the **value of K**?',
          choices: ['Adding reactant', 'Removing product', 'Changing the temperature', 'Changing the volume'],
          answer: 2,
          explain: 'Only a **temperature** change alters K. The other stresses change Q, and the system shifts to restore Q = K.',
        },
        {
          id: 'c7.9-q3',
          type: 'mcq',
          prompt: '[[eq: CaCO3(s) <=> CaO(s) + CO2(g)]] Some solid CaO is **added** at equilibrium. The amount of CO₂…',
          choices: ['increases', 'decreases', 'stays the same', 'drops to zero'],
          answer: 2,
          explain: 'Solids don\'t appear in Q, so adding CaO(s) doesn\'t change Q → **no shift**.',
        },
      ],
      flashcards: [
        { front: 'Le Châtelier: decreasing the volume of a gas mixture', back: 'Shifts toward the side with **fewer gas moles**.' },
        { front: 'Which stress changes K?', back: 'Only **temperature**.' },
        { front: 'Effect of a catalyst on equilibrium position', back: 'None. It just reaches equilibrium faster.' },
        { front: 'Raising T for an exothermic reaction: shift and K?', back: 'Shifts **left**. K **decreases**.' },
      ],
    },
    {
      id: 'chem-7.11',
      ced: ['7.11'],
      title: 'Solubility Equilibria (Ksp)',
      level: 'core',
      minutes: 10,
      cards: [
        {
          kind: 'hook',
          body: 'Kidney stones are mostly calcium oxalate, a "slightly soluble" salt that precipitates when its ions get too concentrated. **Ksp** tells you exactly how much can dissolve.',
        },
        {
          kind: 'concept',
          title: 'Ksp: the solubility product',
          body: 'Dissolving a salt is a reversible equilibrium:\n\n[[eq: AgCl(s) <=> Ag^+(aq) + Cl^-(aq)]] **Ksp = [Ag⁺][Cl⁻]**\n[[eq: CaF2(s) <=> Ca^2+(aq) + 2F^-(aq)]] **Ksp = [Ca²⁺][F⁻]²**\n\n(No solid in the expression!) The CED connects this to the solubility rules: salts with **Ksp > 1** correspond to soluble salts. The "always soluble" Na⁺/K⁺/NH₄⁺/NO₃⁻ salts fit this.',
        },
        {
          kind: 'concept',
          title: 'Molar solubility (s)',
          body: 'Let **s** = moles of salt that dissolve per liter (M). Then use the formula to write each ion in terms of s:\n\n| Salt type | Ions | Ksp in terms of s |\n| AB (AgCl) | s, s | s² |\n| AB₂ (CaF₂) | s, 2s | s(2s)² = **4s³** |\n| A₂B (Ag₂CrO₄) | 2s, s | (2s)²s = **4s³** |',
        },
        {
          kind: 'example',
          title: 'Solubility of AgCl',
          problem: 'Ksp of AgCl = 1.8 × 10^{-10}. Find its molar solubility.',
          steps: ['Ksp = s² → s = √(1.8 × 10^{-10})', 's = **1.3 × 10^{-5} M**'],
          answer: '1.3 × 10⁻⁵ M',
          verify: [{ stated: 1.3e-5, compute: () => Math.sqrt(1.8e-10), tol: 0.04 }],
        },
        {
          kind: 'example',
          title: 'Ksp from solubility',
          problem: 'The molar solubility of Ag₂CrO₄ is **6.5 × 10^{-5} M**. Find Ksp.',
          steps: ['[Ag⁺] = 2s = 1.3 × 10^{-4} M and [CrO₄²⁻] = s = 6.5 × 10^{-5} M', 'Ksp = (2s)²(s) = 4s³ = 4(6.5 × 10^{-5})³ = **1.1 × 10^{-12}**'],
          answer: 'Ksp ≈ 1.1 × 10⁻¹²',
          verify: [{ stated: 1.1e-12, compute: () => 4 * 6.5e-5 ** 3, tol: 0.02 }],
        },
        {
          kind: 'trap',
          body: 'You can compare solubilities by Ksp **only for salts of the same type** (same ion ratio). AgCl (s²) vs. AgBr (s²) ✓. But AgCl (s²) vs. Ag₂CrO₄ (4s³) ✗. You have to calculate s for each!',
        },
        {
          kind: 'try',
          question: {
            id: 'c7.11-t1',
            type: 'num',
            prompt: 'CaF₂ has Ksp = 3.9 × 10^{-11}. What is its molar solubility?',
            answer: 2.136e-4,
            unit: 'M',
            hint: 'Ksp = 4s³, so s = ∛(Ksp/4).',
            explain: 's = ∛(3.9 × 10^{-11} / 4) = ∛(9.75 × 10^{-12}) = **2.1 × 10^{-4} M**',
            compute: () => Math.cbrt(3.9e-11 / 4),
          },
        },
        {
          kind: 'summary',
          points: [
            'Ksp = the product of the ion concentrations (each raised to its coefficient). No solid.',
            'AB: Ksp = s². AB₂ or A₂B: Ksp = 4s³.',
            'Compare Ksp directly only for salts with the same ion ratio.',
          ],
        },
      ],
      check: [
        {
          id: 'c7.11-q1',
          type: 'mcq',
          prompt: 'What is the Ksp expression for **PbI₂**?',
          choices: ['[Pb²⁺][I⁻]', '[Pb²⁺][I⁻]²', '[Pb²⁺][2I⁻]', '[Pb²⁺][I⁻]²/[PbI₂]'],
          answer: 1,
          explain: '[[eq: PbI2(s) <=> Pb^2+(aq) + 2I^-(aq)]] → **Ksp = [Pb²⁺][I⁻]²**',
        },
        {
          id: 'c7.11-q2',
          type: 'mcq',
          prompt: 'Which is **most soluble** in water? AgCl (Ksp 1.8 × 10⁻¹⁰), AgBr (Ksp 5.0 × 10⁻¹³), AgI (Ksp 8.3 × 10⁻¹⁷)',
          choices: ['AgCl', 'AgBr', 'AgI', 'All equal'],
          answer: 0,
          explain: 'All are the same type (AB, s = √Ksp), so the largest Ksp = the most soluble → **AgCl**.',
        },
        {
          id: 'c7.11-q3',
          type: 'num',
          prompt: 'The molar solubility of BaSO₄ is 1.0 × 10^{-5} M. What is its Ksp?',
          answer: 1.0e-10,
          explain: 'Ksp = s² = (1.0 × 10^{-5})² = **1.0 × 10^{-10}**',
          compute: () => (1.0e-5) ** 2,
        },
      ],
      flashcards: [
        { front: 'Ksp for an AB salt in terms of s', back: 'Ksp = s²' },
        { front: 'Ksp for an AB₂ or A₂B salt in terms of s', back: 'Ksp = 4s³' },
        { front: 'When can you compare solubility using Ksp directly?', back: 'Only for salts with the same ion ratio (same formula type).' },
      ],
    },
    // ---------------- ADVANCED ----------------
    {
      id: 'chem-7.12',
      ced: ['7.12'],
      title: 'The Common-Ion Effect',
      level: 'advanced',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Try dissolving AgCl in salt water instead of pure water and even less dissolves. The Cl⁻ already in the water "gets in the way." That\'s the **common-ion effect**.',
        },
        {
          kind: 'concept',
          title: 'Why it happens',
          body: 'For [[eq: AgCl(s) <=> Ag^+(aq) + Cl^-(aq)]], adding Cl⁻ (from NaCl) raises Q above Ksp. The equilibrium shifts **left** (Le Châtelier), so **less AgCl dissolves**.\n\n**A common ion lowers solubility.** Ksp itself doesn\'t change, since the temperature is the same.',
        },
        {
          kind: 'example',
          title: 'AgCl in 0.10 M NaCl',
          problem: 'Ksp(AgCl) = 1.8 × 10^{-10}. Find the solubility of AgCl in **0.10 M NaCl**.',
          steps: [
            '[Ag⁺] = s and [Cl⁻] = 0.10 + s ≈ **0.10** (s is tiny)',
            'Ksp = s(0.10) = 1.8 × 10^{-10}',
            's = **1.8 × 10^{-9} M**, about 7,500 times less than in pure water (1.3 × 10^{-5} M)!',
          ],
          answer: 's = 1.8 × 10⁻⁹ M',
          verify: [
            { stated: 1.8e-9, compute: () => 1.8e-10 / 0.1 },
            { stated: 7500, compute: () => Math.sqrt(1.8e-10) / (1.8e-10 / 0.1), tol: 0.01 },
          ],
        },
        {
          kind: 'hack',
          title: 'The "ignore the tiny s" shortcut',
          body: 'When the common ion\'s concentration is much bigger than s, drop the "+ s":\n\n0.10 + 1.8 × 10^{-9} ≈ 0.10\n\nThis turns a cubic or quadratic into simple division.',
        },
        {
          kind: 'try',
          question: {
            id: 'c7.12-t1',
            type: 'mcq',
            prompt: 'In which solution is PbCl₂ **least** soluble?',
            choices: ['Pure water', '0.10 M NaNO₃', '0.10 M NaCl', '0.10 M HNO₃'],
            answer: 2,
            explain: '**NaCl** supplies Cl⁻, a common ion, which shifts PbCl₂(s) ⇌ Pb²⁺ + 2Cl⁻ to the left. The others contain no common ion.',
          },
        },
        {
          kind: 'summary',
          points: [
            'A common ion lowers solubility (Le Châtelier shifts toward the solid).',
            'Ksp stays the same. Only the solubility changes.',
            'Approximate [common ion] + s ≈ [common ion].',
          ],
        },
      ],
      check: [
        {
          id: 'c7.12-q1',
          type: 'num',
          prompt: 'Ksp of CaF₂ = 3.9 × 10^{-11}. What is its molar solubility in **0.010 M NaF**? (Ksp = [Ca²⁺][F⁻]², and [F⁻] ≈ 0.010 M)',
          answer: 3.9e-7,
          unit: 'M',
          explain: 's(0.010)² = 3.9 × 10^{-11} → s = 3.9 × 10^{-11} / 1.0 × 10^{-4} = **3.9 × 10^{-7} M**',
          compute: () => 3.9e-11 / 0.01 ** 2,
        },
        {
          id: 'c7.12-q2',
          type: 'mcq',
          prompt: 'Adding Na₂SO₄ to a saturated BaSO₄ solution causes…',
          choices: ['more BaSO₄ to dissolve', 'BaSO₄ to precipitate', 'Ksp to increase', 'no change'],
          answer: 1,
          explain: 'Extra SO₄²⁻ makes Q > Ksp → the equilibrium shifts left → **BaSO₄ precipitates**.',
        },
      ],
      flashcards: [
        { front: 'Common-ion effect', back: 'A salt is **less soluble** in a solution that already contains one of its ions.' },
        { front: 'Does a common ion change Ksp?', back: 'No (same temperature). It lowers the **solubility**.' },
      ],
    },
  ],
  checkpoint: [
    {
      id: 'c7-cp1',
      type: 'mcq',
      prompt: 'For [[eq: H2(g) + Cl2(g) <=> 2HCl(g)]], K ≈ 10^{33} at 25 °C. At equilibrium the mixture is…',
      choices: ['mostly H₂ and Cl₂', 'mostly HCl', 'equal amounts of all three', 'impossible to predict'],
      answer: 1,
      explain: 'A huge K → the reaction goes essentially to completion → **mostly HCl**.',
    },
    {
      id: 'c7-cp2',
      type: 'mcq',
      prompt: '[[eq: PCl5(g) <=> PCl3(g) + Cl2(g)]] Some Cl₂ is removed. What happens to [PCl₃]?',
      choices: ['Increases', 'Decreases', 'Stays the same', 'Drops to zero'],
      answer: 0,
      explain: 'Removing a product → Q < K → shifts **right** → more PCl₃ forms.',
    },
    {
      id: 'c7-cp3',
      type: 'num',
      prompt: 'K = 0.50 for {{X(g) + Y(g) <=> Z(g)}}. What is K for {{2Z(g) <=> 2X(g) + 2Y(g)}}?',
      answer: 4.0,
      explain: 'Reverse → 1/0.50 = 2.0. Then ×2 → square it: 2.0² = **4.0**',
      compute: () => (1 / 0.5) ** 2,
    },
    {
      id: 'c7-cp4',
      type: 'mcq',
      prompt: 'Which statement about a system at equilibrium is correct?',
      choices: ['All reactions have stopped', 'Q > K', 'The rates of the forward and reverse reactions are equal', 'Reactants have been completely used up'],
      answer: 2,
      explain: 'Equilibrium means **equal forward and reverse rates** (and Q = K).',
    },
  ],
}
