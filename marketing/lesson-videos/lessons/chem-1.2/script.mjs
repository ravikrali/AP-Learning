// Narration for chem-1.2 "Mass Spectra of Elements". Every fact comes from the lesson cards and
// quick checks in app/src/content/chem/u1.ts (and its book.ts prose). One entry per sentence: the
// voice reads `say`; captions show `cap` (or `say`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-1.2',
  title: 'Mass Spectra of Elements',
  course: 'AP® Chemistry',
  unit: 'Unit 1 · Atomic Structure and Properties',
  unitId: 'chem-u1',
  unitTitle: 'Atomic Structure and Properties',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Mass spectra of elements.', gap: 0.5 },
      { say: "In the next few minutes, you'll see how to read a mass spectrum, how to find an average atomic mass, and a quick estimate that checks your answer.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'The periodic table lists chlorine as thirty-five point four five atomic mass units.', cap: 'The periodic table lists chlorine as 35.45 amu.', gap: 0.5 },
      { say: 'But no chlorine atom actually weighs thirty-five point four five.', cap: 'But no chlorine atom actually weighs 35.45.', gap: 0.5 },
      { say: 'Chlorine atoms weigh about thirty-five, or about thirty-seven.', cap: 'Chlorine atoms weigh about 35, or about 37.', gap: 0.5 },
      { say: 'So what is thirty-five point four five?', cap: 'So what is 35.45?', gap: 0.5 },
      { say: "It's an average. And a mass spectrometer shows us the mix.", gap: 0.9 },
    ] },
    { id: 'spectrum', beats: [
      { say: 'A mass spectrometer sorts atoms by mass.', gap: 0.5 },
      { say: 'Here is the mass spectrum of chlorine atoms.', gap: 0.5 },
      { say: 'Each peak is one isotope.', gap: 0.4 },
      { say: "And the position of the peak is that isotope's mass.", gap: 0.5 },
      { say: 'The height of the peak tells you how abundant that isotope is.', gap: 0.5 },
      { say: 'Taller peak, more common isotope.', gap: 0.9 },
    ] },
    { id: 'wavg', beats: [
      { say: 'Now, the average atomic mass.', gap: 0.5 },
      { say: 'It is a weighted average.', gap: 0.4 },
      { say: 'Average mass equals the sum of each isotope mass, times its fractional abundance.', cap: 'Average mass = Σ (isotope mass × fractional abundance)', gap: 0.6 },
      { say: 'Think of a class grade, where tests count more than homework.', gap: 0.5 },
      { say: 'Each isotope counts according to its abundance.', gap: 0.9 },
    ] },
    { id: 'chlorine', beats: [
      { say: "Let's try it with chlorine.", gap: 0.5 },
      { say: 'Chlorine is seventy-five point seven six percent chlorine thirty-five, with a mass of thirty-four point nine six nine.', cap: 'Chlorine is 75.76% ³⁵Cl, with a mass of 34.969 amu.', gap: 0.4 },
      { say: 'And it is twenty-four point two four percent chlorine thirty-seven, with a mass of thirty-six point nine six six.', cap: 'And 24.24% ³⁷Cl, with a mass of 36.966 amu.', gap: 0.6 },
      { say: 'Step one: convert the percents to decimals. Zero point seven five seven six, and zero point two four two four.', cap: 'Step 1: convert the percents to decimals: 0.7576 and 0.2424.', gap: 0.6 },
      { say: 'Step two: multiply. Thirty-four point nine six nine times zero point seven five seven six is twenty-six point four nine.', cap: 'Step 2: 34.969 × 0.7576 = 26.49', gap: 0.4 },
      { say: 'Thirty-six point nine six six times zero point two four two four is eight point nine six one.', cap: '36.966 × 0.2424 = 8.961', gap: 0.6 },
      { say: 'Step three: add them. Twenty-six point four nine plus eight point nine six one is thirty-five point four five atomic mass units.', cap: 'Step 3: 26.49 + 8.961 = 35.45 amu', gap: 0.5 },
      { say: 'It matches the periodic table.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a quick trick: estimate first, calculate second.", gap: 0.5 },
      { say: 'The average always lands closer to the most abundant isotope.', gap: 0.5 },
      { say: "Chlorine's thirty-five point four five is much closer to thirty-five than to thirty-seven, because chlorine thirty-five is about three quarters of all chlorine atoms.", cap: "Chlorine's 35.45 is much closer to 35 than to 37, because ³⁵Cl is about 3/4 of all Cl atoms.", gap: 0.5 },
      { say: 'On multiple choice, this estimate alone often picks the right answer in seconds.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'One thing to know about the exam.', gap: 0.4 },
      { say: 'The AP® exam only uses mass spectra of a single element.', gap: 0.5 },
      { say: "It won't ask you to read spectra of mixtures, or of molecules that break into fragments.", gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Boron is nineteen point nine percent boron ten, with a mass of ten point zero one three, and eighty point one percent boron eleven, with a mass of eleven point zero zero nine.', cap: 'Boron is 19.9% ¹⁰B (10.013 amu) and 80.1% ¹¹B (11.009 amu).', gap: 0.3 },
      { say: 'What is its average atomic mass?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is ten point eight one atomic mass units.', cap: 'The answer is 10.81 amu.', gap: 0.4 },
      { say: 'Ten point zero one three times zero point one nine nine is one point nine nine three.', cap: '10.013 × 0.199 = 1.993', gap: 0.3 },
      { say: 'Eleven point zero zero nine times zero point eight zero one is eight point eight one eight.', cap: '11.009 × 0.801 = 8.818', gap: 0.3 },
      { say: "Add them, and you get ten point eight one. It's close to eleven, because boron eleven is the most common isotope.", cap: "Add them: 10.81. It's close to 11, because ¹¹B is the most common isotope.", gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Peaks are isotopes. Position is mass. Height is relative abundance.', gap: 0.5 },
      { say: 'Average atomic mass is the sum of mass times fraction.', cap: 'Average atomic mass = Σ(mass × fraction).', gap: 0.5 },
      { say: 'And the average is pulled toward the most abundant isotope.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
