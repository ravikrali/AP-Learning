// Narration for chem-9.10 "Cell Potential Under Nonstandard Conditions". Every fact comes from the lesson cards,
// quick checks and flashcards in app/src/content/chem/u9.ts, plus chem/book.ts (Q rises as a cell discharges; a dead
// battery is a cell at equilibrium; the 0.010 M / 1.0 M Cu²⁺ concentration cell, identical half-reactions, runs
// until the concentrations are equal).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-9.10',
  title: 'Cell Potential Under Nonstandard Conditions',
  course: 'AP® Chemistry',
  unit: 'Unit 9 · Thermodynamics and Electrochemistry',
  unitId: 'chem-u9',
  unitTitle: 'Thermodynamics and Electrochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Cell potential under nonstandard conditions.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn how concentrations change a cell's voltage, and why a dead battery is a cell at equilibrium.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Why does a battery die?', gap: 0.5 },
      { say: 'As it runs, its reactant concentrations drop.', gap: 0.4 },
      { say: 'At the same time, its product concentrations build up.', gap: 0.4 },
      { say: 'And its voltage falls, until it reaches zero.', gap: 0.5 },
      { say: "That's a cell reaching equilibrium.", gap: 0.8 },
    ] },
    { id: 'drive', beats: [
      { say: 'Start with E naught, the standard cell potential.', cap: 'Start with E°, the standard cell potential.' },
      { say: 'It applies at standard conditions: all concentrations one molar, and one atmosphere.', cap: 'It applies at standard conditions: all 1 M, 1 atm.', gap: 0.4 },
      { say: 'That means Q equals one.', cap: 'That means Q = 1.', gap: 0.5 },
      { say: "Think of the voltage as the cell's drive toward equilibrium.", gap: 0.5 },
      { say: 'Farther from equilibrium than standard, and the size of the voltage increases.', gap: 0.4 },
      { say: 'Closer to equilibrium, and it decreases.', gap: 0.4 },
      { say: 'At equilibrium, Q equals K, and E equals zero.', cap: 'At equilibrium, Q = K, and E = 0.', gap: 0.4 },
      { say: "That's a dead battery.", gap: 0.8 },
    ] },
    { id: 'nernst', beats: [
      { say: 'The Nernst equation puts this into one line.' },
      { say: 'E equals E naught, minus R T over n F, times the natural log of Q.', cap: 'E = E° − (RT/nF) ln Q', gap: 0.5 },
      { say: 'Use it qualitatively. Just watch the sign of the log.', gap: 0.5 },
      { say: "If Q is less than one, there's more reactant and less product. The log is negative, so E is greater than E naught.", cap: 'If Q < 1 (more reactant, less product), ln Q < 0, so E > E°.', gap: 0.5 },
      { say: "If Q is greater than one, there's more product. The log is positive, so E is less than E naught.", cap: 'If Q > 1 (more product), ln Q > 0, so E < E°.', gap: 0.6 },
      { say: 'Take zinc plus copper two plus, giving zinc two plus plus copper.', cap: 'Take Zn + Cu²⁺ → Zn²⁺ + Cu.', gap: 0.4 },
      { say: 'Here, Q equals the zinc ion concentration over the copper ion concentration.', cap: 'Here, Q = [Zn²⁺]/[Cu²⁺].', gap: 0.5 },
      { say: 'Raise the copper ion concentration, or lower the zinc ion concentration, and Q gets smaller.', cap: 'Raise [Cu²⁺] or lower [Zn²⁺], and Q gets smaller.', gap: 0.4 },
      { say: 'A smaller Q means a higher voltage.', gap: 0.8 },
    ] },
    { id: 'conc', beats: [
      { say: 'Now a special case: the concentration cell.' },
      { say: 'Both half-cells use the same metal and the same ion, but at different concentrations.', gap: 0.4 },
      { say: 'For example, copper in zero point zero one oh molar copper two plus, and copper in one point oh molar copper two plus.', cap: 'For example, Cu in 0.010 M Cu²⁺, and Cu in 1.0 M Cu²⁺.', gap: 0.5 },
      { say: 'E naught is zero, because the half-reactions are identical. But the cell still produces a voltage.', cap: 'E° = 0, because the half-reactions are identical. But the cell still produces a voltage.', gap: 0.4 },
      { say: 'The system wants to equalize the concentrations.', gap: 0.5 },
      { say: "The dilute side oxidizes copper, making more ions. That's the anode.", gap: 0.4 },
      { say: "The concentrated side reduces copper ions, using them up. That's the cathode.", gap: 0.4 },
      { say: 'Electrons flow through the wire, from the dilute side to the concentrated side.', gap: 0.4 },
      { say: 'They keep flowing until the concentrations are equal, and E equals zero.', cap: 'They keep flowing until the concentrations are equal, and E = 0.', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now the trap.' },
      { say: "It's tempting to reason with Le Chatelier's principle here.", cap: "It's tempting to reason with Le Châtelier's principle here.", gap: 0.4 },
      { say: "But the course framework says equilibrium arguments like that don't apply to a working electrochemical cell.", gap: 0.4 },
      { say: 'A working cell is not at equilibrium.', gap: 0.5 },
      { say: 'So reason with Q versus K, and the Nernst equation, instead.', cap: 'So reason with Q vs. K, and the Nernst equation, instead.', gap: 0.4 },
      { say: 'Compare Q with one to place E above or below E naught, and Q with K to know when E reaches zero.', cap: 'Compare Q with 1 to place E above or below E°, and Q with K to know when E reaches 0.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Zinc plus copper two plus gives zinc two plus plus copper, with an E naught of one point one oh volts.', cap: 'Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), E° = 1.10 V', gap: 0.3 },
      { say: 'The zinc ion concentration is zero point one oh molar, and the copper ion concentration is one point oh molar.', cap: '[Zn²⁺] = 0.10 M and [Cu²⁺] = 1.0 M.', gap: 0.3 },
      { say: 'Is the cell potential greater than one point one oh volts, exactly one point one oh, less than one point one oh, or zero?', cap: 'Is the cell potential greater than 1.10 V, exactly 1.10 V, less than 1.10 V, or 0 V?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is: greater than one point one oh volts.', cap: 'The answer is: greater than 1.10 V.', gap: 0.5 },
      { say: 'Q equals zero point one oh over one point oh, which is zero point one oh.', cap: 'Q = 0.10/1.0 = 0.10', gap: 0.4 },
      { say: "That's less than one, so the cell is farther from equilibrium than standard.", gap: 0.4 },
      { say: 'So E is greater than one point one oh volts.', cap: 'So E > 1.10 V.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Q equals one gives E naught. Q less than one raises E, Q greater than one lowers it, and at Q equals K, E is zero.', cap: 'Q = 1 → E = E°. Q < 1 → E > E°. Q > 1 → E < E°. Q = K → E = 0.', gap: 0.5 },
      { say: 'In a concentration cell, the dilute side is the anode, and electrons flow toward the concentrated side.', gap: 0.5 },
      { say: "For working cells, use Q, K and Nernst reasoning, not Le Chatelier.", cap: 'For working cells, use Q, K and Nernst reasoning, not Le Châtelier.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
