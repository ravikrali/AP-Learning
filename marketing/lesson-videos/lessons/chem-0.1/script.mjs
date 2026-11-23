// Narration for chem-0.1 "Scientific Notation & Significant Figures". Every fact comes from the lesson
// cards in app/src/content/chem/u0.ts. One entry per sentence: the voice reads `say`; captions show
// `cap` (or `say` when there is no `cap`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-0.1',
  title: 'Scientific Notation & Significant Figures',
  course: 'AP® Chemistry',
  unit: 'Unit 0 · Chemistry Toolkit',
  unitId: 'chem-u0', // with unitTitle, names the folder the video is stored under
  unitTitle: 'Chemistry Toolkit',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Scientific notation and significant figures.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn how to write huge and tiny numbers, how to count significant figures, and how to round answers the right way.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'A drop of water holds about one point seven times ten to the twenty first molecules.', cap: 'A drop of water holds about 1,700,000,000,000,000,000,000 molecules.', gap: 0.6 },
      { say: 'Nobody wants to write that twice!', gap: 0.6 },
      { say: 'So chemists use scientific notation for numbers like that.', gap: 0.5 },
      { say: 'And they use significant figures to show how precisely something was measured.', gap: 0.9 },
    ] },
    { id: 'sci', beats: [
      { say: 'Scientific notation has one form.', gap: 0.5 },
      { say: 'Write a number from one to ten, times ten to a power.', cap: 'Write a number from 1 to 10, times 10 to a power.', gap: 0.6 },
      { say: 'Take one million seven hundred thousand. Move the decimal six places left. That gives one point seven times ten to the six.', cap: 'Take 1,700,000. Move the decimal 6 places left. That gives 1.7 × 10⁶.', gap: 0.6 },
      { say: 'Now take zero point zero zero zero five two. Move the decimal four places right. That gives five point two times ten to the negative four.', cap: 'Now take 0.00052. Move the decimal 4 places right. That gives 5.2 × 10⁻⁴.', gap: 0.6 },
      { say: 'Big numbers get positive powers. Tiny numbers get negative powers.', gap: 0.9 },
    ] },
    { id: 'sig', beats: [
      { say: 'Significant figures are the digits you actually measured.', gap: 0.5 },
      { say: 'Rule one: all nonzero digits count. Four point five six has three.', cap: 'Rule 1: all nonzero digits count. 4.56 has 3.', gap: 0.6 },
      { say: 'Rule two: zeros between nonzero digits count. One point zero five has three.', cap: 'Rule 2: zeros between nonzero digits count. 1.05 has 3.', gap: 0.6 },
      { say: 'Rule three: leading zeros never count. Zero point zero zero four five has two.', cap: 'Rule 3: leading zeros never count. 0.0045 has 2.', gap: 0.6 },
      { say: 'Rule four: trailing zeros count only if there is a decimal point. Two point five zero has three. Two point five zero zero has four.', cap: 'Rule 4: trailing zeros count only if there is a decimal point. 2.50 has 3. 2.500 has 4.', gap: 0.6 },
      { say: 'The number three hundred, with no decimal point, is ambiguous. Scientific notation fixes this. Three point zero zero times ten squared clearly has three.', cap: 'The number 300, with no decimal point, is ambiguous. Scientific notation fixes this. 3.00 × 10² clearly has 3.', gap: 0.6 },
      { say: 'Exact numbers, like counted objects or defined conversions, have unlimited significant figures.', cap: 'Exact numbers, like counted objects or defined conversions such as 1 m = 100 cm, have unlimited significant figures.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: 'Here is a trick to count them: the Atlantic Pacific rule.', cap: 'Here is a trick to count them: the Atlantic–Pacific rule.', gap: 0.5 },
      { say: 'If the decimal point is Present, start from the Pacific side, the left, at the first nonzero digit. Count everything after it.', gap: 0.6 },
      { say: 'If the decimal point is Absent, start from the Atlantic side, the right, at the first nonzero digit.', gap: 0.6 },
      { say: 'Example: zero point zero zero three four zero has a decimal, so it is Pacific. Start at the three. Three, four, zero. That is three significant figures.', cap: 'Example: 0.00340 has a decimal, so it is Pacific. Start at the 3. 3, 4, 0. That is 3 significant figures.', gap: 0.9 },
    ] },
    { id: 'calc', beats: [
      { say: 'Now, calculations.', gap: 0.5 },
      { say: 'When you multiply or divide, the answer gets the fewest significant figures of any measurement.', gap: 0.5 },
      { say: 'Three point five centimeters times two point two five centimeters is seven point eight seven five. Round it to seven point nine square centimeters, two significant figures.', cap: '3.5 cm × 2.25 cm = 7.875. Round it to 7.9 cm², 2 significant figures.', gap: 0.6 },
      { say: 'When you add or subtract, the answer gets the fewest decimal places.', gap: 0.5 },
      { say: 'Twelve point one one grams plus zero point three grams is twelve point four one. Round it to twelve point four grams, one decimal place.', cap: '12.11 g + 0.3 g = 12.41. Round it to 12.4 g, 1 decimal place.', gap: 0.6 },
      { say: 'Keep extra digits while you calculate. Round only the final answer.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'Here is the trap.', gap: 0.5 },
      { say: "Your calculator shows every digit, but it doesn't know how precise your measurements were.", cap: "Your calculator shows every digit, but it doesn't know how precise your measurements were.", gap: 0.5 },
      { say: 'Writing seven point eight seven five square centimeters claims precision you never measured.', cap: 'Writing 7.875 cm² claims precision you never measured.', gap: 0.5 },
      { say: 'Round the final answer!', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'How many significant figures are in zero point zero zero four zero five zero? Three, four, six, or seven?', cap: 'How many significant figures are in 0.004050? 3, 4, 6, or 7?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is four.', cap: 'The answer is 4.', gap: 0.4 },
      { say: 'Leading zeros are just placeholders. Start at the four. Four, zero, five, zero.', cap: 'Leading zeros are just placeholders. Start at the 4. 4, 0, 5, 0.', gap: 0.4 },
      { say: 'The trailing zero counts because there is a decimal point.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Scientific notation is a number from one to ten, times ten to the n. Small numbers have a negative n.', cap: 'Scientific notation is a number from 1 to 10, times 10ⁿ. Small numbers have a negative n.', gap: 0.5 },
      { say: 'Leading zeros never count. Trailing zeros count only with a decimal point.', gap: 0.5 },
      { say: 'Multiply and divide: fewest significant figures. Add and subtract: fewest decimal places.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
