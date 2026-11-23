// Narration for chem-0.2 "Dimensional Analysis: Units Are Your GPS". Every fact comes from the lesson
// cards in app/src/content/chem/u0.ts. One entry per sentence: the voice reads `say`; captions show
// `cap` (or `say` when there is no `cap`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-0.2',
  title: 'Dimensional Analysis: Units Are Your GPS',
  course: 'AP® Chemistry',
  unit: 'Unit 0 · Chemistry Toolkit',
  unitId: 'chem-u0',
  unitTitle: 'Chemistry Toolkit',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Dimensional analysis: units are your GPS.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn how conversion factors work, which metric prefixes to know, and how to handle squared and cubed units.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "Here's a secret great chemistry students know.", gap: 0.5 },
      { say: 'You can solve most AP calculation problems by just following the units.', cap: 'You can solve most AP® calculation problems by just following the units.', gap: 0.6 },
      { say: 'If your units cancel to what the question asks for, you are almost certainly on the right track.', gap: 0.9 },
    ] },
    { id: 'factor', beats: [
      { say: 'Conversion factors are fancy ones.', cap: 'Conversion factors are fancy 1s.', gap: 0.5 },
      { say: 'Because one kilogram equals one thousand grams, the fraction one thousand grams over one kilogram equals one.', cap: 'Because 1 kg = 1000 g, the fraction (1000 g)/(1 kg) equals 1.', gap: 0.6 },
      { say: 'Multiplying by it changes the units, but not the amount.', gap: 0.6 },
      { say: 'Set up each factor so the unit you do not want is on the bottom. Then it cancels.', gap: 0.6 },
      { say: 'Two point five kilograms times one thousand grams over one kilogram is twenty five hundred grams.', cap: '2.5 kg × (1000 g / 1 kg) = 2500 g', gap: 0.9 },
    ] },
    { id: 'prefix', beats: [
      { say: 'Next, the metric prefixes you must know.', gap: 0.5 },
      { say: 'Giga is ten to the ninth. Mega is ten to the sixth. Kilo is ten to the third.', cap: 'Giga (G) is 10⁹. Mega (M) is 10⁶. Kilo (k) is 10³.', gap: 0.5 },
      { say: 'Centi is ten to the negative two. Milli is ten to the negative three.', cap: 'Centi (c) is 10⁻². Milli (m) is 10⁻³.', gap: 0.5 },
      { say: 'Micro is ten to the negative six. Nano is ten to the negative nine. Pico is ten to the negative twelve.', cap: 'Micro (μ) is 10⁻⁶. Nano (n) is 10⁻⁹. Pico (p) is 10⁻¹².', gap: 0.6 },
      { say: 'These are on the AP Equations and Constants sheet.', cap: 'These are on the AP® Equations and Constants sheet.', gap: 0.5 },
      { say: 'Also, one milliliter equals one cubic centimeter, and one liter equals one thousand milliliters.', cap: 'Also: 1 mL = 1 cm³, and 1 L = 1000 mL.', gap: 0.9 },
    ] },
    { id: 'chain', beats: [
      { say: 'Now, chain conversions.', gap: 0.5 },
      { say: 'Convert forty five minutes into seconds, then into hours.', cap: 'Convert 45 minutes into seconds, then into hours.', gap: 0.6 },
      { say: 'Forty five minutes times sixty seconds over one minute is twenty seven hundred seconds.', cap: '45 min × (60 s / 1 min) = 2700 s', gap: 0.5 },
      { say: 'Minutes are on top in forty five minutes, and on the bottom of the factor, so they cancel.', cap: 'Minutes are on top in "45 min" and on the bottom of the factor, so they cancel.', gap: 0.6 },
      { say: 'Now forty five minutes times one hour over sixty minutes is zero point seven five hours.', cap: '45 min × (1 h / 60 min) = 0.75 h', gap: 0.9 },
    ] },
    { id: 'cube', beats: [
      { say: 'Squared units are the sneaky one.', cap: 'Squared units: the sneaky one.', gap: 0.5 },
      { say: 'How many cubic centimeters are in one cubic meter?', cap: 'How many cm³ are in 1 m³?', gap: 0.6 },
      { say: 'One meter is one hundred centimeters, but the unit is cubed, so the factor gets cubed too.', cap: '1 m = 100 cm, but the unit is cubed, so the factor gets cubed too.', gap: 0.6 },
      { say: 'One cubic meter times one hundred centimeters over one meter, cubed, is one hundred cubed cubic centimeters.', cap: '1 m³ × (100 cm / 1 m)³ = 100³ cm³', gap: 0.6 },
      { say: 'That is one million cubic centimeters, or one times ten to the sixth.', cap: 'That is 1,000,000 cm³, or 1 × 10⁶ cm³.', gap: 0.6 },
      { say: 'Which is also one thousand liters.', cap: 'Which is also 1000 L.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: 'Here is the habit that saves points.', gap: 0.5 },
      { say: 'Write the units every single time.', gap: 0.5 },
      { say: 'It feels slow, but writing units on every number is the number one way to catch mistakes.', cap: 'It feels slow, but writing units on every number is the #1 way to catch mistakes.', gap: 0.6 },
      { say: 'If your answer comes out in grams squared per mole when you wanted grams, you know right away a factor is upside down.', cap: 'If your answer comes out in g²/mol when you wanted grams, you know right away a factor is upside down.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Convert three hundred fifty milliliters to liters.', cap: 'Convert 350 mL to liters.', gap: 0.4 },
      { say: 'Hint: one liter equals one thousand milliliters. Put milliliters on the bottom so it cancels.', cap: 'Hint: 1 L = 1000 mL. Put mL on the bottom so it cancels.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'Three hundred fifty milliliters times one liter over one thousand milliliters.', cap: '350 mL × (1 L / 1000 mL)', gap: 0.4 },
      { say: 'The answer is zero point three five zero liters.', cap: 'The answer is 0.350 L.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'A conversion factor equals one, so it changes units, not amount.', cap: 'A conversion factor equals 1, so it changes units, not amount.', gap: 0.5 },
      { say: 'Put the unit you want to get rid of on the bottom.', gap: 0.5 },
      { say: 'Squared or cubed units: square or cube the conversion factor too.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
