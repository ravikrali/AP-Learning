import type { Unit } from '../types'

// Unit 0: algebra skills the AP Statistics course assumes (prerequisite: first-year algebra). Not CED topics.

const V = 'Fall 2026'

export const unit0: Unit = {
  id: 'stats-u0',
  number: 0,
  title: 'Statistics Toolkit',
  blurb: 'The algebra AP Statistics leans on: percents and proportions, square roots and Σ, and the slope and intercept of a line.',
  badge: { name: 'Toolkit Ready', emoji: '🧰' },
  lessons: [
    {
      id: 'stats-0.1',
      ced: [],
      cedVersion: V,
      title: 'Percents, Proportions & Rounding',
      level: 'foundation',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: '"18 out of 40 students take the bus." "45% take the bus." "The proportion is 0.45." Three ways to say **exactly the same thing**. Statistics switches between them all the time.',
        },
        {
          kind: 'concept',
          title: 'Three ways to write a part of a whole',
          body: '**proportion = part ÷ whole**\n\n- 18 out of 40 → 18 ÷ 40 = **0.45** (a proportion, between 0 and 1)\n- 0.45 × 100 = **45%** (a percent)\n- "18 out of 40" or 18/40 (a fraction or ratio)\n\nTo go back: **part = proportion × whole**. 30% of 250 people is 0.30 × 250 = 75 people.',
        },
        {
          kind: 'example',
          title: 'Part, whole or proportion?',
          problem: 'In a survey, **132** of **480** teens said they read for fun every week. What proportion is that? About how many of **2,000** similar teens would you expect to say the same?',
          steps: ['Proportion = part ÷ whole = 132 ÷ 480 = **0.275** (27.5%)', 'Expected part = proportion × whole = 0.275 × 2,000 = **550 teens**'],
          answer: '0.275, and about 550 of 2,000',
          verify: [
            { stated: 0.275, compute: () => 132 / 480 },
            { stated: 550, compute: () => (132 / 480) * 2000 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's0.1-t1',
            type: 'num',
            prompt: 'A coach finds that **27 of 36** free throws went in. What **proportion** went in? (Give a decimal.)',
            answer: 0.75,
            hint: 'part ÷ whole',
            explain: '27 ÷ 36 = **0.75**, which is 75%.',
            compute: () => 27 / 36,
          },
        },
        {
          kind: 'hack',
          title: 'Keep extra digits until the end',
          body: 'Round only your **final** answer, usually to 3 or 4 decimal places in statistics. If you round 0.27519 to 0.28 in the middle of a problem and keep going, small errors pile up. Store the full number in your calculator.',
        },
        {
          kind: 'trap',
          body: '**Percent of what?** "40% of the girls play a sport" is not the same as "40% of the sport players are girls". The whole you divide by changes the answer. Always ask: *out of which group?*',
        },
        {
          kind: 'summary',
          points: ['proportion = part ÷ whole (0 to 1); percent = proportion × 100.', 'part = proportion × whole.', 'Round only at the end, and always ask "out of which group?"'],
        },
      ],
      check: [
        {
          id: 's0.1-q1',
          type: 'num',
          prompt: 'What is **12%** of **350**?',
          answer: 42,
          explain: '0.12 × 350 = **42**',
          compute: () => 0.12 * 350,
        },
        {
          id: 's0.1-q2',
          type: 'mcq',
          prompt: 'In a club, 8 of the 20 members are seniors. Which is **not** a correct way to describe this?',
          choices: ['40% of members are seniors', 'The proportion of seniors is 0.4', '8/20 of the members are seniors', '40% of seniors are members'],
          answer: 3,
          explain: 'The whole is **the club members**, so "40% of members are seniors" is right. "40% of seniors are members" divides by a different group (all seniors), which we know nothing about.',
        },
      ],
      flashcards: [
        { front: 'proportion = ?', back: 'part ÷ whole (a number from 0 to 1). Percent = proportion × 100.' },
        { front: 'When should you round in a statistics calculation?', back: 'Only at the final answer. Keep full precision in between.' },
      ],
    },
    {
      id: 'stats-0.2',
      ced: [],
      cedVersion: V,
      title: 'Square Roots, Order of Operations & Σ',
      level: 'foundation',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Almost every AP Statistics formula has a **square root** and a **Σ** (capital Greek sigma) in it. Once you can read those two symbols, the formula sheet stops looking scary.',
        },
        {
          kind: 'concept',
          title: 'Σ means "add them all up"',
          body: 'For data values 4, 7, 10:\n\n- Σx = 4 + 7 + 10 = **21**\n- Σx² = 16 + 49 + 100 = **165** (square first, then add)\n- (Σx)² = 21² = **441** (add first, then square)\n\nThe mean is x̄ = Σx ÷ n = 21 ÷ 3 = **7**.',
        },
        {
          kind: 'concept',
          title: 'Order of operations inside formulas',
          body: 'Work **inside parentheses** and **under the square root** first, then square roots, then multiply and divide, then add and subtract.\n\nExample: √(0.4 × 0.6 ÷ 96)\n1. 0.4 × 0.6 = 0.24\n2. 0.24 ÷ 96 = 0.0025\n3. √0.0025 = **0.05**\n\nOn a calculator, put the whole expression under the root in parentheses.',
        },
        {
          kind: 'example',
          title: 'A standard deviation by hand',
          problem: 'Data: **4, 7, 10**. Find s = √( Σ(x − x̄)² ÷ (n − 1) ).',
          steps: [
            'x̄ = 21 ÷ 3 = **7**',
            'Deviations x − x̄: −3, 0, 3. Squared: 9, 0, 9. Sum = **18**',
            'Divide by n − 1 = 2: 18 ÷ 2 = **9**',
            'Square root: s = √9 = **3**',
          ],
          answer: 's = 3',
          verify: [
            { stated: 18, compute: () => (4 - 7) ** 2 + (7 - 7) ** 2 + (10 - 7) ** 2 },
            { stated: 3, compute: () => Math.sqrt(18 / 2) },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's0.2-t1',
            type: 'num',
            prompt: 'Evaluate √( 0.3 × 0.7 ÷ 84 ).',
            answer: 0.05,
            hint: 'Multiply, divide, then take the square root.',
            explain: '0.3 × 0.7 = 0.21 → 0.21 ÷ 84 = 0.0025 → √0.0025 = **0.05**',
            compute: () => Math.sqrt((0.3 * 0.7) / 84),
          },
        },
        {
          kind: 'hack',
          title: 'Check your square root',
          body: 'A square root of a number between 0 and 1 is **bigger** than the number: √0.04 = 0.2. If your calculator gives you something smaller, you probably missed a parenthesis.',
        },
        {
          kind: 'trap',
          body: '**Σx² is not (Σx)².** Squaring each value then adding is different from adding then squaring. For 4, 7, 10: Σx² = 165 but (Σx)² = 441.',
        },
        {
          kind: 'summary',
          points: ['Σ = add up every value.', 'Do everything under a square root first, then take the root.', 'Σx² (square, then add) ≠ (Σx)² (add, then square).'],
        },
      ],
      check: [
        {
          id: 's0.2-q1',
          type: 'num',
          prompt: 'For the data 2, 5, 5, 8, find **Σx²**.',
          answer: 118,
          explain: '4 + 25 + 25 + 64 = **118**',
          compute: () => 2 ** 2 + 5 ** 2 + 5 ** 2 + 8 ** 2,
        },
        {
          id: 's0.2-q2',
          type: 'num',
          prompt: 'Evaluate 1.96 × √( 0.5 × 0.5 ÷ 400 ). Round to 3 decimal places.',
          answer: 0.049,
          tolerance: 0.01,
          explain: '0.25 ÷ 400 = 0.000625 → √ = 0.025 → × 1.96 = **0.049**',
          compute: () => 1.96 * Math.sqrt(0.25 / 400),
        },
        {
          id: 's0.2-q3',
          type: 'mcq',
          prompt: 'In x̄ = Σx ÷ n, what does **n** stand for?',
          choices: ['The largest value', 'The number of values', 'The sum of the values', 'The middle value'],
          answer: 1,
          explain: '**n** is the number of data values (the sample size).',
        },
      ],
      flashcards: [
        { front: 'What does Σx mean?', back: 'Add up all the x values.' },
        { front: 'Σx² vs. (Σx)²', back: 'Σx²: square each value, then add. (Σx)²: add, then square the total.' },
      ],
    },
    {
      id: 'stats-0.3',
      ced: [],
      cedVersion: V,
      title: 'Lines: Slope & Intercept',
      level: 'foundation',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: 'A taxi charges **$3 to start** plus **$2 per mile**. That sentence *is* a line: cost = 3 + 2·miles. In Unit 5 you will fit lines like this to data and use them to make predictions.',
        },
        {
          kind: 'concept',
          title: 'y = a + bx',
          body: 'Statistics writes a line as **y = a + bx** (the AP formula sheet uses ŷ = a + bx).\n\n- **b = slope**: how much y changes when x goes up by 1\n- **a = y-intercept**: the value of y when x = 0\n\nTaxi: a = 3 (the starting fee), b = 2 (dollars per extra mile). A 5-mile ride costs 3 + 2(5) = **$13**.',
        },
        {
          kind: 'example',
          title: 'Slope from two points',
          problem: 'A plant is **4 cm** tall on day 2 and **10 cm** tall on day 5. Assuming steady growth, find the slope and the intercept.',
          steps: [
            'Slope = change in y ÷ change in x = (10 − 4) ÷ (5 − 2) = 6 ÷ 3 = **2 cm per day**',
            'Intercept: 4 = a + 2(2), so a = **0 cm** (height on day 0)',
            'Line: height = 0 + 2·day',
          ],
          answer: 'b = 2 cm/day, a = 0 cm',
          verify: [
            { stated: 2, compute: () => (10 - 4) / (5 - 2) },
            { stated: 0, compute: () => 4 - 2 * 2 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's0.3-t1',
            type: 'num',
            prompt: 'Using y = 12 + 0.5x, find y when **x = 30**.',
            answer: 27,
            explain: '12 + 0.5(30) = 12 + 15 = **27**',
            compute: () => 12 + 0.5 * 30,
          },
        },
        {
          kind: 'hack',
          title: 'Read the slope as a sentence',
          body: 'Slope = "**for each 1 more** [x unit], y goes up (or down) by [b] [y units]". Saying it in words with units is exactly what AP free-response questions ask for in Unit 5.',
        },
        {
          kind: 'trap',
          body: 'In statistics the slope is **b** and the intercept is **a**, the reverse of the y = mx + b you may know from algebra. In y = a + bx, the number multiplied by x is always the slope.',
        },
        {
          kind: 'summary',
          points: ['y = a + bx: a is the intercept (y at x = 0), b is the slope.', 'Slope = change in y ÷ change in x, with units.', 'The number next to x is the slope.'],
        },
      ],
      check: [
        {
          id: 's0.3-q1',
          type: 'mcq',
          prompt: 'In y = 40 − 3x, what is the **slope**?',
          choices: ['40', '3', '−3', '37'],
          answer: 2,
          explain: 'The number multiplied by x is the slope: **−3**. So y goes **down** 3 for each 1-unit increase in x.',
        },
        {
          id: 's0.3-q2',
          type: 'num',
          prompt: 'A line passes through (1, 8) and (4, 17). What is its slope?',
          answer: 3,
          explain: '(17 − 8) ÷ (4 − 1) = 9 ÷ 3 = **3**',
          compute: () => (17 - 8) / (4 - 1),
        },
      ],
      flashcards: [
        { front: 'In y = a + bx, which letter is the slope?', back: 'b (the number multiplied by x). a is the y-intercept.' },
        { front: 'Slope formula', back: '(change in y) ÷ (change in x)' },
      ],
    },
  ],
  checkpoint: [
    {
      id: 's0-cp1',
      type: 'num',
      prompt: 'In a survey of 80 students, 0.35 of them walk to school. How many students walk?',
      answer: 28,
      explain: 'part = proportion × whole = 0.35 × 80 = **28**',
      compute: () => 0.35 * 80,
    },
    {
      id: 's0-cp2',
      type: 'num',
      prompt: 'Evaluate √( 0.2 × 0.8 ÷ 100 ).',
      answer: 0.04,
      explain: '0.16 ÷ 100 = 0.0016 → √0.0016 = **0.04**',
      compute: () => Math.sqrt((0.2 * 0.8) / 100),
    },
    {
      id: 's0-cp3',
      type: 'mcq',
      prompt: 'A line is ŷ = 5 + 2x. What is the predicted y when x = 0?',
      choices: ['0', '2', '5', '7'],
      answer: 2,
      explain: 'At x = 0, ŷ = 5 + 2(0) = **5**: the intercept.',
    },
  ],
}
