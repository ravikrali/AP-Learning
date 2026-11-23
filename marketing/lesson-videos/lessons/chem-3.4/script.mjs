// Narration for chem-3.4 "The Ideal Gas Law". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u3.ts (the partial pressure wording is the glossary's).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`). `gap` = seconds of
// silence after the sentence.
export default {
  id: 'chem-3.4',
  title: 'The Ideal Gas Law',
  course: 'AP® Chemistry',
  unit: 'Unit 3 · Properties of Substances and Mixtures',
  unitId: 'chem-u3',
  unitTitle: 'Properties of Substances and Mixtures',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'The ideal gas law.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn one equation, how to use it, how the gas variables change together, and how to handle gas mixtures.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'A car airbag inflates in about thirty milliseconds.', cap: 'A car airbag inflates in about 30 milliseconds.', gap: 0.5 },
      { say: 'So how much gas-producing chemical goes inside?', gap: 0.4 },
      { say: 'Engineers calculate it exactly, using one equation.', gap: 0.4 },
      { say: 'P V equals N R T.', cap: 'PV = nRT.', gap: 0.8 },
    ] },
    { id: 'equation', beats: [
      { say: "Here's what each letter means.", gap: 0.4 },
      { say: 'P is pressure, in atmospheres.', cap: 'P is pressure, in atm.', gap: 0.3 },
      { say: 'V is volume, in liters.', cap: 'V is volume, in L.', gap: 0.3 },
      { say: 'N is the number of moles.', cap: 'n is the number of moles.', gap: 0.3 },
      { say: 'T is the temperature, and it must be in kelvin. Kelvin equals degrees Celsius plus two seventy-three point one five.', cap: 'T is the temperature, and it must be in kelvin. K = °C + 273.15.', gap: 0.5 },
      { say: 'And R is the gas constant: zero point zero eight two zero six liter atmospheres per mole kelvin.', cap: 'And R is the gas constant: 0.08206 L·atm/(mol·K).', gap: 0.9 },
    ] },
    { id: 'stp', beats: [
      { say: 'Good news: you do not have to memorize R.', gap: 0.4 },
      { say: 'Both R values, zero point zero eight two zero six, and eight point three one four joules per mole kelvin, are on your equation sheet.', cap: 'Both R values, 0.08206 L·atm/(mol·K) and 8.314 J/(mol·K), are on your equation sheet.', gap: 0.5 },
      { say: 'So is S T P, and twenty-two point four liters per mole.', cap: 'So is STP, and 22.4 L/mol.', gap: 0.5 },
      { say: 'S T P means two seventy-three point one five kelvin, and one point zero atmospheres.', cap: 'STP means 273.15 K and 1.0 atm.', gap: 0.4 },
      { say: 'At S T P, one mole of an ideal gas occupies twenty-two point four liters.', cap: 'At STP, one mole of an ideal gas occupies 22.4 L.', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: "Let's use it.", gap: 0.4 },
      { say: 'Two point zero zero moles of gas are in a ten point zero liter container at twenty-five degrees Celsius. What is the pressure?', cap: '2.00 mol of gas is in a 10.0 L container at 25 °C. What is the pressure?', gap: 0.6 },
      { say: 'Step one: convert the temperature. Twenty-five plus two seventy-three is two ninety-eight kelvin.', cap: 'Step 1: convert the temperature. 25 + 273 = 298 K.', gap: 0.5 },
      { say: 'Step two: solve for P. P equals N R T over V.', cap: 'Step 2: solve for P. P = nRT/V.', gap: 0.4 },
      { say: 'That is two point zero zero, times zero point zero eight two zero six, times two ninety-eight, all divided by ten point zero.', cap: 'That is (2.00)(0.08206)(298) ÷ 10.0.', gap: 0.5 },
      { say: 'The pressure is four point eight nine atmospheres.', cap: 'The pressure is 4.89 atm.', gap: 0.9 },
    ] },
    { id: 'relations', beats: [
      { say: 'Next: how the variables change together, when you hold the others constant.', gap: 0.5 },
      { say: 'Pressure and volume are inverse. When pressure goes up, volume goes down.', gap: 0.4 },
      { say: 'So the graph is a decreasing curve, not a straight line.', gap: 0.5 },
      { say: 'Volume and kelvin temperature are direct. The graph is a straight line through zero kelvin.', gap: 0.5 },
      { say: 'Pressure and kelvin temperature are direct too. Double the kelvin temperature at constant volume and moles, and the pressure doubles.', gap: 0.5 },
      { say: 'And volume and moles are direct.', gap: 0.5 },
      { say: 'For before and after problems, use the combined gas law: P one V one over T one equals P two V two over T two.', cap: 'For "before and after" problems, use the combined gas law: P₁V₁/T₁ = P₂V₂/T₂.', gap: 0.9 },
    ] },
    { id: 'dalton', beats: [
      { say: 'What about a mixture of gases?', gap: 0.4 },
      { say: "Dalton's law: each gas in a mixture acts as if it were alone.", gap: 0.4 },
      { say: 'Its partial pressure is the pressure it would have if it were alone.', gap: 0.4 },
      { say: 'The partial pressures add up to the total pressure.', gap: 0.5 },
      { say: "And each gas's partial pressure is the total pressure times its mole fraction: the moles of that gas divided by the total moles.", cap: "And each gas's partial pressure is P total × its mole fraction: moles of that gas ÷ total moles.", gap: 0.5 },
      { say: 'Example: three moles of nitrogen and one mole of oxygen, at two point zero atmospheres total.', cap: 'Example: 3 mol N₂ and 1 mol O₂, at 2.0 atm total.', gap: 0.4 },
      { say: 'The mole fraction of oxygen is one fourth, so its partial pressure is zero point five zero atmospheres.', cap: 'The mole fraction of O₂ is 1/4, so its partial pressure is 0.50 atm.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: 'Here is the number one gas law mistake: using degrees Celsius.', cap: 'Here is the #1 gas law mistake: using °C.', gap: 0.5 },
      { say: 'If T is in the denominator and you plug in zero degrees Celsius, you divide by zero!', cap: 'If T is in the denominator and you plug in 0 °C, you divide by zero!', gap: 0.5 },
      { say: 'So convert to kelvin before doing anything.', gap: 0.6 },
      { say: 'Bonus trick: molar mass from density.', gap: 0.3 },
      { say: 'Molar mass equals d R T over P.', cap: 'M = dRT/P.', gap: 0.4 },
      { say: 'It comes from P V equals N R T, with N equal to mass over molar mass.', cap: 'It comes from PV = nRT, with n = m/M.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'What volume does zero point five zero zero moles of an ideal gas occupy at S T P?', cap: 'What volume does 0.500 mol of an ideal gas occupy at STP?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is eleven point two liters.', cap: 'The answer is 11.2 L.', gap: 0.4 },
      { say: 'At S T P, one mole of gas occupies twenty-two point four liters.', cap: 'At STP, 1 mol of gas occupies 22.4 L.', gap: 0.4 },
      { say: 'So zero point five zero zero moles, times twenty-two point four liters per mole, is eleven point two liters.', cap: 'So 0.500 mol × 22.4 L/mol = 11.2 L.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'P V equals N R T, with T in kelvin, and R equal to zero point zero eight two zero six liter atmospheres per mole kelvin.', cap: 'PV = nRT, with T in kelvin and R = 0.08206 L·atm/(mol·K).', gap: 0.5 },
      { say: 'The total pressure is the sum of the partial pressures. And each partial pressure is its mole fraction times the total.', cap: 'P total = the sum of the partial pressures. Each partial pressure = mole fraction × P total.', gap: 0.5 },
      { say: 'At S T P, one mole of gas occupies twenty-two point four liters.', cap: 'At STP, 1 mol of gas = 22.4 L.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
