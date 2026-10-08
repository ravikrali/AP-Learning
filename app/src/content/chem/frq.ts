// Original AP-style free-response practice (format per the CED: 3 long × 10 pts, 4 short × 4 pts).
// Each rubric item is worth 1 point. Numbers are re-checked by the test suite via `verify`.
import { CONST, molarMass } from '../../lib/chem'

export interface FrqPart {
  label: string
  prompt: string
  answer: string
  rubric: string[]
  verify?: { stated: number; compute: () => number; tol?: number }[]
}

export interface Frq {
  id: string
  title: string
  kind: 'long' | 'short'
  units: number[]
  intro: string
  parts: FrqPart[]
}

const R = CONST.R_Latm
const F = CONST.F

const nNH3 = 5.0 / molarMass('NH3')
const dHprop = 3 * -393.5 + 4 * -285.8 - -103.8
const molProp11 = 11.0 / molarMass('C3H8')
const hFrq3 = 10 ** -2.88
const KaFrq3 = hFrq3 ** 2 / (0.1 - hFrq3)

export const CHEM_FRQS: Frq[] = [
  {
    id: 'frq-ammonia',
    title: 'Ammonia: Structure, Forces & Gases',
    kind: 'long',
    units: [2, 3, 4],
    intro: 'Ammonia, NH₃, boils at −33 °C. Phosphine, PH₃, boils at −88 °C.',
    parts: [
      {
        label: '(a)',
        prompt: 'Draw the complete Lewis electron-dot diagram for NH₃.',
        answer: 'N in the center, single-bonded to three H atoms, with one lone pair on N (8 valence electrons total).',
        rubric: ['Three N–H single bonds and one lone pair on N'],
      },
      {
        label: '(b)',
        prompt: 'Identify the molecular geometry of NH₃ and the hybridization of the N atom.',
        answer: 'Trigonal pyramidal (4 electron domains, 1 lone pair). N is sp³.',
        rubric: ['Trigonal pyramidal', 'sp³'],
      },
      {
        label: '(c)',
        prompt: 'PH₃ has more electrons than NH₃, yet NH₃ has the higher boiling point. Explain in terms of intermolecular forces.',
        answer:
          'NH₃ molecules form **hydrogen bonds** (H bonded directly to the small, highly electronegative N). PH₃ cannot hydrogen bond: its IMFs are dipole–dipole and London dispersion forces. The hydrogen bonds between NH₃ molecules are stronger overall than PH₃\'s IMFs, even though PH₃\'s LDFs are slightly stronger, so more energy is needed to separate NH₃ molecules → higher boiling point.',
        rubric: ['Identifies hydrogen bonding in NH₃ and its absence in PH₃', 'Connects stronger overall IMFs in NH₃ to more energy needed to vaporize'],
      },
      {
        label: '(d)',
        prompt: 'A 5.00 g sample of NH₃(g) is placed in a rigid 2.00 L flask at 300. K. Calculate the pressure, assuming ideal behavior.',
        answer: 'n = 5.00 g ÷ 17.03 g/mol = 0.294 mol. P = nRT/V = (0.294)(0.08206)(300.)/2.00 = **3.61 atm**',
        rubric: ['Correct moles of NH₃ (0.294 mol)', 'Correct pressure with units (3.61 atm)'],
        verify: [
          { stated: 0.294, compute: () => nNH3 },
          { stated: 3.61, compute: () => (nNH3 * R * 300) / 2.0 },
        ],
      },
      {
        label: '(e)',
        prompt: 'Would the actual pressure of NH₃ in the flask be greater than, less than, or equal to the value from part (d)? Justify your answer.',
        answer:
          '**Less than.** NH₃ molecules attract each other strongly (hydrogen bonding), which reduces the frequency and force of their collisions with the walls, so the real pressure is lower than the ideal prediction.',
        rubric: ['States "less than"', 'Justifies with intermolecular attractions reducing wall collisions'],
      },
      {
        label: '(f)',
        prompt: 'Write the equation for NH₃ acting as a Brønsted–Lowry base in water and identify its conjugate acid.',
        answer: '[[eq: NH3(aq) + H2O(l) <=> NH4^+(aq) + OH^-(aq)]] The conjugate acid is NH₄⁺.',
        rubric: ['Correct equation with NH₄⁺ identified as the conjugate acid'],
      },
    ],
  },
  {
    id: 'frq-propane',
    title: 'Burning Propane: Stoichiometry & Thermochemistry',
    kind: 'long',
    units: [4, 6, 9],
    intro: 'Propane burns according to: [[eq: C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(l)]]\n\n| Substance | ΔH°_f (kJ/mol) |\n| C₃H₈(g) | −103.8 |\n| CO₂(g) | −393.5 |\n| H₂O(l) | −285.8 |',
    parts: [
      {
        label: '(a)',
        prompt: 'Calculate ΔH°_rxn using the enthalpies of formation.',
        answer: 'ΔH° = [3(−393.5) + 4(−285.8)] − [(−103.8) + 5(0)] = −2323.7 + 103.8 = **−2219.9 kJ/mol_rxn**',
        rubric: ['Correct products − reactants setup (O₂ = 0, coefficients used)', 'Correct value: −2219.9 kJ/mol'],
        verify: [{ stated: -2219.9, compute: () => dHprop }],
      },
      {
        label: '(b)',
        prompt: 'Calculate the mass of CO₂ produced when 11.0 g of C₃H₈ burns completely.',
        answer: '11.0 g ÷ 44.10 g/mol = 0.249 mol C₃H₈ → × 3 = 0.748 mol CO₂ → × 44.01 g/mol = **32.9 g CO₂**',
        rubric: ['Uses the 3 : 1 mole ratio', 'Correct mass (32.9 g)'],
        verify: [{ stated: 32.9, compute: () => molProp11 * 3 * molarMass('CO2') }],
      },
      {
        label: '(c)',
        prompt: 'Calculate the heat released when 11.0 g of C₃H₈ burns.',
        answer: '0.249 mol × 2219.9 kJ/mol = **554 kJ** released',
        rubric: ['Correct heat (≈ 554 kJ)'],
        verify: [{ stated: 554, compute: () => molProp11 * -dHprop, tol: 0.01 }],
      },
      {
        label: '(d)',
        prompt: 'The heat from burning 0.500 g of propane is fully absorbed by 2.00 kg of water (c = 4.18 J/(g·°C)). Calculate the expected temperature increase.',
        answer: 'q = (0.500/44.10)(2219.9) = 25.2 kJ = 25,200 J. ΔT = q/(mc) = 25,200 / (2000 × 4.18) = **3.01 °C**',
        rubric: ['Correct heat from 0.500 g (≈ 25.2 kJ)', 'Correct ΔT (≈ 3.01 °C)'],
        verify: [
          { stated: 25.2, compute: () => (0.5 / molarMass('C3H8')) * -dHprop, tol: 0.01 },
          { stated: 3.01, compute: () => ((0.5 / molarMass('C3H8')) * -dHprop * 1000) / (2000 * 4.18), tol: 0.01 },
        ],
      },
      {
        label: '(e)',
        prompt: 'In the experiment, the measured ΔT was smaller than the calculated value. Give one plausible reason.',
        answer: 'Some heat was lost to the surroundings (air, container) instead of the water, OR the combustion was incomplete (forming CO/soot releases less heat).',
        rubric: ['A valid reason linked to the smaller ΔT'],
      },
      {
        label: '(f)',
        prompt: 'Predict the sign of ΔS° for the reaction as written. Justify.',
        answer: '**Negative.** 6 mol of gas (1 C₃H₈ + 5 O₂) become 3 mol of gas (CO₂); H₂O is a liquid. Fewer gas particles → less dispersal of matter.',
        rubric: ['Negative, justified by fewer moles of gas'],
      },
      {
        label: '(g)',
        prompt: 'Using the signs of ΔH° and ΔS°, describe the temperature conditions under which the reaction is thermodynamically favored.',
        answer: 'ΔH° < 0 and ΔS° < 0, so it is favored at **low temperatures** (below T = ΔH°/ΔS°). Because ΔH° is so large and negative, that crossover temperature is extremely high, so the reaction is favored at all ordinary temperatures.',
        rubric: ['Favored at low T, reasoned from ΔH° < 0 and ΔS° < 0'],
      },
    ],
  },
  {
    id: 'frq-weak-acid',
    title: 'A Weak Acid Titration',
    kind: 'long',
    units: [4, 8],
    intro: 'A 25.0 mL sample of 0.100 M weak monoprotic acid HA has a measured pH of 2.88. It is titrated with 0.100 M NaOH.',
    parts: [
      {
        label: '(a)',
        prompt: 'Calculate the value of Ka for HA.',
        answer: '[H₃O⁺] = [A⁻] = 10^{-2.88} = 1.32 × 10^{-3} M. Ka = (1.32 × 10^{-3})² / (0.100 − 0.00132) = **1.8 × 10^{-5}**',
        rubric: ['Correct [H₃O⁺] from pH', 'Correct Ka (≈ 1.8 × 10⁻⁵)'],
        verify: [
          { stated: 1.32e-3, compute: () => hFrq3 },
          { stated: 1.8e-5, compute: () => KaFrq3, tol: 0.03 },
        ],
      },
      {
        label: '(b)',
        prompt: 'Calculate the percent ionization of HA in the original solution.',
        answer: '(1.32 × 10^{-3} / 0.100) × 100 = **1.3%**',
        rubric: ['Correct percent ionization'],
        verify: [{ stated: 1.3, compute: () => (hFrq3 / 0.1) * 100, tol: 0.03 }],
      },
      {
        label: '(c)',
        prompt: 'What volume of NaOH is needed to reach the equivalence point?',
        answer: 'mol HA = 0.100 × 0.0250 = 0.00250 mol = mol NaOH → V = 0.00250/0.100 = **25.0 mL**',
        rubric: ['25.0 mL'],
        verify: [{ stated: 25.0, compute: () => (0.1 * 25.0) / 0.1 }],
      },
      {
        label: '(d)',
        prompt: 'Determine the pH after 12.5 mL of NaOH has been added. Justify.',
        answer: '12.5 mL is the **half-equivalence point**: [HA] = [A⁻], so pH = pKa = −log(1.8 × 10^{-5}) = **4.75**',
        rubric: ['Identifies the half-equivalence point ([HA] = [A⁻])', 'pH = pKa ≈ 4.75'],
        verify: [{ stated: 4.75, compute: () => -Math.log10(KaFrq3), tol: 0.005 }],
      },
      {
        label: '(e)',
        prompt: 'Is the pH at the equivalence point greater than, less than, or equal to 7? Justify.',
        answer: '**Greater than 7.** At equivalence the solution contains A⁻, the conjugate base of a weak acid, which reacts with water: [[eq: A^-(aq) + H2O(l) <=> HA(aq) + OH^-(aq)]], producing OH⁻.',
        rubric: ['Greater than 7', 'Justifies with A⁻ reacting with water to produce OH⁻'],
      },
      {
        label: '(f)',
        prompt: 'Which indicator is best: methyl red (pKa 5.0), bromothymol blue (pKa 7.1) or phenolphthalein (pKa 9.3)? Explain.',
        answer: '**Phenolphthalein**: its pKa is closest to the pH at the equivalence point, which is above 7.',
        rubric: ['Phenolphthalein, with the reason that its pKa is closest to the equivalence pH'],
      },
      {
        label: '(g)',
        prompt: 'Write the net ionic equation for the titration reaction.',
        answer: '[[eq: HA(aq) + OH^-(aq) -> A^-(aq) + H2O(l)]] (HA is weak, so it stays un-ionized in the equation.)',
        rubric: ['Correct net ionic equation with HA written as a molecule'],
      },
    ],
  },
  {
    id: 'frq-rate-law',
    title: 'Rate Law from Initial Rates',
    kind: 'short',
    units: [5],
    intro: 'For [[eq: 2NO(g) + O2(g) -> 2NO2(g)]]:\n\n| Exp | [NO] (M) | [O₂] (M) | Initial rate (M/s) |\n| 1 | 0.010 | 0.010 | 2.5 × 10^{-5} |\n| 2 | 0.020 | 0.010 | 1.0 × 10^{-4} |\n| 3 | 0.010 | 0.020 | 5.0 × 10^{-5} |',
    parts: [
      {
        label: '(a)',
        prompt: 'Determine the order with respect to NO and with respect to O₂. Justify each.',
        answer: 'Exp 1→2: [NO] doubles, rate ×4 → **second order in NO**. Exp 1→3: [O₂] doubles, rate ×2 → **first order in O₂**.',
        rubric: ['Second order in NO with justification', 'First order in O₂ with justification'],
      },
      {
        label: '(b)',
        prompt: 'Calculate the rate constant k, with units.',
        answer: 'rate = k[NO]²[O₂] → k = 2.5 × 10^{-5} / [(0.010)²(0.010)] = **25 M⁻²s⁻¹**',
        rubric: ['k = 25 M⁻²s⁻¹ (value and units)'],
        verify: [{ stated: 25, compute: () => 2.5e-5 / (0.01 ** 2 * 0.01) }],
      },
      {
        label: '(c)',
        prompt: 'A student proposes a single-step termolecular mechanism. It is consistent with the rate law, but is it likely? Explain.',
        answer: 'It matches the rate law, but it is **unlikely**, because an elementary step requiring three particles to collide at the same instant (termolecular) is rare. A two-step mechanism (fast pre-equilibrium 2NO ⇌ N₂O₂, then slow N₂O₂ + O₂ → 2NO₂) gives the same rate law and is more plausible.',
        rubric: ['Explains that termolecular elementary steps are rare'],
      },
    ],
  },
  {
    id: 'frq-galvanic',
    title: 'A Zinc–Silver Galvanic Cell',
    kind: 'short',
    units: [9],
    intro: 'Ag⁺ + e⁻ → Ag   E° = +0.80 V\nZn²⁺ + 2e⁻ → Zn   E° = −0.76 V',
    parts: [
      {
        label: '(a)',
        prompt: 'Calculate E°_cell for the thermodynamically favored reaction.',
        answer: 'Cathode Ag, anode Zn: E° = 0.80 − (−0.76) = **+1.56 V** (for [[eq: Zn(s) + 2Ag^+(aq) -> Zn^2+(aq) + 2Ag(s)]])',
        rubric: ['E°cell = +1.56 V'],
        verify: [{ stated: 1.56, compute: () => 0.8 - -0.76 }],
      },
      {
        label: '(b)',
        prompt: 'Which electrode increases in mass as the cell operates? Explain.',
        answer: 'The **silver electrode** (cathode): Ag⁺ ions are reduced and deposit as solid Ag.',
        rubric: ['Silver, because Ag⁺ is reduced to Ag(s) at the cathode'],
      },
      {
        label: '(c)',
        prompt: 'Calculate ΔG° for the cell reaction.',
        answer: 'ΔG° = −nFE° = −(2)(96,485)(1.56) = **−301 kJ**',
        rubric: ['ΔG° ≈ −301 kJ (n = 2)'],
        verify: [{ stated: -301, compute: () => (-2 * F * 1.56) / 1000, tol: 0.01 }],
      },
      {
        label: '(d)',
        prompt: 'If [Ag⁺] is decreased, will the cell potential increase, decrease, or stay the same? Justify.',
        answer: '**Decrease.** Q = [Zn²⁺]/[Ag⁺]². Lowering [Ag⁺] increases Q, moving the cell closer to equilibrium, so E decreases (E = E° − (RT/nF) ln Q).',
        rubric: ['Decreases, justified using Q'],
      },
    ],
  },
  {
    id: 'frq-beer',
    title: 'Copper(II) by Spectrophotometry',
    kind: 'short',
    units: [3],
    intro: 'A student makes CuSO₄ standards and finds that, at the wavelength of maximum absorbance in a 1.00 cm cuvette, A = 12.1c (c in mol/L). An unknown CuSO₄ solution has A = 0.484.',
    parts: [
      {
        label: '(a)',
        prompt: 'Calculate [Cu²⁺] in the unknown.',
        answer: 'c = 0.484 / 12.1 = **0.0400 M**',
        rubric: ['0.0400 M'],
        verify: [{ stated: 0.04, compute: () => 0.484 / 12.1 }],
      },
      {
        label: '(b)',
        prompt: 'Calculate the mass of CuSO₄ in 50.0 mL of the unknown solution.',
        answer: '0.0400 M × 0.0500 L = 0.00200 mol × 159.61 g/mol = **0.319 g**',
        rubric: ['≈ 0.319 g'],
        verify: [{ stated: 0.319, compute: () => 0.04 * 0.05 * molarMass('CuSO4') }],
      },
      {
        label: '(c)',
        prompt: 'Why is the wavelength of maximum absorbance used?',
        answer: 'It gives the **greatest sensitivity**: the largest change in absorbance for a given change in concentration.',
        rubric: ['Maximum sensitivity'],
      },
      {
        label: '(d)',
        prompt: 'The cuvette still had a few drops of water in it when the unknown was added. How does this affect the calculated concentration? Explain.',
        answer: 'The water **dilutes** the sample, so the measured absorbance is lower → the calculated [Cu²⁺] is **too low**.',
        rubric: ['Too low, because dilution lowers the absorbance'],
      },
    ],
  },
  {
    id: 'frq-limestone',
    title: 'Decomposing Limestone',
    kind: 'short',
    units: [7, 9],
    intro: 'For [[eq: CaCO3(s) -> CaO(s) + CO2(g)]], ΔH° = +178 kJ/mol_rxn and ΔS° = +161 J/(mol_rxn·K).',
    parts: [
      {
        label: '(a)',
        prompt: 'Calculate ΔG° at 298 K and state whether the reaction is thermodynamically favored at 298 K.',
        answer: 'ΔG° = 178 − (298)(0.161) = **+130 kJ/mol** → **not** thermodynamically favored at 298 K.',
        rubric: ['Correct ΔG° (≈ +130 kJ/mol, with ΔS converted to kJ)', 'Concludes "not favored"'],
        verify: [{ stated: 130, compute: () => 178 - 298 * 0.161, tol: 0.01 }],
      },
      {
        label: '(b)',
        prompt: 'Above what temperature does the reaction become thermodynamically favored?',
        answer: 'T = ΔH°/ΔS° = 178 / 0.161 ≈ **1110 K**',
        rubric: ['≈ 1110 K'],
        verify: [{ stated: 1110, compute: () => 178 / 0.161, tol: 0.01 }],
      },
      {
        label: '(c)',
        prompt: 'At 298 K, is K greater than 1 or less than 1? Justify.',
        answer: '**Less than 1**, because ΔG° > 0 and ΔG° = −RT ln K requires ln K < 0.',
        rubric: ['K < 1, linked to the positive ΔG°'],
      },
    ],
  },
]
