// Narration for chem-4.5c "Stoichiometry with Gases & Solutions". Every fact comes from the lesson
// cards, quick checks and flashcards in app/src/content/chem/u4.ts (the 298 K volume and the
// "molarity in both directions" example are from book.ts). One entry per sentence: the voice reads
// `say`; captions show `cap` (or `say`). `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-4.5c',
  title: 'Stoichiometry with Gases & Solutions',
  course: 'AP® Chemistry',
  unit: 'Unit 4 · Chemical Reactions',
  unitId: 'chem-u4',
  unitTitle: 'Chemical Reactions',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Stoichiometry with gases and solutions.', cap: 'Stoichiometry with Gases & Solutions.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn three ways to get to moles, and how to use them with gas volumes and solution volumes.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Real lab problems rarely hand you grams.', gap: 0.4 },
      { say: 'Instead, they give you liters of gas, or milliliters of solution.', gap: 0.5 },
      { say: 'Good news: moles are still the hub.', gap: 0.4 },
      { say: 'You just have more ways to get to them.', gap: 0.5 },
      { say: 'A mass, a gas volume, and a solution volume can each be converted to moles.', gap: 0.4 },
      { say: 'And moles connect one substance to another through the balanced equation.', gap: 0.9 },
    ] },
    { id: 'doors', beats: [
      { say: 'Think of moles as a room with three doors.', gap: 0.4 },
      { say: 'Door one: mass. Moles equal the mass divided by the molar mass.', cap: 'Door one: mass. Moles = m ÷ M.', gap: 0.5 },
      { say: 'Door two: a gas. If you know its pressure, volume and temperature, moles equal P V divided by R T.', cap: 'Door two: a gas. If you know its pressure, volume and temperature, moles = PV ÷ RT.', gap: 0.5 },
      { say: 'Door three: a solution. Moles equal molarity times liters.', cap: 'Door three: a solution. Moles = molarity × liters.', gap: 0.6 },
      { say: 'Here is the plan for every problem.', gap: 0.3 },
      { say: 'Get to moles through one door, use the mole ratio, then leave through whichever door the question asks for.', gap: 0.5 },
      { say: 'The mole ratio sits in the middle, every time.', gap: 0.9 },
    ] },
    { id: 'gas', beats: [
      { say: "Let's go from a solid to a gas.", gap: 0.4 },
      { say: 'Heating calcium carbonate gives calcium oxide and carbon dioxide gas.', cap: 'Heating CaCO₃ gives CaO and CO₂ gas.', gap: 0.4 },
      { say: 'What volume of carbon dioxide, at S T P, comes from heating twenty-five point zero grams of calcium carbonate?', cap: 'What volume of CO₂, at STP, comes from heating 25.0 g of CaCO₃?', gap: 0.6 },
      { say: 'In through the mass door: twenty-five point zero grams, divided by one hundred point zero nine grams per mole, is zero point two five zero moles.', cap: 'In through the mass door: 25.0 g ÷ 100.09 g/mol = 0.250 mol CaCO₃.', gap: 0.5 },
      { say: 'The mole ratio is one to one, so we get zero point two five zero moles of carbon dioxide.', cap: 'The mole ratio is 1 : 1, so we get 0.250 mol CO₂.', gap: 0.5 },
      { say: 'Out through the gas door. At S T P, one mole of gas takes up twenty-two point four liters.', cap: 'Out through the gas door. At STP, 1 mol of gas takes up 22.4 L.', gap: 0.4 },
      { say: 'Zero point two five zero moles, times twenty-two point four liters per mole, is five point six zero liters of carbon dioxide.', cap: '0.250 mol × 22.4 L/mol = 5.60 L CO₂.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, watch out.', gap: 0.4 },
      { say: 'Twenty-two point four liters per mole works only at S T P.', cap: '22.4 L/mol works only at STP.', gap: 0.5 },
      { say: 'At any other conditions, use P V equals n R T. Solved for volume, V equals n R T over P.', cap: 'At any other conditions, use PV = nRT. Solved for volume, V = nRT/P.', gap: 0.5 },
      { say: 'Take the same zero point two five zero moles of carbon dioxide, at one point zero zero atmosphere and two hundred ninety-eight kelvin.', cap: 'Take the same 0.250 mol CO₂, at 1.00 atm and 298 K.', gap: 0.4 },
      { say: 'V equals zero point two five zero, times zero point zero eight two zero six, times two hundred ninety-eight, divided by one point zero zero. That is about six point one one liters.', cap: 'V = 0.250 × 0.08206 × 298 ÷ 1.00 ≈ 6.11 L.', gap: 0.5 },
      { say: 'That is more than five point six zero liters, because the gas is warmer.', cap: 'That is more than 5.60 L, because the gas is warmer.', gap: 0.5 },
      { say: 'So check the conditions before you reach for twenty-two point four.', cap: 'So check the conditions before you reach for 22.4.', gap: 0.9 },
    ] },
    { id: 'solution', beats: [
      { say: 'Next, a solution that makes a solid.', gap: 0.4 },
      { say: 'Fifty point zero milliliters of zero point two zero zero molar silver nitrate reacts with excess sodium chloride. What mass of silver chloride precipitates?', cap: '50.0 mL of 0.200 M AgNO₃ reacts with excess NaCl. What mass of AgCl precipitates?', gap: 0.6 },
      { say: 'In through the solution door. Fifty point zero milliliters is zero point zero five zero zero liters.', cap: 'In through the solution door. 50.0 mL is 0.0500 L.', gap: 0.4 },
      { say: 'Moles of silver ion equal zero point two zero zero molar, times zero point zero five zero zero liters. That is zero point zero one zero zero moles.', cap: 'mol Ag⁺ = 0.200 M × 0.0500 L = 0.0100 mol.', gap: 0.5 },
      { say: 'Silver ion and chloride ion combine one to one, so we make zero point zero one zero zero moles of silver chloride.', cap: 'Ag⁺ and Cl⁻ combine 1 : 1, so we make 0.0100 mol AgCl.', gap: 0.5 },
      { say: 'Out through the mass door: zero point zero one zero zero moles, times one hundred forty-three point three two grams per mole, is one point four three grams of silver chloride.', cap: 'Out through the mass door: 0.0100 mol × 143.32 g/mol = 1.43 g AgCl.', gap: 0.9 },
    ] },
    { id: 'reverse', beats: [
      { say: 'Molarity works in both directions.', gap: 0.4 },
      { say: 'To find the volume of solution you need, divide moles by molarity.', gap: 0.5 },
      { say: 'Say you want to precipitate all the silver ion from zero point zero one zero zero moles of silver nitrate, using zero point two five zero molar sodium chloride.', cap: 'Say you want to precipitate all the Ag⁺ from 0.0100 mol AgNO₃, using 0.250 M NaCl.', gap: 0.4 },
      { say: 'You need zero point zero one zero zero moles of chloride ion.', cap: 'You need 0.0100 mol Cl⁻.', gap: 0.4 },
      { say: 'Volume equals zero point zero one zero zero moles, divided by zero point two five zero moles per liter. That is zero point zero four zero zero liters, or forty point zero milliliters.', cap: 'V = 0.0100 mol ÷ 0.250 mol/L = 0.0400 L, or 40.0 mL.', gap: 0.5 },
      { say: 'With small volumes, here is a handy shortcut: millimoles equal molarity times milliliters.', cap: 'With small volumes, here is a handy shortcut: mmol = M × mL.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Zinc reacts with hydrochloric acid. Zinc, plus two H C L, gives zinc chloride plus hydrogen gas.', cap: 'Zinc reacts with hydrochloric acid: Zn + 2HCl → ZnCl₂ + H₂.', gap: 0.4 },
      { say: 'How many moles of hydrogen gas form from one hundred milliliters of one point zero zero molar H C L, with excess zinc?', cap: 'How many moles of H₂ form from 100. mL of 1.00 M HCl, with excess Zn?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is zero point zero five zero zero moles of hydrogen gas.', cap: 'The answer is 0.0500 mol H₂.', gap: 0.4 },
      { say: 'Moles of H C L equal one point zero zero molar, times zero point one zero zero liters. That is zero point one zero zero moles.', cap: 'mol HCl = 1.00 M × 0.100 L = 0.100 mol.', gap: 0.4 },
      { say: 'The mole ratio of hydrogen to H C L is one to two. So divide by two: zero point zero five zero zero moles.', cap: 'The mole ratio H₂ : HCl is 1 : 2. So divide by two: 0.0500 mol.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Get moles from mass divided by molar mass, from P V over R T, or from molarity times liters.', cap: 'Get moles from mass ÷ molar mass, from PV/RT, or from molarity × liters.', gap: 0.5 },
      { say: 'Put the mole ratio in the middle, every time.', gap: 0.5 },
      { say: 'And at S T P, one mole of gas is twenty-two point four liters. Otherwise, use P V equals n R T.', cap: 'And at STP, 1 mol of gas is 22.4 L. Otherwise, use PV = nRT.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
