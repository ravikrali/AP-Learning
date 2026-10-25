// Textbook prose for the printed Chemistry course book (scripts/books). Same markup as lesson cards.
// It deepens each lesson without adding topics: everything here stays inside the CED (effective Fall 2024).
import type { CourseBook } from '../types'

export const BOOK: CourseBook = {
  units: {
    'chem-u0': {
      overview: `AP® Chemistry assumes a toolkit of skills from earlier courses: writing very large and very small numbers, keeping track of precision with significant figures, converting units, describing atoms and ions, naming compounds, balancing equations and working with logarithms. None of these is tested as a topic on its own, but every exam question relies on them.

Work through this chapter first if any of these skills feel rusty. Each lesson is short, and the habits it builds (writing units on every number, checking that equations balance, estimating before calculating) will save you points in every unit that follows.`,
    },
    'chem-u1': {
      overview: `Chemistry explains the behavior of matter in terms of atoms, and this unit builds the atomic picture that the rest of the course depends on.

It starts with the mole, the chemist's way of counting particles by weighing them, and with how mass data reveal the composition of pure substances and mixtures. It then looks inside the atom: the nucleus and the arrangement of electrons in shells and subshells, the experimental evidence for that arrangement from mass spectrometry and photoelectron spectroscopy, and Coulomb's law, the electrostatic attraction that holds electrons to the nucleus.

The unit ends with periodic trends (atomic radius, ionization energy, electronegativity) and with how valence electrons determine the formulas of ionic compounds. A single idea runs through all of it: the strength of the attraction between the nucleus and an electron depends on the nuclear charge the electron feels and on its distance from the nucleus. Learn to explain trends with that idea and you will be ready for bonding in Unit 2.`,
    },
    'chem-u2': {
      overview: `Unit 1 described single atoms. This unit is about what happens when atoms join: the bonds that hold them together and the structures that result.

It begins with the three types of bonding (covalent, ionic and metallic) and with the potential energy changes that make bonds form. Coulomb's law, met in Unit 1, explains why some ionic compounds are held together more strongly than others. The structures of ionic solids and metals, including alloys, then explain everyday properties such as brittleness, conductivity and malleability.

The second half focuses on molecules. Lewis diagrams track valence electrons; formal charge and resonance refine those diagrams; and VSEPR theory turns them into three-dimensional shapes, with hybridization and sigma and pi bonds describing the bonding at each atom. Shape and bond polarity together decide whether a molecule is polar, and that one property drives the intermolecular forces at the heart of Unit 3.`,
    },
    'chem-u3': {
      overview: `This is the largest unit on the exam, and it explains the physical properties of matter in terms of particles and the forces between them.

The central idea is the **intermolecular force**: the attraction between separate particles. Its strength explains why some substances are gases and others solids at room temperature, why boiling points and vapor pressures differ, and why some substances dissolve in water while others do not. You will also classify solids (ionic, covalent network, molecular and metallic) by the forces that hold them together.

The unit then turns to gases, where intermolecular forces are usually small: the ideal gas law, Dalton's law of partial pressures, kinetic molecular theory and the conditions under which real gases deviate from ideal behavior. It continues with solutions: molarity, particle-level diagrams, and separation by chromatography and distillation. It ends with how matter interacts with light: the regions of the electromagnetic spectrum, the energy of photons, and the Beer–Lambert law used to measure concentrations in the lab.`,
    },
    'chem-u4': {
      overview: `Chemical reactions turn one set of substances into another. This unit is about describing reactions precisely and calculating how much of each substance is involved.

It begins by distinguishing chemical changes from physical ones and by representing reactions in several ways: balanced molecular equations, complete and net ionic equations, and particle diagrams. Stoichiometry, built on the mole ratios in a balanced equation, then lets you predict amounts of products from amounts of reactants, identify the limiting reactant, calculate percent yield, and work with gases and solutions as well as masses. Titration applies the same ideas in the lab to find an unknown concentration.

The second half sorts reactions into three families: precipitation, where ions combine into an insoluble solid; acid–base reactions, where protons are transferred; and oxidation–reduction (redox) reactions, where electrons are transferred. Each family returns in depth later: solubility in Unit 7, acids and bases in Unit 8, and electrochemistry in Unit 9.`,
    },
    'chem-u5': {
      overview: `Thermodynamics (Unit 9) tells you whether a reaction can happen; kinetics tells you how fast it does. This unit explains reaction rates both from experimental data and from what happens at the level of particles.

The experimental side covers measuring rates, writing rate laws, finding reaction orders by the method of initial rates, and using integrated rate laws and half-life to describe how concentrations change over time. The particle side explains those results with the collision model: particles must collide with enough energy and the right orientation, and temperature changes the fraction of collisions that succeed. Reaction energy profiles show the activation energy that sets this threshold.

Most reactions occur in several elementary steps. You will learn to write rate laws for elementary steps, connect a proposed mechanism to an experimental rate law (including mechanisms with a fast reversible first step), recognize intermediates and catalysts, and explain how catalysts speed up reactions by providing a lower-energy pathway.`,
    },
    'chem-u6': {
      overview: `Every chemical and physical change involves energy. Thermochemistry measures that energy and explains where it comes from.

The unit begins with the language of energy flow: the system and its surroundings, exothermic and endothermic processes, and heat transfer by particle collisions until thermal equilibrium is reached. Calorimetry, built on q = mcΔT and the conservation of energy, turns temperature changes into measured heats, and the same reasoning explains why temperature stays constant during a phase change.

The second half is about the enthalpy change of a reaction, ΔH: what it means "per mole of reaction", how it scales with the amounts reacting, and three ways to determine it without measuring it directly: from average bond enthalpies, from standard enthalpies of formation, and from Hess's law. Enthalpy returns in Unit 9, where it combines with entropy to decide whether reactions are thermodynamically favorable.`,
    },
    'chem-u7': {
      overview: `Many reactions do not go to completion. Instead they reach a state of dynamic equilibrium, in which the forward and reverse reactions continue at equal rates and the concentrations no longer change. This unit describes that state quantitatively.

The equilibrium constant K summarizes the composition of an equilibrium mixture and tells you, by its size, whether reactants or products are favored. The reaction quotient Q has the same form at any moment, and comparing Q with K predicts the direction a reaction will go. You will calculate K from data, manipulate K values for related equations, solve for equilibrium concentrations with ICE tables, and read equilibria from particle diagrams.

Le Châtelier's principle then predicts how an equilibrium responds when it is disturbed by changes in concentration, volume or temperature, with Q-versus-K reasoning to explain why. The unit closes with solubility equilibria: the solubility product K_{sp}, molar solubility, and the common-ion effect. These tools are used again for acids and bases in Unit 8.`,
    },
    'chem-u8': {
      overview: `Acid–base chemistry is one of the most heavily tested topics on the exam, and it draws on almost everything earlier in the course: the Brønsted–Lowry model from Unit 4, equilibrium from Unit 7, and the structure and bonding of Unit 2.

The unit begins with the pH scale and the self-ionization of water, then separates acids and bases into two groups. Strong acids and bases ionize completely, so their pH follows directly from their concentration. Weak acids and bases ionize only partially, so their pH requires an equilibrium calculation with K_{a} or K_{b}. Molecular structure explains why some acids are stronger than others.

The second half is about mixtures of acids and bases: what remains after they react, how buffers resist changes in pH and how to calculate their pH with the Henderson–Hasselbalch equation, how indicators and the relationship between pH and pK_{a} determine which form of an acid dominates, how to read titration curves, what determines buffer capacity, and how pH affects the solubility of salts.`,
    },
    'chem-u9': {
      overview: `Why do some reactions happen on their own while others never do? This final unit answers that question with thermodynamics, and then applies it to electrochemistry.

Entropy measures the dispersal of matter and energy, and you will predict and calculate entropy changes. Gibbs free energy combines enthalpy and entropy at a given temperature into one quantity whose sign tells you whether a process is thermodynamically favored. You will see why favorability depends on temperature, why a favored reaction may still be too slow to observe, and how ΔG° is linked to the equilibrium constant K. Coupled reactions and the free energy of dissolution show these ideas at work.

Electrochemistry connects free energy to electricity. Galvanic cells convert the free energy of a favored redox reaction into electrical work; electrolytic cells use electrical energy to drive unfavored reactions. You will calculate standard cell potentials, connect them to ΔG°, reason about cells under nonstandard conditions, and use Faraday's law to relate current and time to the amount of substance produced.`,
    },
  },
  lessons: {
    // ---------------- Unit 0 ----------------
    'chem-0.1': {
      intro: `Chemistry deals with numbers from the size of an atom to the number of molecules in a glass of water. Scientific notation makes such numbers manageable, and significant figures record how precisely they were measured.`,
      deeper: [
        {
          title: 'Precision and accuracy',
          body: `A measurement's **precision** is how finely it was made, shown by its significant figures: 2.50 g was read to the nearest hundredth of a gram, 2.5 g only to the nearest tenth. **Accuracy** is how close a measurement is to the true value. A badly calibrated balance can give very precise (repeatable) readings that are all inaccurate.

Significant figures matter on the AP exam mainly as good practice: answers are usually accepted within a reasonable range of significant figures, but an answer with far too many or far too few digits can lose credit.`,
        },
        {
          title: 'Significant figures in logarithms',
          body: `Logarithms follow a special rule that you will need for pH. In a logarithm, only the digits after the decimal point (the mantissa) count as significant. So if [H₃O⁺] = 2.5 × 10^{−4} M (two significant figures), the pH should be reported with two decimal places: pH = 3.60. The digit before the decimal point only records the power of ten.`,
        },
      ],
    },
    'chem-0.2': {
      intro: `Dimensional analysis treats units as quantities that multiply, divide and cancel. Setting up conversions so the units cancel is the most reliable way to solve chemistry calculations.`,
      deeper: [
        {
          title: 'Density as a conversion factor',
          body: `Any ratio of equivalent quantities can serve as a conversion factor, not just unit definitions. Density is the most common example. If ethanol has a density of 0.789 g/mL, then 25.0 mL of ethanol has a mass of

25.0 mL × (0.789 g / 1 mL) = 19.7 g.

Molar mass (g/mol), molarity (mol/L) and the coefficients of a balanced equation (mol/mol) are all conversion factors in the same way, and they will carry you through most of stoichiometry.`,
        },
        {
          title: 'Checking an answer with units and size',
          body: `After every calculation, ask two quick questions. Are the units what the question asked for? Is the size reasonable? A mass of 2500 g for a 2.5 kg sample makes sense; 0.0025 g would mean the conversion factor was upside down. On multiple-choice questions, units and order of magnitude often eliminate two or three answer choices before you calculate anything.`,
        },
      ],
    },
    'chem-0.3': {
      intro: `Atoms are made of protons, neutrons and electrons. The number of each determines the element, the isotope, and the charge.`,
      deeper: [
        {
          title: 'Isotope notation',
          body: `An isotope is written with the mass number as a superscript to the left of the symbol, and sometimes the atomic number as a subscript: ^{56}Fe, or "iron-56". Because the symbol already fixes the atomic number (every Fe atom has 26 protons), the number of neutrons is simply mass number − atomic number: 56 − 26 = 30. Any charge is written as a superscript to the right, as in ^{56}Fe^{3+}, which has 26 − 3 = 23 electrons.`,
        },
        {
          title: 'Why electrons, not protons, change in reactions',
          body: `Protons and neutrons are held in the tiny nucleus by forces far stronger than any chemical bond, and changing them requires a nuclear reaction. Electrons occupy the large region around the nucleus, and the outermost ones are held relatively weakly. Chemical reactions involve only these outer electrons: they are transferred between atoms (forming ions) or shared (forming covalent bonds). That is why chemistry is, at heart, the study of how valence electrons behave.`,
        },
      ],
    },
    'chem-0.4': {
      intro: `Chemical names and formulas are the vocabulary of the subject. Ionic compounds are named from their ions; molecular compounds use prefixes to count atoms.`,
      deeper: [
        {
          title: 'Writing a formula from a name',
          body: `Reverse the naming process:

1. Identify the ions and their charges. In iron(III) sulfate, the Roman numeral gives Fe³⁺, and sulfate is SO₄²⁻.
2. Choose the smallest numbers of each ion that make the total charge zero: two Fe³⁺ (+6) and three SO₄²⁻ (−6).
3. Write the formula, with parentheses around a polyatomic ion that appears more than once: Fe₂(SO₄)₃.

For molecular compounds, the prefixes give the subscripts directly: diphosphorus pentoxide is P₂O₅.`,
        },
        {
          title: 'Naming acids',
          body: `Many acids are named from their anions:

- Anions ending in **-ide** become **hydro-…-ic acid**: Cl⁻ (chloride) → HCl, hydrochloric acid.
- Anions ending in **-ate** become **-ic acid**: NO₃⁻ (nitrate) → HNO₃, nitric acid.
- Anions ending in **-ite** become **-ous acid**: NO₂⁻ (nitrite) → HNO₂, nitrous acid.

Acetic acid, CH₃COOH, comes from the acetate ion. You will meet these acids again in Units 4 and 8.`,
        },
      ],
    },
    'chem-0.5': {
      intro: `A balanced equation shows that atoms are conserved in a chemical reaction. Balancing is done by adjusting coefficients, never subscripts.`,
      deeper: [
        {
          title: 'What a balanced equation tells you',
          body: `The coefficients in a balanced equation give the ratio in which particles react and form. In [[eq: 2H2(g) + O2(g) -> 2H2O(l)]] two molecules of hydrogen react with one molecule of oxygen to form two molecules of water, and, scaling up by Avogadro's number, 2 mol H₂ react with 1 mol O₂ to form 2 mol H₂O. These mole ratios are the bridge between substances in every stoichiometry problem of Unit 4. The coefficients do not give mass ratios: 2 g of H₂ does not react with 1 g of O₂.`,
        },
        {
          title: 'Balancing with fractions',
          body: `When an element appears as a diatomic molecule, a fractional coefficient can be a useful intermediate step. For the combustion of ethane, balancing C and H first gives C₂H₆ + ? O₂ → 2CO₂ + 3H₂O, which has 7 O atoms on the right, so 7/2 O₂ is needed. Multiplying every coefficient by 2 clears the fraction:

[[eq: 2C2H6(g) + 7O2(g) -> 4CO2(g) + 6H2O(l)]]

Final equations should use the smallest whole-number coefficients.`,
        },
      ],
    },
    'chem-0.6': {
      intro: `Logarithms turn very large and very small numbers into manageable ones. In chemistry they appear in pH, pK_{a}, integrated rate laws and the thermodynamics of equilibrium.`,
      deeper: [
        {
          title: 'Natural logs and common logs',
          body: `The common log (log) uses base 10 and the natural log (ln) uses base e ≈ 2.718. They are proportional to each other: ln x = 2.303 × log x. Chemistry uses log for pH-type scales and ln wherever an equation comes from calculus or thermodynamics, such as the first-order integrated rate law and ΔG° = −RT ln K. Use whichever log the equation is written with, and the matching inverse: 10^{x} undoes log, and e^{x} undoes ln.`,
        },
        {
          title: 'Why a log scale is useful',
          body: `On a log scale each step of 1 is a factor of 10. A solution with pH 3 has ten times the hydronium ion concentration of one with pH 4, and a thousand times that of one with pH 6. Log scales compress enormous ranges into small numbers, but they also make differences easy to underestimate: a change of "only" 2 pH units is a hundredfold change in concentration.`,
        },
      ],
    },

    // ---------------- Unit 1 ----------------
    'chem-1.1': {
      intro: `Atoms are far too small and numerous to count directly. The mole connects the number of particles to a mass that can be measured on a balance.`,
      deeper: [
        {
          title: 'Moles of atoms inside a compound',
          body: `A formula tells you how many moles of each element are in one mole of a compound. One mole of glucose, C₆H₁₂O₆, contains 6 mol of carbon atoms, 12 mol of hydrogen atoms and 6 mol of oxygen atoms, 24 mol of atoms in all. To find the moles of an element in a sample, first find the moles of the compound, then multiply by the subscript:

0.50 mol C₆H₁₂O₆ × (6 mol C / 1 mol C₆H₁₂O₆) = 3.0 mol C.`,
        },
        {
          title: 'Why the gram–amu match works',
          body: `The atomic mass unit is defined as 1/12 the mass of a carbon-12 atom, and Avogadro's number is (very nearly) the number of carbon-12 atoms in exactly 12 g of carbon-12. As a result, any particle with a mass of x amu has a molar mass of x g/mol. This lets you read molar masses straight from the periodic table: the average atomic mass of an element, in amu, is numerically equal to the mass of one mole of its atoms, in grams.`,
        },
      ],
    },
    'chem-1.5': {
      intro: `The electrons in an atom are arranged in shells and subshells. The arrangement, and the attraction between each electron and the nucleus, explain the properties of the elements.`,
      deeper: [
        {
          title: 'Shielding and effective nuclear charge',
          body: `An outer electron does not feel the full charge of the nucleus, because the inner (core) electrons between it and the nucleus repel it, partially canceling the nuclear attraction. The net attraction it feels is described by the **effective nuclear charge**. A simple estimate is protons minus core electrons. For sodium, 11 − 10 = +1 for the 3s electron; for chlorine, 17 − 10 = +7 for each 3s and 3p electron. The much larger effective charge on chlorine's valence electrons explains why chlorine holds them far more tightly than sodium does.`,
        },
        {
          title: 'Why transition metals lose 4s electrons first',
          body: `In a neutral transition-metal atom the 4s subshell fills before 3d, but when the atom forms a cation, the 4s electrons are removed first. The reason is that 4s electrons have the larger average distance from the nucleus (they are in the n = 4 shell), so once the 3d subshell is occupied they are the outermost, most easily removed electrons. The practical rule is simple: remove electrons from the subshell with the highest n first. So Fe ([Ar] 4s² 3d⁶) becomes Fe²⁺ ([Ar] 3d⁶) and then Fe³⁺ ([Ar] 3d⁵).`,
        },
      ],
    },
    'chem-1.2': {
      intro: `Most elements exist as mixtures of isotopes. A mass spectrum shows the mass of each isotope and how common it is, and from that you can calculate the element's average atomic mass.`,
      deeper: [
        {
          title: 'Working backward to an abundance',
          body: `If an element has two isotopes and you know the average atomic mass, you can find their abundances. Boron's isotopes have masses 10.013 and 11.009 amu, and its average atomic mass is 10.81 amu. Let x be the fraction of boron-10:

10.013x + 11.009(1 − x) = 10.81
11.009 − 0.996x = 10.81
x ≈ 0.20

So about 20% of boron atoms are boron-10 and 80% are boron-11, which fits the average lying much closer to 11 than to 10.`,
        },
        {
          title: 'What the spectrum is evidence for',
          body: `Mass spectra are direct experimental evidence that atoms of the same element can have different masses, which is the idea of isotopes. They also explain why most atomic masses on the periodic table are not whole numbers: each is a weighted average of the masses of an element's naturally occurring isotopes. An element with a single stable isotope, such as fluorine or sodium, shows one peak, and its atomic mass is close to a whole number.`,
        },
      ],
    },
    'chem-1.3': {
      intro: `A pure compound always contains its elements in the same proportions by mass. Mass percent data can therefore be turned into a formula, and a formula into mass percents.`,
      deeper: [
        {
          title: 'Mass percent from a formula',
          body: `To find the mass percent of nitrogen in ammonium nitrate, NH₄NO₃:

1. Molar mass: 2(14.01) + 4(1.008) + 3(16.00) = 80.05 g/mol.
2. Mass of N in one mole: 2(14.01) = 28.02 g.
3. Mass percent: 28.02 ÷ 80.05 × 100 ≈ 35.0% N.

Remember to count every atom of the element in the formula, including those inside polyatomic ions. Here nitrogen appears in both the ammonium and the nitrate ion.`,
        },
        {
          title: 'From empirical to molecular formula',
          body: `An empirical formula gives only the ratio of atoms. To find the molecular formula, you also need the molar mass. Divide the molar mass by the empirical formula mass to find the whole-number multiple, then multiply every subscript by it. For CH₂O (30.03 g/mol) and a molar mass of 180 g/mol, the multiple is 180 ÷ 30.03 ≈ 6, giving C₆H₁₂O₆. Different compounds can share an empirical formula: formaldehyde, acetic acid and glucose all have the empirical formula CH₂O.`,
        },
      ],
    },
    'chem-1.4': {
      intro: `A mixture's composition can vary, while a pure substance's cannot. Comparing a sample's measured composition with the composition of the pure compound tells you whether it is pure and what kind of impurity might be present.`,
      deeper: [
        {
          title: 'Which impurity fits the data?',
          body: `Pure NaCl is 60.7% chlorine by mass. Suppose a sample of "NaCl" is found to be 63% chlorine. The impurity must contain a higher mass percent of chlorine than NaCl does. Compare candidates:

| Compound | Molar mass (g/mol) | % Cl by mass |
| NaCl | 58.44 | 60.7 |
| LiCl | 42.39 | 83.6 |
| KCl | 74.55 | 47.6 |

LiCl could raise the chlorine percentage; KCl would lower it. Reasoning like this, without any further calculation, answers many purity questions.`,
        },
        {
          title: 'Mixtures and the law of definite proportions',
          body: `The law of definite proportions applies only to pure compounds. A mixture of two substances can have any composition between those of its components, depending on how much of each is present. That is why elemental analysis can distinguish a pure compound from a mixture, but cannot by itself identify which components a mixture contains: different combinations can give the same overall percentages.`,
        },
      ],
    },
    'chem-1.7': {
      intro: `Periodic trends in atomic radius, ionization energy and electronegativity all come from the same cause: how strongly the nucleus attracts the outermost electrons.`,
      deeper: [
        {
          title: 'Two small exceptions in ionization energy',
          body: `First ionization energy generally increases across a period, but it dips twice in period 2 (and again in period 3):

- **Be to B:** boron's outermost electron is in a 2p subshell, which is higher in energy and slightly farther from the nucleus (more shielded) than the 2s electrons, so it is easier to remove.
- **N to O:** in oxygen, one 2p orbital holds two electrons. The repulsion between the paired electrons makes one of them easier to remove than any of nitrogen's unpaired 2p electrons.

These dips are small compared with the overall trend, and they are evidence for the subshell structure of the atom.`,
        },
        {
          title: 'Electronegativity and bonding',
          body: `Electronegativity follows the same trend as ionization energy because it depends on the same attraction: a nucleus with a larger effective charge, holding electrons closer, pulls harder on shared electrons too. The difference in electronegativity between two bonded atoms determines how unequally they share electrons, which is the basis of bond polarity in Unit 2. Noble gases are usually left out of electronegativity tables because they rarely form bonds.`,
        },
      ],
    },
    'chem-1.8': {
      intro: `The number of valence electrons determines how an element bonds. Because elements in a group have the same number of valence electrons, they form compounds with the same formulas.`,
      deeper: [
        {
          title: 'Predicting ion charges from configurations',
          body: `Main-group elements typically gain or lose electrons until they have the same configuration as a noble gas. Magnesium ([Ne] 3s²) loses two electrons to become Mg²⁺ with the configuration of neon. Sulfur ([Ne] 3s² 3p⁴) gains two electrons to become S²⁻ with the configuration of argon. Removing a third electron from magnesium would mean removing a core electron, which needs far more energy, which is why Mg³⁺ does not form in chemical reactions.`,
        },
        {
          title: 'Using analogies on the exam',
          body: `Questions often give one formula and ask for another. The reasoning is: same group, same number of valence electrons, same typical charge, same ratio. If calcium and chlorine form CaCl₂, then strontium and bromine form SrBr₂. If aluminum forms Al₂O₃, then aluminum and sulfur form Al₂S₃. Analogies work best within the main groups; transition metals often form ions with more than one charge, so analogies for them are less reliable.`,
        },
      ],
    },
    'chem-1.6': {
      intro: `Photoelectron spectroscopy measures the energy needed to remove electrons from each subshell. Its spectra are direct experimental evidence for the shell and subshell model of the atom.`,
      deeper: [
        {
          title: 'How PES works',
          body: `In PES, atoms are struck by high-energy photons (X-rays or ultraviolet light). Each photon can eject an electron, and the electron leaves with kinetic energy equal to the photon's energy minus the energy that held it in the atom:

binding energy = photon energy − kinetic energy of the ejected electron.

Measuring the kinetic energies of many ejected electrons gives the binding energy of every occupied subshell. Electrons from each subshell all have about the same binding energy, which is why the spectrum shows separate peaks rather than a smear.`,
        },
        {
          title: 'Reading a larger spectrum',
          body: `For potassium (19 electrons), a PES spectrum shows six peaks. From the highest binding energy to the lowest, they are 1s, 2s, 2p, 3s, 3p and 4s, with relative heights 2 : 2 : 6 : 2 : 6 : 1, which add to 19. The 4s peak has by far the lowest binding energy: it is in the outermost shell and is shielded by 18 core electrons, so it is very easy to remove. This matches potassium's low first ionization energy and its tendency to form K⁺.`,
        },
      ],
    },

    // ---------------- Unit 2 ----------------
    'chem-2.1': {
      intro: `A chemical bond forms when the valence electrons of two atoms interact with both nuclei. How equally those electrons are shared decides whether a bond is nonpolar covalent, polar covalent, ionic or metallic.`,
      deeper: [
        {
          title: 'Showing bond polarity',
          body: `A polar bond has a bond dipole: a separation of partial positive and partial negative charge. It is drawn either with δ+ and δ− labels or with an arrow pointing toward the more electronegative atom, with a small cross at the positive end. In H–F, fluorine is far more electronegative than hydrogen, so the electrons spend more time near fluorine, giving H δ+ and F δ−. In Cl–Cl the two atoms are identical and the electrons are shared equally, so the bond is nonpolar.`,
        },
        {
          title: 'Using properties as evidence',
          body: `Electronegativity differences are a guide, but the most convincing evidence for the type of bonding is how a substance behaves:

| Observation | Suggests |
| conducts electricity as a solid and is malleable | metallic bonding |
| does not conduct as a solid, conducts when melted or dissolved | ionic bonding |
| does not conduct in any state, low melting point | covalent molecules |

AP® questions often give such data and ask you to identify the bonding, or describe the bonding and ask you to predict the data.`,
        },
      ],
    },
    'chem-2.5': {
      intro: `A Lewis diagram shows how the valence electrons of a molecule or ion are arranged in bonds and lone pairs. It is the starting point for predicting shape, polarity and properties.`,
      deeper: [
        {
          title: 'A worked example with a triple bond',
          body: `Draw HCN:

1. Valence electrons: H 1 + C 4 + N 5 = 10.
2. Skeleton: carbon is less electronegative than nitrogen, and hydrogen can make only one bond, so the order is H–C–N. Two single bonds use 4 electrons, leaving 6.
3. Give nitrogen an octet with three lone pairs (6 electrons). Now carbon has only 4 electrons around it.
4. Move two of nitrogen's lone pairs into bonds with carbon: H–C≡N, with one lone pair on N.

Check: 10 electrons used, carbon and nitrogen each have an octet, and hydrogen has 2.`,
        },
        {
          title: 'A worked example with an expanded octet',
          body: `Draw SF₄. Valence electrons: 6 + 4(7) = 34. Four S–F bonds use 8 electrons, and three lone pairs on each fluorine use 24 more, leaving 2, which go on sulfur as a lone pair. Sulfur ends up with 10 electrons around it (four bonds and one lone pair). That is allowed because sulfur is in period 3. Expanded octets appear only for central atoms in period 3 or below; second-period atoms such as C, N, O and F never exceed eight electrons.`,
        },
      ],
    },
    'chem-2.2': {
      intro: `A bond forms because the attractions between electrons and nuclei lower the energy of the system. A potential energy curve shows how that energy depends on the distance between the atoms.`,
      deeper: [
        {
          title: 'Comparing potential energy curves',
          body: `Curves for different bonds can be compared directly. A deeper well means a stronger bond (more energy needed to separate the atoms), and a well whose minimum is farther to the right means a longer bond. Bonds between larger atoms have their minimum at larger distances, because the atoms' core electrons repel at a greater distance. A double bond between the same two atoms has a deeper, narrower well at a shorter distance than the single bond.`,
        },
        {
          title: 'Ranking ionic attractions',
          body: `Coulomb's law says the attraction between ions is proportional to the product of their charges and inversely related to the distance between their centers. To rank the strength of ionic bonding, and therefore the melting points of ionic solids:

1. compare the products of the ion charges: MgO (2 × 2) and CaO (2 × 2) beat NaCl (1 × 1);
2. for equal charges, compare ion sizes: Mg²⁺ is smaller than Ca²⁺, so MgO beats CaO.

The order MgO > CaO > NaCl matches their melting points (about 2850 °C, 2600 °C and 801 °C).`,
        },
      ],
    },
    'chem-2.3': {
      intro: `In an ionic solid, cations and anions are arranged in a regular three-dimensional lattice. The arrangement explains the high melting points, brittleness and electrical behavior of ionic compounds.`,
      deeper: [
        {
          title: 'Why ionic solids are brittle',
          body: `Every ion in the lattice is surrounded by ions of opposite charge. If a force pushes one layer of ions past another by half a spacing, ions of the same charge suddenly line up next to each other. Their strong repulsion pushes the layers apart, and the crystal cleaves along a flat plane. This is why salt crystals shatter rather than bend, and it contrasts with metals, where shifting layers of cations remain surrounded by the electron sea.`,
        },
        {
          title: 'Conductivity needs mobile charges',
          body: `Electrical conduction requires charged particles that can move. In solid NaCl the ions are fixed in place, so the solid is an insulator. When NaCl melts, or when it dissolves in water, the ions separate and can move toward electrodes of opposite charge, so the liquid or solution conducts. Questions about conductivity are always answered by asking: are there charged particles, and are they free to move?`,
        },
      ],
    },
    'chem-2.4': {
      intro: `Metals consist of cations in a sea of delocalized electrons. Mixing in other atoms to make alloys changes their properties in predictable ways.`,
      deeper: [
        {
          title: 'Explaining metallic properties',
          body: `The electron-sea model accounts for each characteristic property of metals:

- **Electrical conductivity:** the delocalized electrons move freely when a voltage is applied.
- **Thermal conductivity:** the mobile electrons carry kinetic energy quickly through the solid.
- **Malleability and ductility:** layers of cations can slide past one another while the electron sea continues to hold them together.

A good answer names the delocalized electrons and links them to the property.`,
        },
        {
          title: 'How alloying changes properties',
          body: `Adding atoms of a different size disrupts the regular layers of the host metal. In an interstitial alloy such as steel, small carbon atoms in the gaps make it harder for layers of iron atoms to slide, so the alloy is harder, stronger and less malleable than pure iron. In a substitutional alloy such as brass, the zinc atoms are similar in size to copper, so the structure changes less, but the alloy is still typically harder than pure copper. Alloys also usually retain the shiny appearance and conductivity of metals, because the electron sea remains.`,
        },
      ],
    },
    'chem-2.7a': {
      intro: `VSEPR theory predicts the shape of a molecule from the number of electron domains around its central atom. Electron domains repel each other and spread out as far as possible.`,
      deeper: [
        {
          title: 'From Lewis diagram to shape: SF₄',
          body: `In SF₄ (its Lewis diagram is drawn in the lesson on Lewis diagrams) sulfur has five electron domains: four bonds and one lone pair.

1. Five domains give a trigonal bipyramidal electron geometry.
2. The lone pair takes an equatorial position, where it has more room (it is 90° from only two domains, instead of three).
3. Looking only at the atoms, the shape is a **seesaw**.

Always state which you mean: the electron-domain geometry includes lone pairs, while the molecular shape describes only where the atoms are.`,
        },
        {
          title: 'Why bond angles shrink with lone pairs',
          body: `A lone pair is held by only one nucleus, so its electron density spreads out closer to the central atom and takes up more angular space than a bonding pair. Bonding pairs are pushed closer together. The effect is clear in the series CH₄ (109.5°), NH₃ (about 107°) and H₂O (about 104.5°), all with four electron domains. Double bonds, with more electron density than single bonds, have a smaller version of the same effect.`,
        },
      ],
    },
    'chem-2.7b': {
      intro: `Hybridization labels the bonding arrangement around each atom, sigma and pi bonds describe how orbitals overlap, and molecular polarity depends on both bond polarity and shape.`,
      deeper: [
        {
          title: 'Atoms in a larger molecule',
          body: `In a molecule with several "central" atoms, analyze each one separately. In acetic acid, CH₃COOH:

- the CH₃ carbon has four single bonds: 4 domains, sp³, tetrahedral;
- the other carbon has a C=O double bond, a C–O single bond and a C–C bond: 3 domains, sp², trigonal planar;
- the O of the O–H group has two bonds and two lone pairs: 4 domains, sp³, bent.

Counting bonds, acetic acid has 7 σ bonds and 1 π bond.`,
        },
        {
          title: 'Adding bond dipoles',
          body: `Think of each bond dipole as an arrow. A molecule is polar if the arrows do not cancel. In CO₂ the two C=O dipoles point in exactly opposite directions and cancel, so CO₂ is nonpolar even though its bonds are polar. In H₂O the two O–H dipoles point partly in the same direction because the molecule is bent, so they add to give a net dipole. Lone pairs on the central atom usually make a molecule asymmetric, but there are exceptions with special symmetry, such as square planar XeF₄, which is nonpolar.`,
        },
      ],
    },
    'chem-2.6': {
      intro: `When more than one valid Lewis diagram can be drawn, resonance describes the true structure as a blend. Formal charge helps decide which diagrams are the most reasonable.`,
      deeper: [
        {
          title: 'Bond lengths from resonance',
          body: `Resonance makes predictions that can be tested by measuring bond lengths. In the carbonate ion, CO₃²⁻, three equivalent resonance structures each have one C=O double bond and two C–O single bonds. The real ion has three identical C–O bonds, each with a bond order of about 1⅓, intermediate in length between a single and a double bond. Experiments confirm that all three C–O distances are equal, which no single Lewis diagram can explain.`,
        },
        {
          title: 'Choosing among structures with formal charge',
          body: `For the thiocyanate ion, SCN⁻ (16 valence electrons), several arrangements of bonds are possible. The structure with a double bond on each side of carbon gives formal charges of 0 on S, 0 on C and −1 on N. Moving electrons to make S≡C or C≡N bonds gives larger formal charges or places the negative charge on sulfur instead. The best structure has formal charges closest to zero, with the negative formal charge on nitrogen, the most electronegative atom.`,
        },
      ],
    },

    // ---------------- Unit 3 ----------------
    'chem-3.3': {
      intro: `Solids, liquids and gases differ in how close their particles are and how freely they move. Those differences come from a balance between intermolecular attractions and the particles' kinetic energy.`,
      deeper: [
        {
          title: 'Attractions versus motion',
          body: `The phase of a substance reflects a competition. Intermolecular attractions pull particles together; kinetic energy, which increases with temperature, keeps them moving apart. When attractions dominate, particles stay in fixed positions (solid). When the two are comparable, particles stay in contact but move past one another (liquid). When kinetic energy dominates, particles separate almost completely (gas). Raising the temperature or weakening the attractions moves a substance toward the gas phase.`,
        },
        {
          title: 'Why gases are compressible and liquids are not',
          body: `In solids and liquids the particles are already touching, so pushing them closer is very difficult, and their volumes hardly change with pressure. That is also why a mole of a solid and a mole of its liquid have similar volumes. In a gas, the particles take up only a tiny fraction of the space, so the volume can be reduced greatly by increasing the pressure. At room temperature and pressure, the particles of a gas occupy roughly a thousandth of the gas's volume.`,
        },
      ],
    },
    'chem-3.1a': {
      intro: `Intermolecular forces are the attractions between separate particles. They are much weaker than chemical bonds, but they determine many physical properties, including whether a substance is a solid, liquid or gas.`,
      deeper: [
        {
          title: 'Polarizability and dispersion forces',
          body: `London dispersion forces arise because the electron cloud of a molecule fluctuates, creating an instantaneous dipole that induces a dipole in a neighbor. How easily an electron cloud is distorted is its **polarizability**. Larger electron clouds, with more electrons held farther from the nuclei, are more polarizable, which is why dispersion forces increase with the number of electrons, and why they become the dominant force for large molecules. Molar mass is a useful proxy only because heavier molecules usually have more electrons.`,
        },
        {
          title: 'The special case of water',
          body: `Each water molecule can form up to four hydrogen bonds: two through its own H atoms and two through the lone pairs on its O atom. This extensive network explains water's unusually high boiling point for such a small molecule, its high heat capacity and its surface tension. In ice, hydrogen bonds hold the molecules in an open hexagonal arrangement, which is why ice is less dense than liquid water and floats.`,
        },
      ],
    },
    'chem-3.7': {
      intro: `A solution is a homogeneous mixture, and its composition is usually described by its molarity: moles of solute per liter of solution.`,
      deeper: [
        {
          title: 'Preparing a solution in the lab',
          body: `To prepare 250.0 mL of 0.400 M NaCl:

1. Calculate the mass needed: 0.2500 L × 0.400 mol/L × 58.44 g/mol = 5.84 g.
2. Weigh the solid and transfer it to a 250.0 mL volumetric flask.
3. Add some distilled water and swirl until the solid dissolves.
4. Add water up to the calibration mark and mix by inverting the flask.

A volumetric flask, rather than a beaker, is used because it measures the total volume of solution precisely, which is what molarity is defined by.`,
        },
        {
          title: 'Planning a dilution',
          body: `Dilution calculations are usually about planning: what volume of stock solution is needed? To make 100.0 mL of 0.150 M HCl from a 6.00 M stock: V₁ = M₂V₂/M₁ = (0.150 × 100.0)/6.00 = 2.50 mL. Measure 2.50 mL of the stock with a pipet, transfer it to a 100.0 mL volumetric flask, and dilute to the mark. Because the moles of solute do not change, M₁V₁ = M₂V₂ works with any volume unit, as long as both volumes use the same one.`,
        },
      ],
    },
    'chem-3.1b': {
      intro: `Comparing physical properties of substances means comparing their intermolecular forces. Stronger forces mean more energy is needed to separate the particles.`,
      deeper: [
        {
          title: 'Vapor pressure and boiling',
          body: `In a closed container, molecules continually escape from a liquid's surface and return to it. The pressure of the vapor at equilibrium is the liquid's vapor pressure. It is lower for substances with stronger intermolecular forces, and it increases with temperature as more molecules have enough energy to escape. A liquid boils when its vapor pressure equals the external pressure. That is why water boils at a lower temperature at high altitude, where the air pressure is lower.`,
        },
        {
          title: 'Comparing families of compounds',
          body: `Within a series of similar molecules, the comparison usually comes down to size. Among the straight-chain alkanes (dispersion forces only), boiling points rise steadily with chain length: methane −162 °C, ethane −89 °C, propane −42 °C, butane −1 °C. Between families, the type of force matters: ethanol (CH₃CH₂OH, 46 g/mol) boils at 78 °C, far above propane (44 g/mol), because ethanol molecules form hydrogen bonds. A good explanation compares both the types of forces and their strengths.`,
        },
      ],
    },
    'chem-3.2': {
      intro: `Solids can be classified by the particles they contain and the forces between those particles. Each class has a characteristic set of properties.`,
      deeper: [
        {
          title: 'Why graphite conducts',
          body: `In graphite each carbon atom forms three covalent bonds within a flat layer. The fourth valence electron of each carbon is delocalized across the layer, so electrons can move along the layers and graphite conducts electricity. In diamond every carbon forms four bonds in a three-dimensional network, all valence electrons are held in localized bonds, and diamond is an electrical insulator. Same element, different bonding, different properties.`,
        },
        {
          title: 'Identifying a solid from data',
          body: `When a question gives properties and asks for the type of solid, use a short decision process:

1. Conducts as a solid? Metallic (or graphite).
2. Conducts only when melted or dissolved? Ionic.
3. Very high melting point, very hard, never conducts? Covalent network.
4. Low melting point, soft, never conducts? Molecular.

Explain your choice with particles and forces: "The very high melting point shows that melting requires breaking strong covalent bonds throughout a network."`,
        },
      ],
    },
    'chem-3.4': {
      intro: `The ideal gas law relates the pressure, volume, temperature and amount of a gas. Together with Dalton's law, it handles single gases and mixtures.`,
      deeper: [
        {
          title: 'Molar mass from gas data',
          body: `A 1.00 g sample of an unknown gas occupies 0.500 L at 1.00 atm and 298 K. Find its molar mass:

1. n = PV/RT = (1.00 atm)(0.500 L) ÷ (0.08206 L·atm/(mol·K) × 298 K) ≈ 0.0204 mol.
2. M = mass ÷ moles = 1.00 g ÷ 0.0204 mol ≈ 48.9 g/mol.

Combining the two steps gives M = mRT/(PV), equivalent to the density form M = dRT/P from the lesson.`,
        },
        {
          title: 'Gases in stoichiometry',
          body: `The ideal gas law converts between moles and the measurable properties of a gas, so it slots into stoichiometry. To find the volume of CO₂ produced at 1.00 atm and 298 K by burning 0.100 mol of propane, use the balanced combustion equation, which gives 3 mol CO₂ per mole of propane, to get 3 × 0.100 = 0.300 mol CO₂, then V = nRT/P = 0.300 × 0.08206 × 298 ÷ 1.00 ≈ 7.34 L. When collecting a gas over water, remember to subtract the vapor pressure of water from the total pressure to get the pressure of the dry gas (Dalton's law).`,
        },
      ],
    },
    'chem-3.5': {
      intro: `Kinetic molecular theory explains the behavior of gases from the motion of their particles. It links temperature to particle energy and pressure to collisions.`,
      deeper: [
        {
          title: 'Explaining the gas laws with particles',
          body: `Each gas law has a particle-level explanation:

- **Temperature up at constant volume → pressure up:** particles move faster, so they hit the walls more often and with more force.
- **Volume down at constant temperature → pressure up:** particles have less distance to travel between collisions, so they hit the walls more often; their speed does not change.
- **More moles at constant volume and temperature → pressure up:** more particles means more collisions per second.

AP explanations should mention both the frequency and the force of collisions when temperature changes, but only frequency when volume or moles change.`,
        },
        {
          title: 'Reading Maxwell–Boltzmann diagrams',
          body: `On a Maxwell–Boltzmann distribution, the peak marks the most probable speed and the area under the curve represents the total number of particles. When two curves are drawn for the same sample at different temperatures, the curves must have equal areas, so the higher-temperature curve is lower and broader as well as shifted right. The same picture, drawn for kinetic energy instead of speed, returns in Unit 5: a larger fraction of particles above a threshold energy is why reactions speed up when heated.`,
        },
      ],
    },
    'chem-3.8': {
      intro: `Particle-level diagrams of solutions show what cannot be seen: separate solute particles, their relative numbers, and how solvent molecules surround them.`,
      deeper: [
        {
          title: 'Hydrated ions',
          body: `When an ionic compound dissolves in water, each ion becomes surrounded by water molecules held by ion–dipole attractions. A cation attracts the partially negative oxygen ends; an anion attracts the partially positive hydrogen ends. These hydrated ions move independently through the solution, which is why ionic solutions conduct electricity. In a diagram, draw a few water molecules around each ion with the correct orientation; you do not need to draw every water molecule in the beaker.`,
        },
        {
          title: 'Molecular solutes',
          body: `A molecular solute such as glucose or ethanol dissolves as intact molecules, not ions. Draw each molecule as a single particle, surrounded by water molecules and interacting with them by hydrogen bonding or dipole–dipole forces. Because the molecules carry no net charge, the solution does not conduct electricity. Representing solutes correctly, as ions or as molecules, is often the main thing a diagram question tests.`,
        },
      ],
    },
    'chem-3.10': {
      intro: `Whether one substance dissolves in another depends on the intermolecular interactions that must be broken and the new ones that can form. Substances with similar interactions tend to mix.`,
      deeper: [
        {
          title: 'Three sets of interactions',
          body: `Dissolving involves three changes: solute particles must separate from each other, solvent particles must make room, and new solute–solvent interactions form. When the new solute–solvent interactions are comparable in strength to the ones lost, dissolving is favorable. Ethanol and water mix in all proportions because the hydrogen bonds between ethanol and water molecules are similar to those within each pure liquid. Hexane and water do not mix because water would have to lose strong hydrogen bonds and gain only weak dispersion interactions.`,
        },
        {
          title: 'Predicting solubility in water',
          body: `To predict whether a molecular substance dissolves in water, look for groups that can hydrogen bond with water (O–H, N–H, or lone pairs on O or N) and compare them with the size of the nonpolar part. Sugars have many O–H groups and are very soluble. Large hydrocarbons have none and are insoluble. For a molecule like 1-butanol, the polar O–H group and the four-carbon chain compete, giving limited solubility. For ionic compounds, solubility depends on more than "like dissolves like" (it also depends on the strength of the lattice), so it is learned from data and from rules such as "all sodium, potassium, ammonium and nitrate salts are soluble in water".`,
        },
      ],
    },
    'chem-3.9': {
      intro: `The components of a solution cannot be separated by filtration. Chromatography and distillation separate them using differences in intermolecular interactions.`,
      deeper: [
        {
          title: 'Choosing the phases',
          body: `In chromatography the outcome depends on both phases. With polar paper and a nonpolar solvent, polar components stick to the paper and travel little, while nonpolar components travel with the solvent. Reversing the polarity of the phases reverses the order. To explain a chromatogram, state which phase each component is more strongly attracted to and why, in terms of polarity and intermolecular forces, then connect that to how far it moved.`,
        },
        {
          title: 'Distillation step by step',
          body: `In a simple distillation, the mixture is heated in a flask. The vapor, enriched in the component with the higher vapor pressure (weaker intermolecular forces), rises into a condenser, where it cools and returns to the liquid state, and is collected in a separate container. As the more volatile component is removed, the boiling mixture becomes richer in the less volatile one. For example, in an ethanol–water mixture, ethanol (bp 78 °C) distills first because its hydrogen bonding is weaker overall than water's.`,
        },
      ],
    },
    'chem-3.11': {
      intro: `Different regions of the electromagnetic spectrum carry different amounts of energy per photon, and so cause different changes in molecules: rotations, vibrations or electronic transitions.`,
      deeper: [
        {
          title: 'Spectra as evidence',
          body: `Because molecules can only absorb photons whose energies match the differences between their allowed energy levels, each substance absorbs a characteristic set of wavelengths. Infrared spectra reveal which bonds are present, because different bonds vibrate at different frequencies. UV-visible spectra reveal electronic transitions and are the basis of the colors of substances and of the Beer–Lambert measurements later in this unit. Spectra are a fingerprint that identifies substances without chemical reactions.`,
        },
        {
          title: 'Linking energy and the type of change',
          body: `The ordering of effects matches the ordering of photon energies. Rotational energy levels are very close together, so low-energy microwave photons can change them. Vibrational levels are farther apart and need infrared photons. Electronic levels are farther apart still and need visible or ultraviolet photons. Ultraviolet photons can carry enough energy to break chemical bonds, which is why UV light can damage skin and materials.`,
        },
      ],
    },
    'chem-3.12': {
      intro: `Light behaves as a stream of photons, each with an energy set by its frequency. When atoms and molecules absorb or emit light, they gain or lose exactly one photon's energy.`,
      deeper: [
        {
          title: 'Energy per mole of photons',
          body: `One photon of 500. nm light has an energy of 3.97 × 10^{−19} J, a tiny amount. Chemists usually work per mole: multiply by Avogadro's number,

3.97 × 10^{−19} J × 6.022 × 10^{23} mol^{−1} ≈ 2.39 × 10^{5} J/mol = 239 kJ/mol.

That is comparable to the energy of some chemical bonds, which helps explain why visible and especially ultraviolet light can drive chemical reactions.`,
        },
        {
          title: 'Emission spectra and energy levels',
          body: `An atom's electrons can occupy only certain energy levels. When an electron drops from a higher level to a lower one, the atom emits a photon whose energy equals the difference between the two levels. Because only certain differences are possible, an element's emission spectrum consists of specific lines, not a continuous rainbow. Larger energy drops produce photons of higher frequency and shorter wavelength.`,
        },
      ],
    },
    'chem-3.13': {
      intro: `The Beer–Lambert law relates how much light a solution absorbs to its concentration. It is the basis of spectrophotometry, a common lab method for measuring concentrations.`,
      deeper: [
        {
          title: 'Why absorbance is proportional to concentration',
          body: `Absorbance measures how much of the light is absorbed as it passes through the sample. Doubling the concentration doubles the number of absorbing particles in the beam's path, and doubling the path length does the same, so A is proportional to both. The molar absorptivity ε describes how strongly one particular substance absorbs at one particular wavelength, which is why a calibration curve must be made with the same substance, the same wavelength and the same cuvette as the unknown.`,
        },
        {
          title: 'Color and the choice of wavelength',
          body: `A colored solution absorbs light of some wavelengths and transmits the rest; the color we see comes from the transmitted light. A blue copper(II) solution, for example, absorbs strongly in the orange-red region of the spectrum. Measurements are made at the wavelength of maximum absorbance because small changes in concentration then cause the largest changes in absorbance, and small errors in setting the wavelength have the least effect.`,
        },
      ],
    },
    'chem-3.6': {
      intro: `The ideal gas law assumes that gas particles have no volume and no attractions. Real gases deviate from ideal behavior when those assumptions fail.`,
      deeper: [
        {
          title: 'Comparing how ideal two gases are',
          body: `To decide which of two gases behaves more ideally under the same conditions, compare their intermolecular forces and particle sizes. Helium, with very weak dispersion forces and tiny atoms, is the most ideal. Water vapor and ammonia, with hydrogen bonding, deviate much more, especially at low temperatures where their attractions are significant. Among nonpolar gases, larger molecules such as CCl₄ deviate more than smaller ones such as CH₄, because they have stronger dispersion forces and larger particle volumes.`,
        },
        {
          title: 'Two deviations, opposite directions',
          body: `The two failed assumptions push measurements in opposite directions. Particle volume makes the real volume (or pressure) larger than predicted, because less empty space is available. Attractions make the real pressure smaller than predicted, because particles pulled toward their neighbors strike the walls less forcefully. Which effect dominates depends on the conditions: at very high pressure particle volume tends to win, and at low temperature attractions tend to win.`,
        },
      ],
    },

    // ---------------- Unit 4 ----------------
    'chem-4.1': {
      intro: `A chemical change produces new substances; a physical change does not. Telling them apart depends on what happens at the level of particles, not only on what you see.`,
      deeper: [
        {
          title: 'Reversibility is not the test',
          body: `A common belief is that physical changes can be reversed and chemical changes cannot. It is a poor test. Many chemical reactions are reversible (Unit 7 is about them), and some physical changes are hard to undo. The reliable test is composition: if the substances present afterward are different substances, with different formulas, a chemical change has occurred. Melting ice is physical because the particles are still H₂O; electrolysis of water is chemical because H₂ and O₂ form.`,
        },
        {
          title: 'Arguing about dissolving',
          body: `Dissolving an ionic solid shows why the particle-level definitions matter. When NaCl dissolves, the ionic bonds of the lattice are broken (often a sign of a chemical process), but no new substance is formed, and the ions keep their identity in solution (a sign of a physical process). On a free-response question either classification can earn credit if it is supported by a clear, correct reason at the particle level, for example: "Dissolving is physical because the Na⁺ and Cl⁻ ions are unchanged; only their surroundings change."`,
        },
      ],
    },
    'chem-4.5a': {
      intro: `A balanced equation is a recipe in moles. Stoichiometry uses its mole ratios to predict how much of one substance reacts with, or is produced from, a given amount of another.`,
      deeper: [
        {
          title: 'A complete mass-to-mass calculation',
          body: `How many grams of O₂ are needed to burn 10.0 g of methane completely?

[[eq: CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)]]

1. Moles of CH₄: 10.0 g ÷ 16.04 g/mol = 0.623 mol.
2. Mole ratio: 0.623 mol CH₄ × (2 mol O₂ / 1 mol CH₄) = 1.25 mol O₂.
3. Mass of O₂: 1.25 mol × 32.00 g/mol = 39.9 g O₂.

Writing each step with units makes the setup self-checking: every unit except the one you want should cancel.`,
        },
        {
          title: 'Why conservation of mass still holds',
          body: `Atoms are neither created nor destroyed in a reaction, so the total mass of the products equals the total mass of the reactants that were consumed. In the methane example, 10.0 g CH₄ and 39.9 g O₂ (49.9 g in all) produce 27.4 g CO₂ and 22.5 g H₂O, also 49.9 g. Checking that masses add up is a quick way to catch an error in a multi-step calculation.`,
        },
      ],
    },
    'chem-4.7a': {
      intro: `Most reactions on the AP® exam belong to one of three families: precipitation, acid–base and redox. Recognizing the family tells you what to look for.`,
      deeper: [
        {
          title: 'Predicting a precipitate step by step',
          body: `When two ionic solutions are mixed, list all the ions present, then consider the new pairings:

1. Mixing BaCl₂(aq) with Na₂SO₄(aq) gives Ba²⁺, Cl⁻, Na⁺ and SO₄²⁻ in solution.
2. The new pairings are NaCl and BaSO₄.
3. NaCl is a sodium salt, so it is soluble. The question must tell you about BaSO₄; if it is described as insoluble, it precipitates.
4. Write the net ionic equation: [[eq: Ba^2+(aq) + SO4^2-(aq) -> BaSO4(s)]]

The ions that do not form the precipitate, Na⁺ and Cl⁻, are spectators.`,
        },
        {
          title: 'Combustion and other redox reactions',
          body: `Combustion reactions are redox reactions because oxygen gains electrons and the fuel loses them. In the complete combustion of methane, carbon goes from an oxidation number of −4 in CH₄ to +4 in CO₂, and oxygen goes from 0 in O₂ to −2. Any reaction in which an element appears as a free element on one side and in a compound on the other (such as a metal dissolving in acid) is a redox reaction, because its oxidation number must change.`,
        },
      ],
    },
    'chem-4.2': {
      intro: `A net ionic equation shows only the species that actually change in a reaction in solution. Writing one correctly depends on knowing which substances exist as separate ions in water.`,
      deeper: [
        {
          title: 'Strong acid with strong base',
          body: `For any strong acid reacting with any strong base, every ion except H⁺ (or H₃O⁺) and OH⁻ is a spectator. Whether the reaction is HCl with NaOH, HNO₃ with KOH or HBr with LiOH, the net ionic equation is the same:

[[eq: H^+(aq) + OH^-(aq) -> H2O(l)]]

This is why neutralizations of different strong acids by strong bases release almost the same amount of heat per mole of water formed: they are the same reaction.`,
        },
        {
          title: 'Why net ionic equations matter',
          body: `Net ionic equations describe what is really happening in solution. They show that mixing solutions of AgNO₃ and NaCl, or of AgClO₄ and KCl, produces the same reaction: Ag⁺ and Cl⁻ forming solid AgCl. They also underpin later topics: equilibrium expressions (Unit 7), acid–base reactions with weak acids (Unit 8) and cell reactions (Unit 9) are all written in net ionic form, with weak electrolytes and solids kept intact.`,
        },
      ],
    },
    'chem-4.3': {
      intro: `Particle diagrams represent reactions as pictures of atoms and molecules. They are a direct check that atoms are conserved and a quick way to see which reactant is limiting.`,
      deeper: [
        {
          title: 'Finding the limiting reactant in a picture',
          body: `In a particle diagram, use the coefficients as a recipe. For [[eq: N2(g) + 3H2(g) -> 2NH3(g)]], a box with 3 N₂ and 6 H₂ molecules can make NH₃ only until the H₂ runs out: 6 H₂ react with 2 N₂ to give 4 NH₃, leaving 1 N₂ unreacted. The "after" box should show 4 NH₃ molecules and 1 N₂ molecule. Count atoms to check: 6 N and 12 H before, 6 N and 12 H after.`,
        },
        {
          title: 'Drawing states correctly',
          body: `Particle diagrams should show states as well as formulas. Gases are drawn with particles spread far apart; liquids and solids with particles touching. A dissolved ionic compound is drawn as separate, hydrated ions, while a precipitate is drawn as a cluster of ions in a regular arrangement. If a diagram shows a "molecule" of NaCl floating in water, it misrepresents the solution.`,
        },
      ],
    },
    'chem-4.5b': {
      intro: `When reactants are not present in the exact ratio of the balanced equation, one runs out first. That limiting reactant sets the maximum amount of product.`,
      deeper: [
        {
          title: 'How much excess reactant is left?',
          body: `In the aluminum–chlorine example, Cl₂ is limiting (0.423 mol). The balanced equation says 2 mol Al react with 3 mol Cl₂, so the aluminum used is

0.423 mol Cl₂ × (2 mol Al / 3 mol Cl₂) = 0.282 mol Al = 7.61 g Al.

The excess aluminum remaining is 10.0 g − 7.61 g = 2.39 g. Always calculate the excess from the amount of the limiting reactant, not from the amount of product.`,
        },
        {
          title: 'Why yields fall short',
          body: `The actual yield of a reaction is usually less than the theoretical yield. Some product is lost during transfers and filtering, side reactions may produce other substances, and some reactions do not go to completion (Unit 7). A percent yield over 100% signals an error, often a product that is still wet or contaminated, so that its measured mass includes something other than the product.`,
        },
      ],
    },
    'chem-4.5c': {
      intro: `Laboratory quantities come as masses, gas volumes and solution volumes. Each can be converted to moles, and moles connect substances through the balanced equation.`,
      deeper: [
        {
          title: 'Gas volumes away from STP',
          body: `The 22.4 L/mol shortcut applies only at STP. At other conditions use PV = nRT. Heating 25.0 g of CaCO₃ gives 0.250 mol CO₂; at 1.00 atm and 298 K, its volume is

V = nRT/P = 0.250 mol × 0.08206 L·atm/(mol·K) × 298 K ÷ 1.00 atm ≈ 6.11 L,

larger than the 5.60 L at STP because the gas is warmer.`,
        },
        {
          title: 'Solution stoichiometry in two directions',
          body: `Molarity converts in both directions. To find the volume of a solution needed to react with a known amount, divide moles by molarity. For example, to precipitate all the Ag⁺ from 0.0100 mol AgNO₃ using 0.250 M NaCl, you need 0.0100 mol Cl⁻, so V = 0.0100 mol ÷ 0.250 mol/L = 0.0400 L = 40.0 mL. Working in millimoles (mmol = M × mL) is a convenient shortcut with small volumes.`,
        },
      ],
    },
    'chem-4.6': {
      intro: `A titration measures the amount of an unknown substance by reacting it completely with a solution of known concentration.`,
      deeper: [
        {
          title: 'A titration with a 1 : 2 ratio',
          body: `25.00 mL of H₂SO₄ is titrated to the equivalence point with 30.00 mL of 0.100 M NaOH. The reaction is [[eq: H2SO4(aq) + 2NaOH(aq) -> Na2SO4(aq) + 2H2O(l)]].

1. mol NaOH = 0.03000 L × 0.100 M = 0.003000 mol.
2. mol H₂SO₄ = 0.003000 ÷ 2 = 0.001500 mol.
3. [H₂SO₄] = 0.001500 mol ÷ 0.02500 L = 0.0600 M.

Using M₁V₁ = M₂V₂ here would give 0.120 M, twice the correct value, because it ignores the 1 : 2 ratio.`,
        },
        {
          title: 'Precision in the lab',
          body: `A buret is read at the bottom of the meniscus, at eye level, and estimated to one digit beyond the smallest marking, typically to the nearest 0.01 mL. The volume delivered is the final reading minus the initial reading. Titrations are usually repeated until two or more trials agree closely, and the average volume is used. The analyte is measured with a volumetric pipet, which delivers a precise, fixed volume.`,
        },
      ],
    },
    'chem-4.8': {
      intro: `In the Brønsted–Lowry model, an acid–base reaction is a proton transfer. Every acid–base reaction involves two conjugate pairs.`,
      deeper: [
        {
          title: 'An amphoteric ion in both roles',
          body: `The hydrogen carbonate ion, HCO₃⁻, can donate or accept a proton depending on its partner:

- As an acid: [[eq: HCO3^-(aq) + OH^-(aq) -> CO3^2-(aq) + H2O(l)]]
- As a base: [[eq: HCO3^-(aq) + H3O^+(aq) -> H2CO3(aq) + H2O(l)]]

In the first reaction its conjugate base is CO₃²⁻; in the second its conjugate acid is H₂CO₃. Amphoteric species have both an H that can be donated and a lone pair that can accept a proton.`,
        },
        {
          title: 'Hydronium, not bare protons',
          body: `A bare H⁺ ion is just a proton, far too reactive to exist alone in water. In aqueous solution it is always attached to water molecules, so chemists write H₃O⁺ (hydronium). Equations written with H⁺(aq) are a common shorthand and are accepted on the exam, but H₃O⁺ shows more clearly that water acts as a base when an acid dissolves.`,
        },
      ],
    },
    'chem-4.7b': {
      intro: `Oxidation numbers track electrons through a reaction. A change in oxidation number reveals a redox reaction and shows which species is oxidized and which is reduced.`,
      deeper: [
        {
          title: 'Oxidation numbers in polyatomic ions',
          body: `For a polyatomic ion, the oxidation numbers add up to the ion's charge. In the dichromate ion, Cr₂O₇²⁻:

2x + 7(−2) = −2, so 2x = 12 and x = +6.

Each chromium atom has an oxidation number of +6. Oxidation numbers are a bookkeeping device, not actual charges: the chromium atoms in dichromate do not carry a 6+ charge.`,
        },
        {
          title: 'Electrons are counted in pairs of changes',
          body: `In every redox reaction, the total increase in oxidation number equals the total decrease, because every electron lost by one species is gained by another. In Zn + Cu²⁺ → Zn²⁺ + Cu, zinc increases by 2 and copper decreases by 2. This equality is the principle behind balancing redox reactions with half-reactions and, in Unit 9, behind relating the charge passed through a cell to the moles of substance reacting.`,
        },
      ],
    },
    'chem-4.9': {
      intro: `Redox reactions are balanced by splitting them into an oxidation half-reaction and a reduction half-reaction, balancing each, and recombining them so the electrons cancel.`,
      deeper: [
        {
          title: 'A second worked example',
          body: `Balance Cu + NO₃⁻ → Cu²⁺ + NO in acidic solution.

- Oxidation: [[eq: Cu(s) -> Cu^2+(aq) + 2e^-]]
- Reduction: N goes from +5 to +2. Balance O with water, then H with H⁺, then charge with electrons: [[eq: NO3^-(aq) + 4H^+(aq) + 3e^- -> NO(g) + 2H2O(l)]]

Multiply the oxidation by 3 and the reduction by 2 so that each transfers 6 electrons, then add:

[[eq: 3Cu(s) + 2NO3^-(aq) + 8H^+(aq) -> 3Cu^2+(aq) + 2NO(g) + 4H2O(l)]]

Check: 3 Cu, 2 N, 6 O and 8 H on each side, and a charge of +6 on each side.`,
        },
        {
          title: 'Why charge must balance',
          body: `An equation that balances atoms but not charge implies that electrons appeared or vanished, which is impossible. Checking the total charge on each side is the fastest test of any ionic or redox equation. In half-reactions the electrons make up the difference: in the reduction above, the left side has −1 + 4 = +3 before electrons are added, the right side has 0, so 3 electrons are needed on the left.`,
        },
      ],
    },

    // ---------------- Unit 5 ----------------
    'chem-5.1': {
      intro: `The rate of a reaction is how quickly the concentrations of reactants and products change. Rates can be measured from any reactant or product and related through the coefficients.`,
      deeper: [
        {
          title: 'Average and instantaneous rates',
          body: `On a graph of concentration against time, the **average rate** over an interval is the slope of the straight line joining two points. The **instantaneous rate** at one moment is the slope of the tangent to the curve at that point. For most reactions the curve for a reactant gets flatter as time passes: the rate decreases as reactants are used up, because there are fewer collisions per second. The initial rate, at t = 0, is the slope at the very start.`,
        },
        {
          title: 'Measuring a rate in the lab',
          body: `Concentrations are rarely measured by taking samples and titrating them. Instead, a property that depends on concentration is followed continuously: the absorbance of a colored reactant or product (using the Beer–Lambert law from Unit 3), the pressure of a gas produced in a closed vessel, the volume of gas collected, or the mass lost as gas escapes. Each of these can be converted into concentration, giving the data needed for rate laws.`,
        },
      ],
    },
    'chem-5.5': {
      intro: `The collision model explains reaction rates at the particle level: particles must collide, with enough energy and with the correct orientation, for a reaction to occur.`,
      deeper: [
        {
          title: 'Orientation in a real reaction',
          body: `Consider NO(g) + O₃(g) → NO₂(g) + O₂(g). For the reaction to occur, the nitrogen atom of NO must strike one of the end oxygen atoms of O₃, so that an N–O bond can form as an O–O bond breaks. A collision in which the oxygen end of NO hits the ozone molecule, however energetic, cannot transfer the oxygen atom. Orientation requirements are one reason why only a small fraction of collisions lead to reaction.`,
        },
        {
          title: 'Why temperature has a large effect',
          body: `Raising the temperature increases the collision frequency only slightly, because particle speeds increase with the square root of the temperature. Its main effect is on the high-energy tail of the Maxwell–Boltzmann distribution: a small shift in the curve can multiply the number of particles with energy above Eₐ. That is why a 10 °C increase often roughly doubles a reaction rate, a much larger change than the increase in collision frequency alone could cause.`,
        },
      ],
    },
    'chem-5.2': {
      intro: `A rate law shows how the rate depends on reactant concentrations. The orders in a rate law must be determined from experimental data.`,
      deeper: [
        {
          title: 'What zero order means',
          body: `A reactant that is zero order does not appear in the rate law: changing its concentration has no effect on the rate. In the initial-rates example, doubling [B] left the rate unchanged, so the rate law is rate = k[A]². Zero order often means the reactant is involved only after the slow step of the mechanism (see the lessons on mechanisms later in this unit), or that the reaction is limited by something else, such as the surface area of a catalyst.`,
        },
        {
          title: 'When two concentrations change together',
          body: `Ideally, you compare two experiments in which only one concentration changes. If no such pair exists, use the order you already know to separate the effects. Suppose rate = k[A]²[B]^{n}, and from one experiment to another [A] doubles and [B] triples while the rate increases by a factor of 36. Doubling [A] alone accounts for a factor of 2² = 4, so tripling [B] accounts for 36 ÷ 4 = 9 = 3², and n = 2.`,
        },
      ],
    },
    'chem-5.3': {
      intro: `Integrated rate laws describe how a reactant's concentration changes over time. Plotting data three ways and finding the straight line reveals the reaction order.`,
      deeper: [
        {
          title: 'Counting half-lives',
          body: `When the time elapsed is a whole number of half-lives, first-order problems need no logarithms. A radioactive isotope with a half-life of 8.0 days decays from 100. mg to 50.0 mg after 8.0 days, 25.0 mg after 16 days, and 12.5 mg after 24 days. After 24 days (three half-lives), (½)³ = 1/8 of the original sample remains. For times that are not whole numbers of half-lives, use ln[A]_{t} − ln[A]_{0} = −kt with k = 0.693/t_{½}.`,
        },
        {
          title: 'Half-lives for other orders',
          body: `Only first-order reactions have a constant half-life. For a zero-order reaction, each half-life is shorter than the one before; for a second-order reaction, each half-life is longer than the one before (it doubles each time), because the rate falls quickly as the concentration drops. A table of successive half-lives is therefore another way to identify the order: constant means first order.`,
        },
      ],
    },
    'chem-5.4': {
      intro: `An elementary reaction is a single molecular event. Unlike an overall reaction, its rate law can be written directly from its equation.`,
      deeper: [
        {
          title: 'Why molecularity sets the rate law',
          body: `In a bimolecular step A + B → products, every reaction requires one A particle to collide with one B particle. Doubling [A] doubles the number of A–B collisions per second; doubling [B] does the same. So the rate is proportional to [A][B]. For 2A → products, two A particles must collide, and the collision rate is proportional to [A]². The rate law of an elementary step simply counts the particles that must come together.`,
        },
        {
          title: 'Overall equations hide the steps',
          body: `The overall equation 2H₂ + 2NO → N₂ + 2H₂O would require four molecules to collide at once if it happened in one step, which is effectively impossible. The reaction actually proceeds through several elementary steps, each involving only one or two molecules. The experimental rate law reflects the slowest of those steps, which is why it cannot be read from the overall coefficients.`,
        },
      ],
    },
    'chem-5.6': {
      intro: `A reaction energy profile shows how the potential energy changes as reactants turn into products. It displays the activation energy and the enthalpy change on one diagram.`,
      deeper: [
        {
          title: 'Endothermic profiles',
          body: `For an endothermic reaction, the products are higher in energy than the reactants, so ΔH is positive. The forward activation energy is then at least as large as ΔH, because the transition state must be higher than the products. The reverse reaction is exothermic and has the smaller activation energy, Eₐ(forward) − ΔH. Drawing the profile carefully, with the reactants, products and transition state at the right relative heights, makes these relationships easy to read.`,
        },
        {
          title: 'Activation energy and the rate constant',
          body: `The rate constant k depends on the activation energy and on temperature. A reaction with a small Eₐ has a large fraction of collisions above the threshold and a large k; one with a large Eₐ is slow at the same temperature. Raising the temperature increases k for every reaction, and it does so more strongly for reactions with large activation energies. These are qualitative ideas on the AP® exam; you will not be asked to calculate Eₐ from rate constants.`,
        },
      ],
    },
    'chem-5.7': {
      intro: `A reaction mechanism is a sequence of elementary steps that adds up to the overall reaction. It describes what happens at the molecular level.`,
      deeper: [
        {
          title: 'Adding steps carefully',
          body: `To check that a mechanism gives the overall equation, add all the steps as if they were one equation and cancel species that appear on both sides. In the NO₂ + CO mechanism, adding step 1 (2NO₂ → NO₃ + NO) and step 2 (NO₃ + CO → NO₂ + CO₂) gives 2NO₂ + NO₃ + CO → NO₃ + NO + NO₂ + CO₂. Canceling one NO₂ and the NO₃ leaves NO₂ + CO → NO + CO₂, which matches the overall reaction.`,
        },
        {
          title: 'Supporting, not proving, a mechanism',
          body: `Several different mechanisms can add up to the same overall equation and predict the same rate law. Experimental evidence can rule mechanisms out, but it cannot prove one correct. Evidence that supports a mechanism includes an agreeing rate law, the detection of a predicted intermediate (for example by its absorption spectrum), and the effect of a catalyst. On the exam, say a mechanism is "consistent with" the data rather than "proven".`,
        },
      ],
    },
    'chem-5.11': {
      intro: `A catalyst speeds up a reaction by opening a different pathway with a lower activation energy, and is regenerated by the end of the reaction.`,
      deeper: [
        {
          title: 'A catalyst on an energy profile',
          body: `On an energy profile, the catalyzed pathway has a lower maximum than the uncatalyzed one and often has more humps, because it involves more steps. The reactants and products are at the same energies in both pathways, so ΔH is the same. Because the activation energy is lowered for the reverse reaction by the same amount as for the forward reaction, a catalyst speeds up both directions equally and does not change the position of an equilibrium.`,
        },
        {
          title: 'Catalysts in mechanisms',
          body: `In a mechanism, a catalyst appears as a reactant in an early step and as a product in a later step, so it does not appear in the overall equation. If it takes part in the slow step (or a step before it), it can appear in the rate law, which is how a catalyst can affect the rate even though it is not consumed. Enzymes are biological catalysts: their active sites bind specific reactant molecules and hold them in an orientation favorable for reaction.`,
        },
      ],
    },
    'chem-5.8': {
      intro: `In a multistep mechanism, the slowest step limits the overall rate. When that step comes first, the rate law follows directly from it.`,
      deeper: [
        {
          title: 'Ruling out a mechanism',
          body: `For NO₂ + CO → NO + CO₂, the experimental rate law is rate = k[NO₂]². Consider a one-step mechanism, NO₂ + CO → NO + CO₂. As an elementary step it would give rate = k[NO₂][CO], which does not match the experiment, so that mechanism is ruled out even though it adds up to the correct overall equation. The two-step mechanism with a slow bimolecular first step 2NO₂ → NO₃ + NO predicts rate = k[NO₂]² and is consistent with the data.`,
        },
        {
          title: 'Explaining a rate law on the exam',
          body: `A full explanation of why a mechanism is consistent with a rate law makes two points: the elementary steps add up to the overall balanced equation, and the rate law of the rate-determining step matches the experimental rate law. If a reactant is missing from the rate law, explain that it first takes part in a fast step after the slow step, so changing its concentration does not change the overall rate.`,
        },
      ],
    },
    'chem-5.9': {
      intro: `When a fast, reversible step comes before the slow step, the intermediate's concentration is found from the equilibrium of the first step and substituted into the slow step's rate law.`,
      deeper: [
        {
          title: 'The full derivation',
          body: `For the mechanism 2NO ⇌ N₂O₂ (fast) followed by N₂O₂ + O₂ → 2NO₂ (slow):

1. Slow step: rate = k₂[N₂O₂][O₂]. N₂O₂ is an intermediate, so it cannot stay in the final rate law.
2. At equilibrium in step 1, the forward and reverse rates are equal: k₁[NO]² = k₋₁[N₂O₂], so [N₂O₂] = (k₁/k₋₁)[NO]².
3. Substitute: rate = k₂(k₁/k₋₁)[NO]²[O₂] = k[NO]²[O₂], where k = k₂k₁/k₋₁.

The predicted rate law is third order overall, even though no step involves three molecules colliding at once.`,
        },
        {
          title: 'Why the first step stays at equilibrium',
          body: `Because the second step is slow, the intermediate made in the first step is used up only slowly. Most of the N₂O₂ that forms simply falls apart back into NO long before it can react with O₂. The forward and reverse reactions of step 1 therefore stay balanced, and the small amount of N₂O₂ drawn off by step 2 hardly disturbs that balance. That is the justification for treating step 1 as an equilibrium.`,
        },
      ],
    },
    'chem-5.10': {
      intro: `The energy profile of a multistep reaction has one peak for each elementary step. Its shape identifies the intermediates, the rate-determining step and the overall enthalpy change.`,
      deeper: [
        {
          title: 'Reading a two-step profile',
          body: `In a typical two-step profile, the energy rises from the reactants to the first transition state, falls into a valley (the intermediate), rises again to the second transition state, and falls to the products. Measure each step's activation energy from the energy at the start of that step, not from the original reactants. If the climb from the intermediate to the second peak is the larger one, the second step is rate-determining; if the first climb is larger, the first step is.`,
        },
        {
          title: 'Connecting profiles and mechanisms',
          body: `An energy profile and a mechanism describe the same reaction and must agree: one hump per elementary step, one valley per intermediate, and the highest barrier for the slow step. A catalyzed mechanism with more steps will have more humps, but the highest point on its profile is lower than on the uncatalyzed profile. Questions often ask you to sketch a profile from a mechanism or to infer a mechanism's features from a profile.`,
        },
      ],
    },

    // ---------------- Unit 6 ----------------
    'chem-6.1': {
      intro: `Chemical and physical processes either release energy to their surroundings or absorb energy from them. Keeping track of which is which starts with defining the system.`,
      deeper: [
        {
          title: 'Energy diagrams for the two cases',
          body: `An enthalpy diagram shows the system's energy before and after a process. For an exothermic process, the products sit lower than the reactants, and the difference, released to the surroundings, is ΔH < 0. For an endothermic process, the products sit higher, and the energy absorbed from the surroundings gives ΔH > 0. The sign of ΔH always describes the system, never the surroundings, which is why a reaction that heats the water around it has a negative ΔH.`,
        },
        {
          title: 'Physical processes have ΔH too',
          body: `Energy changes are not limited to chemical reactions. Melting and boiling are endothermic because energy is needed to overcome intermolecular attractions; freezing and condensing are exothermic. Dissolving can be either, depending on the balance between the energy needed to separate the particles and the energy released when solute–solvent attractions form. The same particle-level reasoning (attractions broken absorb energy, attractions formed release energy) explains them all.`,
        },
      ],
    },
    'chem-6.3': {
      intro: `Heat is energy transferred because of a temperature difference. At the particle level, it is passed along by collisions until both objects reach the same temperature.`,
      deeper: [
        {
          title: 'Thermal energy, temperature and heat',
          body: `Three related terms are easy to confuse:

- **Temperature** measures the average kinetic energy of the particles.
- **Thermal energy** is the total kinetic energy of all the particles, so it depends on the amount of substance as well as the temperature.
- **Heat** is thermal energy in transit from a warmer object to a cooler one.

A bathtub of warm water has a lower temperature than a cup of boiling water, but because it contains far more particles, it holds more thermal energy and can transfer more heat.`,
        },
        {
          title: 'Where thermal equilibrium ends up',
          body: `When two objects reach thermal equilibrium, the final temperature lies between their starting temperatures. It is closer to the starting temperature of the object with the larger heat capacity (mass × specific heat), because that object's temperature changes least for a given transfer of energy. A small hot metal dropped into a large mass of cool water changes the water's temperature only slightly, while the metal cools almost to the water's original temperature.`,
        },
      ],
    },
    'chem-6.4': {
      intro: `Calorimetry measures heat flow by tracking temperature changes. Because energy is conserved, the heat released by one part of an isolated system equals the heat absorbed by the rest.`,
      deeper: [
        {
          title: 'Enthalpy of solution from a coffee-cup calorimeter',
          body: `5.00 g of NH₄NO₃ (0.0625 mol) is dissolved in 100.0 g of water, and the temperature falls from 22.0 °C to 18.3 °C. Assume the 105.0 g solution has c = 4.18 J/(g·°C).

1. Heat absorbed from the water: q = 105.0 g × 4.18 J/(g·°C) × 3.7 °C ≈ 1.6 × 10^{3} J.
2. Because the water cooled, the dissolving absorbed this energy: q_{process} = +1.6 kJ.
3. ΔH_{soln} = +1.6 kJ ÷ 0.0625 mol ≈ +26 kJ/mol.

The positive sign agrees with the temperature drop: dissolving ammonium nitrate is endothermic.`,
        },
        {
          title: 'Assumptions behind the calculation',
          body: `Simple calorimetry relies on several assumptions, and exam questions often ask about them: that no heat is exchanged with the cup or the air, that the solution has the specific heat and density of water, and that the reaction goes to completion. Each failed assumption has a predictable effect. For example, heat lost to the surroundings during an exothermic reaction makes the measured temperature rise too small, so the magnitude of the calculated ΔH is too small.`,
        },
      ],
    },
    'chem-6.5': {
      intro: `During a phase change, energy goes into overcoming or forming intermolecular attractions rather than changing the average kinetic energy, so the temperature of a pure substance stays constant.`,
      deeper: [
        {
          title: 'A two-step heating calculation',
          body: `How much energy is needed to turn 18.0 g of ice at 0 °C into water at 25.0 °C?

1. Melt the ice: q₁ = n × ΔH_{fus} = 1.00 mol × 6.01 kJ/mol = 6.01 kJ.
2. Warm the liquid: q₂ = mcΔT = 18.0 g × 4.18 J/(g·°C) × 25.0 °C = 1881 J = 1.88 kJ.
3. Total: 6.01 + 1.88 = 7.89 kJ.

Notice that melting the ice takes more than three times as much energy as warming the water by 25 °C.`,
        },
        {
          title: 'Why vaporization costs so much more than melting',
          body: `For water, ΔH_{vap} (40.7 kJ/mol) is almost seven times ΔH_{fus} (6.01 kJ/mol). Melting only loosens the arrangement of molecules, which remain in contact and still attract one another. Vaporizing separates the molecules almost completely, overcoming nearly all of their intermolecular attractions. Substances with stronger intermolecular forces have larger enthalpies of vaporization, matching their higher boiling points.`,
        },
      ],
    },
    'chem-6.6': {
      intro: `The enthalpy of reaction, ΔH, is the heat absorbed or released when a reaction occurs at constant pressure, for the amounts shown in the balanced equation.`,
      deeper: [
        {
          title: 'ΔH depends on how the equation is written',
          body: `Because ΔH refers to the reaction as written, changing the equation changes ΔH. Doubling every coefficient doubles ΔH, and reversing the equation reverses its sign:

- [[eq: CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)]] ΔH = −890 kJ/mol_{rxn}
- [[eq: CO2(g) + 2H2O(l) -> CH4(g) + 2O2(g)]] ΔH = +890 kJ/mol_{rxn}

The physical states matter too: forming H₂O(g) instead of H₂O(l) releases less energy, because some energy remains in the vapor.`,
        },
        {
          title: 'Comparing fuels',
          body: `ΔH per mole of fuel can be converted into energy per gram, which is often what matters in practice. Methane releases 890 kJ per 16.04 g, about 55.5 kJ/g. The same stoichiometric reasoning lets you calculate the mass of fuel needed to supply a given amount of heat, or the heat produced from a given volume of gas using the ideal gas law.`,
        },
      ],
    },
    'chem-6.7': {
      intro: `Breaking bonds requires energy and forming bonds releases it. Comparing the two with average bond enthalpies gives an estimate of a reaction's ΔH.`,
      deeper: [
        {
          title: 'Estimating ΔH for methane combustion',
          body: `Using typical average bond enthalpies (C–H 413, O=O 495, C=O 799 and O–H 463 kJ/mol), for CH₄ + 2O₂ → CO₂ + 2H₂O(g):

- Bonds broken: 4 C–H + 2 O=O = 4(413) + 2(495) = 2642 kJ
- Bonds formed: 2 C=O + 4 O–H = 2(799) + 4(463) = 3450 kJ
- ΔH ≈ 2642 − 3450 = −808 kJ

This is close to the measured value of about −802 kJ for forming water vapor. Draw Lewis structures first so that every bond, including each double bond, is counted.`,
        },
        {
          title: 'Why the result is only an estimate',
          body: `A bond enthalpy table lists averages. The energy of a C–H bond is slightly different in methane, ethane and chloroform, because neighboring atoms affect it. Bond enthalpies also apply only to gases, so when a reactant or product is a liquid or solid, the energy of the phase change is left out. For accurate values, use enthalpies of formation; bond enthalpies are best for understanding why a reaction is exothermic or endothermic.`,
        },
      ],
    },
    'chem-6.8': {
      intro: `Standard enthalpies of formation are tabulated for thousands of compounds. Combining them gives the enthalpy change of any reaction among those compounds.`,
      deeper: [
        {
          title: 'Writing a formation reaction',
          body: `A formation reaction makes exactly one mole of a compound from its elements in their standard states, so fractional coefficients are often needed:

[[eq: H2(g) + 1/2O2(g) -> H2O(l)]] ΔH°_{f} = −285.8 kJ/mol

The elements must be in their most stable forms at standard conditions: O₂(g), not O(g); C(graphite), not diamond; Br₂(l), not Br₂(g). That is why an element in its standard state has ΔH°_{f} = 0: forming it from itself involves no change.`,
        },
        {
          title: 'Why products minus reactants works',
          body: `Imagine the reaction happening in two stages: first break every reactant down into its elements (the reverse of their formation reactions, so −ΣΔH°_{f} of the reactants), then build every product from those elements (+ΣΔH°_{f} of the products). Because enthalpy depends only on the starting and ending states, this imaginary path has the same ΔH as the real reaction. The formula ΔH°_{rxn} = ΣΔH°_{f}(products) − ΣΔH°_{f}(reactants) is Hess's law applied to that path.`,
        },
      ],
    },
    'chem-6.9': {
      intro: `Because enthalpy depends only on the initial and final states, the ΔH of a reaction equals the sum of the ΔH values of any series of steps that add up to it. This is Hess's law.`,
      deeper: [
        {
          title: 'Working the carbon monoxide example',
          body: `The target is C(s) + ½O₂(g) → CO(g).

- Equation (1) has C(s) on the left, as in the target: keep it. ΔH = −393.5 kJ.
- Equation (2) has CO(g) on the left, but the target needs it on the right: reverse it. ΔH = +283.0 kJ.

Adding: C + O₂ + CO₂ → CO₂ + CO + ½O₂. Cancel CO₂ and ½O₂ from both sides to get C + ½O₂ → CO, with ΔH = −393.5 + 283.0 = −110.5 kJ.`,
        },
        {
          title: 'State functions',
          body: `Hess's law works because enthalpy is a **state function**: its value depends only on the current state of the system, not on how the system got there. Altitude is a good analogy. Two hikers can take different trails from the same base to the same summit, but their change in altitude is the same. Heat and work individually depend on the path taken; at constant pressure, the heat transferred equals ΔH, which does not.`,
        },
      ],
    },

    // ---------------- Unit 7 ----------------
    'chem-7.1': {
      intro: `Many reactions run in both directions at once. When the forward and reverse rates become equal, the system reaches dynamic equilibrium and its composition stops changing.`,
      deeper: [
        {
          title: 'Approaching equilibrium on a graph',
          body: `If a reaction starts with only reactants, the forward rate is at first high and the reverse rate zero. As products build up, the forward rate falls and the reverse rate rises, until they meet. On a graph of concentration against time, the reactant curve falls and the product curve rises, and both level off at the point where equilibrium is reached. The levels are generally different: equilibrium means the curves become flat, not that they meet.`,
        },
        {
          title: 'Evidence that equilibrium is dynamic',
          body: `If a little radioactive iodine is added as solid AgI to a saturated AgI solution, radioactive iodide ions soon appear in the solution, even though the total concentration of dissolved iodide does not change. Some solid is dissolving while an equal amount of dissolved ions precipitates. Experiments like this show that the reactions continue at equilibrium; they simply balance.`,
        },
      ],
    },
    'chem-7.3': {
      intro: `The equilibrium constant expression relates the concentrations (or partial pressures) of products and reactants at equilibrium. The reaction quotient uses the same expression at any moment.`,
      deeper: [
        {
          title: 'K_{c} and K_{p}',
          body: `For reactions involving gases, the equilibrium constant can be written with molar concentrations (K_{c}) or with partial pressures in atmospheres (K_{p}). For N₂(g) + 3H₂(g) ⇌ 2NH₃(g):

K_{c} = [NH₃]² / ([N₂][H₂]³)     K_{p} = (P_{NH₃})² / (P_{N₂} · P_{H₂}³)

The two usually have different numerical values, so use the type of K given in the question, with matching data. Concentrations of dissolved species always appear as molarities.`,
        },
        {
          title: 'Why solids and pure liquids are left out',
          body: `The "concentration" of a pure solid or liquid is fixed by its density: a bigger lump of CaCO₃ has more moles but also more volume, so moles per liter do not change. Since that value is constant, it is absorbed into K. As long as some solid is present, its amount does not affect the equilibrium. Water as the solvent is treated the same way, because its concentration hardly changes in dilute solutions.`,
        },
      ],
    },
    'chem-7.4': {
      intro: `The value of K can be calculated from equilibrium concentrations, and its size tells you how far a reaction proceeds before reaching equilibrium.`,
      deeper: [
        {
          title: 'K depends only on temperature',
          body: `For a given reaction at a given temperature, K is the same no matter what concentrations you start with. Different starting mixtures reach different equilibrium concentrations, but substituting any of them into the K expression gives the same value. Changing the temperature changes K: for an exothermic reaction K decreases as temperature rises, and for an endothermic reaction it increases.`,
        },
        {
          title: 'Extent of reaction, not speed',
          body: `A large K means the equilibrium lies far toward products; a small K means it lies toward reactants. Neither says how long it takes to get there. The reaction of hydrogen and oxygen to form water has an enormous K at room temperature, yet a mixture of the two gases can sit unchanged for years, because the reaction's activation energy is large. Equilibrium (Unit 7) and kinetics (Unit 5) answer different questions.`,
        },
      ],
    },
    'chem-7.6': {
      intro: `When a chemical equation is reversed, multiplied or combined with others, its equilibrium constant changes in predictable ways.`,
      deeper: [
        {
          title: 'Applying the rules',
          body: `Suppose N₂(g) + 3H₂(g) ⇌ 2NH₃(g) has K at some temperature. Then:

- 2NH₃ ⇌ N₂ + 3H₂ (reversed) has K_{new} = 1/K;
- ½N₂ + ³⁄₂H₂ ⇌ NH₃ (multiplied by ½) has K_{new} = K^{1/2} = √K;
- 4NH₃ ⇌ 2N₂ + 6H₂ (reversed and doubled) has K_{new} = (1/K)² = 1/K².

Each rule follows from writing out the new K expression and comparing it with the original.`,
        },
        {
          title: 'Why K values multiply',
          body: `When two equations are added, the K expression of the sum is the product of the two individual expressions: the concentration of any species that appears as a product in one equation and a reactant in the other cancels between the numerator and denominator. This multiplication rule is the equilibrium counterpart of Hess's law, and in Unit 9 it connects to the additivity of ΔG°, because ΔG° = −RT ln K turns products of K values into sums.`,
        },
      ],
    },
    'chem-7.7': {
      intro: `Comparing Q with K predicts which way a reaction will proceed. An ICE table then finds the concentrations at equilibrium.`,
      deeper: [
        {
          title: 'Solving the H₂ + I₂ example',
          body: `With [H₂] = [I₂] = 0.100 − x and [HI] = 2x at equilibrium,

K = (2x)² / (0.100 − x)² = 50.0.

Both sides are perfect squares, so take the square root: 2x/(0.100 − x) = √50.0 ≈ 7.07. Then 2x = 0.707 − 7.07x, so x ≈ 0.0780. This gives [HI] = 0.156 M and [H₂] = [I₂] ≈ 0.022 M. Check by substitution: (0.156)²/(0.022)² ≈ 50.`,
        },
        {
          title: 'When K is small: the 5% approximation',
          body: `If K is very small, very little reaction occurs, and x is negligible compared with the initial concentration. For A ⇌ B + C with K = 1.0 × 10^{−6} and [A]₀ = 0.50 M, the equilibrium condition is x²/(0.50 − x) = 1.0 × 10^{−6}. Assuming 0.50 − x ≈ 0.50 gives x² = 5.0 × 10^{−7} and x ≈ 7.1 × 10^{−4} M. Since x is only about 0.14% of 0.50, the approximation is justified. The same shortcut is used constantly for weak acids in Unit 8.`,
        },
      ],
    },
    'chem-7.8': {
      intro: `Particle diagrams show equilibrium mixtures as boxes of molecules. Counting particles gives concentrations, and comparing Q with K tells you whether a box is at equilibrium.`,
      deeper: [
        {
          title: 'Is this box at equilibrium?',
          body: `For A₂ + B₂ ⇌ 2AB with K = 16, a box contains 4 A₂, 4 B₂ and 4 AB. Because the total exponents in the numerator and denominator are equal (2 and 2), counts can be used directly: Q = 4²/(4 × 4) = 1. Since Q < K, the box is not at equilibrium, and the reaction will proceed forward, forming more AB, until Q = 16. If the numbers of gas particles on each side differed, you would need the actual concentrations.`,
        },
        {
          title: 'Atoms are conserved in every frame',
          body: `When a series of diagrams shows a reaction approaching equilibrium, every frame must contain the same number of each kind of atom. Checking this catches impossible diagrams quickly, and it is also how you work out the composition of a later frame: if two AB molecules form, one A₂ and one B₂ must have disappeared.`,
        },
      ],
    },
    'chem-7.9': {
      intro: `Le Châtelier's principle predicts how an equilibrium responds to a disturbance: the system shifts in the direction that partly counteracts it. Q-versus-K reasoning explains why.`,
      deeper: [
        {
          title: 'Volume changes in Q-and-K terms',
          body: `Halving the volume of an N₂ + 3H₂ ⇌ 2NH₃ mixture doubles every concentration at once. In Q = [NH₃]²/([N₂][H₂]³), the numerator grows by a factor of 2² = 4 and the denominator by 2⁴ = 16, so Q becomes one quarter of K. With Q < K, the reaction proceeds forward, toward the side with fewer moles of gas. If both sides had the same number of moles of gas, the factors would cancel, Q would still equal K, and no shift would occur.`,
        },
        {
          title: 'What a graph shows after a disturbance',
          body: `On a concentration–time graph, adding a reactant shows up as a sudden vertical jump in that reactant's line. Then, as the system responds, the added reactant's concentration falls partway back, the other reactant's concentration falls, and the products' concentrations rise, until all the lines level off again. A temperature change, by contrast, causes no sudden jump: all the concentrations drift gradually to new values, because K itself has changed.`,
        },
      ],
    },
    'chem-7.11': {
      intro: `A slightly soluble ionic solid in contact with its saturated solution is at equilibrium. The solubility product, K_{sp}, describes that equilibrium.`,
      deeper: [
        {
          title: 'Will a precipitate form?',
          body: `Compare the ion product Q with K_{sp}. If equal volumes of 0.0010 M AgNO₃ and 0.0010 M NaCl are mixed, each concentration is halved by the dilution: [Ag⁺] = [Cl⁻] = 0.00050 M. Then Q = (0.00050)(0.00050) = 2.5 × 10^{−7}. Since this is far greater than K_{sp} = 1.8 × 10^{−10}, the solution is supersaturated and AgCl precipitates until Q = K_{sp}. If Q were less than K_{sp}, no precipitate would form.`,
        },
        {
          title: 'Molar solubility versus K_{sp}',
          body: `K_{sp} is an equilibrium constant; molar solubility is how many moles of the solid dissolve per liter. They are related through the formula of the salt, which is why K_{sp} values can be compared directly only for salts that dissociate into the same numbers of ions. Molar solubility changes with conditions (for example, in the presence of a common ion), while K_{sp} changes only with temperature.`,
        },
      ],
    },
    'chem-7.12': {
      intro: `Adding an ion that is already part of a solubility equilibrium shifts it toward the solid. The salt becomes less soluble, although K_{sp} does not change.`,
      deeper: [
        {
          title: 'Comparing the numbers',
          body: `In pure water, AgCl has a molar solubility of about 1.3 × 10^{−5} M. In 0.10 M NaCl, it falls to about 1.8 × 10^{−9} M, roughly 7000 times less. Both solutions have the same K_{sp}, because the temperature is the same; the difference is that in NaCl solution the chloride concentration is already high, so only a tiny concentration of Ag⁺ can exist alongside it before Q reaches K_{sp}.`,
        },
        {
          title: 'Checking the approximation',
          body: `The shortcut [Cl⁻] = 0.10 + s ≈ 0.10 is justified only if s is tiny compared with 0.10. After solving, check: 1.8 × 10^{−9} is far less than 5% of 0.10, so the approximation is excellent. For a salt such as CaF₂ in a solution of NaF, the same reasoning applies, but remember that the fluoride concentration is squared in K_{sp} = [Ca²⁺][F⁻]².`,
        },
      ],
    },

    // ---------------- Unit 8 ----------------
    'chem-8.1': {
      intro: `The pH scale expresses the hydronium ion concentration of a solution as a small, convenient number. Water's self-ionization links [H₃O⁺] and [OH⁻] in every aqueous solution.`,
      deeper: [
        {
          title: 'Neutral is not always pH 7',
          body: `Neutral means [H₃O⁺] = [OH⁻], and that equals pH 7.00 only at 25 °C. The self-ionization of water is endothermic, so K_{w} increases with temperature. At 50 °C, K_{w} is about 5.5 × 10^{−14}, so in pure water [H₃O⁺] = √(5.5 × 10^{−14}) ≈ 2.3 × 10^{−7} M and the pH is about 6.6. That water is still neutral, because the two ion concentrations remain equal.`,
        },
        {
          title: 'Every aqueous solution contains both ions',
          body: `Because K_{w} = [H₃O⁺][OH⁻] holds in every aqueous solution at a given temperature, an acidic solution still contains some OH⁻ and a basic solution still contains some H₃O⁺. In a solution with pH 3.00, [H₃O⁺] = 1.0 × 10^{−3} M and [OH⁻] = 1.0 × 10^{−11} M. Acidic and basic describe which ion is in excess, not which ion is present.`,
        },
      ],
    },
    'chem-8.2': {
      intro: `Strong acids and strong bases ionize or dissociate completely in water. Their pH can be found directly from their concentrations.`,
      deeper: [
        {
          title: 'Dilution and pH',
          body: `For a strong acid, each tenfold dilution raises the pH by one unit. A 0.010 M HNO₃ solution has [H₃O⁺] = 0.010 M and pH 2.00; diluting it tenfold gives 0.0010 M and pH 3.00. The pattern holds as long as the acid is much more concentrated than about 10^{−6} M; extremely dilute acids cannot raise the pH above 7, because water itself contributes H₃O⁺.`,
        },
        {
          title: 'What "strong" really means',
          body: `"Strong" describes the extent of ionization, not the concentration or how dangerous a solution is. A dilute solution of a strong acid can be less acidic than a concentrated solution of a weak acid. A strong acid's reaction with water goes essentially to completion, and its conjugate base (Cl⁻, NO₃⁻ and so on) is so weak that it has no measurable effect on pH. That is why salts such as NaCl and KNO₃ give neutral solutions.`,
        },
      ],
    },
    'chem-8.3a': {
      intro: `A weak acid ionizes only partially in water. Its acid dissociation constant, K_{a}, describes the equilibrium and lets you calculate the pH.`,
      deeper: [
        {
          title: 'Percent ionization depends on concentration',
          body: `A weak acid ionizes to a greater extent as it is diluted. For acetic acid (K_{a} = 1.8 × 10^{−5}), a 0.10 M solution is about 1.3% ionized, while a 0.010 M solution has [H₃O⁺] ≈ √(1.8 × 10^{−5} × 0.010) ≈ 4.2 × 10^{−4} M and is about 4.2% ionized. Le Châtelier's principle explains why: dilution lowers all concentrations, and the equilibrium shifts toward the side with more dissolved particles, the ions.`,
        },
        {
          title: 'Checking the approximation',
          body: `The shortcut [H₃O⁺] ≈ √(K_{a} · C) assumes that x is negligible compared with C. After calculating, check: if x is less than about 5% of C, the approximation is acceptable. For 0.10 M acetic acid, x = 1.3 × 10^{−3} M is 1.3% of 0.10, so it is fine. When an acid is relatively strong (larger K_{a}) or very dilute, the approximation fails, and the full equilibrium expression must be solved.`,
        },
      ],
    },
    'chem-8.3b': {
      intro: `A weak base accepts protons from water to only a small extent. Its base constant, K_{b}, is related to the K_{a} of its conjugate acid through K_{w}.`,
      deeper: [
        {
          title: 'Salts that change the pH',
          body: `When a salt dissolves, its ions can act as acids or bases. An ion that is the conjugate of a weak acid or base affects the pH; one that is the conjugate of a strong acid or base does not:

| Salt | Ions that matter | Solution |
| NaCl | neither | neutral |
| NaCH₃COO | CH₃COO⁻ (conjugate base of a weak acid) | basic |
| NH₄Cl | NH₄⁺ (conjugate acid of a weak base) | acidic |

For 0.10 M sodium acetate, K_{b} = 1.0 × 10^{−14} ÷ 1.8 × 10^{−5} ≈ 5.6 × 10^{−10}, [OH⁻] ≈ √(5.6 × 10^{−10} × 0.10) ≈ 7.5 × 10^{−6} M, and the pH is about 8.87.`,
        },
        {
          title: 'Strength runs in opposite directions',
          body: `Because K_{a} × K_{b} = K_{w}, the stronger an acid, the weaker its conjugate base. The conjugate bases of strong acids are too weak to accept protons from water at all. The conjugate bases of very weak acids are noticeably basic. This inverse relationship is behind many exam questions that ask you to rank solutions of salts by pH.`,
        },
      ],
    },
    'chem-8.6': {
      intro: `Molecular structure determines how readily an acid gives up a proton. The key is the stability of the conjugate base left behind.`,
      deeper: [
        {
          title: 'Binary acids down a group',
          body: `For the hydrogen halides, acid strength increases down the group: HF < HCl < HBr < HI, even though electronegativity decreases. As the halogen atom gets larger, the H–X bond gets longer and weaker, so the proton is released more easily, and the negative charge on the larger anion is spread over a greater volume, which makes the anion more stable. HF is a weak acid; HCl, HBr and HI are all strong.`,
        },
        {
          title: 'Comparing carboxylic acids',
          body: `In a carboxylic acid, R–COOH, the conjugate base R–COO⁻ is stabilized by resonance between its two oxygen atoms. The rest of the molecule fine-tunes the strength: electronegative atoms such as chlorine near the carboxyl group pull electron density away and further stabilize the anion. Chloroacetic acid is therefore stronger than acetic acid, and trichloroacetic acid is stronger still. The farther the electronegative atoms are from the –COOH group, the smaller their effect.`,
        },
      ],
    },
    'chem-8.4': {
      intro: `When an acid and a base are mixed, they react first. What remains after that reaction determines the pH of the mixture.`,
      deeper: [
        {
          title: 'Part-way and all the way: a weak acid with NaOH',
          body: `Start with 50.0 mL of 0.100 M CH₃COOH (5.00 mmol).

- **Add 25.0 mL of 0.100 M NaOH (2.50 mmol):** half the acid is converted to acetate, leaving 2.50 mmol of each. This is a buffer with equal amounts of acid and base, so pH = pK_{a} = 4.74.
- **Add 50.0 mL of the NaOH (5.00 mmol):** all the acid is converted, leaving 5.00 mmol CH₃COO⁻ in 100.0 mL, or 0.0500 M. Acetate is a weak base with K_{b} = 5.6 × 10^{−10}, so [OH⁻] ≈ √(5.6 × 10^{−10} × 0.0500) ≈ 5.3 × 10^{−6} M and the pH is about 8.72.`,
        },
        {
          title: 'Weak acid with weak base',
          body: `When a weak acid reacts with a weak base, the reaction does not go to completion; it reaches an equilibrium. Its K can be found by combining constants: for HA + B ⇌ A⁻ + HB⁺, K = K_{a}(HA) × K_{b}(B) ÷ K_{w}. If the acid is stronger than the conjugate acid of the base, K is greater than 1 and the products are favored. Qualitatively, proton transfer is favored toward the weaker acid and the weaker base.`,
        },
      ],
    },
    'chem-8.8': {
      intro: `A buffer contains substantial amounts of a weak acid and its conjugate base. It resists changes in pH because each component neutralizes one kind of added species.`,
      deeper: [
        {
          title: 'The buffer in your blood',
          body: `Blood is buffered mainly by carbonic acid, H₂CO₃, and the hydrogen carbonate ion, HCO₃⁻. If acid enters the blood, HCO₃⁻ converts it to H₂CO₃; if base enters, H₂CO₃ neutralizes it, forming HCO₃⁻ and water. Because both components are present in substantial amounts, small additions of acid or base change their ratio only slightly, and the pH stays close to 7.4.`,
        },
        {
          title: 'Why a buffer resists pH change',
          body: `Adding a strong acid to pure water raises [H₃O⁺] directly, and the pH can drop by several units. Adding the same acid to a buffer converts it into the weak acid of the buffer pair, which hardly ionizes. The [A⁻]/[HA] ratio shifts slightly, so by the Henderson–Hasselbalch equation the pH changes only slightly. The buffer works until one of its components is used up, which is the idea of buffer capacity later in this unit.`,
        },
      ],
    },
    'chem-8.9': {
      intro: `The Henderson–Hasselbalch equation gives the pH of a buffer from the pK_{a} of the weak acid and the ratio of conjugate base to acid.`,
      deeper: [
        {
          title: 'Designing a buffer',
          body: `To make an acetic acid–acetate buffer with pH 5.00 (pK_{a} = 4.74), solve the Henderson–Hasselbalch equation for the ratio:

5.00 = 4.74 + log([A⁻]/[HA]), so log([A⁻]/[HA]) = 0.26 and [A⁻]/[HA] = 10^{0.26} ≈ 1.8.

Any mixture with about 1.8 times as many moles of acetate as acetic acid will have pH 5.00. Choosing larger amounts of both, in the same ratio, gives the same pH with greater capacity.`,
        },
        {
          title: 'Where the equation comes from',
          body: `Start from the K_{a} expression, K_{a} = [H₃O⁺][A⁻]/[HA], take −log of both sides, and rearrange: pH = pK_{a} + log([A⁻]/[HA]). In a buffer, the weak acid and its conjugate base are both present in large amounts, so their equilibrium concentrations are essentially the amounts that were mixed. That is why the equation can be used directly with the starting quantities, and why it is not appropriate for a solution of a weak acid alone.`,
        },
      ],
    },
    'chem-8.7': {
      intro: `Comparing the pH of a solution with the pK_{a} of an acid tells you which form of the acid predominates. Indicators use this to change color.`,
      deeper: [
        {
          title: 'Quantifying the ratio',
          body: `Rearranging the Henderson–Hasselbalch equation shows exactly how the ratio depends on pH: [A⁻]/[HA] = 10^{(pH − pKₐ)}. At one pH unit above the pK_{a}, the base form outnumbers the acid form 10 to 1; at two units above, 100 to 1. An indicator's color change becomes visible when one form outnumbers the other by roughly 10 to 1, so most indicators change color over a range of about pK_{a} ± 1.`,
        },
        {
          title: 'Protonation states in biology',
          body: `The same reasoning applies to any molecule with an acidic group. At the pH of blood (about 7.4), a carboxylic acid group with pK_{a} around 4 to 5 is almost entirely in its deprotonated, negatively charged form, while an amine group whose conjugate acid has a pK_{a} around 9 to 10 is mostly protonated and positively charged. Questions often give a pK_{a} and a pH and ask which form, or what charge, predominates.`,
        },
      ],
    },
    'chem-8.5': {
      intro: `A titration curve plots pH against the volume of titrant added. Its shape reveals whether the analyte is strong or weak, its concentration, and its pK_{a}.`,
      deeper: [
        {
          title: 'Strong versus weak acid curves',
          body: `Compare the titrations of a strong acid and a weak acid of the same concentration with NaOH:

- the weak acid starts at a higher pH, because it is only partly ionized;
- the weak acid curve rises more quickly at first, then flattens into a buffer region, which the strong acid curve lacks;
- the vertical jump at equivalence is smaller for the weak acid, and centered above pH 7.

Both reach equivalence at the same volume of NaOH, because the amount of base needed depends only on the moles of acid, not on its strength.`,
        },
        {
          title: 'Finding a concentration from the curve',
          body: `The equivalence point is the midpoint of the steep rise. Read its volume from the graph, find moles of titrant (M × V), and use the mole ratio of the reaction to find moles of analyte. If 30.0 mL of 0.100 M NaOH reaches equivalence with 25.0 mL of a monoprotic acid, the acid contained 3.00 mmol and its concentration is 3.00 mmol ÷ 25.0 mL = 0.120 M. Half of the equivalence volume, 15.0 mL, is the half-equivalence point, where pH = pK_{a}.`,
        },
      ],
    },
    'chem-8.10': {
      intro: `Buffer capacity is the amount of acid or base a buffer can absorb before its pH changes significantly. It depends on the amounts of the buffer components, not only on their ratio.`,
      deeper: [
        {
          title: 'When a buffer fails',
          body: `A buffer stops working when one of its components is nearly used up. If 0.010 mol of strong acid is added to a buffer containing only 0.010 mol of A⁻, the conjugate base is completely consumed, and any further acid lowers the pH sharply, just as in unbuffered water. A buffer containing 0.10 mol of each component could absorb ten times as much acid before reaching that point, even though both buffers start at the same pH.`,
        },
        {
          title: 'Matching a buffer to the job',
          body: `In practice, a buffer is chosen with a pK_{a} near the pH that must be maintained, and with concentrations large enough to absorb the acid or base expected. If a process is expected to produce acid, a buffer with somewhat more conjugate base than acid gives extra protection in that direction. The ratio sets the pH; the amounts set the capacity.`,
        },
      ],
    },
    'chem-8.11': {
      intro: `The solubility of some salts depends strongly on pH. Whether it does depends on whether one of the salt's ions reacts with H₃O⁺ or OH⁻.`,
      deeper: [
        {
          title: 'Explaining a pH effect step by step',
          body: `A complete explanation of why Mg(OH)₂ is more soluble in acidic solution has three links:

1. In acid, H₃O⁺ reacts with OH⁻ from the dissolved solid, forming water.
2. This lowers [OH⁻], so Q = [Mg²⁺][OH⁻]² becomes less than K_{sp}.
3. More Mg(OH)₂ dissolves until Q again equals K_{sp}.

The same three links explain why carbonates, phosphates, sulfides and other salts with basic anions dissolve more in acid.`,
        },
        {
          title: 'Effects in the real world',
          body: `Acid rain dissolves limestone and marble (CaCO₃) because carbonate is a basic anion. Tooth enamel, which contains basic phosphate and hydroxide ions, dissolves more readily when bacteria produce acids in the mouth, which is how tooth decay begins. By contrast, salts whose anions come from strong acids, such as AgCl and AgBr, are not made more soluble by adding acid, because their anions do not react with H₃O⁺ to a significant extent.`,
        },
      ],
    },

    // ---------------- Unit 9 ----------------
    'chem-9.1': {
      intro: `Entropy measures how dispersed matter and energy are. Processes that spread matter or energy out increase entropy.`,
      deeper: [
        {
          title: 'Why dispersal is favored',
          body: `There are vastly more ways for particles and their energy to be arranged when they are spread out than when they are concentrated. When perfume molecules are free to move throughout a room, the number of possible arrangements is enormously larger than when they are confined to the bottle. A system left to itself is overwhelmingly likely to be found in one of the many dispersed arrangements, which is why spreading out happens on its own and the reverse effectively never does.`,
        },
        {
          title: 'Predicting the sign of ΔS for physical processes',
          body: `The same reasoning applies beyond reactions:

- melting and vaporizing increase entropy; freezing and condensing decrease it;
- a gas expanding into a larger volume increases entropy;
- a gas dissolving in a liquid usually decreases entropy, because the gas particles become confined;
- heating any substance increases its entropy, because its particles' energies become more widely distributed.

When gas moles and phases do not change, predicting the sign of ΔS may require data.`,
        },
      ],
    },
    'chem-9.2': {
      intro: `Standard molar entropies are tabulated for substances, and the entropy change of a reaction is found by subtracting the reactants' total from the products'.`,
      deeper: [
        {
          title: 'A second worked example',
          body: `For 2H₂(g) + O₂(g) → 2H₂O(l), using S° values H₂(g) 130.7, O₂(g) 205.2 and H₂O(l) 69.9 J/(mol·K):

ΔS° = 2(69.9) − [2(130.7) + 205.2] = 139.8 − 466.6 = −326.8 J/(mol·K).

The large negative value fits the prediction from the equation: three moles of gas become two moles of liquid, so matter becomes far less dispersed.`,
        },
        {
          title: 'Why entropies of pure substances are positive',
          body: `Entropy has an absolute zero point: a perfect crystal at 0 K has zero entropy. Every substance at room temperature has more dispersal than that, so every pure substance has a positive standard molar entropy, including the elements. For a given substance, S°(gas) > S°(liquid) > S°(solid), and larger, more complex molecules have larger entropies than smaller ones in the same phase.`,
        },
      ],
    },
    'chem-9.3': {
      intro: `Gibbs free energy combines the enthalpy change, the entropy change and the temperature. Its sign tells you whether a process is thermodynamically favored.`,
      deeper: [
        {
          title: 'Melting point from ΔH and ΔS',
          body: `At the melting point, solid and liquid are at equilibrium and ΔG = 0, so T = ΔH/ΔS. For ice, ΔH_{fus} = 6.01 kJ/mol and ΔS_{fus} = 22.0 J/(mol·K):

T = 6010 J/mol ÷ 22.0 J/(mol·K) ≈ 273 K, which is 0 °C.

Above this temperature the TΔS term outweighs ΔH and melting is favored; below it freezing is favored. The same calculation gives the temperature at which any reaction with ΔH and ΔS of the same sign changes from favored to unfavored.`,
        },
        {
          title: 'Reading the sign table with reasons',
          body: `Each row of the sign table can be explained. When ΔH is negative and ΔS is positive, both terms make ΔG negative, so the process is favored at every temperature. When both are positive, the enthalpy term opposes the process and the entropy term favors it; at high temperature, the TΔS term grows large enough to win. A good answer states which term dominates and why, rather than simply quoting the table.`,
        },
      ],
    },
    'chem-9.4': {
      intro: `A thermodynamically favored reaction is not necessarily fast. When a favored reaction does not occur at a measurable rate, it is under kinetic control.`,
      deeper: [
        {
          title: 'Thermodynamics and kinetics on one diagram',
          body: `An energy profile shows both kinds of information. The difference between the reactants and the products determines thermodynamic favorability; the height of the barrier between them, the activation energy, determines the rate. A reaction can have products far below its reactants (strongly favored) and still have a barrier so high that almost no collisions have enough energy to cross it at room temperature.`,
        },
        {
          title: 'Catalysts do not change favorability',
          body: `A catalyst lowers the activation energy, so it can make a kinetically controlled reaction proceed at a useful rate. It does not change ΔG°, because it does not change the energies of the reactants or products. A catalyst can therefore never make an unfavored reaction favored. It only helps a favored reaction reach equilibrium sooner.`,
        },
      ],
    },
    'chem-9.5': {
      intro: `The standard free energy change of a reaction determines its equilibrium constant. The equation ΔG° = −RT ln K links thermodynamics to equilibrium.`,
      deeper: [
        {
          title: 'A rule of thumb for size',
          body: `At 298 K, RT ln 10 ≈ 5.7 kJ/mol. So every 5.7 kJ/mol of ΔG° changes K by a factor of 10:

| ΔG° (kJ/mol) | K at 298 K |
| −11.4 | about 100 |
| −5.7 | about 10 |
| 0 | 1 |
| +5.7 | about 0.1 |

This shows why reactions with ΔG° of a few kilojoules have both reactants and products present at equilibrium, while those with ΔG° of tens of kilojoules lie almost completely to one side.`,
        },
        {
          title: 'Units in the calculation',
          body: `R is 8.314 J/(mol·K), so ΔG° must be in joules per mole before it is divided by RT. For ammonia synthesis at 298 K:

ln K = −ΔG°/RT = 33 000 J/mol ÷ (8.314 J/(mol·K) × 298 K) ≈ 13.3, so K = e^{13.3} ≈ 6 × 10^{5}.

Forgetting to convert kilojoules to joules gives ln K ≈ 0.013 and K ≈ 1, a very different conclusion.`,
        },
      ],
    },
    'chem-9.8': {
      intro: `An electrochemical cell separates the oxidation and reduction halves of a redox reaction so that electrons travel through an external circuit.`,
      deeper: [
        {
          title: 'Why the salt bridge is needed',
          body: `As a Zn–Cu cell runs, Zn²⁺ ions are produced in the anode compartment and Cu²⁺ ions are removed from the cathode compartment. Without a way to balance these charges, the anode solution would become positively charged and the cathode solution negatively charged, and the flow of electrons would stop almost immediately. Ions from the salt bridge move into each compartment (anions toward the anode, cations toward the cathode) to keep both solutions electrically neutral.`,
        },
        {
          title: 'Electrolysis of molten sodium chloride',
          body: `In an electrolytic cell an external power source forces an unfavored reaction to occur. When molten NaCl is electrolyzed, Na⁺ ions are reduced to sodium metal at the cathode and Cl⁻ ions are oxidized to chlorine gas at the anode:

- Cathode: [[eq: Na^+(l) + e^- -> Na(l)]]
- Anode: [[eq: 2Cl^-(l) -> Cl2(g) + 2e^-]]

The salt must be molten so its ions can move to the electrodes. (Dissolving NaCl in water also frees the ions, but then water, not Na⁺, is reduced at the cathode, and hydrogen gas forms instead of sodium.)`,
        },
      ],
    },
    'chem-9.9': {
      intro: `The standard cell potential measures the driving force of a cell reaction. It is calculated from standard reduction potentials and is directly related to ΔG°.`,
      deeper: [
        {
          title: 'Will this reaction happen?',
          body: `Standard reduction potentials predict whether a redox reaction is favored. Will copper metal react with silver ions?

- Ag⁺ + e⁻ → Ag, E° = +0.80 V (higher, so Ag⁺ is reduced)
- Cu²⁺ + 2e⁻ → Cu, E° = +0.34 V (runs as an oxidation)

E°_{cell} = 0.80 − 0.34 = +0.46 V. The positive value means the reaction Cu + 2Ag⁺ → Cu²⁺ + 2Ag is thermodynamically favored, which is why a copper wire placed in silver nitrate solution becomes coated with silver.`,
        },
        {
          title: 'Why E° is not multiplied by coefficients',
          body: `A cell potential is energy per unit of charge (1 V = 1 J/C), an intensive property like temperature. Doubling the amount of reaction doubles both the energy and the charge transferred, leaving their ratio, the voltage, unchanged. The amount of reaction shows up instead in ΔG° = −nFE°, through n, the number of moles of electrons transferred.`,
        },
      ],
    },
    'chem-9.11': {
      intro: `In electrolysis, the amount of substance produced at an electrode is proportional to the electric charge that passes through the cell. Faraday's law turns current and time into moles.`,
      deeper: [
        {
          title: 'Silver plating',
          body: `A current of 1.50 A passes through a silver nitrate solution for 10.0 minutes. What mass of silver is deposited?

1. q = It = 1.50 A × 600. s = 900. C
2. mol e⁻ = 900. C ÷ 96 485 C/mol = 9.33 × 10^{−3} mol
3. Ag⁺ + e⁻ → Ag, so mol Ag = 9.33 × 10^{−3} mol
4. mass = 9.33 × 10^{−3} mol × 107.87 g/mol ≈ 1.01 g Ag

The same charge would deposit only a third as many moles of aluminum, because each Al³⁺ needs three electrons.`,
        },
        {
          title: 'Working backward',
          body: `Faraday's law can be run in reverse to find the time or current needed. To deposit 2.00 g of copper (0.0315 mol) from Cu²⁺, you need 0.0630 mol of electrons, which is 0.0630 × 96 485 ≈ 6.08 × 10^{3} C. At 3.00 A that takes 6.08 × 10^{3} C ÷ 3.00 A ≈ 2.03 × 10^{3} s, about 34 minutes.`,
        },
      ],
    },
    'chem-9.6': {
      intro: `Whether a salt dissolves depends on the balance of enthalpy and entropy changes in several competing processes. The result can be favored even when dissolving absorbs heat.`,
      deeper: [
        {
          title: 'Lattice attractions versus hydration',
          body: `The two largest enthalpy terms in dissolving an ionic solid have opposite signs. Separating the ions from the lattice costs energy; surrounding them with water molecules (hydration) releases energy. Both grow with ion charge and shrink with ion size, as Coulomb's law predicts, so for many salts they nearly cancel. Small differences between them, combined with the entropy changes, decide whether a particular salt is soluble.`,
        },
        {
          title: 'The role of entropy',
          body: `Freeing ions from a crystal greatly increases their dispersal, which favors dissolving. But the water molecules that cluster around the ions become more ordered, which works against it, especially for small, highly charged ions. For salts like NaNO₃, the overall entropy change is positive and large enough that TΔS outweighs a positive ΔH. For salts with very small or highly charged ions, the ordering of water can make ΔS less favorable.`,
        },
      ],
    },
    'chem-9.7': {
      intro: `An unfavored reaction can be made to occur by supplying energy from outside, or by coupling it to a strongly favored reaction.`,
      deeper: [
        {
          title: 'How coupling works',
          body: `Coupling works because free energy changes add, just as enthalpy changes do in Hess's law. If reaction A (ΔG° = +14 kJ) and reaction B (ΔG° = −30.5 kJ) can be combined into one overall process through a shared intermediate, the overall ΔG° is +14 − 30.5 = −16.5 kJ, and the combined process is favored. The two reactions must actually be linked by a common species; simply running them side by side in the same container does not help.`,
        },
        {
          title: 'Light and electricity as energy sources',
          body: `Photosynthesis converts carbon dioxide and water into glucose and oxygen, a process with a large positive ΔG°. Plants drive it with energy absorbed from light. Electrolysis, recharging a battery and electroplating are driven by electrical energy from an external source. In both cases the energy supplied must be at least as large as the positive ΔG of the process being driven.`,
        },
      ],
    },
    'chem-9.10': {
      intro: `Cell potentials change as concentrations change. A cell's voltage reflects how far its reaction is from equilibrium, and it falls to zero when equilibrium is reached.`,
      deeper: [
        {
          title: 'Why a battery voltage drops as it runs',
          body: `As a galvanic cell discharges, reactants are consumed and products accumulate, so Q increases. By the Nernst equation, E = E° − (RT/nF) ln Q, increasing Q makes E smaller. When Q reaches K, the cell reaction is at equilibrium, E = 0, and no more useful work can be obtained. A "dead" battery is simply a cell whose reaction has reached equilibrium.`,
        },
        {
          title: 'A concentration cell example',
          body: `Two copper electrodes are placed in 0.010 M and 1.0 M Cu²⁺ solutions, connected by a wire and a salt bridge. E° = 0, because the half-reactions are identical. In the dilute half-cell, copper metal is oxidized to Cu²⁺, raising that concentration (anode). In the concentrated half-cell, Cu²⁺ is reduced to copper, lowering that concentration (cathode). Electrons flow through the wire from the dilute side to the concentrated side, and the cell runs until the two concentrations are equal.`,
        },
      ],
    },
  },
}
