// Narration for chem-3.12 "Properties of Photons". Every fact comes from the lesson cards, quick
// checks and flashcards in app/src/content/chem/u3.ts (the emission-line and per-mole lines are from
// book.ts). One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-3.12',
  title: 'Properties of Photons',
  course: 'AP® Chemistry',
  unit: 'Unit 3 · Properties of Substances and Mixtures',
  unitId: 'chem-u3',
  unitTitle: 'Properties of Substances and Mixtures',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Properties of photons.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn how atoms trade energy with light, the two photon equations, and how to find the energy of a single photon.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Neon signs glow red. Sodium streetlights glow orange-yellow.', gap: 0.5 },
      { say: 'Each color is a photon with an exact energy.', gap: 0.4 },
      { say: 'It is released when an electron drops to a lower energy level.', gap: 0.5 },
      { say: 'Light is how atoms talk.', gap: 0.8 },
    ] },
    { id: 'levels', beats: [
      { say: 'So how does an atom trade energy with light?', gap: 0.4 },
      { say: "When an atom or molecule absorbs a photon, its energy increases by exactly the photon's energy.", gap: 0.5 },
      { say: 'When it emits a photon, its energy decreases by that same amount.', gap: 0.5 },
      { say: 'In short: the change in energy of the atom equals the energy of the photon.', cap: 'In short: ΔE (of the atom) = E (of the photon).', gap: 0.6 },
      { say: "An atom's electrons can occupy only certain energy levels.", gap: 0.4 },
      { say: 'So when an electron drops, the photon it gives off carries exactly the difference between the two levels.', gap: 0.5 },
      { say: 'Only certain differences are possible, so an emission spectrum is a set of specific lines, not a continuous rainbow.', gap: 0.5 },
      { say: 'And a larger drop makes a photon with a higher frequency and a shorter wavelength.', gap: 0.9 },
    ] },
    { id: 'equations', beats: [
      { say: 'Two equations describe every photon.', gap: 0.4 },
      { say: 'The first: c equals lambda nu. The speed of light equals wavelength times frequency.', cap: 'The first: c = λν. The speed of light = wavelength × frequency.', gap: 0.5 },
      { say: 'The speed of light is two point nine nine eight times ten to the eighth meters per second.', cap: 'The speed of light is 2.998 × 10⁸ m/s.', gap: 0.5 },
      { say: "The second: E equals h nu. A photon's energy equals Planck's constant times its frequency.", cap: "The second: E = hν. A photon's energy = Planck's constant × frequency.", gap: 0.5 },
      { say: "Planck's constant is six point six two six times ten to the minus thirty-four joule seconds.", cap: "Planck's constant is 6.626 × 10⁻³⁴ J·s.", gap: 0.5 },
      { say: 'For example, a photon with a frequency of one point zero times ten to the fifteenth per second has an energy of six point six times ten to the minus nineteenth joules.', cap: 'For example, a photon with a frequency of 1.0 × 10¹⁵ s⁻¹ has an energy of 6.6 × 10⁻¹⁹ J.', gap: 0.6 },
      { say: 'Put them together, and you get the big pattern.', gap: 0.4 },
      { say: 'A shorter wavelength means a higher frequency, and that means a higher energy.', gap: 0.5 },
      { say: 'A longer wavelength means a lower frequency, and a lower energy.', gap: 0.5 },
      { say: 'So if photon X has a longer wavelength than photon Y, then X has the lower frequency and the lower energy.', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: "Let's try green light.", gap: 0.4 },
      { say: 'Find the energy of one photon of five hundred nanometer light.', cap: 'Find the energy of one photon of 500. nm light.', gap: 0.6 },
      { say: 'Step one: convert the wavelength to meters. Five hundred nanometers is five point zero zero times ten to the minus seventh meters.', cap: 'Step 1: convert the wavelength to meters. 500. nm = 5.00 × 10⁻⁷ m.', gap: 0.5 },
      { say: 'Step two: find the frequency. Nu equals c over lambda, which gives six point zero zero times ten to the fourteenth per second.', cap: 'Step 2: find the frequency. ν = c/λ = 6.00 × 10¹⁴ s⁻¹.', gap: 0.5 },
      { say: 'Step three: find the energy. E equals h nu, which gives three point nine seven times ten to the minus nineteenth joules.', cap: 'Step 3: find the energy. E = hν = 3.97 × 10⁻¹⁹ J.', gap: 0.6 },
      { say: "That's the energy of just one photon. A tiny amount.", gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a shortcut.", gap: 0.4 },
      { say: 'Combine the two equations, and you get E equals h c over lambda. One step instead of two!', cap: 'Combine the two equations, and you get E = hc/λ. One step instead of two!', gap: 0.6 },
      { say: 'But watch out for the most common photon mistake: a mismatched unit.', gap: 0.4 },
      { say: 'Always convert nanometers to meters first, by multiplying by ten to the minus ninth.', cap: 'Always convert nanometers to meters first (× 10⁻⁹).', gap: 0.6 },
      { say: "Need the energy per mole of photons? Multiply by Avogadro's number.", gap: 0.5 },
      { say: 'For our green light, that comes to about two hundred thirty-nine kilojoules per mole.', cap: 'For our green light, that comes to about 239 kJ/mol.', gap: 0.5 },
      { say: 'That is comparable to the energy of some chemical bonds.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'What is the frequency of light with a wavelength of six hundred nanometers?', cap: 'What is the frequency of light with a wavelength of 600. nm?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is five point zero zero times ten to the fourteenth per second.', cap: 'The answer is 5.00 × 10¹⁴ s⁻¹.', gap: 0.4 },
      { say: 'First, convert. Six hundred nanometers is six point zero zero times ten to the minus seventh meters.', cap: 'First, convert. 600. nm = 6.00 × 10⁻⁷ m.', gap: 0.4 },
      { say: 'Then, nu equals c over lambda. Two point nine nine eight times ten to the eighth, divided by six point zero zero times ten to the minus seventh.', cap: 'Then, ν = c/λ = (2.998 × 10⁸ m/s) ÷ (6.00 × 10⁻⁷ m).', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: "Absorb a photon, and the atom's energy goes up by the photon's energy. Emit one, and it goes down.", gap: 0.5 },
      { say: 'c equals lambda nu, and E equals h nu. So E equals h c over lambda.', cap: 'c = λν and E = hν, so E = hc/λ.', gap: 0.5 },
      { say: 'Shorter wavelength means higher energy. And convert nanometers to meters!', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
