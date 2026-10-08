import type { Unit } from '../types'
import { CONST, molarMass } from '../../lib/chem'

const F = CONST.F
const R = CONST.R_J

// N2 + 3H2 -> 2NH3 standard values used throughout this unit
const dS_nh3 = 2 * 192.5 - (191.6 + 3 * 130.7) // J/K
const dG_nh3 = -92.2 - (298 * dS_nh3) / 1000 // kJ

export const unit9: Unit = {
  id: 'chem-u9',
  number: 9,
  title: 'Thermodynamics and Electrochemistry',
  weight: '7–9%',
  blurb: 'Why reactions happen at all: entropy, Gibbs free energy, the link between ΔG° and K, and the chemistry of batteries and electroplating.',
  badge: { name: 'Energy Engineer', emoji: '🔋' },
  lessons: [
    // ---------------- FOUNDATION ----------------
    {
      id: 'chem-9.1',
      ced: ['9.1'],
      title: 'Introduction to Entropy',
      level: 'foundation',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Open a bottle of perfume and soon the whole room smells of it. The molecules never gather back into the bottle on their own. Nature tends toward **spreading out**, and **entropy (S)** measures that spreading.',
        },
        {
          kind: 'concept',
          title: 'Entropy = dispersal of matter and energy',
          body: 'Entropy **increases** when **matter** or **energy** becomes more spread out:\n\n- **Phase change:** solid → liquid → gas (particles freer to move, larger volume). S(gas) ≫ S(liquid) > S(solid).\n- **Gas volume increases** (at constant T): more space to move in.\n- **More moles of gas** in the products than in the reactants.\n- **Higher temperature:** the kinetic energy distribution broadens (KMT).\n- **Dissolving** a solid usually increases dispersal of the solute particles.',
        },
        {
          kind: 'hack',
          title: 'Count the gas moles first',
          body: 'For reactions, the fastest predictor of the sign of ΔS is:\n\n**Δn_{gas} = (moles of gas products) − (moles of gas reactants)**\n\n- Δn_{gas} > 0 → ΔS > 0\n- Δn_{gas} < 0 → ΔS < 0\n\nExample: [[eq: 2H2O2(l) -> 2H2O(l) + O2(g)]] goes from 0 to 1 mol gas → ΔS > 0.',
        },
        {
          kind: 'try',
          question: {
            id: 'c9.1-t1',
            type: 'mcq',
            prompt: 'Which process has **ΔS < 0**?',
            choices: ['Ice melting', 'Water evaporating', '[[eq: N2(g) + 3H2(g) -> 2NH3(g)]]', 'Dry ice subliming'],
            answer: 2,
            explain: '4 mol of gas → 2 mol of gas: fewer gas particles → less dispersal → **ΔS < 0**. The other three increase dispersal.',
          },
        },
        {
          kind: 'summary',
          points: [
            'Entropy measures the dispersal of matter and energy.',
            'S increases for s → l → g, larger volume, more gas moles, and higher T.',
            'Δn(gas) is the quickest way to predict the sign of ΔS.',
          ],
        },
      ],
      check: [
        {
          id: 'c9.1-q1',
          type: 'mcq',
          prompt: 'Which has the **highest** standard molar entropy?',
          choices: ['H₂O(s)', 'H₂O(l)', 'H₂O(g)', 'All are equal'],
          answer: 2,
          explain: 'Gas particles are the most dispersed → **H₂O(g)** has the highest entropy.',
        },
        {
          id: 'c9.1-q2',
          type: 'mcq',
          prompt: 'What is the sign of ΔS for [[eq: CaCO3(s) -> CaO(s) + CO2(g)]]?',
          choices: ['Positive', 'Negative', 'Zero', 'Can\'t tell'],
          answer: 0,
          explain: 'A gas forms from a solid (0 → 1 mol of gas) → more dispersal → **ΔS > 0**.',
        },
      ],
      flashcards: [
        { front: 'Entropy (AP definition)', back: 'A measure of the **dispersal** of matter and energy.' },
        { front: 'Quick way to predict the sign of ΔS for a reaction', back: 'Compare the moles of **gas**: more gas in the products → ΔS > 0.' },
      ],
    },
    // ---------------- CORE ----------------
    {
      id: 'chem-9.2',
      ced: ['9.2'],
      title: 'Calculating ΔS°',
      level: 'core',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: 'Unlike enthalpy, entropy has absolute values: every pure element and compound has a standard molar entropy S° greater than zero. So calculating ΔS° is just "products minus reactants," the same pattern as ΔH°_f.',
        },
        {
          kind: 'concept',
          title: 'The equation',
          body: '**ΔS°_{rxn} = ΣS°(products) − ΣS°(reactants)**\n\n- Multiply by the **coefficients**.\n- Units are **J/(mol·K)**, joules, not kilojoules!\n- Unlike ΔH°_f, elements do **not** have S° = 0.',
        },
        {
          kind: 'example',
          title: 'Making ammonia',
          problem: '[[eq: N2(g) + 3H2(g) -> 2NH3(g)]]\nS° (J/(mol·K)): N₂ 191.6, H₂ 130.7, NH₃ 192.5',
          steps: [
            'Products: 2(192.5) = 385.0',
            'Reactants: 191.6 + 3(130.7) = 583.7',
            'ΔS° = 385.0 − 583.7 = **−198.7 J/K**. Negative, as expected (4 mol gas → 2 mol gas).',
          ],
          answer: 'ΔS° = −198.7 J/(mol·K)',
          verify: [{ stated: -198.7, compute: () => dS_nh3 }],
        },
        {
          kind: 'trap',
          body: 'Elements like O₂ and H₂ have S° ≠ 0. Only their ΔH°_f (and ΔG°_f) are zero. Don\'t drop them from an entropy calculation!',
        },
        {
          kind: 'try',
          question: {
            id: 'c9.2-t1',
            type: 'num',
            prompt: 'Find ΔS° for [[eq: 2SO2(g) + O2(g) -> 2SO3(g)]]. S°: SO₂ 248.2, O₂ 205.0, SO₃ 256.8 J/(mol·K).',
            answer: -187.8,
            unit: 'J/K',
            explain: '2(256.8) − [2(248.2) + 205.0] = 513.6 − 701.4 = **−187.8 J/K**',
            compute: () => 2 * 256.8 - (2 * 248.2 + 205.0),
          },
        },
        {
          kind: 'summary',
          points: ['ΔS° = Σ S°(products) − Σ S°(reactants), × coefficients.', 'Units: J/(mol·K).', 'Elements have nonzero S°.'],
        },
      ],
      check: [
        {
          id: 'c9.2-q1',
          type: 'num',
          prompt: 'Find ΔS° for [[eq: H2O(l) -> H2O(g)]]. S°: H₂O(l) 69.9, H₂O(g) 188.8 J/(mol·K).',
          answer: 118.9,
          unit: 'J/K',
          explain: '188.8 − 69.9 = **+118.9 J/K** (liquid → gas, so the sign is positive, as expected).',
          compute: () => 188.8 - 69.9,
        },
        {
          id: 'c9.2-q2',
          type: 'mcq',
          prompt: 'What is the standard molar entropy of O₂(g)?',
          choices: ['Zero, since it\'s an element', 'A positive value (205.0 J/(mol·K))', 'A negative value', 'Undefined'],
          answer: 1,
          explain: 'Every pure element and compound at 298 K has a **positive** absolute entropy. Only ΔH°_f and ΔG°_f are zero for elements.',
        },
      ],
      flashcards: [
        { front: 'ΔS° from standard entropies', back: 'Σ S°(products) − Σ S°(reactants)' },
        { front: 'Units of S° and ΔS°', back: 'J/(mol·K) (joules, not kJ)' },
      ],
    },
    {
      id: 'chem-9.3',
      ced: ['9.3'],
      title: 'Gibbs Free Energy & Favorability',
      level: 'core',
      minutes: 11,
      cards: [
        {
          kind: 'hook',
          body: 'Ice melts on a warm day but not in the freezer. Same process, different outcome. **Gibbs free energy** combines enthalpy, entropy and temperature to decide which way nature goes.',
        },
        {
          kind: 'concept',
          title: 'ΔG° = ΔH° − TΔS°',
          body: '- **ΔG° < 0** → **thermodynamically favored** (the products are favored)\n- **ΔG° > 0** → not favored (the reverse is favored)\n\nAP uses "**thermodynamically favored**" rather than "spontaneous," because "spontaneous" sounds like "happens instantly," and favored reactions can be extremely slow.\n\n⚠️ Units: ΔH in **kJ**, ΔS in **J/K**. Convert ΔS to kJ/K (÷ 1000) before combining!',
        },
        {
          kind: 'concept',
          title: 'The sign table',
          body: '| ΔH° | ΔS° | Favored at |\n| − | + | **all** temperatures |\n| + | − | **no** temperature |\n| + | + | **high** T (the entropy term wins) |\n| − | − | **low** T (the enthalpy term wins) |\n\nIn the first two rows, no calculation is needed!',
        },
        {
          kind: 'hack',
          title: 'Think "who wins the tug-of-war?"',
          body: 'ΔH wants to go **down** (negative). The −TΔS term wants ΔS to go **up** (positive).\n\n- When they agree (−, +) → always favored.\n- When they disagree, **temperature is the referee**. High T makes the TΔS term bigger, so entropy wins.\n\nThe crossover temperature where ΔG° = 0: **T = ΔH°/ΔS°**.',
        },
        {
          kind: 'example',
          title: 'Is ammonia formation favored at 298 K?',
          problem: '[[eq: N2(g) + 3H2(g) -> 2NH3(g)]] ΔH° = −92.2 kJ, ΔS° = −198.7 J/K',
          steps: [
            'Convert ΔS° = −0.1987 kJ/K',
            'ΔG° = −92.2 − (298)(−0.1987) = −92.2 + 59.2 = **−33.0 kJ** → favored ✓',
            'Crossover T = ΔH/ΔS = (−92.2)/(−0.1987) ≈ **464 K**. Above that, it\'s no longer favored (ΔH and ΔS are both negative → favored only at low T).',
          ],
          answer: 'ΔG° = −33.0 kJ (favored at 298 K, but not above ~464 K)',
          verify: [
            { stated: -33.0, compute: () => dG_nh3 },
            { stated: 464, compute: () => -92.2 / (dS_nh3 / 1000), tol: 0.01 },
          ],
        },
        {
          kind: 'concept',
          title: 'Real-world examples from the CED',
          body: '- **Water freezing:** ΔH < 0, ΔS < 0 → favored only at **low T** (below 0 °C).\n- **NaNO₃ dissolving:** ΔH > 0 (it cools the water!) but ΔS > 0 → favored because the entropy term wins.\n\nΔG° can also be found from formation values: **ΔG°_{rxn} = ΣΔG°_{f}(products) − ΣΔG°_{f}(reactants)**.',
        },
        {
          kind: 'try',
          question: {
            id: 'c9.3-t1',
            type: 'mcq',
            prompt: 'A reaction has ΔH° = +50 kJ and ΔS° = +150 J/K. When is it thermodynamically favored?',
            choices: ['At all temperatures', 'At no temperature', 'Only at high temperatures', 'Only at low temperatures'],
            answer: 2,
            explain: '(+, +) → favored at **high T** (above 50/0.150 ≈ 333 K), where TΔS outweighs ΔH.',
          },
        },
        {
          kind: 'summary',
          points: [
            'ΔG° = ΔH° − TΔS°. ΔG° < 0 means thermodynamically favored.',
            '(−,+) always favored. (+,−) never. (+,+) high T. (−,−) low T.',
            'Convert ΔS from J to kJ!',
          ],
        },
      ],
      check: [
        {
          id: 'c9.3-q1',
          type: 'num',
          prompt: 'Calculate ΔG° at 298 K for a reaction with ΔH° = −120 kJ and ΔS° = −150 J/K.',
          answer: -75.3,
          unit: 'kJ',
          explain: 'ΔG° = −120 − (298)(−0.150) = −120 + 44.7 = **−75.3 kJ**',
          compute: () => -120 - 298 * -0.15,
        },
        {
          id: 'c9.3-q2',
          type: 'mcq',
          prompt: 'A process has ΔH > 0 and ΔS < 0. It is…',
          choices: ['always favored', 'never favored', 'favored at high T', 'favored at low T'],
          answer: 1,
          explain: 'Both terms make ΔG positive → **never** thermodynamically favored (at any T).',
        },
        {
          id: 'c9.3-q3',
          type: 'num',
          prompt: 'Above what temperature (K) does a reaction with ΔH° = +40.0 kJ and ΔS° = +100. J/K become favored?',
          answer: 400,
          unit: 'K',
          explain: 'T = ΔH/ΔS = 40.0 kJ / 0.100 kJ/K = **400 K**',
          compute: () => 40.0 / 0.1,
        },
      ],
      flashcards: [
        { front: 'Gibbs equation', back: 'ΔG° = ΔH° − TΔS°' },
        { front: 'ΔG° < 0 means…', back: '**Thermodynamically favored** (products favored)' },
        { front: 'ΔH < 0, ΔS < 0: favored when?', back: 'At **low** temperature' },
        { front: 'ΔH > 0, ΔS > 0: favored when?', back: 'At **high** temperature' },
      ],
    },
    {
      id: 'chem-9.4',
      ced: ['9.4'],
      title: 'Thermodynamic vs. Kinetic Control',
      level: 'core',
      minutes: 5,
      cards: [
        {
          kind: 'hook',
          body: '"Diamonds are forever"? Thermodynamically, diamond should slowly turn into graphite at room conditions. It just happens **so slowly** that you\'ll never see it. That\'s **kinetic control**.',
        },
        {
          kind: 'concept',
          title: 'Favored ≠ fast',
          body: 'ΔG tells you **whether** a reaction is favored. It says **nothing about how fast** it goes.\n\nA thermodynamically favored process that doesn\'t occur at a measurable rate is under **kinetic control**. The usual reason is a **high activation energy**.\n\nExamples: diamond → graphite, and wood + O₂ (very favored, but it needs a match to get over Ea).',
        },
        {
          kind: 'trap',
          body: 'If a favored reaction isn\'t happening, it is **not** at equilibrium. It\'s just slow! Don\'t confuse "no visible change" with "equilibrium" here.',
        },
        {
          kind: 'try',
          question: {
            id: 'c9.4-t1',
            type: 'mcq',
            prompt: 'A reaction has ΔG° = −200 kJ, but no product forms after weeks at room temperature. The best explanation is…',
            choices: ['The reaction is at equilibrium', 'ΔG° is actually positive', 'The reaction has a very high activation energy (kinetic control)', 'The products are less stable'],
            answer: 2,
            explain: 'Favored but unobservably slow → **kinetic control**, most likely because of a large Ea.',
          },
        },
        {
          kind: 'summary',
          points: ['Thermodynamics: whether it\'s favored. Kinetics: how fast.', 'Favored but slow = kinetic control (high Ea).', 'A slow reaction isn\'t necessarily at equilibrium.'],
        },
      ],
      check: [
        {
          id: 'c9.4-q1',
          type: 'mcq',
          prompt: 'Which change would make a kinetically controlled (favored but slow) reaction occur at a measurable rate?',
          choices: ['Adding a catalyst', 'Making ΔG more positive', 'Lowering the temperature', 'Removing the reactants'],
          answer: 0,
          explain: 'A **catalyst** lowers Ea, so the favored reaction can proceed faster (a higher temperature would also help).',
        },
        {
          id: 'c9.4-q2',
          type: 'mcq',
          prompt: 'Thermodynamically, diamond → graphite is favored at room conditions. Why do diamonds last?',
          choices: ['ΔG > 0', 'The conversion has an extremely high activation energy', 'Diamond is at equilibrium with graphite', 'Graphite is less stable'],
          answer: 1,
          explain: 'The conversion requires breaking many strong C–C bonds: a huge **Ea**, so the rate is effectively zero.',
        },
      ],
      flashcards: [
        { front: 'Kinetic control', back: 'A thermodynamically favored process that is too slow to observe, usually because of a high activation energy.' },
        { front: 'Does ΔG tell you the reaction rate?', back: '**No.** It only tells you whether the reaction is favored.' },
      ],
    },
    {
      id: 'chem-9.5',
      ced: ['9.5'],
      title: 'Free Energy & Equilibrium',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'Units 7 and 9 meet here: one equation connects ΔG° (thermodynamics) to K (equilibrium). Know the sign of one and you instantly know the size of the other.',
        },
        {
          kind: 'concept',
          title: 'ΔG° = −RT ln K',
          body: 'Rearranged: **K = e^{−ΔG°/RT}** (R = 8.314 J/(mol·K), so put ΔG° in **joules**)\n\n| ΔG° | K | Equilibrium favors |\n| < 0 | > 1 | products |\n| = 0 | = 1 | neither |\n| > 0 | < 1 | reactants |\n\n"Thermodynamically favored" (ΔG° < 0) means **products are favored at equilibrium** (K > 1).',
        },
        {
          kind: 'hack',
          title: 'Estimate without a calculator',
          body: 'RT ≈ 2.5 kJ/mol at 298 K.\n\n- |ΔG°| near zero (a few kJ) → K close to 1.\n- |ΔG°| much bigger than RT (tens of kJ or more) → K far from 1 (huge or tiny).\n\nThat qualitative reasoning is exactly what the CED expects.',
        },
        {
          kind: 'example',
          title: 'K for ammonia at 298 K',
          problem: 'ΔG° = −33.0 kJ/mol. Find K.',
          steps: [
            'ln K = −ΔG°/RT = −(−33,000 J)/(8.314 × 298) = **13.3**',
            'K = e^{13.3} ≈ **6 × 10^{5}**. Products are strongly favored.',
          ],
          answer: 'K ≈ 6 × 10⁵',
          verify: [
            { stated: 13.3, compute: () => 33000 / (R * 298), tol: 0.01 },
            { stated: 6e5, compute: () => Math.exp(33000 / (R * 298)), tol: 0.05 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 'c9.5-t1',
            type: 'mcq',
            prompt: 'A reaction has K = 3.2 × 10^{-8} at 298 K. Its ΔG° is…',
            choices: ['negative', 'positive', 'zero', 'impossible to determine'],
            answer: 1,
            explain: 'K < 1 → ln K < 0 → ΔG° = −RT ln K > 0 → **positive** (reactants are favored).',
          },
        },
        {
          kind: 'summary',
          points: ['ΔG° = −RT ln K (ΔG° in J).', 'ΔG° < 0 ↔ K > 1 (products favored).', 'ΔG° near 0 → K ≈ 1.'],
        },
      ],
      check: [
        {
          id: 'c9.5-q1',
          type: 'num',
          prompt: 'What is ΔG° (in kJ/mol) at 298 K for a reaction with K = 1.0 × 10^{3}?',
          answer: -17.1,
          unit: 'kJ/mol',
          tolerance: 0.01,
          explain: 'ΔG° = −(8.314)(298) ln(1000) = −2478 × 6.91 = −17,100 J = **−17.1 kJ/mol**',
          compute: () => (-R * 298 * Math.log(1000)) / 1000,
        },
        {
          id: 'c9.5-q2',
          type: 'mcq',
          prompt: 'If ΔG° = 0 for a reaction, then K…',
          choices: ['= 0', '= 1', '> 1', '< 0'],
          answer: 1,
          explain: '−RT ln K = 0 → ln K = 0 → **K = 1**.',
        },
      ],
      flashcards: [
        { front: 'Relationship between ΔG° and K', back: 'ΔG° = −RT ln K' },
        { front: 'ΔG° < 0 corresponds to K…', back: '**> 1** (products favored)' },
      ],
    },
    {
      id: 'chem-9.8',
      ced: ['9.8'],
      title: 'Galvanic & Electrolytic Cells',
      level: 'core',
      minutes: 10,
      cards: [
        {
          kind: 'hook',
          body: 'A battery is a redox reaction with its electrons forced to take the long way, **through a wire**, where they can power your phone. That device is a **galvanic (voltaic) cell**.',
        },
        {
          kind: 'concept',
          title: 'The parts of a galvanic cell',
          body: '- **Anode:** where **oxidation** happens (electrons are released). The electrode often **loses mass** (Zn → Zn²⁺).\n- **Cathode:** where **reduction** happens (electrons are used). The electrode often **gains mass** as metal plates out (Cu²⁺ → Cu).\n- **Wire:** electrons flow **from anode to cathode**.\n- **Salt bridge:** lets ions flow to keep each half-cell electrically neutral. **Anions → anode, cations → cathode.**\n- **Voltmeter:** measures the cell potential.',
          diagram: 'galvanic-cell',
        },
        {
          kind: 'hack',
          title: '"An Ox, Red Cat" 🐂🐈',
          body: '**An**ode = **Ox**idation, **Red**uction = **Cat**hode.\n\nElectrons flow alphabetically: **A → C** (anode to cathode).\n\nThis is true for **every** electrochemical cell, galvanic or electrolytic. (Labeling electrodes + or − isn\'t tested on the AP exam.)',
        },
        {
          kind: 'concept',
          title: 'Galvanic vs. electrolytic',
          body: '| | Galvanic (voltaic) | Electrolytic |\n| Reaction | thermodynamically **favored** | thermodynamically **unfavored** |\n| Energy | **produces** electrical energy | **requires** an external power source |\n| Example | batteries discharging | electroplating, charging a battery, electrolysis of molten NaCl |\n\nOxidation is still at the anode and reduction at the cathode in both!',
        },
        {
          kind: 'try',
          question: {
            id: 'c9.8-t1',
            type: 'mcq',
            prompt: 'In a Zn/Cu galvanic cell, what happens to the mass of the **Zn electrode** over time?',
            choices: ['It increases', 'It decreases', 'It stays the same', 'It first increases and then decreases'],
            answer: 1,
            explain: 'Zn is the anode: Zn(s) → Zn²⁺(aq) + 2e⁻. Zinc atoms dissolve as ions → the electrode\'s mass **decreases**.',
          },
        },
        {
          kind: 'summary',
          points: [
            'Anode = oxidation. Cathode = reduction. e⁻ flow anode → cathode through the wire.',
            'Salt bridge: anions → anode, cations → cathode.',
            'Galvanic = favored, produces energy. Electrolytic = unfavored, needs energy.',
          ],
        },
      ],
      check: [
        {
          id: 'c9.8-q1',
          type: 'mcq',
          prompt: 'In a galvanic cell, the salt bridge…',
          choices: [
            'carries electrons between the half-cells',
            'allows ions to flow and maintain electrical neutrality in each half-cell',
            'is where oxidation occurs',
            'provides energy to the cell',
          ],
          answer: 1,
          explain: 'Electrons travel through the **wire**. The salt bridge moves **ions** to keep the solutions neutral.',
        },
        {
          id: 'c9.8-q2',
          type: 'mcq',
          prompt: 'In any electrochemical cell, reduction occurs at the…',
          choices: ['anode', 'cathode', 'salt bridge', 'voltmeter'],
          answer: 1,
          explain: '"Red Cat": **reduction at the cathode**, always.',
        },
        {
          id: 'c9.8-q3',
          type: 'mcq',
          prompt: 'Recharging a phone battery is an example of…',
          choices: ['a galvanic process', 'an electrolytic process', 'a precipitation reaction', 'equilibrium'],
          answer: 1,
          explain: 'Charging uses **external electrical energy** to drive the unfavored reverse reaction → **electrolytic**.',
        },
      ],
      flashcards: [
        { front: 'Anode / cathode reactions', back: 'Anode = **oxidation**. Cathode = **reduction** (in all cells).' },
        { front: 'Direction of electron flow in the wire', back: 'From the **anode** to the **cathode**' },
        { front: 'Galvanic vs. electrolytic', back: 'Galvanic: favored, produces electricity. Electrolytic: unfavored, needs an external source.' },
      ],
    },
    {
      id: 'chem-9.9',
      ced: ['9.9'],
      title: 'Cell Potential & Free Energy',
      level: 'core',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'Why does a lead–acid cell give about 2 V (a car battery is six of them in series) while a AA cell gives 1.5 V? The voltage comes straight from the chemistry, from the difference in how badly each half-reaction "wants" electrons.',
        },
        {
          kind: 'concept',
          title: 'Standard reduction potentials',
          body: 'Each half-reaction has a **standard reduction potential, E°**. A **more positive** E° means a stronger tendency to be **reduced**.\n\n**E°_{cell} = E°_{cathode} − E°_{anode}** (both as reduction potentials)\n\nThe half-reaction with the higher E° is reduced (cathode). The other one runs in reverse, as an oxidation (anode).\n\nDon\'t multiply E° by coefficients! Potentials don\'t scale with amount.',
        },
        {
          kind: 'example',
          title: 'The Daniell cell (Zn/Cu)',
          problem: 'Cu²⁺ + 2e⁻ → Cu E° = +0.34 V\nZn²⁺ + 2e⁻ → Zn E° = −0.76 V\nFind E°_cell and ΔG°.',
          steps: [
            'Cu has the higher E° → **cathode** (reduction). Zn → **anode** (oxidized).',
            'E°_{cell} = 0.34 − (−0.76) = **+1.10 V** → favored',
            'ΔG° = −nFE° = −(2)(96,485)(1.10) = −212,000 J = **−212 kJ**',
          ],
          answer: 'E°cell = +1.10 V, ΔG° = −212 kJ',
          verify: [
            { stated: 1.1, compute: () => 0.34 - -0.76 },
            { stated: -212, compute: () => (-2 * F * 1.1) / 1000, tol: 0.01 },
          ],
        },
        {
          kind: 'concept',
          title: 'ΔG° = −nFE°',
          body: '- n = moles of electrons transferred (in the balanced equation)\n- F = 96,485 C/mol e⁻ (Faraday\'s constant)\n\n**Positive E° → negative ΔG° → thermodynamically favored** (galvanic).\n**Negative E° → positive ΔG° → needs an external voltage** (electrolytic).',
        },
        {
          kind: 'try',
          question: {
            id: 'c9.9-t1',
            type: 'num',
            prompt: 'Ag⁺ + e⁻ → Ag E° = +0.80 V; Cu²⁺ + 2e⁻ → Cu E° = +0.34 V. Find E°_cell for the favored reaction between them.',
            answer: 0.46,
            unit: 'V',
            hint: 'The higher E° is the cathode.',
            explain: 'Cathode Ag (0.80), anode Cu (0.34): E° = 0.80 − 0.34 = **+0.46 V**. (Even though 2 Ag⁺ are needed, E° is not doubled.)',
            compute: () => 0.8 - 0.34,
          },
        },
        {
          kind: 'summary',
          points: [
            'E°cell = E°cathode − E°anode. The higher E° is reduced.',
            'Never multiply E° by coefficients.',
            'ΔG° = −nFE°. E° > 0 ↔ favored.',
          ],
        },
      ],
      check: [
        {
          id: 'c9.9-q1',
          type: 'num',
          prompt: 'A cell has E° = +0.46 V and n = 2. What is ΔG° in kJ? (F = 96,485 C/mol)',
          answer: -88.8,
          unit: 'kJ',
          explain: 'ΔG° = −(2)(96,485)(0.46) = −88,800 J = **−88.8 kJ**',
          compute: () => (-2 * F * 0.46) / 1000,
        },
        {
          id: 'c9.9-q2',
          type: 'mcq',
          prompt: 'A redox reaction has E°_{cell} = −0.25 V. Which is true?',
          choices: [
            'It is thermodynamically favored',
            'ΔG° > 0, so it requires an external energy source (electrolytic)',
            'K > 1',
            'It is a galvanic cell',
          ],
          answer: 1,
          explain: 'Negative E° → positive ΔG° → **not favored**. It needs an applied voltage.',
        },
      ],
      flashcards: [
        { front: 'E°cell formula', back: 'E°cell = E°cathode − E°anode (as reduction potentials)' },
        { front: 'ΔG° from cell potential', back: 'ΔG° = −nFE°' },
        { front: 'Do you multiply E° by the coefficients when balancing?', back: '**No**' },
      ],
    },
    {
      id: 'chem-9.11',
      ced: ['9.11'],
      title: 'Electrolysis & Faraday\'s Law',
      level: 'core',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'Gold-plated jewelry, chrome bumpers and aluminum cans are all made with electrolysis. The amount of metal deposited depends on just two things: **current** and **time**.',
        },
        {
          kind: 'concept',
          title: 'Charge → electrons → moles → grams',
          body: '**q = I × t** (charge in coulombs = current in amps × time in **seconds**)\n\n**mol e⁻ = q ÷ F** (F = 96,485 C/mol e⁻)\n\nThen use the half-reaction\'s electron ratio to get moles of metal, and from there grams.\n\nExample: [[eq: Cu^2+(aq) + 2e^- -> Cu(s)]] → **2 mol e⁻ per mol Cu**',
        },
        {
          kind: 'example',
          title: 'Copper plating',
          problem: 'A current of **2.00 A** runs for **30.0 min** through a Cu²⁺ solution. What mass of Cu plates out?',
          steps: [
            't = 30.0 × 60 = 1800 s → q = 2.00 × 1800 = **3600 C**',
            'mol e⁻ = 3600 ÷ 96,485 = **0.0373 mol**',
            'mol Cu = 0.0373 ÷ 2 = 0.0187 mol → mass = 0.0187 × 63.55 = **1.19 g**',
          ],
          answer: '1.19 g Cu',
          verify: [
            { stated: 0.0373, compute: () => 3600 / F },
            { stated: 1.19, compute: () => (3600 / F / 2) * molarMass('Cu') },
          ],
        },
        {
          kind: 'hack',
          title: 'The 4-step chain',
          body: '**amps × seconds → coulombs ÷ F → mol e⁻ ÷ (e⁻ per atom) → mol metal × M → grams**\n\nThe number of e⁻ per atom equals the **charge of the ion**: Ag⁺ = 1, Cu²⁺ = 2, Al³⁺ = 3. And convert minutes to seconds!',
        },
        {
          kind: 'try',
          question: {
            id: 'c9.11-t1',
            type: 'num',
            prompt: 'How many grams of **silver** are deposited by **0.500 A** for **965 s**? ([[eq: Ag^+(aq) + e^- -> Ag(s)]], Ag = 107.87)',
            answer: 0.5394,
            unit: 'g',
            tolerance: 0.01,
            explain: 'q = 0.500 × 965 = 482.5 C → 482.5/96,485 = 0.00500 mol e⁻ = 0.00500 mol Ag → × 107.87 = **0.539 g**',
            compute: () => ((0.5 * 965) / F) * molarMass('Ag'),
          },
        },
        {
          kind: 'summary',
          points: ['q = It (seconds!). mol e⁻ = q/F.', 'e⁻ per atom = the ion\'s charge.', 'Chain: A·s → C → mol e⁻ → mol metal → g.'],
        },
      ],
      check: [
        {
          id: 'c9.11-q1',
          type: 'num',
          prompt: 'How many **seconds** are needed to deposit **0.100 mol of Al** from Al³⁺ using a current of **10.0 A**?',
          answer: 2894.6,
          unit: 's',
          tolerance: 0.01,
          hint: 'Al³⁺ needs 3 e⁻ per Al atom.',
          explain: 'mol e⁻ = 0.300 → q = 0.300 × 96,485 = 28,946 C → t = 28,946 / 10.0 = **2,890 s** (about 48 min).',
          compute: () => (0.1 * 3 * F) / 10.0,
        },
        {
          id: 'c9.11-q2',
          type: 'mcq',
          prompt: 'The same charge is passed through solutions of Ag⁺ and Cu²⁺. Compared with the moles of Ag deposited, the moles of Cu deposited are…',
          choices: ['twice as many', 'the same', 'half as many', 'four times as many'],
          answer: 2,
          explain: 'Cu²⁺ needs 2 e⁻ per atom and Ag⁺ needs 1. The same electrons make **half** as many moles of Cu.',
        },
      ],
      flashcards: [
        { front: 'Charge from current and time', back: 'q = I × t (C = A × s)' },
        { front: 'Faraday\'s constant', back: '96,485 C per mole of electrons' },
      ],
    },
    // ---------------- ADVANCED ----------------
    {
      id: 'chem-9.6',
      ced: ['9.6'],
      title: 'Free Energy of Dissolution',
      level: 'advanced',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: 'Some salts dissolve and the water gets **colder**, yet they still dissolve readily. How can an "uphill" (endothermic) process be favored? Entropy to the rescue!',
        },
        {
          kind: 'concept',
          title: 'Three things happen when a salt dissolves',
          body: '1. **Breaking up the solid:** overcoming the attractions holding the lattice together. This costs energy (ΔH > 0), and the ions become more dispersed (ΔS > 0).\n2. **Reorganizing the solvent** around the ions: some water molecules become more ordered (often ΔS < 0).\n3. **Ion–solvent attractions form** (ion–dipole): this releases energy (ΔH < 0).\n\nΔG°_{dissolution} is the sum of these contributions. Because they partly **cancel**, predicting the overall result is often hard. That\'s why some salts dissolve and others don\'t.',
        },
        {
          kind: 'example',
          title: 'NaNO₃ in water (from the CED)',
          problem: 'Dissolving NaNO₃ makes the water colder, yet NaNO₃ is very soluble. Explain.',
          steps: [
            'The water cools → the process absorbs heat → **ΔH > 0** (unfavorable).',
            'The ions spread out from an ordered lattice into solution → **ΔS > 0** (favorable).',
            'At room temperature, **TΔS > ΔH**, so ΔG = ΔH − TΔS < 0 → favored. It\'s **entropy-driven**.',
          ],
          answer: 'Dissolving NaNO₃ is entropy-driven: TΔS outweighs the positive ΔH.',
        },
        {
          kind: 'try',
          question: {
            id: 'c9.6-t1',
            type: 'mcq',
            prompt: 'A salt dissolves readily and the solution gets warmer. Which must be true?',
            choices: ['ΔH > 0', 'ΔH < 0 for the dissolution', 'ΔS must be negative', 'ΔG > 0'],
            answer: 1,
            explain: 'The solution warms → heat is released → **ΔH < 0**. Since the salt dissolves readily, ΔG < 0.',
          },
        },
        {
          kind: 'summary',
          points: [
            'Dissolution = break the lattice (+ΔH) + reorganize the solvent + form ion–solvent attractions (−ΔH).',
            'The contributions partly cancel, so ΔG is hard to predict.',
            'Endothermic dissolving can still be favored if ΔS > 0 (like NaNO₃).',
          ],
        },
      ],
      check: [
        {
          id: 'c9.6-q1',
          type: 'mcq',
          prompt: 'Which step of dissolution **releases** energy?',
          choices: ['Separating ions from the crystal lattice', 'Separating solvent molecules to make room', 'Forming ion–dipole attractions between ions and water', 'None of them'],
          answer: 2,
          explain: 'Forming attractions (**ion–dipole**) releases energy. Breaking attractions requires it.',
        },
        {
          id: 'c9.6-q2',
          type: 'mcq',
          prompt: 'Dissolving a salt is endothermic (ΔH > 0), yet the salt is very soluble at room temperature. What must be true?',
          choices: ['ΔS < 0', 'ΔS > 0 and TΔS > ΔH', 'ΔG > 0', 'The salt is not really dissolving'],
          answer: 1,
          explain: 'For ΔG = ΔH − TΔS to be negative with ΔH > 0, the entropy term must win: **ΔS > 0 and TΔS > ΔH**.',
        },
      ],
      flashcards: [
        { front: 'Why can endothermic dissolving be favored?', back: 'If ΔS > 0 is large enough that TΔS > ΔH, then ΔG < 0 (entropy-driven).' },
        { front: 'Three contributions to ΔG of dissolution', back: 'Breaking solid interactions, reorganizing the solvent, solute–solvent interactions' },
      ],
    },
    {
      id: 'chem-9.7',
      ced: ['9.7'],
      title: 'Coupled Reactions',
      level: 'advanced',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: 'Your cells build proteins, an "uphill" (unfavored) process, all day long. How? They pair it with a strongly "downhill" reaction: breaking down ATP. Chemistry\'s version of a counterweight elevator.',
        },
        {
          kind: 'concept',
          title: 'Two ways to drive an unfavored reaction',
          body: '**1. An external energy source:**\n- **Electricity** drives electrolytic cells (and recharges batteries).\n- **Light** drives photosynthesis, turning CO₂ and H₂O into glucose.\n\n**2. Coupling:** combine an unfavored reaction (ΔG > 0) with a favored one (ΔG ≪ 0) that shares a **common intermediate**. The overall ΔG = the sum, and if it\'s **< 0**, the combined process is favored.',
        },
        {
          kind: 'example',
          title: 'ATP coupling',
          problem: 'Reaction A: ΔG° = +14 kJ (unfavored). ATP → ADP: ΔG° = −30.5 kJ. Coupled through a shared intermediate, what is ΔG° overall?',
          steps: ['Add the free energies: +14 + (−30.5) = **−16.5 kJ**', 'Overall ΔG° < 0 → the coupled process is **favored**'],
          answer: 'ΔG°overall = −16.5 kJ (favored)',
          verify: [{ stated: -16.5, compute: () => 14 + -30.5 }],
        },
        {
          kind: 'try',
          question: {
            id: 'c9.7-t1',
            type: 'mcq',
            prompt: 'An unfavored reaction (ΔG° = +40 kJ) is coupled with a favored one (ΔG° = −25 kJ). The overall process is…',
            choices: ['favored (ΔG° = −15 kJ)', 'not favored (ΔG° = +15 kJ)', 'favored (ΔG° = −65 kJ)', 'at equilibrium'],
            answer: 1,
            explain: '+40 + (−25) = **+15 kJ** → still not favored. The driving reaction must be more negative than +40.',
          },
        },
        {
          kind: 'summary',
          points: [
            'External energy (electricity, light) can drive unfavored processes.',
            'Coupling: add the ΔG values. The overall process must have ΔG < 0.',
            'Coupled reactions share a common intermediate (in cells, often a phosphorylated species formed from ATP).',
          ],
        },
      ],
      check: [
        {
          id: 'c9.7-q1',
          type: 'mcq',
          prompt: 'What drives the overall conversion of CO₂ and H₂O into glucose in photosynthesis?',
          choices: ['Heat from the soil', 'Light energy', 'A catalyst alone', 'ΔG < 0 on its own'],
          answer: 1,
          explain: 'Photosynthesis is thermodynamically unfavored on its own. **Light energy** drives it.',
        },
        {
          id: 'c9.7-q2',
          type: 'num',
          prompt: 'Reaction X has ΔG° = +22 kJ. It is coupled to ATP → ADP (ΔG° = −30.5 kJ). What is ΔG° for the coupled process?',
          answer: -8.5,
          unit: 'kJ',
          explain: '+22 + (−30.5) = **−8.5 kJ**, so the coupled process is favored.',
          compute: () => 22 + -30.5,
        },
      ],
      flashcards: [
        { front: 'Coupled reactions', back: 'An unfavored reaction is paired with a favored one (sharing an intermediate) so the overall ΔG < 0.' },
        { front: 'Two external energy sources that drive unfavored processes', back: 'Electricity (electrolysis, charging) and light (photosynthesis)' },
      ],
    },
    {
      id: 'chem-9.10',
      ced: ['9.10'],
      title: 'Cell Potential Under Nonstandard Conditions',
      level: 'advanced',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'Why does a battery die? As it runs, its reactant concentrations drop and its product concentrations build up, until the voltage falls to **zero**. That\'s a cell reaching equilibrium.',
        },
        {
          kind: 'concept',
          title: 'Voltage is the "drive toward equilibrium"',
          body: 'E° applies at standard conditions (all 1 M, 1 atm), which means **Q = 1**.\n\n- **Farther from equilibrium** than standard → |E| **increases**\n- **Closer to equilibrium** → |E| **decreases**\n- **At equilibrium (Q = K)** → **E = 0**: a dead battery!\n\nNernst equation (use it qualitatively): **E = E° − (RT/nF) ln Q**',
        },
        {
          kind: 'hack',
          title: 'Q < 1 boosts the voltage, Q > 1 drains it',
          body: 'From E = E° − (RT/nF) ln Q:\n\n- **Q < 1** (more reactant, less product) → ln Q < 0 → **E > E°**\n- **Q > 1** (more product) → ln Q > 0 → **E < E°**\n\nFor Zn + Cu²⁺ → Zn²⁺ + Cu: raising [Cu²⁺] or lowering [Zn²⁺] makes Q smaller → **higher voltage**.',
        },
        {
          kind: 'concept',
          title: 'Concentration cells',
          body: 'Both half-cells use the **same metal and ion**, at **different concentrations**. E° = 0, but the cell still produces a voltage, because the system "wants" to equalize the concentrations.\n\n- The **dilute** side oxidizes (makes more ions) → **anode**.\n- The **concentrated** side reduces (uses up ions) → **cathode**.\n\nElectrons flow from the dilute side to the concentrated side, until the concentrations are equal and E = 0.',
        },
        {
          kind: 'trap',
          body: 'The CED says equilibrium arguments like **Le Châtelier\'s principle don\'t apply** to a working electrochemical cell, because the cell is **not at equilibrium**. Reason with **Q vs. K and the Nernst equation** instead.',
        },
        {
          kind: 'try',
          question: {
            id: 'c9.10-t1',
            type: 'mcq',
            prompt: 'For Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s) (E° = 1.10 V), [Zn²⁺] = 0.10 M and [Cu²⁺] = 1.0 M. The cell potential is…',
            choices: ['greater than 1.10 V', 'exactly 1.10 V', 'less than 1.10 V', '0 V'],
            answer: 0,
            hint: 'Q = [Zn²⁺]/[Cu²⁺]',
            explain: 'Q = 0.10/1.0 = 0.10 < 1 → farther from equilibrium than standard → E **> 1.10 V**.',
          },
        },
        {
          kind: 'summary',
          points: [
            'Q = 1 → E = E°. Q < 1 → E > E°. Q > 1 → E < E°. Q = K → E = 0.',
            'Concentration cell: the dilute side is the anode. e⁻ flow toward the concentrated side.',
            'Use Q, K and Nernst reasoning, not Le Châtelier, for working cells.',
          ],
        },
      ],
      check: [
        {
          id: 'c9.10-q1',
          type: 'mcq',
          prompt: 'A galvanic cell has run until its voltage reads **0 V**. Which is true?',
          choices: ['Q = 1', 'Q = K (equilibrium)', 'E° = 0', 'The electrodes are gone'],
          answer: 1,
          explain: 'E = 0 means the reaction has no more driving force: it has reached **equilibrium (Q = K)**.',
        },
        {
          id: 'c9.10-q2',
          type: 'mcq',
          prompt: 'In a concentration cell with 0.010 M Cu²⁺ on one side and 1.0 M Cu²⁺ on the other, the anode is…',
          choices: ['the 1.0 M side', 'the 0.010 M side', 'neither: no current flows', 'both'],
          answer: 1,
          explain: 'The **dilute (0.010 M)** side oxidizes Cu → Cu²⁺ to raise its concentration → anode.',
        },
      ],
      flashcards: [
        { front: 'Effect of Q < 1 on cell potential', back: 'E > E° (farther from equilibrium)' },
        { front: 'Cell potential at equilibrium', back: '**E = 0** (Q = K), a "dead battery"' },
        { front: 'Concentration cell: which side is the anode?', back: 'The **more dilute** side' },
      ],
    },
  ],
  checkpoint: [
    {
      id: 'c9-cp1',
      type: 'mcq',
      prompt: 'A reaction has ΔH° < 0 and ΔS° > 0. Which is true?',
      choices: ['Favored only at high T', 'Favored only at low T', 'Favored at all T, and K > 1', 'Never favored'],
      answer: 2,
      explain: 'ΔG = (−) − T(+) is always negative → favored at **all T** → K > 1.',
    },
    {
      id: 'c9-cp2',
      type: 'num',
      prompt: 'Ni²⁺ + 2e⁻ → Ni (E° = −0.25 V); Ag⁺ + e⁻ → Ag (E° = +0.80 V). What is E°_cell for the favored reaction?',
      answer: 1.05,
      unit: 'V',
      explain: 'Cathode Ag (+0.80), anode Ni (−0.25): 0.80 − (−0.25) = **+1.05 V**',
      compute: () => 0.8 - -0.25,
    },
    {
      id: 'c9-cp3',
      type: 'num',
      prompt: 'How much charge (in C) passes when a current of **3.00 A** flows for **10.0 minutes**?',
      answer: 1800,
      unit: 'C',
      explain: 'q = It = 3.00 × 600 = **1800 C**',
      compute: () => 3.0 * 600,
    },
    {
      id: 'c9-cp4',
      type: 'mcq',
      prompt: 'Which pairing correctly connects all three quantities for a thermodynamically favored redox reaction?',
      choices: ['ΔG° > 0, K < 1, E° < 0', 'ΔG° < 0, K > 1, E° > 0', 'ΔG° < 0, K < 1, E° > 0', 'ΔG° = 0, K = 0, E° = 0'],
      answer: 1,
      explain: 'Favored: **ΔG° < 0 ↔ K > 1 ↔ E° > 0**. Remember this "triangle".',
    },
  ],
}
