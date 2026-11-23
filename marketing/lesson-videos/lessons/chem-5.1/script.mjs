// Narration for chem-5.1 "Reaction Rates". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u5.ts; the slope scene and the lab-measurement scene use
// the lesson's extra prose in app/src/content/chem/book.ts.
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-5.1',
  title: 'Reaction Rates',
  course: 'AP® Chemistry',
  unit: 'Unit 5 · Kinetics',
  unitId: 'chem-u5',
  unitTitle: 'Kinetics',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'Reaction rates.', cap: 'Reaction Rates.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn what a reaction rate is, how the coefficients link the rates of different substances, and what makes a reaction go faster.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'An explosion is over in a millisecond.', gap: 0.5 },
      { say: 'Rusting takes years.', gap: 0.6 },
      { say: "It's the same idea: atoms rearranging.", gap: 0.3 },
      { say: 'But at wildly different speeds.', gap: 0.6 },
      { say: 'Kinetics is the study of how fast.', gap: 0.9 },
    ] },
    { id: 'rate', beats: [
      { say: 'So what exactly is a rate?', gap: 0.4 },
      { say: 'The reaction rate is how fast reactants are converted to products, per unit of time.', gap: 0.5 },
      { say: 'It is usually a change in concentration per second, in molar per second.', cap: 'It is usually a change in concentration per second, in M/s.', gap: 0.5 },
      { say: "As the reaction runs, the reactant's concentration goes down, and the product's concentration goes up.", gap: 0.5 },
      { say: 'So the rate is minus the change in reactant concentration over the change in time, or plus the change in product concentration over the change in time.', cap: 'So rate = −Δ[reactant]/Δt = +Δ[product]/Δt.', gap: 0.5 },
      { say: 'The minus sign keeps the rate positive, because reactant concentrations go down.', gap: 0.9 },
    ] },
    { id: 'slope', beats: [
      { say: 'On a graph of concentration against time, a rate is a slope.', gap: 0.5 },
      { say: 'The average rate over an interval is the slope of the straight line joining two points.', gap: 0.5 },
      { say: 'The instantaneous rate at one moment is the slope of the tangent to the curve at that point.', gap: 0.5 },
      { say: 'The slope at the very start, at time zero, is the initial rate.', cap: 'The slope at the very start, at t = 0, is the initial rate.', gap: 0.5 },
      { say: 'Notice that the reactant curve gets flatter as time passes.', gap: 0.4 },
      { say: 'The rate decreases as reactants are used up, because there are fewer collisions per second.', gap: 0.9 },
    ] },
    { id: 'stoich', beats: [
      { say: 'But a reaction has more than one substance. Whose rate do we use?', gap: 0.5 },
      { say: 'Take two N two O five, forming four N O two plus O two.', cap: 'Take 2N₂O₅ → 4NO₂ + O₂.', gap: 0.5 },
      { say: 'N O two forms twice as fast as N two O five disappears.', cap: 'NO₂ forms twice as fast as N₂O₅ disappears.', gap: 0.4 },
      { say: 'And O two forms half as fast as N two O five disappears.', cap: 'And O₂ forms half as fast as N₂O₅ disappears.', gap: 0.5 },
      { say: 'The general rule: divide each rate by its coefficient, to get one single rate of reaction.', gap: 0.5 },
      { say: 'Rate equals minus one half the change in N two O five over time, which equals one quarter the change in N O two, which equals the change in O two.', cap: 'rate = −½ Δ[N₂O₅]/Δt = ¼ Δ[NO₂]/Δt = Δ[O₂]/Δt', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: "Let's try it with numbers.", gap: 0.4 },
      { say: 'N two O five is consumed at zero point zero one zero molar per second. At what rate is O two formed?', cap: 'N₂O₅ is consumed at 0.010 M/s. At what rate is O₂ formed?', gap: 0.5 },
      { say: 'The ratio of O two to N two O five is one to two.', cap: 'O₂ : N₂O₅ = 1 : 2.', gap: 0.4 },
      { say: 'So zero point zero one zero times one half is zero point zero zero five zero molar per second.', cap: 'So 0.010 × ½ = 0.0050 M/s.', gap: 0.5 },
      { say: 'Relative rates follow the coefficients.', gap: 0.9 },
    ] },
    { id: 'factors', beats: [
      { say: 'What speeds a reaction up? There are four factors.', gap: 0.5 },
      { say: 'One: higher concentration, or higher pressure for gases. That means more collisions.', gap: 0.5 },
      { say: 'Two: higher temperature. More collisions, and more of them energetic enough to react.', gap: 0.5 },
      { say: 'Three: more surface area, like a powder instead of a chunk. More particles are exposed.', gap: 0.5 },
      { say: 'Four: a catalyst. It gives the reaction a lower energy pathway.', cap: 'Four: a catalyst. It gives the reaction a lower-energy pathway.', gap: 0.5 },
      { say: "You'll learn the particle level why for each one in the coming lessons.", cap: "You'll learn the particle-level “why” for each one in the coming lessons.", gap: 0.9 },
    ] },
    { id: 'surface', beats: [
      { say: "Here's a classic question.", gap: 0.4 },
      { say: 'Why does powdered zinc react with acid faster than a single lump of zinc with the same mass?', gap: 0.6 },
      { say: "The powder isn't hotter, and it isn't a catalyst.", gap: 0.5 },
      { say: 'The powder has more surface area. That exposes more zinc atoms to the acid.', gap: 0.5 },
      { say: 'So there are more collisions per second, and the reaction goes faster.', gap: 0.9 },
    ] },
    { id: 'measure', beats: [
      { say: 'How is a rate measured in the lab?', gap: 0.4 },
      { say: 'Concentrations are rarely measured by taking samples and titrating them.', gap: 0.4 },
      { say: 'Instead, a property that depends on concentration is followed continuously.', gap: 0.5 },
      { say: 'The absorbance of a colored reactant or product.', gap: 0.4 },
      { say: 'The pressure of a gas produced in a closed vessel, or the volume of gas collected.', gap: 0.4 },
      { say: 'Or the mass lost as gas escapes.', gap: 0.5 },
      { say: 'Each of these can be converted into concentration.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'For N two plus three H two, forming two N H three, H two is consumed at zero point zero six zero molar per second. At what rate is N H three formed?', cap: 'For N₂ + 3H₂ → 2NH₃, H₂ is consumed at 0.060 M/s. At what rate is NH₃ formed?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is zero point zero four zero molar per second.', cap: 'The answer is 0.040 M/s.', gap: 0.4 },
      { say: 'The ratio of N H three to H two is two to three.', cap: 'NH₃ : H₂ = 2 : 3.', gap: 0.4 },
      { say: 'So zero point zero six zero times two thirds is zero point zero four zero molar per second.', cap: 'So 0.060 M/s × 2/3 = 0.040 M/s.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Rate is the change in concentration divided by time.', gap: 0.5 },
      { say: 'Relative rates follow the coefficients.', gap: 0.5 },
      { say: 'And concentration, temperature, surface area and catalysts all affect the rate.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
