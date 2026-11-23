// Narration for chem-0.5 "Balancing Chemical Equations". Every fact comes from the lesson cards and quick checks
// in app/src/content/chem/u0.ts and the extra prose in app/src/content/chem/book.ts. One entry per sentence: the voice reads `say`;
// captions show `cap` (or `say` when there is no `cap`). `gap` = seconds of silence after the sentence.
export default {
  id: 'chem-0.5',
  title: 'Balancing Chemical Equations',
  course: 'AP® Chemistry',
  unit: 'Unit 0 · Chemistry Toolkit',
  unitId: 'chem-u0', // with unitTitle, names the folder the video is stored under
  unitTitle: 'Chemistry Toolkit',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Balancing chemical equations.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the golden rule of balancing, an order that keeps you from going in circles, and how to check your answer.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'Atoms are never created or destroyed in a chemical reaction.', gap: 0.6 },
      { say: 'They are just rearranged, like LEGO bricks rebuilt into a new shape.', gap: 0.6 },
      { say: 'A balanced equation shows that every brick is accounted for.', gap: 0.9 },
    ] },
    { id: 'golden', beats: [
      { say: 'Here is the golden rule.', gap: 0.5 },
      { say: 'Change only the coefficients. These are the big numbers in front.', gap: 0.6 },
      { say: 'Never change the subscripts, because that changes the substance itself.', gap: 0.6 },
      { say: 'H two O two is hydrogen peroxide, not water!', cap: 'H₂O₂ is hydrogen peroxide, not water!', gap: 0.9 },
    ] },
    { id: 'check', beats: [
      { say: 'Look at this equation. H two plus O two makes H two O. It is not balanced.', cap: 'H₂ + O₂ → H₂O. It is not balanced.', gap: 0.7 },
      { say: 'Now put a two in front of H two, and a two in front of H two O.', cap: 'Now put a 2 in front of H₂, and a 2 in front of H₂O.', gap: 0.7 },
      { say: 'Check: hydrogen is four on both sides, and oxygen is two on both sides.', cap: 'Check: H = 4 on both sides, and O = 2 on both sides.', gap: 0.9 },
    ] },
    { id: 'ratio', beats: [
      { say: 'The coefficients give the ratio in which particles react and form.', gap: 0.6 },
      { say: 'Two molecules of hydrogen react with one molecule of oxygen to form two molecules of water.', gap: 0.6 },
      { say: 'Scale that up, and two moles of hydrogen react with one mole of oxygen.', gap: 0.6 },
      { say: 'But the coefficients do not give mass ratios. Two grams of hydrogen does not react with one gram of oxygen.', gap: 0.9 },
    ] },
    { id: 'mino', beats: [
      { say: 'Next, a trick for the order. It is called MINO.', cap: 'Next, a trick for the order: MINO.', gap: 0.6 },
      { say: 'Balance in this order to avoid going in circles.', gap: 0.6 },
      { say: 'M is for metals.', gap: 0.5 },
      { say: 'I is for ions. These are polyatomic ions that appear on both sides as a unit.', gap: 0.5 },
      { say: 'N is for nonmetals, other than hydrogen and oxygen.', gap: 0.5 },
      { say: 'And O is for oxygen and hydrogen, last.', gap: 0.6 },
      { say: 'Finally, check every element, and reduce the coefficients if they share a common factor.', gap: 0.9 },
    ] },
    { id: 'propane', beats: [
      { say: 'Let us burn propane. C three H eight plus O two makes C O two plus H two O.', cap: 'C₃H₈ + O₂ → CO₂ + H₂O', gap: 0.7 },
      { say: 'Carbon: three on the left, so put a three in front of C O two.', cap: 'Carbon: 3 on the left, so put a 3 in front of CO₂.', gap: 0.6 },
      { say: 'Hydrogen: eight on the left, so put a four in front of H two O. Four times two is eight.', cap: 'Hydrogen: 8 on the left, so put a 4 in front of H₂O. 4 × 2 = 8.', gap: 0.6 },
      { say: 'Oxygen on the right: three times two, plus four times one, is ten oxygen atoms.', cap: 'Oxygen on the right: 3 × 2 + 4 × 1 = 10 O atoms.', gap: 0.6 },
      { say: 'So you need five O two on the left.', cap: 'So you need 5 O₂ on the left.', gap: 0.6 },
      { say: 'C three H eight plus five O two makes three C O two plus four H two O.', cap: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', gap: 0.9 },
    ] },
    { id: 'frac', beats: [
      { say: 'Sometimes a fraction helps as a step along the way.', gap: 0.6 },
      { say: 'For ethane, balancing carbon and hydrogen first leaves seven oxygen atoms on the right. So you need seven halves of O two.', cap: 'For ethane, balancing C and H first leaves 7 O atoms on the right. So you need 7/2 O₂.', gap: 0.6 },
      { say: 'Multiply every coefficient by two to clear the fraction. Final equations use the smallest whole numbers.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, a common trap.', gap: 0.5 },
      { say: 'Count atoms inside parentheses carefully.', gap: 0.6 },
      { say: 'Ca, O H, twice, has two oxygen and two hydrogen.', cap: 'Ca(OH)₂ has 2 O and 2 H.', gap: 0.6 },
      { say: 'And three Ca, O H, twice, has three calcium, six oxygen, and six hydrogen.', cap: 'And 3Ca(OH)₂ has 3 Ca, 6 O and 6 H.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'Which coefficients balance A l plus O two makes A l two O three? One, one, one. Two, three, one. Four, three, two. Or two, one, one?', cap: 'Which coefficients balance Al + O₂ → Al₂O₃? 1, 1, 1. 2, 3, 1. 4, 3, 2. Or 2, 1, 1?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is C: four, three, two.', cap: 'The answer is C: 4, 3, 2.', gap: 0.4 },
      { say: 'Oxygen is two on the left and three on the right. The lowest common multiple of two and three is six.', gap: 0.4 },
      { say: 'Six oxygen atoms means three O two and two A l two O three. Then two A l two O three contains four aluminum, so you need four A l.', cap: '6 O atoms means 3 O₂ and 2 Al₂O₃. Then 2 Al₂O₃ contains 4 Al, so you need 4 Al.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Only change coefficients, never subscripts.', gap: 0.5 },
      { say: 'Balance metals, then polyatomic ions, then nonmetals, then oxygen and hydrogen last.', gap: 0.5 },
      { say: 'And always do a final count of every element.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
