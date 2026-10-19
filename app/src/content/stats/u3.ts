import type { Unit } from '../types'
import { chiSquareTest, chiUpper, normalcdf, normCdf, propInterval, propTest, twoPropInterval, twoPropTest, zStar } from '../../lib/stats'

const V = 'Fall 2026'

// Worked examples (every printed number is recomputed through `verify`)
const ci1 = propInterval(132, 400, 0.95) // teens who volunteer
const t1 = propTest(87, 150, 0.5, 'greater') // students who exercise 3.5+ hours
const sdPhat = Math.sqrt((0.3 * 0.7) / 100)
const ci2 = twoPropInterval(84, 240, 63, 300, 0.95) // teens vs adults who sleep with a fan on
const t2 = twoPropTest(68, 150, 48, 150, 'greater') // reminder app experiment
const WATCH = [
  [30, 20],
  [25, 25],
  [20, 30],
]
const chi = chiSquareTest(WATCH)

export const unit3: Unit = {
  id: 'stats-u3',
  number: 3,
  title: 'Inference for Categorical Data: Proportions',
  weight: '15–25%',
  blurb:
    'Estimators and the sampling distribution of p̂, confidence intervals and significance tests for one proportion and for a difference of two proportions, errors and power, and chi-square tests for homogeneity and independence.',
  badge: { name: 'Proportion Pro', emoji: '🥧' },
  lessons: [
    // ---------------- FOUNDATION ----------------
    {
      id: 'stats-3.1',
      ced: ['3.1'],
      cedVersion: V,
      title: 'Estimators & Bias',
      level: 'foundation',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: 'You want the percent of all teens in your state who volunteer. You can\'t ask them all, so you ask 400 random teens and get 33%. Is 33% a good guess? It depends on whether your method aims at the truth, on average.',
        },
        {
          kind: 'concept',
          title: 'Point estimators',
          body: 'A sample **statistic** is a **point estimator** of the matching population **parameter**:\n\n| Parameter (population) | Point estimator (sample) |\n| p (proportion) | p̂ (sample proportion) |\n| μ (mean) | x̄ (sample mean) |\n\nThe value you calculate from your data, like p̂ = 0.33, is the **estimate**.',
        },
        {
          kind: 'concept',
          title: 'Unbiased estimators',
          body: 'An estimator is **unbiased** if, **on average** over many samples, it does **not underestimate or overestimate** the parameter. Its sampling distribution is centered at the true parameter value.\n\nUnbiased doesn\'t mean every estimate is right. It means the method has no systematic lean.',
        },
        {
          kind: 'example',
          title: 'An estimate in context',
          problem: 'In a random sample of 400 teens in a state, 132 volunteer regularly. Give a point estimate of the population proportion.',
          steps: ['p̂ = 132 ÷ 400 = **0.33**', 'We estimate that **33% of all teens in the state** volunteer regularly.'],
          answer: 'p̂ = 0.33',
          verify: [{ stated: 0.33, compute: () => 132 / 400 }],
        },
        {
          kind: 'try',
          question: {
            id: 's3.1-t1',
            type: 'mcq',
            prompt: 'A simulation shows that the sampling distribution of an estimator is centered **above** the true parameter. The estimator is…',
            choices: ['unbiased', 'biased (it tends to overestimate)', 'a parameter', 'more precise'],
            answer: 1,
            explain: 'Its average value is **higher** than the parameter, so it systematically overestimates: **biased**.',
          },
        },
        {
          kind: 'hack',
          title: 'Bias vs. variability: the dartboard',
          body: 'Unbiased = darts centered on the bullseye. Low variability = darts close together. You want both: an unbiased estimator from a large random sample.',
        },
        {
          kind: 'trap',
          body: 'p̂ is unbiased **for random samples**. A voluntary-response sample can produce a biased p̂ no matter how big it is.',
        },
        {
          kind: 'summary',
          points: ['A statistic is a point estimator of a parameter (p̂ for p, x̄ for μ).', 'Unbiased: on average it neither over- nor underestimates.', 'Unbiased ≠ always right; it means no systematic error.'],
        },
      ],
      check: [
        {
          id: 's3.1-q1',
          type: 'mcq',
          prompt: 'Which is the point estimator for a population proportion p?',
          choices: ['μ', 'x̄', 'p̂', 'σ'],
          answer: 2,
          explain: 'The sample proportion **p̂** estimates p.',
        },
        {
          id: 's3.1-q2',
          type: 'num',
          prompt: 'In a random sample of 250 shoppers, 95 used a coupon. What is the point estimate of the proportion of all shoppers who use coupons?',
          answer: 0.38,
          explain: 'p̂ = 95 ÷ 250 = **0.38**',
          compute: () => 95 / 250,
        },
      ],
      flashcards: [
        { front: 'Unbiased estimator', back: 'An estimator whose average over many samples equals the parameter: it neither over- nor underestimates on average.' },
        { front: 'Point estimate', back: 'A single value of a statistic used to estimate a parameter (e.g. p̂ = 0.33).' },
      ],
    },
    {
      id: 'stats-3.2',
      ced: ['3.2'],
      cedVersion: V,
      title: 'The Sampling Distribution of p̂',
      level: 'foundation',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'Suppose exactly 30% of a city\'s adults bike to work. In a random sample of 100, would you be surprised by 36% bikers? To decide, you need to know how much p̂ naturally varies from sample to sample.',
        },
        {
          kind: 'concept',
          title: 'Center and spread',
          body: 'For a population with proportion p and independent sampled values:\n\n- Mean: **μ_{p̂} = p**\n- Standard deviation: **σ_{p̂} = √( p(1 − p) / n )**\n\nLarger samples → smaller σ_{p̂} → p̂ is closer to p more often.',
        },
        {
          kind: 'concept',
          title: 'Conditions',
          body: 'When sampling **without replacement**:\n\n- **Randomization**: a random sample\n- **10% condition**: n ≤ 10% of N (the population is at least 10 times the sample)\n\nThe distribution of p̂ is **approximately normal** when the sample is large enough:\n\n- **np ≥ 10 and n(1 − p) ≥ 10** (expected successes and failures)',
        },
        {
          kind: 'example',
          title: 'Biking to work',
          problem: 'p = 0.30, n = 100 (random sample from a large city). Describe the sampling distribution of p̂ and find P(p̂ > 0.36).',
          steps: [
            'Mean: μ = **0.30**. SD: √(0.3 × 0.7 ÷ 100) ≈ **0.0458**',
            'Normal? np = 30 ≥ 10 and n(1 − p) = 70 ≥ 10 ✓. 10%: 100 is far less than 10% of the city\'s adults ✓',
            'z = (0.36 − 0.30) ÷ 0.0458 ≈ 1.31 → P(p̂ > 0.36) ≈ **0.095**',
          ],
          answer: 'Approximately normal, mean 0.30, SD 0.0458; P(p̂ > 0.36) ≈ 0.095',
          verify: [
            { stated: 0.0458, compute: () => sdPhat, tol: 0.001 },
            { stated: 1.31, compute: () => (0.36 - 0.3) / sdPhat, tol: 0.003 },
            { stated: 0.095, compute: () => normalcdf(0.36, Infinity, 0.3, sdPhat), tol: 0.005 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's3.2-t1',
            type: 'num',
            prompt: 'p = 0.5 and n = 400. Find σ_{p̂}.',
            answer: 0.025,
            explain: '√(0.5 × 0.5 ÷ 400) = √0.000625 = **0.025**',
            compute: () => Math.sqrt((0.5 * 0.5) / 400),
          },
        },
        {
          kind: 'hack',
          title: 'Quadruple n to halve the spread',
          body: 'σ_{p̂} has √n in the denominator. To cut the standard deviation in half, you need **4 times** the sample size.',
        },
        {
          kind: 'trap',
          body: 'The 10% condition is about **independence** (sampling without replacement), not normality. Normality comes from **np ≥ 10 and n(1 − p) ≥ 10**. Don\'t mix them up.',
        },
        {
          kind: 'summary',
          points: ['μ_{p̂} = p; σ_{p̂} = √(p(1 − p)/n).', 'Random sample and n ≤ 10% of N.', 'Approximately normal if np ≥ 10 and n(1 − p) ≥ 10.'],
        },
      ],
      check: [
        {
          id: 's3.2-q1',
          type: 'mcq',
          prompt: 'For p = 0.04, which sample size makes the sampling distribution of p̂ approximately normal?',
          choices: ['n = 50', 'n = 100', 'n = 200', 'n = 250'],
          answer: 3,
          explain: 'Need np ≥ 10: 250(0.04) = **10** ✓ and 250(0.96) = 240 ✓. n = 200 gives np = 8.',
        },
        {
          id: 's3.2-q2',
          type: 'mcq',
          prompt: 'What happens to σ_{p̂} when the sample size increases from 100 to 400?',
          choices: ['It doubles', 'It is cut in half', 'It is cut to a quarter', 'It stays the same'],
          answer: 1,
          explain: 'σ_{p̂} ∝ 1/√n, and √4 = 2, so it is **cut in half**.',
        },
      ],
      flashcards: [
        { front: 'Mean and SD of p̂', back: 'μ_{p̂} = p; σ_{p̂} = √(p(1 − p)/n)' },
        { front: 'Large counts condition for p̂', back: 'np ≥ 10 and n(1 − p) ≥ 10 (expected successes and failures)' },
      ],
    },
    {
      id: 'stats-3.3',
      ced: ['3.3'],
      cedVersion: V,
      title: 'Confidence Intervals for p: Setup',
      level: 'foundation',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'A single number like "33%" will almost never exactly equal the truth. A better answer is a **range of plausible values**: "between 28% and 38%." That range is a confidence interval.',
        },
        {
          kind: 'concept',
          title: 'What a confidence interval is',
          body: 'A **confidence interval** is an **interval estimate** for a population parameter. For one proportion, the procedure is a **one-sample z-interval for a population proportion**.\n\nDefine the **parameter** in context: the proportion, the response, and the population. Example: "p = the proportion of **all teens in the state** who **volunteer regularly**."',
        },
        {
          kind: 'concept',
          title: 'Three conditions',
          body: '1. **Randomization**: the data come from a random sample.\n2. **10% condition**: when sampling without replacement, n ≤ 10% of N.\n3. **Normality**: the **observed** numbers of successes, np̂, and failures, n(1 − p̂), are both **at least 10**.',
        },
        {
          kind: 'example',
          title: 'Check the conditions',
          problem: 'A random sample of 400 teens from a state with over 1 million teens: 132 volunteer. Check the conditions for a one-sample z-interval.',
          steps: ['**Random**: the teens were randomly sampled ✓', '**10%**: 400 ≤ 10% of over 1,000,000 teens ✓', '**Normality**: successes 132 ≥ 10 and failures 400 − 132 = **268** ≥ 10 ✓'],
          answer: 'All three conditions are met.',
          verify: [{ stated: 268, compute: () => 400 - 132 }],
        },
        {
          kind: 'try',
          question: {
            id: 's3.3-t1',
            type: 'mcq',
            prompt: 'A random sample of 60 students finds 6 who are left-handed. Why is a one-sample z-interval NOT appropriate?',
            choices: ['The sample isn\'t random', 'The number of successes, 6, is less than 10', 'n is more than 30', 'p is unknown'],
            answer: 1,
            explain: 'Normality needs observed successes **and** failures ≥ 10. Only **6 successes** fails it.',
          },
        },
        {
          kind: 'hack',
          title: 'Check conditions with numbers, in context',
          body: 'Not "random ✓, 10% ✓, large counts ✓". Write: "**The teens were randomly selected. 400 is less than 10% of all teens in the state. 132 and 268 are both at least 10.**"',
        },
        {
          kind: 'trap',
          body: 'For **intervals**, check normality with the **observed** counts (np̂ and n(1 − p̂)). For **tests** (Topic 3.5), use the **expected** counts under H₀ (np₀ and n(1 − p₀)).',
        },
        {
          kind: 'summary',
          points: ['Procedure: one-sample z-interval for p.', 'Define p in context (proportion, response, population).', 'Conditions: random, n ≤ 10%N, np̂ ≥ 10 and n(1 − p̂) ≥ 10.'],
        },
      ],
      check: [
        {
          id: 's3.3-q1',
          type: 'mcq',
          prompt: 'Which is a properly defined parameter for a confidence interval?',
          choices: ['p̂ = 0.33', 'p = the proportion of the 400 sampled teens who volunteer', 'p = the proportion of all teens in the state who volunteer regularly', 'p = 132'],
          answer: 2,
          explain: 'A parameter describes the **population** (all teens in the state), with the response (volunteer regularly).',
        },
        {
          id: 's3.3-q2',
          type: 'mcq',
          prompt: 'A random sample of 80 is taken from a club with 500 members. Which condition fails?',
          choices: ['Randomization', '10% condition', 'Normality', 'None'],
          answer: 1,
          explain: '10% of 500 is 50, and **80 > 50**, so the 10% condition fails.',
        },
      ],
      flashcards: [
        { front: 'Conditions for a one-sample z-interval for p', back: 'Random sample; n ≤ 10% of N; observed successes np̂ ≥ 10 and failures n(1 − p̂) ≥ 10.' },
        { front: 'Parameter for a CI for a proportion', back: 'p = the proportion of [population] who [response], in context.' },
      ],
    },
    // ---------------- CORE ----------------
    {
      id: 'stats-3.4',
      ced: ['3.3'],
      cedVersion: V,
      title: 'Building the Interval, SE & Sample Size',
      level: 'core',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'Every confidence interval has the same skeleton: **estimate ± margin of error**. Fill in three numbers and you\'re done.',
        },
        {
          kind: 'concept',
          title: 'The formula',
          body: '**p̂ ± z^{∗} √( p̂(1 − p̂) / n )**\n\n- **Standard error**: SE_{p̂} = √(p̂(1 − p̂)/n), an estimate of the SD of p̂. It is the typical distance between p̂ and p.\n- **Critical value** z^{∗}: bounds the middle C% of the standard normal (1.645 for 90%, 1.96 for 95%, 2.576 for 99%).\n- **Margin of error** = z^{∗} × SE = half the width of the interval.',
        },
        {
          kind: 'example',
          title: 'Teens who volunteer',
          problem: 'n = 400, 132 successes. Build a 95% confidence interval for p.',
          steps: [
            'p̂ = 0.33; SE = √(0.33 × 0.67 ÷ 400) ≈ **0.0235**',
            'z^{∗} = 1.96; margin of error = 1.96 × 0.0235 ≈ **0.0461**',
            'Interval: 0.33 ± 0.0461 = (**0.284**, **0.376**)',
          ],
          answer: '(0.284, 0.376)',
          verify: [
            { stated: 0.0235, compute: () => ci1.se, tol: 0.002 },
            { stated: 0.0461, compute: () => ci1.me, tol: 0.002 },
            { stated: 0.284, compute: () => ci1.lo, tol: 0.002 },
            { stated: 0.376, compute: () => ci1.hi, tol: 0.002 },
          ],
        },
        {
          kind: 'concept',
          title: 'Choosing a sample size',
          body: 'Solve the margin of error for n:\n\n**n = z^{∗2} p̂(1 − p̂) / MOE²**\n\nIf you have no estimate of p, use **p̂ = 0.5**: it gives the largest (safest) sample size. Always **round up**.',
        },
        {
          kind: 'example',
          title: 'How many to survey?',
          problem: 'What sample size gives a 95% margin of error of at most 0.03, with no prior estimate of p?',
          steps: ['n = 1.96² × 0.5 × 0.5 ÷ 0.03² = 3.8416 × 0.25 ÷ 0.0009 ≈ **1067.1**', 'Round **up**: **n = 1,068**'],
          answer: 'n = 1,068',
          verify: [
            { stated: 1067.1, compute: () => (1.96 ** 2 * 0.25) / 0.03 ** 2, tol: 0.001 },
            { stated: 1068, compute: () => Math.ceil((1.96 ** 2 * 0.25) / 0.03 ** 2) },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's3.4-t1',
            type: 'num',
            prompt: 'A random sample of 200 voters: 116 support a measure. Find the **margin of error** for a 90% confidence interval (z^{∗} = 1.645). Round to 4 decimals.',
            answer: 0.0574,
            tolerance: 0.01,
            explain: 'p̂ = 0.58; SE = √(0.58 × 0.42 ÷ 200) ≈ 0.0349; ME = 1.645 × 0.0349 ≈ **0.0574**',
            compute: () => propInterval(116, 200, 0.9).me,
          },
        },
        {
          kind: 'hack',
          title: 'Write the formula with your numbers',
          body: 'On free response: "0.33 ± 1.96 √(0.33(0.67)/400) = (0.284, 0.376)". Showing the plugged-in formula earns credit even if your calculator gave the interval directly.',
        },
        {
          kind: 'trap',
          body: 'Sample-size answers are **always rounded up**. n = 1067.1 means 1,068, even though 1067.1 would normally round down.',
        },
        {
          kind: 'summary',
          points: ['p̂ ± z^{∗}√(p̂(1 − p̂)/n).', 'SE = √(p̂(1 − p̂)/n); MOE = z^{∗} × SE = half the width.', 'Sample size: n = z^{∗2}p̂(1 − p̂)/MOE², use p̂ = 0.5 if unknown, round up.'],
        },
      ],
      check: [
        {
          id: 's3.4-q1',
          type: 'num',
          prompt: 'What is z^{∗} for a 99% confidence interval? (3 decimals)',
          answer: 2.576,
          tolerance: 0.001,
          explain: 'The middle 99% leaves 0.5% in each tail: z^{∗} ≈ **2.576**.',
          compute: () => zStar(0.99),
        },
        {
          id: 's3.4-q2',
          type: 'num',
          prompt: 'A 95% interval for p is (0.42, 0.50). What is the margin of error?',
          answer: 0.04,
          explain: 'Half the width: (0.50 − 0.42) ÷ 2 = **0.04**',
          compute: () => (0.5 - 0.42) / 2,
        },
        {
          id: 's3.4-q3',
          type: 'num',
          prompt: 'What sample size gives a 90% margin of error of at most 0.05 if a pilot study found p̂ = 0.2? (z^{∗} = 1.645)',
          answer: 174,
          explain: 'n = 1.645² × 0.2 × 0.8 ÷ 0.05² ≈ 173.2 → round up to **174**',
          compute: () => Math.ceil((1.645 ** 2 * 0.2 * 0.8) / 0.05 ** 2),
        },
      ],
      flashcards: [
        { front: 'One-sample z-interval for p', back: 'p̂ ± z^{∗}√(p̂(1 − p̂)/n)' },
        { front: 'Minimum sample size for a margin of error', back: 'n = z^{∗2}p̂(1 − p̂)/MOE²; use p̂ = 0.5 if no estimate; round up.' },
      ],
    },
    {
      id: 'stats-3.5',
      ced: ['3.4'],
      cedVersion: V,
      title: 'Interpreting Confidence Intervals',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'Two sentences that sound alike: "We are 95% confident the interval captures p" and "There is a 95% chance p is in this interval." Only the first is right. Here\'s why, and how to write it every time.',
        },
        {
          kind: 'concept',
          title: 'Interpreting the interval',
          body: 'Template:\n\n"We are **C% confident** that the interval from **a** to **b** captures the **[parameter in context]**."\n\nExample: "We are 95% confident that the interval from 0.284 to 0.376 captures the proportion of all teens in the state who volunteer regularly."\n\nA computed interval **may or may not** contain p; we never know for sure.',
        },
        {
          kind: 'concept',
          title: 'Interpreting the confidence level',
          body: '"In repeated random sampling with the same sample size, **about C% of the intervals** calculated would **capture the population proportion**."\n\nThe confidence level is about the **method**, not about one interval.',
          diagram: 'st-ci-capture',
        },
        {
          kind: 'concept',
          title: 'Using an interval to judge a claim',
          body: 'The interval gives **plausible values** for p.\n\n- A claimed value **inside** the interval is plausible: no convincing evidence against it.\n- A claimed value **outside** the interval is not plausible: convincing evidence against it.\n\nExample: (0.284, 0.376) is entirely below 0.40, so there is convincing evidence that fewer than 40% of the state\'s teens volunteer.',
        },
        {
          kind: 'concept',
          title: 'What changes the width?',
          body: '- **Higher confidence level** → larger z^{∗} → larger margin of error → **wider** interval.\n- **Larger sample size** → smaller SE → **narrower** interval. Width is roughly proportional to 1/√n, so 4× the sample halves the width.',
        },
        {
          kind: 'try',
          question: {
            id: 's3.5-t1',
            type: 'mcq',
            prompt: 'A 90% interval is rebuilt from the same data at 95% confidence. What happens?',
            choices: ['The interval gets narrower', 'The interval gets wider', 'The standard error decreases', 'The margin of error stays the same'],
            answer: 1,
            explain: 'Higher confidence → larger z^{∗} → larger margin of error → **wider** interval. The SE doesn\'t change (same data).',
          },
        },
        {
          kind: 'hack',
          title: 'Two interpretations, two sentences',
          body: '**Interval**: "We are 95% confident that (a, b) captures [parameter in context]." **Level**: "If we took many random samples of this size, about 95% of the resulting intervals would capture [parameter]."',
        },
        {
          kind: 'trap',
          body: 'Never say "95% of the data are in the interval" or "95% of samples have p̂ in the interval." The interval estimates the **parameter**, not individual values or sample statistics.',
        },
        {
          kind: 'summary',
          points: ['"We are C% confident that (a, b) captures [parameter in context]."', 'Confidence level: about C% of intervals from repeated samples capture the parameter.', 'Values outside the interval are not plausible; higher confidence → wider; larger n → narrower.'],
        },
      ],
      check: [
        {
          id: 's3.5-q1',
          type: 'mcq',
          prompt: 'A 95% interval for the proportion of a city\'s adults who own an electric car is (0.08, 0.14). A dealer claims 15% own one. What can you conclude?',
          choices: [
            'The claim is plausible',
            'There is convincing evidence the proportion is less than 15%, because 0.15 is above the interval',
            'Exactly 11% own one',
            '95% of adults own between 8% and 14% electric cars',
          ],
          answer: 1,
          explain: '0.15 is **not** in the interval of plausible values; the whole interval is below it.',
        },
        {
          id: 's3.5-q2',
          type: 'mcq',
          prompt: 'Which is a correct interpretation of the 95% confidence **level**?',
          choices: [
            'There is a 95% probability that p is between a and b',
            'About 95% of all intervals built this way from repeated random samples would capture the true p',
            '95% of the sample said yes',
            'The interval contains 95% of the population',
          ],
          answer: 1,
          explain: 'The level describes the long-run **capture rate of the method**.',
        },
        {
          id: 's3.5-q3',
          type: 'mcq',
          prompt: 'To cut the width of a confidence interval in half (same confidence level), you should…',
          choices: ['double the sample size', 'quadruple the sample size', 'halve the sample size', 'use a 50% confidence level'],
          answer: 1,
          explain: 'Width ∝ 1/√n, so you need **4 times** the sample size.',
        },
      ],
      flashcards: [
        { front: 'Interpret a 95% confidence interval', back: 'We are 95% confident that the interval from a to b captures the [parameter in context].' },
        { front: 'Interpret the 95% confidence level', back: 'In repeated random sampling with the same n, about 95% of the intervals would capture the parameter.' },
        { front: 'Effect of a higher confidence level', back: 'Larger critical value and margin of error: a wider interval.' },
      ],
    },
    {
      id: 'stats-3.6',
      ced: ['3.5'],
      cedVersion: V,
      title: 'Setting Up a Test for p',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'A principal claims **more than half** of the school\'s students exercise at least 3.5 hours a week. A random sample of 150 students finds 58% do. Is that convincing, or could 58% happen by chance even if the true figure were 50%? A significance test decides.',
        },
        {
          kind: 'concept',
          title: 'Hypotheses',
          body: 'A **hypothesis test** uses data to make a decision about a parameter. For one proportion: a **one-sample z-test for a population proportion**.\n\n- **Null hypothesis H₀**: the status quo, assumed true unless there is convincing evidence otherwise. **H₀: p = p₀**\n- **Alternative hypothesis Hₐ**: the claim we are collecting evidence **for**. **Hₐ: p > p₀**, **p < p₀** (one-sided) or **p ≠ p₀** (two-sided)\n\nHypotheses are **always about parameters**, defined in context.',
        },
        {
          kind: 'example',
          title: 'Write the hypotheses',
          problem: 'Principal\'s claim: more than half of the students exercise at least 3.5 hours per week.',
          steps: [
            'Parameter: p = the proportion of **all students at the school** who exercise at least 3.5 hours per week.',
            'H₀: p = 0.5',
            'Hₐ: p > 0.5 (the claim)',
          ],
          answer: 'H₀: p = 0.5, Hₐ: p > 0.5',
        },
        {
          kind: 'concept',
          title: 'Conditions for the z-test',
          body: '1. **Randomization**: a random sample.\n2. **10% condition**: n ≤ 10% of N (when sampling without replacement).\n3. **Normality**: the **expected** successes and failures, **np₀** and **n(1 − p₀)**, are both **at least 10**.\n\nWe use p₀ because the test assumes H₀ is true.',
        },
        {
          kind: 'try',
          question: {
            id: 's3.6-t1',
            type: 'mcq',
            prompt: 'A company says 20% of its customers return a product. A consumer group suspects the true rate is **different**. Which hypotheses fit?',
            choices: ['H₀: p = 0.2, Hₐ: p > 0.2', 'H₀: p = 0.2, Hₐ: p ≠ 0.2', 'H₀: p̂ = 0.2, Hₐ: p̂ ≠ 0.2', 'H₀: p ≠ 0.2, Hₐ: p = 0.2'],
            answer: 1,
            explain: '"Different" → two-sided **Hₐ: p ≠ 0.2**, with H₀: p = 0.2. Hypotheses use **p**, never p̂.',
          },
        },
        {
          kind: 'hack',
          title: 'The claim decides the direction',
          body: '"More than" → >. "Less than", "fewer", "decreased" → <. "Different", "changed" → ≠. The equal sign always goes in H₀.',
        },
        {
          kind: 'trap',
          body: '**Never write hypotheses with p̂.** You already know p̂ (it\'s 0.58); there\'s nothing to test about it. Hypotheses are about the unknown population p.',
        },
        {
          kind: 'summary',
          points: ['Procedure: one-sample z-test for p.', 'H₀: p = p₀; Hₐ: >, < or ≠ p₀, about the parameter in context.', 'Conditions: random, n ≤ 10%N, np₀ ≥ 10 and n(1 − p₀) ≥ 10.'],
        },
      ],
      check: [
        {
          id: 's3.6-q1',
          type: 'mcq',
          prompt: 'For H₀: p = 0.05 with n = 150, does the normality condition hold?',
          choices: ['Yes: 150 ≥ 30', 'No: np₀ = 7.5 < 10', 'Yes: n(1 − p₀) = 142.5 ≥ 10', 'Can\'t tell without p̂'],
          answer: 1,
          explain: 'Both expected counts must be ≥ 10. np₀ = 150(0.05) = **7.5**, which fails.',
        },
        {
          id: 's3.6-q2',
          type: 'mcq',
          prompt: 'In AP Statistics, a one-sided H₀ like "p ≤ 0.5" is tested…',
          choices: ['at p = 0.5, the boundary of equality', 'at p = 0', 'at p̂', 'it can\'t be tested'],
          answer: 0,
          explain: 'The null is tested at the boundary of equality, **p = 0.5**.',
        },
      ],
      flashcards: [
        { front: 'Null vs. alternative hypothesis', back: 'H₀: status quo (contains equality), assumed true. Hₐ: the claim we look for evidence for.' },
        { front: 'Normality condition for a one-proportion z-test', back: 'np₀ ≥ 10 and n(1 − p₀) ≥ 10 (expected counts under H₀).' },
      ],
    },
    {
      id: 'stats-3.7',
      ced: ['3.6'],
      cedVersion: V,
      title: 'What a p-Value Means',
      level: 'core',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'The p-value is the most misunderstood number in statistics. It is **not** the chance H₀ is true. It answers a narrower question: **if H₀ were true, how surprising would our result be?**',
        },
        {
          kind: 'concept',
          title: 'Definition',
          body: 'Assuming H₀ is true, the test statistic has a distribution called the **null distribution**. The **p-value** is the probability of getting a test statistic **as extreme or more extreme** than the one observed (in the direction of Hₐ), **given that H₀ is true**.\n\n- Hₐ: > → area **at or above** the observed z\n- Hₐ: < → area **at or below** it\n- Hₐ: ≠ → area in **both tails** beyond ±|z|',
          diagram: 'st-pvalue',
        },
        {
          kind: 'concept',
          title: 'Small and large p-values',
          body: '- **Small** p-value: the result would be **unusual** if H₀ were true → evidence **for Hₐ**. The smaller, the more convincing.\n- **Not small**: the result would **not be unusual** under H₀ → **not convincing** evidence for Hₐ. It is **not** evidence that H₀ is true.',
        },
        {
          kind: 'concept',
          title: 'From a simulation',
          body: 'If the null distribution was **simulated**, the p-value is the **proportion of simulated values** as extreme or more extreme than the observed statistic. Example: 23 of 1,000 simulated p̂\'s are at or above the observed 0.58 → p-value ≈ **0.023**.',
        },
        {
          kind: 'try',
          question: {
            id: 's3.7-t1',
            type: 'mcq',
            prompt: 'A test of H₀: p = 0.5 vs. Hₐ: p > 0.5 gives p-value = 0.03. Which interpretation is correct?',
            choices: [
              'There is a 3% chance that p = 0.5',
              'Assuming the true proportion is 0.5, there is a 3% chance of getting a sample proportion as large or larger than the one observed',
              'There is a 97% chance Hₐ is true',
              '3% of the sample said yes',
            ],
            answer: 1,
            explain: 'A p-value is computed **assuming H₀ is true** and gives the chance of a result **as extreme or more extreme** than observed.',
          },
        },
        {
          kind: 'hack',
          title: 'p-value interpretation template',
          body: '"**Assuming** [H₀ in context, e.g. the true proportion of all students who exercise 3.5+ hours is 0.5], there is a **[p-value]** probability of getting a sample proportion of **[observed] or greater** by chance alone."',
        },
        {
          kind: 'trap',
          body: 'A large p-value does **not** prove H₀. "We accept H₀" and "this proves p = 0.5" are wrong. Say there is **not convincing evidence** for Hₐ.',
        },
        {
          kind: 'summary',
          points: ['p-value: P(result as or more extreme | H₀ true), in the direction of Hₐ.', 'Small p-value → evidence for Hₐ; not small → not convincing evidence.', 'A p-value never proves H₀.'],
        },
      ],
      check: [
        {
          id: 's3.7-q1',
          type: 'num',
          prompt: 'For a two-sided test, the observed z = −2.1. What is the p-value? (Round to 4 decimals.)',
          answer: 0.0357,
          tolerance: 0.01,
          explain: 'Both tails: 2 × P(Z ≤ −2.1) = 2 × 0.0179 ≈ **0.0357**',
          compute: () => 2 * normCdf(-2.1),
        },
        {
          id: 's3.7-q2',
          type: 'mcq',
          prompt: 'In a simulation of 500 samples assuming H₀ is true, 4 gave a statistic as extreme as the observed one. The p-value is about…',
          choices: ['0.004', '0.008', '0.04', '0.4'],
          answer: 1,
          explain: '4 ÷ 500 = **0.008**',
        },
      ],
      flashcards: [
        { front: 'p-value', back: 'The probability, assuming H₀ is true, of a test statistic as extreme or more extreme than the observed one.' },
        { front: 'What does a large p-value mean?', back: 'The result is not unusual if H₀ is true: not convincing evidence for Hₐ (not proof of H₀).' },
      ],
    },
    {
      id: 'stats-3.8',
      ced: ['3.7'],
      cedVersion: V,
      title: 'Carrying Out a One-Proportion z-Test',
      level: 'core',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'Time to put it together: hypotheses, conditions, test statistic, p-value, decision, conclusion. This four-step structure earns most of the points on inference free-response questions.',
        },
        {
          kind: 'concept',
          title: 'Test statistic and decision',
          body: '**z = (p̂ − p₀) / √( p₀(1 − p₀)/n )**\n\nWhen H₀ is true, z has a standard normal distribution. Find the p-value from Table A or technology.\n\nThe **significance level α** is chosen before collecting data (often 0.05). It is the probability of rejecting H₀ when H₀ is true.\n\n- p-value **≤ α** → **reject H₀**: convincing evidence for Hₐ\n- p-value **> α** → **fail to reject H₀**: not convincing evidence for Hₐ',
        },
        {
          kind: 'example',
          title: 'The principal\'s claim',
          problem: 'H₀: p = 0.5, Hₐ: p > 0.5, α = 0.05. A random sample of 150 of the school\'s 1,800 students: 87 exercise at least 3.5 hours per week.',
          steps: [
            '**Conditions**: random sample ✓; 150 ≤ 10% of 1,800 (= 180) ✓; 150(0.5) = 75 and 150(0.5) = 75 are both ≥ 10 ✓. One-sample z-test for p.',
            'p̂ = 87 ÷ 150 = **0.58**; z = (0.58 − 0.5) ÷ √(0.5 × 0.5 ÷ 150) ≈ **1.96**',
            'p-value = P(Z ≥ 1.96) ≈ **0.025**',
            'Because 0.025 < α = 0.05, **reject H₀**. There is convincing statistical evidence that more than half of all students at the school exercise at least 3.5 hours per week.',
          ],
          answer: 'z ≈ 1.96, p-value ≈ 0.025, reject H₀.',
          verify: [
            { stated: 0.58, compute: () => 87 / 150 },
            { stated: 1.96, compute: () => t1.z, tol: 0.003 },
            { stated: 0.025, compute: () => t1.p, tol: 0.01 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's3.8-t1',
            type: 'num',
            prompt: 'H₀: p = 0.3, Hₐ: p < 0.3. A random sample of 200 gives 48 successes. Find the test statistic z. (Round to 2 decimals.)',
            answer: -1.85,
            tolerance: 0.01,
            explain: 'p̂ = 0.24; z = (0.24 − 0.3) ÷ √(0.3 × 0.7 ÷ 200) = −0.06 ÷ 0.0324 ≈ **−1.85**',
            compute: () => propTest(48, 200, 0.3, 'less').z,
          },
        },
        {
          kind: 'hack',
          title: 'The conclusion sentence',
          body: '"Because the p-value of **0.025** is **less than α = 0.05**, we **reject H₀**. There is **convincing statistical evidence** that **[Hₐ in context: the proportion of all … is greater than 0.5]**." Link p-value to α **explicitly**, every time.',
        },
        {
          kind: 'trap',
          body: 'Conclusions are about **Hₐ**, stated in context, with **non-definitive** language: "convincing evidence that…", never "this proves…". When you fail to reject, don\'t say H₀ is true.',
        },
        {
          kind: 'frq',
          body: 'The inference question (Question 3) is usually scored on: identifying the procedure, hypotheses with a defined parameter, conditions checked in context, correct test statistic and p-value, and a conclusion in context that compares the p-value to α.',
        },
        {
          kind: 'summary',
          points: ['z = (p̂ − p₀)/√(p₀(1 − p₀)/n), standard normal under H₀.', 'p-value ≤ α → reject H₀; p-value > α → fail to reject.', 'Conclude about Hₐ in context with non-definitive language.'],
        },
      ],
      check: [
        {
          id: 's3.8-q1',
          type: 'num',
          prompt: 'For z = −1.85 and Hₐ: p < 0.3, find the p-value. (Round to 3 decimals.)',
          answer: 0.032,
          tolerance: 0.02,
          explain: 'P(Z ≤ −1.85) ≈ **0.032**',
          compute: () => propTest(48, 200, 0.3, 'less').p,
        },
        {
          id: 's3.8-q2',
          type: 'mcq',
          prompt: 'A test at α = 0.05 gives p-value = 0.12. Which conclusion is correct?',
          choices: [
            'Reject H₀; there is convincing evidence for Hₐ',
            'Fail to reject H₀; there is not convincing evidence for Hₐ',
            'Accept H₀; H₀ is proven true',
            'Reject Hₐ',
          ],
          answer: 1,
          explain: '0.12 > 0.05, so **fail to reject H₀**: not convincing evidence for Hₐ. We never "accept" or prove H₀.',
        },
      ],
      flashcards: [
        { front: 'Test statistic for one proportion', back: 'z = (p̂ − p₀) / √(p₀(1 − p₀)/n)' },
        { front: 'Decision rule', back: 'Reject H₀ if p-value ≤ α; otherwise fail to reject H₀.' },
      ],
    },
    {
      id: 'stats-3.9',
      ced: ['3.8'],
      cedVersion: V,
      title: 'Type I & Type II Errors, Power',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'A smoke alarm can fail two ways: it can beep when there is no fire, or stay silent during a real fire. Hypothesis tests can fail in the same two ways.',
        },
        {
          kind: 'concept',
          title: 'The two errors',
          body: '| | H₀ true | Hₐ true |\n| Reject H₀ | **Type I error** | correct (power) |\n| Fail to reject H₀ | correct | **Type II error** |\n\n- **Type I**: convincing evidence for Hₐ (small p-value), but Hₐ is **not** true. A false alarm.\n- **Type II**: not convincing evidence for Hₐ (large p-value), but Hₐ **is** true. A missed detection.\n- **Power**: the probability of correctly rejecting a false H₀.',
        },
        {
          kind: 'concept',
          title: 'Probabilities',
          body: '- P(Type I error) = **α**, set before collecting data (e.g. 0.01, 0.05, 0.10).\n- P(Type II error) = **1 − power**. Ideally small, e.g. ≤ 0.20 (power ≥ 0.80).\n\nPower **increases** (and P(Type II) decreases) when, with the others unchanged:\n- the **sample size** increases\n- the **standard error** decreases\n- the true parameter is **farther from** the null value\n- **α** increases',
        },
        {
          kind: 'example',
          title: 'Describe the errors in context',
          problem: 'H₀: p = 0.5, Hₐ: p < 0.5, where p = the proportion of a town\'s voters who support a new tax. Describe a Type II error and one consequence.',
          steps: [
            'Type II: **failing to reject H₀** when Hₐ is true.',
            'In context: concluding there is **not convincing evidence that fewer than half** support the tax, when in fact **fewer than half do**.',
            'Consequence: the town might push ahead with a tax that most voters oppose.',
          ],
          answer: 'Fail to find evidence that p < 0.5 when p really is < 0.5.',
        },
        {
          kind: 'try',
          question: {
            id: 's3.9-t1',
            type: 'mcq',
            prompt: 'For H₀: p = 0.5 vs. Hₐ: p < 0.5 at α = 0.10, which is a Type II error?',
            choices: [
              'Rejecting H₀ when p = 0.5',
              'Rejecting H₀ when p < 0.5',
              'Failing to reject H₀ when p = 0.5',
              'Failing to reject H₀ when p < 0.5',
            ],
            answer: 3,
            explain: 'Type II = **failing to reject** H₀ when Hₐ is **true** (p really is less than 0.5).',
          },
        },
        {
          kind: 'hack',
          title: 'Which error is worse? Pick α to match',
          body: 'If a **Type I** error is costly (e.g. approving an ineffective drug), use a **smaller α**. If a **Type II** error is costly (e.g. missing a contamination), use a larger α or a **larger sample** to increase power.',
        },
        {
          kind: 'trap',
          body: 'You can only make a Type I error if you **reject** H₀, and only a Type II error if you **fail to reject**. After a decision, only one of them is possible.',
        },
        {
          kind: 'summary',
          points: ['Type I: reject a true H₀ (probability α). Type II: fail to reject a false H₀ (probability 1 − power).', 'Power rises with larger n, smaller SE, larger α, or a true value farther from p₀.', 'Weigh the consequences of each error when choosing α and n.'],
        },
      ],
      check: [
        {
          id: 's3.9-q1',
          type: 'num',
          prompt: 'A test has power 0.85 against a particular alternative. What is P(Type II error) for that alternative?',
          answer: 0.15,
          explain: 'P(Type II) = 1 − power = 1 − 0.85 = **0.15**',
          compute: () => 1 - 0.85,
        },
        {
          id: 's3.9-q2',
          type: 'mcq',
          prompt: 'Which change increases the power of a test (all else the same)?',
          choices: ['Decreasing the sample size', 'Decreasing α from 0.05 to 0.01', 'Increasing the sample size', 'Making the true p closer to p₀'],
          answer: 2,
          explain: 'A **larger sample** decreases the standard error, increasing power.',
        },
        {
          id: 's3.9-q3',
          type: 'mcq',
          prompt: 'A test is run at α = 0.05. What is the probability of a Type I error if H₀ is true?',
          choices: ['0.95', '0.05', '1 − power', 'Unknown'],
          answer: 1,
          explain: 'P(Type I error) = **α = 0.05**.',
        },
      ],
      flashcards: [
        { front: 'Type I error', back: 'Rejecting H₀ when H₀ is actually true (probability α).' },
        { front: 'Type II error', back: 'Failing to reject H₀ when Hₐ is actually true (probability 1 − power).' },
        { front: 'Ways to increase power', back: 'Larger sample size, smaller standard error, larger α, true value farther from the null.' },
      ],
    },
    // ---------------- ADVANCED ----------------
    {
      id: 'stats-3.10',
      ced: ['3.9'],
      cedVersion: V,
      title: 'Sampling Distribution of p̂₁ − p̂₂',
      level: 'advanced',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Do more teens than adults use a certain app? With two random samples, the difference p̂₁ − p̂₂ will bounce around from sample to sample. Its sampling distribution tells us how much.',
        },
        {
          kind: 'concept',
          title: 'Center and spread',
          body: 'For two independent populations with proportions p₁ and p₂:\n\n- **μ_{p̂₁−p̂₂} = p₁ − p₂**\n- **σ_{p̂₁−p̂₂} = √( p₁(1 − p₁)/n₁ + p₂(1 − p₂)/n₂ )**\n\nVariances add, even though we subtract the proportions.',
        },
        {
          kind: 'concept',
          title: 'Conditions',
          body: '- **Randomization**: two **independent random samples** (or, for an experiment, random assignment of treatments; then only this condition is needed).\n- **10% condition** (sampling without replacement): n₁ ≤ 10% of N₁ and n₂ ≤ 10% of N₂.\n- **Normality**: n₁p₁, n₁(1 − p₁), n₂p₂, n₂(1 − p₂) are all **at least 10**.',
        },
        {
          kind: 'example',
          title: 'Two towns',
          problem: 'In Town 1, 40% of adults recycle daily; in Town 2, 30%. Independent random samples: n₁ = 200, n₂ = 150. Describe the sampling distribution of p̂₁ − p̂₂.',
          steps: [
            'Mean: 0.40 − 0.30 = **0.10**',
            'SD: √(0.4 × 0.6 ÷ 200 + 0.3 × 0.7 ÷ 150) = √(0.0012 + 0.0014) ≈ **0.0510**',
            'Normal? 200(0.4) = 80, 200(0.6) = 120, 150(0.3) = 45, 150(0.7) = 105, all ≥ 10 ✓',
          ],
          answer: 'Approximately normal, mean 0.10, SD ≈ 0.0510',
          verify: [
            { stated: 0.1, compute: () => 0.4 - 0.3, tol: 1e-9 },
            { stated: 0.051, compute: () => Math.sqrt((0.4 * 0.6) / 200 + (0.3 * 0.7) / 150), tol: 0.002 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's3.10-t1',
            type: 'num',
            prompt: 'Using the two towns (mean 0.10, SD 0.0510), find P(p̂₁ − p̂₂ < 0), the chance the sample shows Town 2 ahead. (Round to 3 decimals.)',
            answer: 0.025,
            tolerance: 0.03,
            explain: 'z = (0 − 0.10) ÷ 0.0510 ≈ −1.96 → P ≈ **0.025**',
            compute: () => normalcdf(-Infinity, 0, 0.1, Math.sqrt((0.4 * 0.6) / 200 + (0.3 * 0.7) / 150)),
          },
        },
        {
          kind: 'hack',
          title: 'Interpret the SD in context',
          body: '"The difference in sample proportions (Town 1 − Town 2) typically varies by about 0.051 from the true difference of 0.10, in repeated random samples of these sizes."',
        },
        {
          kind: 'trap',
          body: 'σ_{p̂₁−p̂₂} is **not** σ_{p̂₁} − σ_{p̂₂}. Add the variances (the squares) inside one square root.',
        },
        {
          kind: 'summary',
          points: ['Mean p₁ − p₂; SD √(p₁(1 − p₁)/n₁ + p₂(1 − p₂)/n₂).', 'Independent random samples (or random assignment); 10% for each sample.', 'All four expected counts ≥ 10 for approximate normality.'],
        },
      ],
      check: [
        {
          id: 's3.10-q1',
          type: 'mcq',
          prompt: 'If data come from a randomized experiment, which condition must be met for the sampling distribution of p̂₁ − p̂₂?',
          choices: ['Only the randomization condition (random assignment)', 'The 10% condition only', 'Both samples must be random samples from populations', 'n₁ = n₂'],
          answer: 0,
          explain: 'For an experiment, the data only need the **randomization condition**: treatments randomly assigned.',
        },
        {
          id: 's3.10-q2',
          type: 'num',
          prompt: 'p₁ = 0.5, n₁ = 100, p₂ = 0.5, n₂ = 100. Find σ_{p̂₁−p̂₂}. (Round to 4 decimals.)',
          answer: 0.0707,
          tolerance: 0.01,
          explain: '√(0.25/100 + 0.25/100) = √0.005 ≈ **0.0707**',
          compute: () => Math.sqrt(0.25 / 100 + 0.25 / 100),
        },
      ],
      flashcards: [
        { front: 'SD of p̂₁ − p̂₂', back: '√( p₁(1 − p₁)/n₁ + p₂(1 − p₂)/n₂ )' },
        { front: 'Normality condition for p̂₁ − p̂₂', back: 'n₁p₁, n₁(1 − p₁), n₂p₂, n₂(1 − p₂) all at least 10.' },
      ],
    },
    {
      id: 'stats-3.11',
      ced: ['3.10', '3.11'],
      cedVersion: V,
      title: 'Two-Proportion z-Interval',
      level: 'advanced',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'A survey finds 35% of teens but only 21% of adults sleep with a fan on. How big is the real difference between **all** teens and **all** adults? A two-proportion interval estimates it.',
        },
        {
          kind: 'concept',
          title: 'Procedure, parameter, conditions',
          body: 'Procedure: **two-sample z-interval for a difference between population proportions**.\n\nParameter: **p₁ − p₂**, the difference in proportions, with the response and both populations in context.\n\nConditions:\n1. **Randomization**: two independent random samples **or** a randomized experiment\n2. **10%**: n₁ ≤ 10%N₁ and n₂ ≤ 10%N₂ (not needed for a randomized experiment)\n3. **Normality**: **observed** successes and failures in **both** samples are at least 10',
        },
        {
          kind: 'concept',
          title: 'The interval',
          body: '**(p̂₁ − p̂₂) ± z^{∗} √( p̂₁(1 − p̂₁)/n₁ + p̂₂(1 − p̂₂)/n₂ )**\n\nThe square-root part is the standard error; z^{∗} × SE is the margin of error.',
        },
        {
          kind: 'example',
          title: 'Fans at night',
          problem: 'Random samples: 84 of 240 teens and 63 of 300 adults sleep with a fan on. Build a 95% interval for p_{teens} − p_{adults}.',
          steps: [
            'p̂₁ = 84/240 = **0.35**; p̂₂ = 63/300 = **0.21**; difference = **0.14**',
            'Conditions: independent random samples ✓; samples are less than 10% of all teens and adults ✓; 84, 156, 63, 237 all ≥ 10 ✓',
            'SE = √(0.35 × 0.65 ÷ 240 + 0.21 × 0.79 ÷ 300) ≈ **0.0387**',
            '0.14 ± 1.96(0.0387) = (**0.064**, **0.216**)',
          ],
          answer: '(0.064, 0.216)',
          verify: [
            { stated: 0.14, compute: () => ci2.diff, tol: 1e-6 },
            { stated: 0.0387, compute: () => ci2.se, tol: 0.002 },
            { stated: 0.064, compute: () => ci2.lo, tol: 0.01 },
            { stated: 0.216, compute: () => ci2.hi, tol: 0.003 },
          ],
        },
        {
          kind: 'concept',
          title: 'Interpret and use it',
          body: '"We are 95% confident that the interval from 0.064 to 0.216 captures the **difference** (teens − adults) in the proportions of **all teens and all adults** who sleep with a fan on."\n\n- Interval **contains 0** → not convincing evidence of a difference.\n- Interval **doesn\'t contain 0** → convincing evidence of a difference. Here **all positive** → evidence teens\' proportion is higher.',
        },
        {
          kind: 'try',
          question: {
            id: 's3.11-t1',
            type: 'mcq',
            prompt: 'A 95% interval for p_{A} − p_{B} is (−0.03, 0.08). What does it suggest?',
            choices: [
              'A\'s proportion is definitely higher',
              'There is not convincing evidence of a difference, because 0 is in the interval',
              'B\'s proportion is higher',
              'The proportions are exactly equal',
            ],
            answer: 1,
            explain: '0 is a plausible value for the difference, so there\'s **not convincing evidence** of a difference (but no proof they are equal either).',
          },
        },
        {
          kind: 'hack',
          title: 'Keep the order of subtraction',
          body: 'Say which group is "1": a positive interval for teens − adults means teens are higher. If you flip the order, the interval flips sign too.',
        },
        {
          kind: 'trap',
          body: 'The interval estimates a **difference in population proportions**. Don\'t interpret it as a range for either single proportion.',
        },
        {
          kind: 'summary',
          points: ['(p̂₁ − p̂₂) ± z^{∗}√(p̂₁(1 − p̂₁)/n₁ + p̂₂(1 − p̂₂)/n₂).', 'Conditions: independent random samples or randomized experiment; 10% (samples only); observed counts ≥ 10.', 'Contains 0 → no convincing evidence of a difference.'],
        },
      ],
      check: [
        {
          id: 's3.11-q1',
          type: 'mcq',
          prompt: 'For a two-sample z-interval, how is the normality condition checked?',
          choices: [
            'Both samples were random',
            'Each sample is less than 10% of its population',
            'Both sample sizes are greater than 30',
            'The observed numbers of successes and failures in each sample are all at least 10',
          ],
          answer: 3,
          explain: 'Normality uses the **observed successes and failures** in both samples.',
        },
        {
          id: 's3.11-q2',
          type: 'num',
          prompt: 'p̂₁ = 0.6 (n₁ = 100), p̂₂ = 0.5 (n₂ = 100). Find the SE of p̂₁ − p̂₂. (Round to 4 decimals.)',
          answer: 0.0700,
          tolerance: 0.01,
          explain: '√(0.24/100 + 0.25/100) = √0.0049 = **0.0700**',
          compute: () => Math.sqrt(0.24 / 100 + 0.25 / 100),
        },
      ],
      flashcards: [
        { front: 'Two-sample z-interval for p₁ − p₂', back: '(p̂₁ − p̂₂) ± z^{∗}√(p̂₁(1 − p̂₁)/n₁ + p̂₂(1 − p̂₂)/n₂)' },
        { front: 'What does a CI for p₁ − p₂ that contains 0 mean?', back: 'There is not convincing evidence of a difference between the population proportions.' },
      ],
    },
    {
      id: 'stats-3.12',
      ced: ['3.12', '3.13'],
      cedVersion: V,
      title: 'Two-Proportion z-Test',
      level: 'advanced',
      minutes: 10,
      cards: [
        {
          kind: 'hook',
          body: 'An app company randomly assigns 300 volunteers: half get daily reminders, half don\'t. 45% of the reminder group finish a course versus 32% of the others. Real effect, or luck of the draw?',
        },
        {
          kind: 'concept',
          title: 'Hypotheses',
          body: 'Procedure: **two-sample z-test for the difference between two population proportions**.\n\n- **H₀: p₁ = p₂** (or p₁ − p₂ = 0): no difference\n- **Hₐ: p₁ > p₂**, **p₁ < p₂** or **p₁ ≠ p₂** (equivalently p₁ − p₂ > 0, < 0, ≠ 0)\n\nDefine both parameters in context.',
        },
        {
          kind: 'concept',
          title: 'Combined (pooled) proportion and conditions',
          body: 'Because H₀ says the proportions are equal, combine the samples:\n\n**p̂_{c} = (n₁p̂₁ + n₂p̂₂) / (n₁ + n₂)** = total successes ÷ total sample size\n\nConditions:\n1. Two independent random samples **or** a randomized experiment\n2. 10% for each sample (not needed for an experiment)\n3. n₁p̂_{c}, n₁(1 − p̂_{c}), n₂p̂_{c}, n₂(1 − p̂_{c}) are all **at least 10**',
        },
        {
          kind: 'concept',
          title: 'Test statistic',
          body: '**z = (p̂₁ − p̂₂ − 0) / √( p̂_{c}(1 − p̂_{c})(1/n₁ + 1/n₂) )**\n\nUnder H₀, z is standard normal. Then compare the p-value to α and conclude in context, about the populations.',
        },
        {
          kind: 'example',
          title: 'Reminders and finishing',
          problem: 'Randomized experiment: 68 of 150 with reminders and 48 of 150 without finished. Test Hₐ: p_{R} > p_{N} at α = 0.05.',
          steps: [
            'p̂_{R} = 68/150 ≈ 0.453; p̂_{N} = 48/150 = 0.32; p̂_{c} = 116/300 ≈ **0.387**',
            'Conditions: random assignment ✓; 150(0.387) ≈ 58 and 150(0.613) ≈ 92 for each group, all ≥ 10 ✓',
            'z = (0.453 − 0.32) ÷ √(0.387 × 0.613 × (1/150 + 1/150)) ≈ **2.37**; p-value ≈ **0.0089**',
            '0.0089 < 0.05 → **reject H₀**. There is convincing evidence that, for people like these volunteers, reminders increase the proportion who finish. Random assignment supports a cause-and-effect conclusion.',
          ],
          answer: 'z ≈ 2.37, p-value ≈ 0.009, reject H₀.',
          verify: [
            { stated: 0.387, compute: () => t2.pc, tol: 0.002 },
            { stated: 2.37, compute: () => t2.z, tol: 0.003 },
            { stated: 0.0089, compute: () => t2.p, tol: 0.02 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's3.12-t1',
            type: 'num',
            prompt: 'Group 1: 30 of 100 successes; Group 2: 45 of 150. Find the combined proportion p̂_{c}.',
            answer: 0.3,
            explain: '(30 + 45) ÷ (100 + 150) = 75 ÷ 250 = **0.30**',
            compute: () => (30 + 45) / (100 + 150),
          },
        },
        {
          kind: 'hack',
          title: 'Interval uses separate p̂\'s; test uses p̂_{c}',
          body: '**Confidence interval**: SE with p̂₁ and p̂₂ separately. **Test**: SE with the combined p̂_{c}, because the test assumes H₀ (equal proportions) is true.',
        },
        {
          kind: 'trap',
          body: 'Volunteers in an experiment → conclusions apply to **people like those in the study**, not the whole population, even when the test is significant.',
        },
        {
          kind: 'summary',
          points: ['H₀: p₁ = p₂; Hₐ: >, < or ≠.', 'p̂_{c} = total successes ÷ total n; check n·p̂_{c} and n(1 − p̂_{c}) ≥ 10 for both groups.', 'z = (p̂₁ − p̂₂)/√(p̂_{c}(1 − p̂_{c})(1/n₁ + 1/n₂)).'],
        },
      ],
      check: [
        {
          id: 's3.12-q1',
          type: 'num',
          prompt: 'In a two-proportion test, 150 of 500 in Group 1 and 55 of 250 in Group 2 are successes; Hₐ: p₁ > p₂. Find z. (Round to 2 decimals.)',
          answer: 2.32,
          tolerance: 0.01,
          explain: 'p̂₁ = 0.30, p̂₂ = 0.22; p̂_{c} = 205 ÷ 750 ≈ 0.273; SE = √(0.273 × 0.727 × (1/500 + 1/250)) ≈ 0.0345; z = 0.08 ÷ 0.0345 ≈ **2.32**',
          compute: () => twoPropTest(150, 500, 55, 250, 'greater').z,
        },
        {
          id: 's3.12-q2',
          type: 'mcq',
          prompt: 'A two-sample z-test gives p-value = 0.21 at α = 0.05. What is the conclusion?',
          choices: [
            'Reject H₀; the proportions differ',
            'Fail to reject H₀; there is not convincing evidence that the population proportions differ',
            'Accept H₀; the proportions are equal',
            'The test is invalid',
          ],
          answer: 1,
          explain: '0.21 > 0.05 → **fail to reject H₀**. Not convincing evidence of a difference, which is not proof of equality.',
        },
      ],
      flashcards: [
        { front: 'Combined (pooled) proportion', back: 'p̂_{c} = (x₁ + x₂)/(n₁ + n₂): used in the two-proportion z-test because H₀ assumes p₁ = p₂.' },
        { front: 'Two-proportion z-test statistic', back: 'z = (p̂₁ − p̂₂) / √( p̂_{c}(1 − p̂_{c})(1/n₁ + 1/n₂) )' },
      ],
    },
    {
      id: 'stats-3.13',
      ced: ['3.14'],
      cedVersion: V,
      title: 'Chi-Square: Homogeneity or Independence?',
      level: 'advanced',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'A z-test compares two proportions. But what if the variable has **three or more categories**, like smartwatch ownership across three grades, or favorite music genre across several towns? Chi-square tests handle whole tables at once.',
        },
        {
          kind: 'concept',
          title: 'The chi-square statistic and distributions',
          body: 'The **chi-square statistic** measures how far the **observed counts** are from the **expected counts**, relative to the expected counts.\n\n**Chi-square distributions** take only positive values and are **skewed right**. The skew becomes less pronounced as the **degrees of freedom** increase.',
          diagram: 'st-chi-shapes',
        },
        {
          kind: 'concept',
          title: 'Which test?',
          body: '- **Chi-square test for homogeneity**: are the distributions of **one categorical variable** different across **two or more populations or treatments**? (Separate samples from each group, or random assignment.)\n- **Chi-square test for independence**: are **two categorical variables** associated in **one population**? (One sample, two variables recorded on each unit.)',
        },
        {
          kind: 'concept',
          title: 'Hypotheses and conditions',
          body: '**Homogeneity**: H₀: there is **no difference** in the distributions of [variable] across [populations]. Hₐ: there **is** a difference.\n**Independence**: H₀: [variable 1] and [variable 2] are **independent** (not associated) in [population]. Hₐ: they are **associated** (not independent).\n\nConditions:\n1. **Randomization**: independence → one random sample; homogeneity → independent random samples or a randomized experiment\n2. **10%**: n ≤ 10%N when sampling without replacement (not needed for an experiment)\n3. **Expected counts**: all expected counts are at least 5 (the AP topic page says "greater than 5"). Check **expected**, not observed, counts.',
        },
        {
          kind: 'try',
          question: {
            id: 's3.13-t1',
            type: 'mcq',
            prompt: 'A random sample of 300 swimmers is classified by experience (low, medium, high) and whether they had a shoulder injury. Which test fits?',
            choices: ['One-sample z-test for p', 'Two-sample z-test', 'Chi-square test for independence', 'Chi-square test for homogeneity'],
            answer: 2,
            explain: '**One sample**, **two categorical variables** recorded on each swimmer → chi-square test for **independence**.',
          },
        },
        {
          kind: 'hack',
          title: 'Count the samples',
          body: '**One** random sample, two variables → **independence**. **Several** samples (or treatment groups), one variable → **homogeneity**. The table can look identical; the design decides.',
        },
        {
          kind: 'trap',
          body: 'Hypotheses for chi-square tests are written **in words** about the **population(s)**, not with p\'s or p̂\'s. And "the variables are associated" goes in **Hₐ**, never H₀.',
        },
        {
          kind: 'summary',
          points: ['χ² compares observed and expected counts; χ² distributions are positive and skewed right.', 'Homogeneity: one variable across several populations/treatments. Independence: two variables in one population.', 'Conditions: randomization, 10%, all expected counts at least 5.'],
        },
      ],
      check: [
        {
          id: 's3.13-q1',
          type: 'mcq',
          prompt: 'Independent random samples of 100 shoppers from each of three malls are asked their preferred payment method (cash, card, phone). Which test?',
          choices: ['Chi-square test for independence', 'Chi-square test for homogeneity', 'Two-sample z-test', 'One-sample t-test'],
          answer: 1,
          explain: '**Separate samples** from three populations, one categorical variable → **homogeneity**.',
        },
        {
          id: 's3.13-q2',
          type: 'mcq',
          prompt: 'As the degrees of freedom of a chi-square distribution increase, the distribution becomes…',
          choices: ['more skewed right', 'less skewed', 'skewed left', 'uniform'],
          answer: 1,
          explain: 'The skew becomes **less pronounced** with more degrees of freedom.',
        },
      ],
      flashcards: [
        { front: 'Chi-square test for homogeneity', back: 'Tests whether the distribution of one categorical variable differs across two or more populations or treatments.' },
        { front: 'Chi-square test for independence', back: 'Tests whether two categorical variables are associated in a single population.' },
        { front: 'Expected counts condition', back: 'All expected counts at least 5 (check expected, not observed, counts).' },
      ],
    },
    {
      id: 'stats-3.14',
      ced: ['3.15'],
      cedVersion: V,
      title: 'Carrying Out a Chi-Square Test',
      level: 'advanced',
      minutes: 10,
      cards: [
        {
          kind: 'hook',
          body: 'Back to the smartwatches: 60%, 50% and 40% owners across three grades in a sample of 150. Is that strong enough evidence of an association in the whole school? Let\'s run the full test.',
        },
        {
          kind: 'concept',
          title: 'Expected counts',
          body: 'Under H₀, each cell\'s expected count is:\n\n**expected = (row total × column total) ÷ table total**',
        },
        {
          kind: 'concept',
          title: 'Statistic, df and p-value',
          body: '**χ² = Σ (Observed − Expected)² / Expected**, summed over **all** cells.\n\nUnder H₀, χ² has a chi-square distribution with **df = (rows − 1)(columns − 1)**. The p-value is the area to the **right** of the observed χ² (Table C or technology).',
        },
        {
          kind: 'example',
          title: 'Grade and smartwatch ownership',
          problem: 'A random sample of 150 students (from a school of 2,000): rows = 9th, 10th, 11th (50 each); columns = owns (75), doesn\'t own (75). Observed: 30/20, 25/25, 20/30. Test for independence at α = 0.05.',
          steps: [
            'Expected for every cell: 50 × 75 ÷ 150 = **25** (all ≥ 5 ✓; random sample ✓; 150 ≤ 10% of 2,000 ✓)',
            'χ² = (30−25)²/25 + (20−25)²/25 + 0 + 0 + (20−25)²/25 + (30−25)²/25 = 1 + 1 + 0 + 0 + 1 + 1 = **4**',
            'df = (3 − 1)(2 − 1) = **2**; p-value = P(χ² ≥ 4) ≈ **0.135**',
            '0.135 > 0.05 → **fail to reject H₀**. The data do **not** provide convincing evidence that grade level and smartwatch ownership are associated for students at this school.',
          ],
          answer: 'χ² = 4, df = 2, p ≈ 0.135, fail to reject H₀.',
          verify: [
            { stated: 25, compute: () => chi.expected[0][0] },
            { stated: 4, compute: () => chi.chi2 },
            { stated: 2, compute: () => chi.df },
            { stated: 0.135, compute: () => chi.p, tol: 0.003 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's3.14-t1',
            type: 'num',
            prompt: 'In a 3 × 4 two-way table, how many degrees of freedom does the chi-square test have?',
            answer: 6,
            explain: '(3 − 1)(4 − 1) = 2 × 3 = **6**',
            compute: () => (3 - 1) * (4 - 1),
          },
        },
        {
          kind: 'concept',
          title: 'Interpret the p-value',
          body: '"**Assuming** grade level and smartwatch ownership are independent for students at this school, there is about a **0.135** probability of getting a χ² statistic of **4 or larger** by chance."',
        },
        {
          kind: 'hack',
          title: 'Show one expected count',
          body: 'On free response, write one expected-count calculation ("50 × 75 / 150 = 25"), then state that **all** expected counts are at least 5.',
        },
        {
          kind: 'trap',
          body: 'A large p-value means "not convincing evidence of an association". It does **not** mean "there is no association" or "the variables are independent".',
        },
        {
          kind: 'summary',
          points: ['Expected = row total × column total ÷ table total.', 'χ² = Σ (O − E)²/E; df = (r − 1)(c − 1); p-value = right-tail area.', 'Conclude in context with linkage to α and non-definitive language.'],
        },
      ],
      check: [
        {
          id: 's3.14-q1',
          type: 'num',
          prompt: 'A cell is in a row with total 80 and a column with total 45; the table total is 200. Find its expected count.',
          answer: 18,
          explain: '80 × 45 ÷ 200 = **18**',
          compute: () => (80 * 45) / 200,
        },
        {
          id: 's3.14-q2',
          type: 'num',
          prompt: 'A chi-square test has χ² = 9.8 with df = 3. Find the p-value. (Round to 4 decimals.)',
          answer: 0.0203,
          tolerance: 0.02,
          explain: 'P(χ² ≥ 9.8) with df 3 ≈ **0.0203**',
          compute: () => chiUpper(9.8, 3),
        },
        {
          id: 's3.14-q3',
          type: 'mcq',
          prompt: 'A chi-square test for independence gives p-value = 0.003 at α = 0.05. Which is the correct conclusion?',
          choices: [
            'Fail to reject H₀; the variables are independent',
            'Reject H₀; there is convincing evidence the two variables are associated in the population',
            'Reject H₀; one variable causes the other',
            'Accept Hₐ with certainty',
          ],
          answer: 1,
          explain: '0.003 < 0.05 → reject H₀: convincing evidence of an **association** (not causation, and not certainty).',
        },
      ],
      flashcards: [
        { front: 'Expected count in a two-way table', back: '(row total × column total) ÷ table total' },
        { front: 'Degrees of freedom for a chi-square test on a two-way table', back: '(rows − 1)(columns − 1)' },
      ],
    },
  ],
  checkpoint: [
    {
      id: 's3-cp1',
      type: 'mcq',
      prompt: 'A 95% confidence interval for a proportion is (0.31, 0.39). Which is a correct interpretation?',
      choices: [
        'There is a 95% chance the sample proportion is between 0.31 and 0.39',
        'We are 95% confident the interval from 0.31 to 0.39 captures the population proportion',
        '95% of the population is between 0.31 and 0.39',
        'The population proportion is 0.35',
      ],
      answer: 1,
      explain: 'Confidence intervals are about capturing the **population parameter**.',
    },
    {
      id: 's3-cp2',
      type: 'num',
      prompt: 'Random sample of 500: 140 successes. Find the 95% margin of error for p. (Round to 4 decimals.)',
      answer: 0.0394,
      tolerance: 0.02,
      explain: 'p̂ = 0.28; 1.96 × √(0.28 × 0.72 / 500) ≈ **0.0394**',
      compute: () => propInterval(140, 500, 0.95).me,
    },
    {
      id: 's3-cp3',
      type: 'mcq',
      prompt: 'A researcher claims more than 60% of a city\'s residents support a park. Which hypotheses fit?',
      choices: ['H₀: p = 0.6, Hₐ: p ≠ 0.6', 'H₀: p = 0.6, Hₐ: p > 0.6', 'H₀: p̂ = 0.6, Hₐ: p̂ > 0.6', 'H₀: p > 0.6, Hₐ: p = 0.6'],
      answer: 1,
      explain: '"More than 60%" → **Hₐ: p > 0.6**, with H₀: p = 0.6.',
    },
    {
      id: 's3-cp4',
      type: 'mcq',
      prompt: 'A new screening test is evaluated with H₀: the patient is healthy. A Type I error would mean…',
      choices: ['telling a sick patient they are healthy', 'telling a healthy patient they may be sick', 'correctly identifying a sick patient', 'the test has low power'],
      answer: 1,
      explain: 'Type I = rejecting a **true** H₀: the patient is healthy but the test says otherwise.',
    },
    {
      id: 's3-cp5',
      type: 'num',
      prompt: 'One-proportion z-test: H₀: p = 0.4, n = 250, p̂ = 0.452. Find z. (Round to 2 decimals.)',
      answer: 1.68,
      tolerance: 0.01,
      explain: 'z = (0.452 − 0.4) ÷ √(0.4 × 0.6 / 250) = 0.052 ÷ 0.031 ≈ **1.68**',
      compute: () => (0.452 - 0.4) / Math.sqrt((0.4 * 0.6) / 250),
    },
    {
      id: 's3-cp6',
      type: 'mcq',
      prompt: 'Which change would make a confidence interval for p narrower?',
      choices: ['Increase the confidence level', 'Increase the sample size', 'Decrease the sample size', 'Use a z^{∗} of 2.576 instead of 1.96'],
      answer: 1,
      explain: 'A **larger n** decreases the standard error, giving a narrower interval.',
    },
    {
      id: 's3-cp7',
      type: 'mcq',
      prompt: 'Students are randomly assigned to one of three study methods, and each student\'s grade (A, B, C or lower) is recorded. Which test compares the grade distributions?',
      choices: ['Chi-square test for independence', 'Chi-square test for homogeneity', 'Two-sample z-test', 'One-sample z-test'],
      answer: 1,
      explain: 'Comparing the distribution of one categorical variable across **treatment groups** → **homogeneity**.',
    },
    {
      id: 's3-cp8',
      type: 'num',
      prompt: 'A 2 × 4 table gives χ² = 8.2. Find the p-value. (Round to 3 decimals.)',
      answer: 0.042,
      tolerance: 0.03,
      explain: 'df = (2 − 1)(4 − 1) = 3; P(χ² ≥ 8.2) ≈ **0.042**',
      compute: () => chiUpper(8.2, 3),
    },
  ],
}
