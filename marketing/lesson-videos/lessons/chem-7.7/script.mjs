// Narration for chem-7.7 "Q vs. K & ICE Tables". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u7.ts (plus chem/book.ts: "reaction quotient", and the check
// by substitution for the H2 + I2 example). The card's "alphabet trick" is taught by its own rule
// ("the reaction always moves Q toward K") on a number line. One entry per sentence: the voice reads
// `say`; captions show `cap` (or `say`). `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-7.7',
  title: 'Q vs. K & ICE Tables',
  course: 'AP® Chemistry',
  unit: 'Unit 7 · Equilibrium',
  unitId: 'chem-u7',
  unitTitle: 'Equilibrium',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Q versus K, and ICE tables.', cap: 'Q vs. K & ICE tables.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn to predict which way a reaction will go, and to find the amounts where it stops.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Mix some chemicals, and ask two questions.' },
      { say: 'Which way will the reaction go?', gap: 0.4 },
      { say: 'And where will it stop?', gap: 0.6 },
      { say: 'For the direction, compare Q to K.', gap: 0.4 },
      { say: 'For the final amounts, use an ICE table.', gap: 0.8 },
    ] },
    { id: 'compare', beats: [
      { say: 'The reaction quotient, Q, has the same form as K, but you can work it out at any moment.', gap: 0.5 },
      { say: 'If Q is less than K, there are too few products.', cap: 'If Q < K, there are too few products.', gap: 0.3 },
      { say: 'So the reaction shifts forward, making products.', cap: 'So the reaction shifts forward (→), making products.', gap: 0.5 },
      { say: 'If Q is greater than K, there are too many products.', cap: 'If Q > K, there are too many products.', gap: 0.3 },
      { say: 'So it shifts in reverse, making reactants.', cap: 'So it shifts in reverse (←), making reactants.', gap: 0.5 },
      { say: 'And if Q equals K, the reaction is already at equilibrium.', cap: 'And if Q = K, the reaction is already at equilibrium.', gap: 0.3 },
      { say: 'The forward and reverse rates are equal.', gap: 0.8 },
    ] },
    { id: 'check', beats: [
      { say: "Let's try one." },
      { say: 'Dinitrogen tetroxide makes two nitrogen dioxide, and K is zero point zero zero five nine.', cap: 'N₂O₄(g) ⇌ 2NO₂(g), and K = 0.0059.', gap: 0.4 },
      { say: 'A flask has zero point one zero molar dinitrogen tetroxide, and zero point zero one zero molar nitrogen dioxide.', cap: 'A flask has [N₂O₄] = 0.10 M and [NO₂] = 0.010 M.', gap: 0.5 },
      { say: 'Q is nitrogen dioxide squared, over dinitrogen tetroxide.', cap: 'Q = [NO₂]² / [N₂O₄]', gap: 0.4 },
      { say: "That's zero point zero zero zero one zero, over zero point one zero, which is zero point zero zero one zero.", cap: 'Q = 0.00010 / 0.10 = 0.0010', gap: 0.5 },
      { say: 'Q is less than K, so the reaction shifts forward, making more nitrogen dioxide.', cap: '0.0010 < 0.0059, so Q < K: the reaction shifts forward, making more NO₂.', gap: 0.8 },
    ] },
    { id: 'ice', beats: [
      { say: 'Now for the amounts: the ICE table.' },
      { say: 'ICE stands for initial, change, equilibrium. One row each, and one column for each species.', cap: 'ICE stands for Initial, Change, Equilibrium. One row each, and one column for each species.', gap: 0.5 },
      { say: 'Step one: fill in the initial concentrations.', gap: 0.4 },
      { say: 'Step two: write the changes as plus or minus the coefficient times x.', cap: 'Step two: write the changes as ±(coefficient)·x.', gap: 0.3 },
      { say: 'If Q is less than K, reactants go down and products go up.', cap: 'If Q < K, reactants go down and products go up.', gap: 0.5 },
      { say: 'Step three: the equilibrium row is the initial row plus the change.', cap: 'Step three: the equilibrium row = I + C.', gap: 0.4 },
      { say: 'Step four: plug the equilibrium row into the K expression, and solve for x.', gap: 0.8 },
    ] },
    { id: 'table', beats: [
      { say: "Let's use one. Hydrogen plus iodine makes two hydrogen iodide, and K is fifty point zero.", cap: "Let's use one. H₂ + I₂ ⇌ 2HI, and K = 50.0.", gap: 0.4 },
      { say: 'We mix zero point one zero zero molar hydrogen and zero point one zero zero molar iodine, with no hydrogen iodide at the start.', cap: 'We mix 0.100 M H₂ and 0.100 M I₂, with no HI at the start.', gap: 0.5 },
      { say: 'Initial row: zero point one zero zero, zero point one zero zero, and zero.', cap: 'Initial row: 0.100, 0.100, and 0.', gap: 0.4 },
      { say: 'Change row: minus x, minus x, and plus two x, because hydrogen iodide has a coefficient of two.', cap: 'Change row: −x, −x, and +2x, because HI has a coefficient of 2.', gap: 0.4 },
      { say: 'Equilibrium row: zero point one zero zero minus x, twice, and two x.', cap: 'Equilibrium row: 0.100 − x, twice, and 2x.', gap: 0.8 },
    ] },
    { id: 'solve', beats: [
      { say: 'Now plug the equilibrium row into K.' },
      { say: 'Fifty point zero equals two x squared, over zero point one zero zero minus x, squared.', cap: '50.0 = (2x)² / (0.100 − x)²', gap: 0.5 },
      { say: 'Both sides are perfect squares, so take the square root: seven point zero seven equals two x over zero point one zero zero minus x.', cap: 'Both sides are perfect squares, so take the square root: 7.07 = 2x / (0.100 − x)', gap: 0.5 },
      { say: 'Solve, and x is zero point zero seven eight zero.', cap: '7.07(0.100 − x) = 2x → 0.707 = 9.07x → x = 0.0780', gap: 0.5 },
      { say: 'So hydrogen iodide is two x: zero point one five six molar.', cap: 'So [HI] = 2x = 0.156 M.', gap: 0.4 },
      { say: 'Hydrogen and iodine are each zero point one zero zero minus x: zero point zero two two molar.', cap: '[H₂] = [I₂] = 0.100 − 0.0780 = 0.022 M.', gap: 0.5 },
      { say: 'Check by putting them back into K: it comes out at about fifty.', cap: 'Check: (0.156)² / (0.022)² ≈ 50.', gap: 0.8 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a quick trick for the direction." },
      { say: 'Put Q and K on a number line.', gap: 0.4 },
      { say: 'The reaction always moves Q toward K.', gap: 0.5 },
      { say: 'If Q is to the left of K, Q is smaller, so the reaction moves right: forward.', cap: 'If Q is to the left of K (Q < K), the reaction moves right: forward (→).', gap: 0.5 },
      { say: 'If Q is to the right of K, it moves left: in reverse.', cap: 'If Q is to the right of K (Q > K), it moves left: in reverse (←).', gap: 0.8 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, a common trap.' },
      { say: 'ICE tables use concentrations, in molarity, or partial pressures.', cap: 'ICE tables use concentrations (M) or partial pressures.', gap: 0.4 },
      { say: 'Not moles, and not grams.', gap: 0.5 },
      { say: "If you're given moles and a volume, divide first!", gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'For a reaction, K is ten. At some moment, Q is twenty-five. Which way does the reaction proceed?', cap: 'For a reaction, K = 10. At some moment, Q = 25. Which way does the reaction proceed?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is reverse, toward reactants.', gap: 0.4 },
      { say: 'Q is greater than K, so there are too many products.', cap: 'Q > K, so there are too many products.', gap: 0.3 },
      { say: 'The reaction runs in reverse until Q drops to K.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Q less than K: forward. Q greater than K: reverse. Q equals K: equilibrium.', cap: 'Q < K → forward. Q > K → reverse. Q = K → equilibrium.', gap: 0.5 },
      { say: 'ICE stands for initial, change, using the coefficients times x, and equilibrium.', cap: 'ICE: Initial, Change (the coefficients × x), Equilibrium.', gap: 0.5 },
      { say: 'Then substitute the equilibrium row into K, and solve for x.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
