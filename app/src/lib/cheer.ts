// Short end-of-activity messages. The tone rule: celebrate effort, never shame a score,
// and always point to a hopeful next step.

export type Tier = 'great' | 'good' | 'grow' | 'try'

export function tierFor(score: number, total: number): Tier {
  if (!total) return 'great'
  const r = score / total
  return r >= 0.9 ? 'great' : r >= 0.7 ? 'good' : r >= 0.4 ? 'grow' : 'try'
}

export const CHEERS: Record<Tier, string[]> = {
  great: [
    'Nailed it! Your hard work is showing.',
    "Brilliant! That's expert-level thinking.",
    'Wow, you are on fire today! 🔥',
    'Perfect! Your brain just leveled up.',
    'Superstar work. Be proud of this one! ⭐',
  ],
  good: [
    "Strong work! You're so close to mastering this.",
    'Nice! A quick look at the misses and it is yours.',
    'Great progress. Keep that momentum going!',
    "You're getting really good at this. 💪",
  ],
  grow: [
    'Good effort! Every miss shows you exactly what to learn next.',
    "You're getting there. Mistakes are how brains grow. 🌱",
    'Real progress! A little review and this will click.',
    'Halfway up the hill already. Keep climbing!',
  ],
  try: [
    "Tough one, but you showed up and tried. That's what counts. 💛",
    'Every expert started right here. Try again tomorrow and watch it change.',
    "\"Not yet\" doesn't mean never. You will get this.",
    "Hard means your brain is growing. Proud of you for sticking with it.",
    'One step at a time. Coming back is how champions are made.',
  ],
}

export const REVIEW_CHEERS = [
  'Memory locked in! 🔒 See you next time.',
  'Quick and done. Your future self says thanks!',
  'Little reviews like this are the secret of top scorers.',
  'Done for today! These facts will stick much longer now.',
]

export function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]
}
