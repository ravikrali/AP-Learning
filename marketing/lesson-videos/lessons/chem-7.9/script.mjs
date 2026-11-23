// Narration for chem-7.9 "Le Châtelier's Principle". Every fact comes from the lesson cards, quick
// checks and flashcards in app/src/content/chem/u7.ts (plus the lesson's prose in chem/book.ts: the
// volume change in Q-and-K terms, and what a concentration-time graph shows after a disturbance).
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`). `gap` = seconds of
// silence after the sentence (default 0.35). "Le Châtelier" is spelled for the voice as
// "luh shah-tul-yay".
const LC = 'luh shah-tul-yay'
export default {
  id: 'chem-7.9',
  title: 'Le Châtelier\'s Principle',
  course: 'AP® Chemistry',
  unit: 'Unit 7 · Equilibrium',
  unitId: 'chem-u7',
  unitTitle: 'Equilibrium',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: `${LC}'s principle.`, cap: "Le Châtelier's principle.", gap: 0.5 },
      { say: "In the next few minutes, you'll learn how a system at equilibrium responds when you disturb it, and how to explain it with Q and K.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Push on a system at equilibrium, and it pushes back.', gap: 0.5 },
      { say: `That's ${LC}'s principle.`, cap: "That's Le Châtelier's principle.", gap: 0.5 },
      { say: "It's how chemical plants squeeze the most ammonia out of nitrogen and hydrogen,", cap: "It's how chemical plants squeeze the most ammonia out of N₂ and H₂,", gap: 0.2 },
      { say: 'to make fertilizer for the world.', gap: 0.5 },
      { say: "Let's see how it works.", gap: 0.8 },
    ] },
    { id: 'rule', beats: [
      { say: 'Here is the rule.' },
      { say: 'If a stress is applied to a system at equilibrium, the system shifts to counteract the stress, and reaches a new equilibrium.', gap: 0.6 },
      { say: 'In Q and K terms, a disturbance makes Q no longer equal to K.', cap: 'In Q-and-K terms, a disturbance makes Q ≠ K.', gap: 0.4 },
      { say: 'The reaction then proceeds in the direction that brings Q back to K.', gap: 0.8 },
    ] },
    { id: 'conc', beats: [
      { say: 'Take the reaction from the hook: nitrogen plus three hydrogen, making two ammonia. It is exothermic.', cap: 'Take the reaction from the hook: N₂ + 3H₂ ⇌ 2NH₃. It is exothermic (ΔH < 0).', gap: 0.5 },
      { say: 'Add more nitrogen.', cap: 'Add more N₂.', gap: 0.3 },
      { say: 'Now Q is less than K, so the reaction shifts right, and uses up the extra nitrogen.', cap: 'Now Q < K, so the reaction shifts right, and uses up the extra N₂.', gap: 0.5 },
      { say: 'Remove ammonia, and Q is again less than K. The reaction shifts right to replace it.', cap: 'Remove NH₃, and Q < K again. The reaction shifts right to replace it.', gap: 0.6 },
      { say: 'On a concentration versus time graph, adding a reactant shows up as a sudden jump in that line.', cap: 'On a concentration–time graph, adding a reactant shows up as a sudden jump in that line.', gap: 0.4 },
      { say: 'Then the added reactant falls partway back, the other reactant falls, and the product rises, until all the lines level off again.', gap: 0.8 },
    ] },
    { id: 'volume', beats: [
      { say: 'Next, squeeze the container. Decrease the volume, and the pressure increases.' },
      { say: 'The left side has four moles of gas: one nitrogen and three hydrogen. The right side has two.', cap: 'The left side has 4 moles of gas: 1 N₂ and 3 H₂. The right side has 2.', gap: 0.5 },
      { say: 'So the system shifts toward fewer gas moles. Here, that is to the right.', gap: 0.6 },
      { say: 'Here is why, with Q. Halving the volume doubles every concentration at once.', gap: 0.4 },
      { say: 'In Q, the top grows by a factor of four, and the bottom by a factor of sixteen.', cap: 'In Q, the top grows by 2² = 4, and the bottom by 2⁴ = 16.', gap: 0.5 },
      { say: 'So Q becomes one quarter of K. Q is less than K, and the reaction moves forward.', cap: 'So Q becomes ¼ of K. Q < K, and the reaction moves forward.', gap: 0.5 },
      { say: 'If both sides had the same number of gas moles, the factors would cancel, and there would be no shift.', gap: 0.8 },
    ] },
    { id: 'noshift', beats: [
      { say: 'Two changes cause no shift at all.' },
      { say: 'A catalyst speeds up both directions equally. It just reaches equilibrium faster.', gap: 0.6 },
      { say: 'Adding an inert gas at constant volume changes no partial pressures, so nothing shifts.', gap: 0.8 },
    ] },
    { id: 'dilute', beats: [
      { say: 'One more stress, for reactions in solution.' },
      { say: 'Adding water to an aqueous equilibrium lowers all the dissolved concentrations.', gap: 0.5 },
      { say: 'The system shifts toward the side with more dissolved particles, to partly make up for it.', gap: 0.8 },
    ] },
    { id: 'temp', beats: [
      { say: "Here's the trick for temperature, the special one." },
      { say: 'Write heat into the equation, as a reactant or a product.', gap: 0.4 },
      { say: 'Exothermic: heat is a product. Endothermic: heat is a reactant.', gap: 0.5 },
      { say: 'Adding heat pushes the reaction away from the heat side.', gap: 0.5 },
      { say: 'Making ammonia is exothermic, so raising the temperature shifts it left.', gap: 0.6 },
      { say: 'Now the trap: only temperature changes the value of K.', gap: 0.4 },
      { say: 'Concentration, pressure and volume changes alter Q only.', gap: 0.4 },
      { say: 'Raising the temperature of an exothermic reaction decreases K.', gap: 0.5 },
      { say: 'That is why a temperature change shows no sudden jump on a graph. The lines drift gradually to new values, because K itself has changed.', gap: 0.8 },
    ] },
    { id: 'color', beats: [
      { say: "Here's an equilibrium you can see." },
      { say: 'A cobalt ion with six waters, plus four chloride ions, makes a cobalt ion with four chlorides, plus six waters.', cap: 'Co(H₂O)₆²⁺(aq) + 4Cl⁻(aq) ⇌ CoCl₄²⁻(aq) + 6H₂O(l)', gap: 0.4 },
      { say: 'The left side is pink. The right side is blue. And the forward reaction is endothermic.', gap: 0.5 },
      { say: 'Heat it. Heat acts as a reactant, so it shifts right, and turns blue.', gap: 0.5 },
      { say: 'Add hydrochloric acid. That adds chloride, a reactant. Q is less than K, so it shifts right. Also blue.', cap: 'Add HCl. That adds Cl⁻, a reactant. Q < K, so it shifts right. Also blue.', gap: 0.5 },
      { say: 'Cool it in an ice bath, and it shifts left, back to pink.', gap: 0.8 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'For two sulfur dioxide plus oxygen, making two sulfur trioxide, the container volume is increased at constant temperature. Which way does the equilibrium shift?', cap: 'For 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), the container volume is increased at constant temperature. Which way does the equilibrium shift?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B: left, toward sulfur dioxide and oxygen.', cap: 'The answer is B: left, toward SO₂ + O₂.', gap: 0.4 },
      { say: 'A bigger volume favors the side with more gas moles. The left has three, and the right has two.', gap: 0.4 },
      { say: 'And K is unchanged.', gap: 0.9 },
    ] },
    { id: 'frq', beats: [
      { say: 'One tip for free response questions.', cap: 'One tip for free-response questions.' },
      { say: `For full credit, explain with Q versus K, not just "${LC} says so."`, cap: 'For full credit, explain with Q vs. K, not just "Le Châtelier says so."', gap: 0.5 },
      { say: 'For example: adding nitrogen increases the denominator of Q, so Q is less than K.', cap: 'For example: adding N₂ increases the denominator of Q, so Q < K.', gap: 0.3 },
      { say: 'The reaction proceeds in the forward direction, consuming nitrogen and hydrogen and producing ammonia, until Q equals K again.', cap: 'The reaction proceeds in the forward direction, consuming N₂ and H₂ and producing NH₃, until Q = K again.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'The system shifts to counteract a stress, so Q returns to K.', gap: 0.5 },
      { say: 'Decrease the volume, and it shifts toward fewer gas moles. Catalysts and inert gases cause no shift.', cap: 'Volume ↓ → shift toward fewer gas moles. Catalysts and inert gases → no shift.', gap: 0.5 },
      { say: 'And only temperature changes K.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
