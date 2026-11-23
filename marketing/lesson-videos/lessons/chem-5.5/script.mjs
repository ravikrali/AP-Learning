// Narration for chem-5.5 "The Collision Model". Every fact comes from the lesson cards, quick checks
// and flashcards in app/src/content/chem/u5.ts; the NO + O3 orientation example and the "10 °C
// roughly doubles" line are from book.ts ('chem-5.5').
// One entry per sentence: the voice reads `say`; captions show `cap` (or `say`).
// `gap` = seconds of silence after the sentence (default 0.35).
export default {
  id: 'chem-5.5',
  title: 'The Collision Model',
  course: 'AP® Chemistry',
  unit: 'Unit 5 · Kinetics',
  unitId: 'chem-u5',
  unitTitle: 'Kinetics',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'The collision model.', cap: 'The Collision Model.', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the three things a reaction needs from a collision, why most collisions fail, and why heat speeds reactions up so much.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: 'In a gas, each molecule collides billions of times per second.', gap: 0.5 },
      { say: 'If every collision made a reaction, everything would react instantly!', gap: 0.5 },
      { say: "So why don't they?", gap: 0.7 },
      { say: 'The collision model explains reaction rates at the particle level.', gap: 0.4 },
      { say: 'Particles must collide, with enough energy, and with the correct orientation, for a reaction to occur.', gap: 0.9 },
    ] },
    { id: 'three', beats: [
      { say: 'For an elementary reaction to happen, the particles must meet three requirements.', gap: 0.5 },
      { say: 'One: they must collide. More frequent collisions mean a faster reaction.', gap: 0.5 },
      { say: 'Two: they must collide with enough energy to overcome the activation energy, E a, and start breaking bonds.', cap: 'Two: they must collide with enough energy to overcome the activation energy, Eₐ, and start breaking bonds.', gap: 0.5 },
      { say: 'Three: they must collide with the correct orientation, so the right atoms meet.', gap: 0.6 },
      { say: 'In most reactions, only a small fraction of collisions meets both the energy and the orientation requirements.', gap: 0.4 },
      { say: 'Most collisions just bounce off.', gap: 0.9 },
    ] },
    { id: 'orient', beats: [
      { say: "Let's see orientation in a real reaction: N O plus O three gives N O two plus O two.", cap: "Let's see orientation in a real reaction: NO + O₃ → NO₂ + O₂.", gap: 0.5 },
      { say: 'For it to work, the nitrogen atom of N O must strike one of the end oxygen atoms of O three.', cap: 'For it to work, the nitrogen atom of NO must strike one of the end oxygen atoms of O₃.', gap: 0.4 },
      { say: 'Then a new nitrogen oxygen bond can form as an oxygen oxygen bond breaks.', cap: 'Then a new N–O bond can form as an O–O bond breaks.', gap: 0.6 },
      { say: 'But if the oxygen end of N O hits the ozone molecule, the oxygen atom cannot be transferred, however energetic the collision.', cap: 'But if the oxygen end of NO hits the ozone molecule, the oxygen atom cannot be transferred, however energetic the collision.', gap: 0.6 },
      { say: 'So here is a classic question. Two molecules collide with more than enough energy, but no reaction occurs. Why?', gap: 0.5 },
      { say: 'The most likely reason is incorrect orientation.', gap: 0.4 },
      { say: "Energy alone isn't enough. The atoms that need to bond must meet.", gap: 0.9 },
    ] },
    { id: 'temp', beats: [
      { say: 'Now, why does temperature matter so much?', gap: 0.5 },
      { say: 'The Maxwell Boltzmann distribution shows the spread of particle energies.', cap: 'The Maxwell–Boltzmann distribution shows the spread of particle energies.', gap: 0.5 },
      { say: 'Only the particles in the tail past E a have enough energy to react.', cap: 'Only the particles in the tail past Eₐ have enough energy to react.', gap: 0.6 },
      { say: 'Raising the temperature shifts the curve, so a much larger fraction of collisions has an energy at or above E a.', cap: 'Raising the temperature shifts the curve, so a much larger fraction of collisions has E ≥ Eₐ.', gap: 0.6 },
      { say: "That's why a modest temperature increase can speed a reaction up dramatically.", gap: 0.4 },
      { say: 'A ten degree Celsius rise often roughly doubles a reaction rate.', cap: 'A 10 °C rise often roughly doubles a reaction rate.', gap: 0.9 },
    ] },
    { id: 'hack', beats: [
      { say: "Here's a trick to remember it all: hit it hard, hit it right.", gap: 0.5 },
      { say: 'A successful collision needs energy, so hit it hard, and orientation, so hit it right.', gap: 0.5 },
      { say: 'On free response questions, when you explain a rate change, name which requirement changes.', cap: 'On free-response questions, when you explain a rate change, name which requirement changes.', gap: 0.5 },
      { say: 'Raise the concentration: more particles in the same volume mean more frequent collisions, and more successful ones per second. It does not raise the energy of each collision.', gap: 0.5 },
      { say: 'Raise the temperature: the frequency goes up, and so does the fraction with energy at or above E a. That fraction is the bigger effect.', cap: 'Raise the temperature: the frequency goes up, and so does the fraction with E ≥ Eₐ. That fraction is the bigger effect.', gap: 0.5 },
      { say: 'Add a catalyst: it gives a lower E a, so a bigger fraction qualifies.', cap: 'Add a catalyst: it gives a lower Eₐ, so a bigger fraction qualifies.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: "Increasing the temperature increases a reaction's rate mainly because...", gap: 0.4 },
      { say: 'A: the activation energy decreases.', gap: 0.25 },
      { say: 'B: a greater fraction of collisions have energy at or above E a.', cap: 'B: a greater fraction of collisions have energy ≥ Eₐ.', gap: 0.25 },
      { say: 'C: the particles become larger.', gap: 0.25 },
      { say: 'D: the orientation of every collision improves.', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is B.', gap: 0.4 },
      { say: 'A higher temperature shifts the energy distribution, so a greater fraction of collisions has enough energy to reach the transition state.', gap: 0.4 },
      { say: "The activation energy itself doesn't change.", gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'Successful collisions need enough energy, at least E a, and the correct orientation.', cap: 'Successful collisions need enough energy (≥ Eₐ) and the correct orientation.', gap: 0.5 },
      { say: 'Only a small fraction of collisions succeed.', gap: 0.5 },
      { say: 'And a higher temperature means a much larger fraction of collisions has energy at or above E a.', cap: 'And a higher temperature means a much larger fraction of collisions has E ≥ Eₐ.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
