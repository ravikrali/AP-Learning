// Popular YouTube explanations for each lesson, shown under "More ways to learn it".
// Chosen in October 2026 from YouTube search results for each CED topic: the most-viewed video
// that is on the topic, plus (when different) a video made for that AP Chemistry topic.
// Titles and channels are as published on YouTube. These are outside videos: they are not
// checked line by line like the lessons, and admins can replace them (Admin → Videos).

export type YT = [id: string, title: string, channel: string]

export const CHEM_YOUTUBE: Record<string, YT[]> = {
  'chem-0.1': [
    ['hQpQ0hxVNTg', 'Unit Conversion & Significant Figures: Crash Course Chemistry #2', 'CrashCourse'],
    ['l2yuDvwYq5g', 'Significant Figures - A Fast Review!', 'The Organic Chemistry Tutor'],
  ],
  'chem-0.2': [
    ['HRe1mire4Gc', 'Unit Conversion the Easy Way (Dimensional Analysis)', 'ketzbook'],
    ['vWovdihteqs', 'Dimensional Analysis', 'The Organic Chemistry Tutor'],
  ],
  'chem-0.3': [
    ['bagegEZBtOs', 'What are Isotopes?', 'The Organic Chemistry Tutor'],
    ['5PyVoMnRTlQ', 'Nuclide Symbols: Atomic Number, Mass Number, Ions, and Isotopes', 'Professor Dave Explains'],
  ],
  'chem-0.4': [
    ['nijb6UMvZuE', 'Naming Ionic and Molecular Compounds | How to Pass Chemistry', 'Melissa Maribel'],
    ['FXBEh7nd9KQ', 'How to Memorize The Polyatomic Ions - Formulas, Charges, Naming - Chemistry', 'The Organic Chemistry Tutor'],
  ],
  'chem-0.5': [
    ['zmdxMlb88Fs', 'How to Balance Chemical Equations in 5 Easy Steps: Balancing Equations Tutorial', 'Wayne Breslyn (Dr. B.)'],
    ['yA3TZJ2em6g', 'Introduction to Balancing Chemical Equations', 'Tyler DeWitt'],
  ],
  'chem-0.6': [
    ['kqVpPSzkTYA', 'Logarithms - The Easy Way!', 'The Organic Chemistry Tutor'],
    ['XnxBPM3XTWo', 'Using Logarithms and Natural Logarithms in Chemistry', 'Melissa Maribel'],
  ],
  'chem-1.1': [
    ['74-X94OP2XI', "Avogadro's Number, The Mole, Grams, Atoms, Molar Mass Calculations - Introduction", 'The Organic Chemistry Tutor'],
    ['wynFro1c09k', 'An Introduction to Moles and Molar Mass - AP Chem Unit 1, Topic 1a', 'Jeremy Krug (krugslist)'],
  ],
  'chem-1.2': [
    ['myolF-h1kKI', 'Mass spectrometry | Atomic structure and properties | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['bzky1T4RYIs', 'Isotopes, Atomic Mass, & Mass Spectra of Elements - AP Chem Unit 1, Topic 2', 'Jeremy Krug (krugslist)'],
  ],
  'chem-1.3': [
    ['_uqIROUX0js', 'Composition of Pure Substances - AP Chem Unit 1, Topic 3', 'Jeremy Krug (krugslist)'],
    ['rwspUu7pM40', 'Unit 1.3 - Elemental Composition of Pure Substances', 'Abigail Giordano'],
  ],
  'chem-1.4': [
    ['00RufJkBZy4', 'Composition of Mixtures - AP Chem, Unit 1, Topic 4', 'Jeremy Krug (krugslist)'],
    ['2pG9Ub5vSeE', 'Unit 1.4 - Composition of Mixtures', 'Abigail Giordano'],
  ],
  'chem-1.5': [
    ['NIwcDnFjj98', 'Electron Configuration - Basic introduction', 'The Organic Chemistry Tutor'],
    ['lvhHMbXLi-U', 'Electron Configurations - AP Chem Unit 1, Topic 5b', 'Jeremy Krug (krugslist)'],
  ],
  'chem-1.6': [
    ['UaTWrOTh4qU', 'Introduction to photoelectron spectroscopy | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['4qjsJa-dtzs', 'Photoelectron Spectroscopy - AP Chem Unit 1, Topic 6', 'Jeremy Krug (krugslist)'],
  ],
  'chem-1.7': [
    ['hePb00CqvP0', 'The Periodic Table: Atomic Radius, Ionization Energy, and Electronegativity', 'Professor Dave Explains'],
    ['gi2Y-kbrjCw', "Periodic trends and Coulomb's law | Atomic structure and properties | AP Chemistry | Khan Academy", 'Khan Academy'],
  ],
  'chem-1.8': [
    ['FPk2ziB9iX0', 'Valence Electrons and the Periodic Table', 'The Organic Chemistry Tutor'],
    ['XPnlIEk7XrU', 'Valence electrons and ionic compounds | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-2.1': [
    ['QXT4OVM4vXI', 'Atomic Hook-Ups - Types of Chemical Bonds: Crash Course Chemistry #22', 'CrashCourse'],
    ['SQk9E_Y2EWw', 'Types of Chemical Bonds - AP Chem Unit 2, Topic 1', 'Jeremy Krug (krugslist)'],
  ],
  'chem-2.2': [
    ['U43-NTF-79E', 'Bond Energy & Bond Length, Forces of Attraction & Repulsion - Chemistry', 'The Organic Chemistry Tutor'],
    ['acZoHGBwDq0', 'Unit 2.2 - Intramolecular Force and Potential Energy', 'Abigail Giordano'],
  ],
  'chem-2.3': [
    ['5vSBjS99Ozs', 'Ionic Solids', 'Bozeman Science'],
    ['zax0lYlOdiI', 'Ionic solids | Intermolecular forces and properties | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-2.4': [
    ['buRAe2IDBzQ', 'Energy, Ionic Solids, Metals, & Alloys - AP Chem Unit 2, Topics 2-4', 'Jeremy Krug (krugslist)'],
    ['uqfaGg2J1Cg', 'Unit 2.4 - Structure of Metals and Alloys', 'Abigail Giordano'],
  ],
  'chem-2.5': [
    ['cIuXl7o6mAw', 'Lewis Diagrams Made Easy: How to Draw Lewis Dot Structures', 'ketzbook'],
    ['9BZFphoY-vo', 'Drawing Lewis diagrams | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-2.6': [
    ['fYCzeFEAfjg', 'Resonance Structures/Assigning Formal Charge', 'Professor Dave Explains'],
    ['Th3ZiNN313o', 'Resonance and Formal Charge - AP Chem Unit 2, Topic 6', 'Jeremy Krug (krugslist)'],
  ],
  'chem-2.7a': [
    ['DBrq31w8vC4', 'VSEPR Theory - Basic Introduction', 'The Organic Chemistry Tutor'],
    ['r2XmaiEC0Vw', 'Molecular Geometry Made Easy: VSEPR Theory and How to Determine the Shape of a Molecule', 'ketzbook'],
  ],
  'chem-2.7b': [
    ['pdJeQUd2g_4', 'Hybridization of Atomic Orbitals - Sigma & Pi Bonds - Sp Sp2 Sp3', 'The Organic Chemistry Tutor'],
    ['pT8nrBrTOm4', 'Sigma and Pi Bonds Explained, Basic Introduction, Chemistry', 'The Organic Chemistry Tutor'],
  ],
  'chem-3.1a': [
    ['08kGgrqaZXA', 'Intermolecular Forces and Boiling Points', 'Professor Dave Explains'],
    ['a9YtU828MzM', 'Intermolecular & Interparticle Forces - London dispersion forces - AP Chem Unit 3, Topic 1A', 'Jeremy Krug (krugslist)'],
  ],
  'chem-3.1b': [
    ['XSRa9P-xJl0', 'Intermolecular Forces - Hydrogen Bonding, Dipole Dipole Interactions - Boiling Point & Solubility', 'The Organic Chemistry Tutor'],
    ['eubN8DwUh48', 'Intermolecular forces and vapor pressure | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-3.2': [
    ['4_14asNzvc0', 'Properties of Solids - AP Chem Unit 3, Topic 2', 'Jeremy Krug (krugslist)'],
    ['JETFY2LdxPQ', 'Unit 3.2 - Properties of Solids', 'Abigail Giordano'],
  ],
  'chem-3.3': [
    ['9TVOlTolKFA', 'States of Matter - Solids, Liquids, Gases & Plasma - Chemistry', 'The Organic Chemistry Tutor'],
    ['9G88-AcHVbA', 'Solids, Liquids, & Gases - AP Chem Unit 3, Topic 3', 'Jeremy Krug (krugslist)'],
  ],
  'chem-3.4': [
    ['robEY-idcLU', 'Kinetic Molecular Theory and the Ideal Gas Laws', 'Professor Dave Explains'],
    ['77xhRWWpIi4', 'Ideal Gas Law PV=nRT - AP Chem Unit 3, Topic 4B', 'Jeremy Krug (krugslist)'],
  ],
  'chem-3.5': [
    ['o3f_VJ87Df0', 'Kinetic Molecular Theory and its Postulates', 'Professor Dave Explains'],
    ['HkSXiHz9vUc', 'The kinetic molecular theory of gases | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-3.6': [
    ['UABFOI1sb7A', 'Real gases: Deviations from ideal behavior | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['BvGTzkVDcHI', 'Deviation from the Ideal Gas Law - AP Chem Unit 3, Topic 6', 'Jeremy Krug (krugslist)'],
  ],
  'chem-3.7': [
    ['L-Uhyjt8t10', 'Molarity | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['aob4zGMCVIM', 'Solutions and Mixtures - AP Chemistry Unit 3, Topic 7', 'Jeremy Krug (krugslist)'],
  ],
  'chem-3.8': [
    ['W19S_PQOqgw', 'Representations of Solutions - AP Chem Unit 3, Topic 8A', 'Jeremy Krug (krugslist)'],
    ['q8saARNBGNc', 'Unit 3.8 - Representations of Solutions', 'Abigail Giordano'],
  ],
  'chem-3.9': [
    ['mWxgxb-RHTE', 'Chromatography, Distillation, & Solubility - AP Chem Unit 3, Topics 9-10', 'Jeremy Krug (krugslist)'],
    ['u6VTcolm1hA', 'Unit 3.9 - Separation of Solutions and Mixtures', 'Abigail Giordano'],
  ],
  'chem-3.10': [
    ['ccDKr4TIWfk', 'Solubility and intermolecular forces | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['qrAhZyaQcwU', 'Unit 3.10 - Solubility', 'Abigail Giordano'],
  ],
  'chem-3.11': [
    ['B4ca-7L0HJ0', 'Unit 3.11 - Spectroscopy and the Electromagnetic Spectrum', 'Abigail Giordano'],
    ['57-QrIr74WI', 'AP Chemistry Unit 3.11 Practice Problems - Spectroscopy and Electromagnetic Spectrum', 'Christine McKenna'],
  ],
  'chem-3.12': [
    ['PYNSopwd1l4', 'How To Calculate The Energy of a Photon Given Frequency & Wavelength in nm   Chemistry', 'The Organic Chemistry Tutor'],
    ['MFPKwu5vugg', 'Wave-Particle Duality and the Photoelectric Effect', 'Professor Dave Explains'],
  ],
  'chem-3.13': [
    ['jD3_pN5gR8A', 'Spectrophotometry and the Beer-Lambert Law - AP Chem Unit 3, Topic 13', 'Jeremy Krug (krugslist)'],
    ['kjSKOGK59nc', 'Unit 3.13 - Beer-Lambert Law', 'Abigail Giordano'],
  ],
  'chem-4.1': [
    ['YE2xaMsoGFU', 'Physical and Chemical Changes', 'The Organic Chemistry Tutor'],
    ['3lzI1vO118g', 'Visually Representing Reactions / Physical vs Chemical Changes - AP Chem Unit 4, Topics 3-4', 'Jeremy Krug (krugslist)'],
  ],
  'chem-4.2': [
    ['iOCEYIbJYTk', 'How To Write Net Ionic Equations In Chemistry - A Simple Method!', 'The Organic Chemistry Tutor'],
    ['BgTpPM9BMuU', 'Molecular, complete ionic, and net ionic equations | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-4.3': [
    ['3lzI1vO118g', 'Visually Representing Reactions / Physical vs Chemical Changes - AP Chem Unit 4, Topics 3-4', 'Jeremy Krug (krugslist)'],
    ['DpWn6YOJhtE', 'Unit 4.3 - Representations of Reactions', 'Abigail Giordano'],
  ],
  'chem-4.5a': [
    ['pZHDvyv_z0c', 'Reaction Stoichiometry Made Easy - AP Chemistry Unit 4, Topic 5a', 'Jeremy Krug (krugslist)'],
    ['evPw9C7G9CI', 'AP Chemistry 4.5 - Stoichiometry', 'Nikles Chemistry'],
  ],
  'chem-4.5b': [
    ['nZOVR8EMwRU', 'Introduction to Limiting Reactant and Excess Reactant', 'Tyler DeWitt'],
    ['b7mKXr7LZ3I', 'Stoichiometry Problems - Limiting Reactant & Percent Yield - AP Chem Unit 4, Topic 5b', 'Jeremy Krug (krugslist)'],
  ],
  'chem-4.5c': [
    ['hPY7d6GUEV0', 'Gas Stoichiometry Problems', 'The Organic Chemistry Tutor'],
    ['zb6_ak50Jlw', 'Basics of Solution Stoichiometry - AP Chem Unit 4, Topic 5c', 'Jeremy Krug (krugslist)'],
  ],
  'chem-4.6': [
    ['d1XTOsnNlgg', 'Acid–base titrations | Chemical reactions | AP Chemistry | Khan Academy', 'Khan Academy Organic Chemistry'],
    ['kxdu490P4Tw', 'Introduction to Titration - AP Chemistry Unit 4, Topic 6', 'Jeremy Krug (krugslist)'],
  ],
  'chem-4.7a': [
    ['aMU1RaRulSo', 'Types of Chemical Reactions', 'Tyler DeWitt'],
    ['IIu16dy3ThI', 'Precipitation Reactions: Crash Course Chemistry #9', 'CrashCourse'],
  ],
  'chem-4.7b': [
    ['-a2ckxhfDjQ', 'How to Calculate Oxidation Numbers Introduction', 'Tyler DeWitt'],
    ['dF5lB7gRtcA', 'Oxidation and Reduction Reactions - Basic Introduction', 'The Organic Chemistry Tutor'],
  ],
  'chem-4.8': [
    ['ANi709MYnWg', 'Acid-Base Reactions in Solution: Crash Course Chemistry #8', 'CrashCourse'],
    ['eX7soWYIGv8', 'Introduction to Acid-Base Chemistry - AP Chemistry Unit 4, Topic 8', 'Jeremy Krug (krugslist)'],
  ],
  'chem-4.9': [
    ['5rtJdjas-mY', 'Introduction to Oxidation Reduction (Redox) Reactions', 'Tyler DeWitt'],
    ['fdbrhQAM9Gw', 'Half Reaction Method, Balancing Redox Reactions In Basic & Acidic Solution, Chemistry', 'The Organic Chemistry Tutor'],
  ],
  'chem-5.1': [
    ['8wIodo1HD4Y', 'Introduction to reaction rates | Kinetics | AP Chemistry | Khan Academy', 'Khan Academy Organic Chemistry'],
    ['FDV_qaFCARA', 'Reaction Rates & Introduction to Kinetics - AP Chem Unit 5, Topic 1', 'Jeremy Krug (krugslist)'],
  ],
  'chem-5.2': [
    ['wYqQCojggyM', 'Kinetics: Initial Rates and Integrated Rate Laws', 'Professor Dave Explains'],
    ['liGCU9gaLcM', 'How to Find the Rate Law and Rate Constant (k)', 'Melissa Maribel'],
  ],
  'chem-5.3': [
    ['Jln8OrpjEsA', 'Concentration Changes Over Time - AP Chem Unit 5, Topic 3', 'Jeremy Krug (krugslist)'],
    ['RLnTsf-DMl8', 'Unit 5.3 - Concentration Changes Over Time', 'Abigail Giordano'],
  ],
  'chem-5.4': [
    ['S84Llf1vqiM', 'Elementary Rate Laws - Unimolecular, Bimolecular and Termolecular Reactions - Chemical Kinetics', 'The Organic Chemistry Tutor'],
    ['vIZ0LnLo3jE', 'Elementary reactions | Kinetics | AP Chemistry | Khan Academy', 'Khan Academy Organic Chemistry'],
  ],
  'chem-5.5': [
    ['1iAxhc6EflI', 'Collision theory | Kinetics | AP Chemistry | Khan Academy', 'Khan Academy Organic Chemistry'],
    ['AGte-WD8kdU', 'How Reactions Happen: Steps, Collisions, & Energy - AP Chem Unit 5, Topics 4, 5, and 6', 'Jeremy Krug (krugslist)'],
  ],
  'chem-5.6': [
    ['fEXq_RvnYgI', 'Energy Diagrams, Catalysts, and Reaction Mechanisms', 'Professor Dave Explains'],
    ['VPXudQCgnrA', 'Unit 5.6 - Reaction Energy Profile', 'Abigail Giordano'],
  ],
  'chem-5.7': [
    ['ShzW1LoQgoc', 'Reaction mechanism and rate law | Kinetics | AP Chemistry | Khan Academy', 'Khan Academy Organic Chemistry'],
    ['0goaDsXV56w', 'Reaction Mechanisms and Rate Laws - AP Chemistry Unit 5, Topics 7-10', 'Jeremy Krug (krugslist)'],
  ],
  'chem-5.8': [
    ['B1bWIrOe0SE', 'Writing Rate Laws of Reaction Mechanisms Using The Rate Determining Step - Chemical Kinetics', 'The Organic Chemistry Tutor'],
    ['ShzW1LoQgoc', 'Reaction mechanism and rate law | Kinetics | AP Chemistry | Khan Academy', 'Khan Academy Organic Chemistry'],
  ],
  'chem-5.9': [
    ['4czm7qIbUjA', 'The pre-equilibrium approximation | Kinetics | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['Mde-rsYwVmg', 'Unit 5.9 - Pre-Equilibrium (Steady-State) Approximation', 'Abigail Giordano'],
  ],
  'chem-5.10': [
    ['l4VCiJulLKw', 'Multistep reaction energy profiles | Kinetics | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['FiOb_ShiTC4', 'Unit 5.10 - Multistep Reaction Energy Profiles', 'Abigail Giordano'],
  ],
  'chem-5.11': [
    ['5zF6kurqvk4', 'Catalysis - AP Chemistry Unit 5, Topic 11 | AP Chem Topic 5.11', 'Jeremy Krug (krugslist)'],
    ['6hcraCILoBE', 'Unit 5.11 - Catalysis', 'Abigail Giordano'],
  ],
  'chem-6.1': [
    ['JRIm_a2LDPM', 'Endothermic and Exothermic Reactions', 'The Organic Chemistry Tutor'],
    ['JPxTgtUx9sE', 'Endothermic and exothermic processes | Thermodynamics | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-6.3': [
    ['7jAPitc0bkY', 'Heat transfer and thermal equilibrium | Thermodynamics | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['3mOtTpmabmc', 'Unit 6.3 - Heat Transfer and Thermal Equilibrium', 'Abigail Giordano'],
  ],
  'chem-6.4': [
    ['yhNHJ7WdT8A', 'Heat Capacity, Specific Heat, and Calorimetry', 'Professor Dave Explains'],
    ['Xn-vRyWu7mI', 'Calorimetry, Specific Heat Capacity, and Q=MCΔT - AP Chem Unit 6, Topic 4', 'Jeremy Krug (krugslist)'],
  ],
  'chem-6.5': [
    ['oc0ypeDELb0', 'Phase Changes, Heats of Fusion and Vaporization, and Phase Diagrams', 'Professor Dave Explains'],
    ['2IFMaefCIhk', 'Phase Changes and Energy - AP Chemistry Unit 6, Topic 5', 'Jeremy Krug (krugslist)'],
  ],
  'chem-6.6': [
    ['cEzN33gfgVs', 'Enthalpy of reaction | Thermodynamics | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['LNPoyiCpLgM', 'How to Calculate Enthalpy of Reaction - AP Chem Unit 6, Topic 6a', 'Jeremy Krug (krugslist)'],
  ],
  'chem-6.7': [
    ['z3FziIDJjdk', 'Calculating ΔH Using Bond Enthalpies - AP Chem Unit 6, Topic 7', 'Jeremy Krug (krugslist)'],
    ['VxcqAIaO-cA', 'Bond enthalpies | Thermodynamics | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-6.8': [
    ['FP-VYfTYi8Y', 'Enthalpy of Formation Reaction & Heat of Combustion, Enthalpy Change Problems   Chemistry', 'The Organic Chemistry Tutor'],
    ['TNwGNHqwHxc', 'Enthalpy of formation | Thermodynamics | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-6.9': [
    ['2ixEf2zpR8E', "Hess's Law Problems & Enthalpy Change - Chemistry", 'The Organic Chemistry Tutor'],
    ['QU3zVec5I_M', "Hess's law | Thermodynamics | AP Chemistry | Khan Academy", 'Khan Academy'],
  ],
  'chem-7.1': [
    ['1GiZzCzmO5Q', 'Chemical Equilibria and Reaction Quotients', 'Professor Dave Explains'],
    ['Zmks1z6PT6U', 'What Is Equilibrium? AP Chemistry Unit 7, Topic 1 Daily Video', 'Jeremy Krug (krugslist)'],
  ],
  'chem-7.3': [
    ['1GiZzCzmO5Q', 'Chemical Equilibria and Reaction Quotients', 'Professor Dave Explains'],
    ['_lIoPOFKes0', 'Unit 7.3 - Reaction Quotient and Equilibrium Constant', 'Abigail Giordano'],
  ],
  'chem-7.4': [
    ['xfGlEXWDRZE', 'The Equilibrium Constant', 'Bozeman Science'],
    ['VkC0mQwKM1c', 'Magnitude of the Equilibrium Constant - AP Chem Unit 7, Topics 4-5', 'Jeremy Krug (krugslist)'],
  ],
  'chem-7.6': [
    ['u4adSYN8tMM', 'Manipulating Reactions and Its Effect on the Equilibrium Constant - AP Chem Unit 7, Topic 6', 'Jeremy Krug (krugslist)'],
    ['U39OqCEMjto', 'Properties of the equilibrium constant | Equilibrium | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-7.7': [
    ['DP-vWN1yXrY', 'Equilibrium Equations: Crash Course Chemistry #29', 'CrashCourse'],
    ['l81swfmUaek', 'Worked example: Calculating equilibrium concentrations from initial concentrations | Khan Academy', 'Khan Academy'],
  ],
  'chem-7.8': [
    ['z40T4AN2veo', 'Representations of Equilibrium - AP Chem Unit 7, Topic 8', 'Jeremy Krug (krugslist)'],
    ['HnVUumloTsM', 'Unit 7.8 - Representations of Equilibrium', 'Abigail Giordano'],
  ],
  'chem-7.9': [
    ['XmgRRmxS3is', "Le Chatelier's Principle", 'Professor Dave Explains'],
    ['5t0PRjJgNmc', "Le Chatelier's Principle - AP Chemistry Unit 7, Topic 9 #apchem #apchemistry #equilibriumchemistry", 'Jeremy Krug (krugslist)'],
  ],
  'chem-7.11': [
    ['WjiXbemBXkE', 'Solubility Product Constant (Ksp)', 'Professor Dave Explains'],
    ['N9a2r01ToZk', 'Introduction to solubility equilibria | Equilibrium | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-7.12': [
    ['qawipem0LwA', 'The Common Ion Effect', 'Professor Dave Explains'],
    ['fI3U9T7LigY', 'The common-ion effect | Equilibrium | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-8.1': [
    ['Xeuyc55LqiY', 'Acids, Bases, and pH', 'Bozeman Science'],
    ['NNXvokAcSuE', 'Acids and Bases, pH and pOH', 'Professor Dave Explains'],
  ],
  'chem-8.2': [
    ['OEW4-Sfyvik', 'pH, pOH, H3O+, OH-, Kw, Ka, Kb, pKa, and pKb Basic Calculations -Acids and Bases Chemistry Problems', 'The Organic Chemistry Tutor'],
    ['8soANOG1O_0', 'How to Calculate pH & pOH for Strong Acids & Bases - AP Chem Unit 8, Topic 2', 'Jeremy Krug (krugslist)'],
  ],
  'chem-8.3a': [
    ['kJTCuRSeh6g', 'pH of Weak Acids and Bases - Percent Ionization - Ka & Kb', 'The Organic Chemistry Tutor'],
    ['AjbAPEFSZvo', "Let's Solve Weak Acid Problems! - AP Chemistry Unit 8, Topic 3a", 'Jeremy Krug (krugslist)'],
  ],
  'chem-8.3b': [
    ['kJTCuRSeh6g', 'pH of Weak Acids and Bases - Percent Ionization - Ka & Kb', 'The Organic Chemistry Tutor'],
    ['3F8xA8AUfz4', "Let's Solve Weak Base Problems! - AP Chem Unit 8, Topic 3c", 'Jeremy Krug (krugslist)'],
  ],
  'chem-8.4': [
    ['C3ni6qUi8os', 'Acid-Base Reactions and pH Calculations - AP Chem Unit 8, Topic 4', 'Jeremy Krug (krugslist)'],
    ['jdmHjFp_35I', 'Acid-Base Equilibria and Buffer Solutions', 'Professor Dave Explains'],
  ],
  'chem-8.5': [
    ['d1XTOsnNlgg', 'Acid–base titrations | Chemical reactions | AP Chemistry | Khan Academy', 'Khan Academy Organic Chemistry'],
    ['lw3kDHbpOps', 'Acid-Base Titrations - What You Should Know - AP Chem Unit 8, Topic 5a', 'Jeremy Krug (krugslist)'],
  ],
  'chem-8.6': [
    ['NECIQ2Wp1m0', 'Molecular Structure of Acids and Bases - AP Chem Unit 8, Topic 6', 'Jeremy Krug (krugslist)'],
    ['IawFSr3_fW4', 'Unit 8.6 - Molecular Structure of Acids and Bases', 'Abigail Giordano'],
  ],
  'chem-8.7': [
    ['1YlXtpF-19A', 'Titration curves and acid-base indicators | Chemistry | Khan Academy', 'Khan Academy Organic Chemistry'],
    ['ZDgYWaeuwbw', 'Acid–base indicators | Acids and bases | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-8.8': [
    ['kBzPTEB21Po', 'Buffer Solutions', 'The Organic Chemistry Tutor'],
    ['H8kHwEN4SbM', 'What You Need to Know About Buffers - AP Chem Unit 8, Topics 8-10', 'Jeremy Krug (krugslist)'],
  ],
  'chem-8.9': [
    ['7QgtdYiWH50', 'Henderson–Hasselbalch equation | Acids and bases | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['EhO6RlWlTEk', 'Unit 8.9 - Henderson-Hasselbalch Equation', 'Abigail Giordano'],
  ],
  'chem-8.10': [
    ['H8kHwEN4SbM', 'What You Need to Know About Buffers - AP Chem Unit 8, Topics 8-10', 'Jeremy Krug (krugslist)'],
    ['XcSZ5jeG5mA', 'Buffer capacity | Acids and bases | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-8.11': [
    ['Z2bDnvDGQHQ', 'pH and solubility | Equilibrium | AP Chemistry | Khan Academy', 'Khan Academy'],
    ['cpo0AeUIUPA', 'pH and Solubility | AP Chem Unit 8, Topic 11 - How pH Affects the Solubility of an Ionic Compound', 'Jeremy Krug (krugslist)'],
  ],
  'chem-9.1': [
    ['8N1BxHgsoOw', 'The Laws of Thermodynamics, Entropy, and Gibbs Free Energy', 'Professor Dave Explains'],
    ['0VVLShoOjTc', 'What You Need to Know About Entropy - AP Chem Unit 9, Topic 1', 'Jeremy Krug (krugslist)'],
  ],
  'chem-9.2': [
    ['ALMENyJ69lE', 'How to Calculate ΔS Change in Entropy - AP Chem Unit 9, Topic 2', 'Jeremy Krug (krugslist)'],
    ['ObridY7EHyk', 'Absolute entropy and entropy change | Applications of thermodynamics | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-9.3': [
    ['8N1BxHgsoOw', 'The Laws of Thermodynamics, Entropy, and Gibbs Free Energy', 'Professor Dave Explains'],
    ['XsujflbbkSI', 'How to Tell If a Process Is Thermodynamically-Favored - AP Chem Unit 9, Topic 3a', 'Jeremy Krug (krugslist)'],
  ],
  'chem-9.4': [
    ['5PIpBjUNIUc', 'Kinetic Control - ΔG and the Equilibrium Constant - AP Chem Unit 9, Topics 4-5', 'Jeremy Krug (krugslist)'],
    ['0LTN4q23u4k', 'Unit 9.4 - Thermodynamic and Kinetic Control', 'Abigail Giordano'],
  ],
  'chem-9.5': [
    ['F1k8TJsVg_g', 'Free Energy and the Equilibrium Constant', 'Bozeman Science'],
    ['4ZcTEiJru84', 'Free energy and equilibrium | Applications of thermodynamics | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-9.6': [
    ['jEEqbBrJWRI', 'Free Energy of Dissolution', 'Professor Dave Explains'],
    ['lQCzDV7uAdg', 'Free Energy of Dissolution - AP Chemistry Unit 9, Topic 6 | ΔG and the Formation of Solutions', 'Jeremy Krug (krugslist)'],
  ],
  'chem-9.7': [
    ['7IqgrcBkGRU', 'Coupled Reactions', 'Bozeman Science'],
    ['NnSJsYa1IK0', 'Coupled reactions | Applications of thermodynamics | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-9.8': [
    ['7b34XYgADlM', 'Galvanic Cells (Voltaic Cells)', 'Tyler DeWitt'],
    ['patZ8zoemVo', 'Electrolytic cells | Applications of thermodynamics | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
  'chem-9.9': [
    ['LqAfREfwt1Y', 'Cell Potential & Gibbs Free Energy, Standard Reduction Potentials, Electrochemistry Problems', 'The Organic Chemistry Tutor'],
    ['trObhsu0si4', 'Electrochemistry - Cell Potential and ΔG - AP Chem Unit 9, Topic 9 - AP Chemistry Topic 9.9', 'Jeremy Krug (krugslist)'],
  ],
  'chem-9.10': [
    ['59H0LAJK0OY', 'The Nernst Equation and Nonstandard Conditions - AP Chem Unit 9, Topic 10 - AP Chemistry Topic 9.10', 'Jeremy Krug (krugslist)'],
    ['MfX9M3pYAKQ', 'How to find the cell potential under nonstandard conditions| Nernst Equation', 'Melissa Maribel'],
  ],
  'chem-9.11': [
    ['51kjxyY8UTg', "Electrolysis and Faraday's Law | AP Chem Unit 9, Topic 11 - AP Chemistry Topic 9.11", 'Jeremy Krug (krugslist)'],
    ['v5qQusbk-j0', 'Quantitative electrolysis | Applications of thermodynamics | AP Chemistry | Khan Academy', 'Khan Academy'],
  ],
}
