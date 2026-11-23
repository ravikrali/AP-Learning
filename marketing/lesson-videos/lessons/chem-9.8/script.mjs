// Narration for chem-9.8 "Galvanic & Electrolytic Cells". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u9.ts plus the lesson's book.ts prose: a battery forces a redox reaction's
// electrons through a wire (galvanic / voltaic cell); anode = oxidation, loses mass (Zn -> Zn2+); cathode =
// reduction, gains mass (Cu2+ -> Cu); electrons flow anode -> cathode in the wire; voltmeter = cell potential;
// salt bridge keeps each half-cell neutral (anions -> anode, cations -> cathode), carries ions not electrons, and
// without it the flow stops almost at once; "An Ox, Red Cat" for every cell; galvanic favored / produces energy,
// electrolytic unfavored / needs a power source (electroplating, charging a battery, molten NaCl); molten NaCl
// half-reactions; the Zn-mass try; the three summary points. The card's "+/- labels not tested" aside is left out.
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-9.8',
  title: 'Galvanic & Electrolytic Cells',
  course: 'AP® Chemistry',
  unit: 'Unit 9 · Thermodynamics and Electrochemistry',
  unitId: 'chem-u9',
  unitTitle: 'Thermodynamics and Electrochemistry',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Galvanic and Electrolytic Cells.', cap: 'Galvanic & Electrolytic Cells.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the parts of a galvanic cell, which way electrons and ions move, a quick memory trick, and how electrolytic cells are different.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'A battery is a redox reaction with a twist.', gap: 0.4 },
      { say: 'Oxidation happens in one place, and reduction happens in another.', gap: 0.4 },
      { say: 'So the electrons are forced to take the long way, through a wire.', gap: 0.4 },
      { say: 'On the way, they can do useful work, like powering your phone.', gap: 0.5 },
      { say: 'A device like this is called a galvanic cell, also known as a voltaic cell.', gap: 0.4 },
      { say: "Let's take one apart.", gap: 0.8 },
    ] },
    { id: 'parts', beats: [
      { say: 'Here is a classic galvanic cell, with zinc on one side and copper on the other.', cap: 'Here is a classic galvanic cell, with Zn on one side and Cu on the other.', gap: 0.4 },
      { say: 'Each metal sits in a solution of its own ions.', gap: 0.5 },
      { say: 'The anode is where oxidation happens. Electrons are released there.', gap: 0.4 },
      { say: 'Here, zinc atoms lose two electrons and become zinc two plus ions.', cap: 'Here, Zn → Zn²⁺ + 2e⁻.', gap: 0.4 },
      { say: 'The ions go into the solution, so the anode often loses mass.', gap: 0.5 },
      { say: 'The cathode is where reduction happens. Electrons are used there.', gap: 0.4 },
      { say: 'Copper two plus ions pick up two electrons and plate out as copper metal.', cap: 'Cu²⁺ + 2e⁻ → Cu: copper metal plates out.', gap: 0.4 },
      { say: 'So the cathode often gains mass.', gap: 0.5 },
      { say: 'In the wire, electrons flow from the anode to the cathode.', gap: 0.4 },
      { say: 'And a voltmeter in the circuit measures the cell potential.', gap: 0.8 },
    ] },
    { id: 'bridge', beats: [
      { say: 'Now, imagine this cell without its salt bridge.', gap: 0.4 },
      { say: 'As it runs, zinc two plus ions are produced in the anode compartment.', cap: 'As it runs, Zn²⁺ ions are produced in the anode compartment.', gap: 0.4 },
      { say: 'And copper two plus ions are removed from the cathode compartment.', cap: 'And Cu²⁺ ions are removed from the cathode compartment.', gap: 0.4 },
      { say: 'With nothing to balance these charges, the anode solution becomes positive, the cathode solution negative, and the electron flow stops almost immediately.', gap: 0.5 },
      { say: "That's why the cell needs a salt bridge.", gap: 0.4 },
      { say: 'It lets ions flow to keep each half-cell electrically neutral.', gap: 0.4 },
      { say: 'Anions move toward the anode. Cations move toward the cathode.', gap: 0.5 },
      { say: 'Careful. The salt bridge does not carry electrons.', gap: 0.4 },
      { say: 'Electrons travel through the wire. The salt bridge moves ions.', gap: 0.8 },
    ] },
    { id: 'redcat', beats: [
      { say: "Here's a quick way to remember it all.", gap: 0.4 },
      { say: 'An Ox, Red Cat.', gap: 0.5 },
      { say: 'Anode, oxidation. Reduction, cathode.', cap: 'ANode = OXidation. REDuction = CAThode.', gap: 0.5 },
      { say: 'And electrons flow alphabetically, from A to C. Anode to cathode.', cap: 'And electrons flow alphabetically, from A to C: anode → cathode.', gap: 0.5 },
      { say: 'This is true for every electrochemical cell, galvanic or electrolytic.', gap: 0.8 },
    ] },
    { id: 'compare', beats: [
      { say: 'So what makes a cell electrolytic?', gap: 0.4 },
      { say: 'A galvanic cell runs a thermodynamically favored reaction.', gap: 0.4 },
      { say: 'It produces electrical energy. A battery discharging is galvanic.', gap: 0.5 },
      { say: 'An electrolytic cell runs a thermodynamically unfavored reaction.', gap: 0.4 },
      { say: 'So it requires an external power source.', gap: 0.4 },
      { say: 'Electroplating is electrolytic. So is charging a battery.', gap: 0.4 },
      { say: 'When you recharge a phone, outside electrical energy drives the unfavored reverse reaction.', gap: 0.5 },
      { say: 'In both kinds of cell, oxidation is still at the anode, and reduction is still at the cathode.', gap: 0.8 },
    ] },
    { id: 'molten', beats: [
      { say: 'A classic electrolytic cell is the electrolysis of molten sodium chloride.', cap: 'A classic electrolytic cell is the electrolysis of molten NaCl.', gap: 0.4 },
      { say: 'The power source forces an unfavored reaction to occur.', gap: 0.4 },
      { say: 'At the cathode, sodium ions are reduced to sodium metal.', cap: 'At the cathode, Na⁺ + e⁻ → Na: sodium ions are reduced to sodium metal.', gap: 0.4 },
      { say: 'At the anode, chloride ions are oxidized to chlorine gas.', cap: 'At the anode, 2Cl⁻ → Cl₂ + 2e⁻: chloride ions are oxidized to chlorine gas.', gap: 0.5 },
      { say: 'Oxidation at the anode, reduction at the cathode. An Ox, Red Cat still works.', gap: 0.4 },
      { say: 'And the salt must be molten, so its ions can move to the electrodes.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'In a zinc copper galvanic cell, what happens to the mass of the zinc electrode over time?', cap: 'In a Zn/Cu galvanic cell, what happens to the mass of the Zn electrode over time?', gap: 0.3 },
      { say: 'A, it increases. B, it decreases. C, it stays the same. D, it first increases and then decreases.', cap: 'A) It increases B) It decreases C) It stays the same D) It first increases and then decreases', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B.', gap: 0.4 },
      { say: 'Zinc is the anode. Zinc metal is oxidized to zinc two plus ions, releasing two electrons.', cap: 'Zn is the anode: Zn(s) → Zn²⁺(aq) + 2e⁻.', gap: 0.4 },
      { say: "The zinc atoms dissolve as ions, so the electrode's mass decreases.", gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Anode is oxidation, cathode is reduction, and electrons flow from anode to cathode through the wire.', gap: 0.5 },
      { say: 'In the salt bridge, anions move to the anode, and cations move to the cathode.', gap: 0.5 },
      { say: 'Galvanic cells are favored and produce energy. Electrolytic cells are unfavored and need energy.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
