import type { Unit } from '../types'
import { invT, mean, normalcdf, sd, tInterval, tStar, tTest, twoTInterval, twoTTest } from '../../lib/stats'

const V = 'Fall 2026'

// Worked examples (every printed number is recomputed through `verify`)
const battery = tInterval(11.8, 1.6, 16, 0.95) // phone battery life, hours
const DIFFS = [4, 7, -1, 3, 5, 6, 2, 8, 3, 3] // post − pre quiz score for 10 students
const pairs = tInterval(mean(DIFFS), sd(DIFFS), DIFFS.length, 0.9)
const cups = tTest(351.8, 6.2, 20, 355, 'less') // mL in "355 mL" cups
const sleep = twoTInterval(7.1, 1.2, 40, 6.6, 1.4, 35, 0.95) // hours of sleep, School A vs. B
const plants = twoTTest(24.2, 3.1, 15, 21.5, 3.8, 15, 'greater') // growth (cm), fertilizer vs. control

export const unit4: Unit = {
  id: 'stats-u4',
  number: 4,
  title: 'Inference for Quantitative Data: Means',
  weight: '10–20%',
  blurb:
    'The sampling distribution of x̄, t-distributions, confidence intervals and t-tests for one mean, a mean difference (matched pairs) and the difference of two means, and choosing the right procedure.',
  badge: { name: 'Mean Machine', emoji: '📏' },
  lessons: [
    // ---------------- FOUNDATION ----------------
    {
      id: 'stats-4.1',
      ced: ['4.1'],
      cedVersion: V,
      title: 'The Sampling Distribution of x̄',
      level: 'foundation',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'One patient might wait 15 minutes at a clinic, another 35. But the **average** wait of 36 random patients will be much closer to the true mean. Averages vary less than individuals. How much less? Exactly √n times less.',
        },
        {
          kind: 'concept',
          title: 'Center and spread',
          body: 'For a population with mean μ and SD σ, with independent sampled values:\n\n- **μ_{x̄} = μ**\n- **σ_{x̄} = σ / √n**',
        },
        {
          kind: 'concept',
          title: 'Conditions and shape',
          body: 'Sampling without replacement needs:\n- **Randomization**: a random sample\n- **10% condition**: n ≤ 10% of N\n\nShape:\n- If the **population is normal**, x̄ is normal for **any** n.\n- If not, x̄ is **approximately normal** when **n ≥ 30** (central limit theorem). An **extremely skewed** population may need n much larger than 30.',
        },
        {
          kind: 'example',
          title: 'Clinic waits',
          problem: 'Wait times: μ = 24 minutes, σ = 6 minutes (shape unknown). For a random sample of 36 patients, find P(x̄ > 25.5).',
          steps: [
            'σ_{x̄} = 6 ÷ √36 = **1 minute**; μ_{x̄} = 24',
            'n = 36 ≥ 30 → x̄ is approximately normal (CLT)',
            'z = (25.5 − 24) ÷ 1 = 1.5 → P(x̄ > 25.5) ≈ **0.0668**',
          ],
          answer: '≈ 0.0668',
          verify: [
            { stated: 1, compute: () => 6 / Math.sqrt(36) },
            { stated: 0.0668, compute: () => normalcdf(25.5, Infinity, 24, 1), tol: 0.003 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's4.1-t1',
            type: 'num',
            prompt: 'Heights of a plant species are normal with μ = 30 cm and σ = 4 cm. For random samples of 4 plants, what is σ_{x̄}?',
            answer: 2,
            unit: 'cm',
            explain: '4 ÷ √4 = **2 cm**. (x̄ is normal even with n = 4, because the population is normal.)',
            compute: () => 4 / Math.sqrt(4),
          },
        },
        {
          kind: 'hack',
          title: 'Individual or average? Pick the right SD',
          body: 'A question about **one** randomly chosen value uses **σ**. A question about the **mean of a sample** uses **σ/√n**. Read for words like "mean of", "average of the sample".',
        },
        {
          kind: 'trap',
          body: 'n ≥ 30 makes the **sampling distribution of x̄** approximately normal. It does not make the population or the sample data normal.',
        },
        {
          kind: 'summary',
          points: ['μ_{x̄} = μ; σ_{x̄} = σ/√n.', 'Random sample; n ≤ 10% of N.', 'Normal population → x̄ normal for any n; otherwise n ≥ 30 (more if extremely skewed).'],
        },
      ],
      check: [
        {
          id: 's4.1-q1',
          type: 'mcq',
          prompt: 'A population is strongly skewed right. For which sample size is the sampling distribution of x̄ closest to normal?',
          choices: ['n = 5', 'n = 15', 'n = 25', 'n = 100'],
          answer: 3,
          explain: 'The larger n, the better the normal approximation (CLT). Strong skew calls for a **large** n.',
        },
        {
          id: 's4.1-q2',
          type: 'num',
          prompt: 'Weekly screen time has μ = 30 hours and σ = 10 hours. For random samples of 100 people, find P(x̄ < 28). (Round to 4 decimals.)',
          answer: 0.0228,
          tolerance: 0.01,
          explain: 'σ_{x̄} = 10/√100 = 1; z = (28 − 30)/1 = −2 → **0.0228**',
          compute: () => normalcdf(-Infinity, 28, 30, 1),
        },
      ],
      flashcards: [
        { front: 'Mean and SD of the sampling distribution of x̄', back: 'μ_{x̄} = μ; σ_{x̄} = σ/√n' },
        { front: 'When is x̄ approximately normal?', back: 'Always if the population is normal; otherwise when n ≥ 30 (larger if the population is extremely skewed).' },
      ],
    },
    {
      id: 'stats-4.2',
      ced: ['4.2'],
      cedVersion: V,
      title: 't-Distributions & the One-Sample t-Interval',
      level: 'foundation',
      minutes: 10,
      cards: [
        {
          kind: 'hook',
          body: 'For a mean, we almost never know σ. Plug in the sample SD s instead and something changes: the extra uncertainty makes the curve a little shorter with fatter tails. Meet the **t-distribution**.',
        },
        {
          kind: 'concept',
          title: 't-distributions',
          body: '**t-distributions** (Student\'s t) are a family of **symmetric, bell-shaped** distributions centered at 0 with **wider tails** than the standard normal.\n\nEach one is set by its **degrees of freedom (df)**, based on the sample size. Small df → lower peak and fatter tails; as df grows, t gets closer and closer to the standard normal.\n\nUse t for means when **σ is unknown** and s is used instead.',
          diagram: 'st-t-vs-z',
        },
        {
          kind: 'concept',
          title: 'Procedure, parameter, conditions',
          body: 'Procedure: **one-sample t-interval for a population mean**.\n\nParameter: μ = the mean [variable] of [population], in context.\n\nConditions:\n1. **Randomization**: random sample or randomized experiment\n2. **10%**: n ≤ 10% of N (sampling without replacement)\n3. **Sample data**: the population is approximately normal, **or n ≥ 30**, or (if n < 30) the sample data show **no strong skewness and no outliers**',
        },
        {
          kind: 'concept',
          title: 'The interval',
          body: '**x̄ ± t^{∗} · s/√n**, with **df = n − 1**\n\n- SE_{x̄} = s/√n\n- margin of error = t^{∗} · s/√n\n\nt^{∗} comes from Table B (row df, column for the confidence level) or technology.',
        },
        {
          kind: 'example',
          title: 'Phone battery life',
          problem: 'A random sample of 16 phones of one model: x̄ = 11.8 hours, s = 1.6 hours; a dotplot shows no strong skew or outliers. Build a 95% interval for μ.',
          steps: [
            'Conditions: random ✓; 16 is less than 10% of all phones of this model ✓; n < 30 but the data show no strong skew or outliers ✓',
            'df = 15 → t^{∗} ≈ **2.131**; SE = 1.6 ÷ √16 = **0.4**',
            '11.8 ± 2.131(0.4) = 11.8 ± 0.852 = (**10.95**, **12.65**) hours',
          ],
          answer: '(10.95, 12.65) hours',
          verify: [
            { stated: 2.131, compute: () => battery.tStar, tol: 0.001 },
            { stated: 0.4, compute: () => battery.se },
            { stated: 0.852, compute: () => battery.me, tol: 0.002 },
            { stated: 10.95, compute: () => battery.lo, tol: 0.001 },
            { stated: 12.65, compute: () => battery.hi, tol: 0.001 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's4.2-t1',
            type: 'num',
            prompt: 'Find t^{∗} for a 90% confidence interval with a sample of n = 25. (3 decimals)',
            answer: 1.711,
            tolerance: 0.001,
            explain: 'df = 24; 90% → 5% in each tail → t^{∗} ≈ **1.711** (Table B, df 24, p = 0.05)',
            compute: () => tStar(0.9, 24),
          },
        },
        {
          kind: 'hack',
          title: 't* is bigger than z*',
          body: 'For the same confidence level, t^{∗} > z^{∗} (2.131 vs. 1.96 at df 15), because using s adds uncertainty. As n grows, t^{∗} shrinks toward z^{∗}.',
        },
        {
          kind: 'trap',
          body: 'Don\'t use z for a mean when σ is unknown, and never use t for proportions. **Means → t. Proportions → z.**',
        },
        {
          kind: 'summary',
          points: ['t-distributions: symmetric, fatter tails than z, approach z as df grows.', 'x̄ ± t^{∗}·s/√n with df = n − 1.', 'Conditions: random, 10%, normal population or n ≥ 30 or no strong skew/outliers.'],
        },
      ],
      check: [
        {
          id: 's4.2-q1',
          type: 'mcq',
          prompt: 'Compared with the standard normal distribution, a t-distribution with 4 degrees of freedom has…',
          choices: ['a higher peak and thinner tails', 'a lower peak and fatter tails', 'a different center', 'a skewed shape'],
          answer: 1,
          explain: 'Small df → **lower peak, fatter tails**, still symmetric about 0.',
        },
        {
          id: 's4.2-q2',
          type: 'mcq',
          prompt: 'A random sample of 12 values has a clear outlier and strong right skew. Which condition fails for a t-interval?',
          choices: ['Randomization', '10% condition', 'Sample data condition', 'None'],
          answer: 2,
          explain: 'With n < 30, the sample must be free of strong skewness and outliers. This one isn\'t.',
        },
        {
          id: 's4.2-q3',
          type: 'num',
          prompt: 'A random sample of 9 has x̄ = 50 and s = 6. Find the 95% margin of error (t^{∗} with df 8). Round to 2 decimals.',
          answer: 4.61,
          tolerance: 0.01,
          explain: 't^{∗} ≈ 2.306; SE = 6/√9 = 2; ME = 2.306 × 2 ≈ **4.61**',
          compute: () => tInterval(50, 6, 9, 0.95).me,
        },
      ],
      flashcards: [
        { front: 'One-sample t-interval for μ', back: 'x̄ ± t^{∗}·s/√n, df = n − 1' },
        { front: 'Sample data condition (t procedures)', back: 'Population approximately normal, or n ≥ 30, or (n < 30) sample data free of strong skewness and outliers.' },
      ],
    },
    // ---------------- CORE ----------------
    {
      id: 'stats-4.3',
      ced: ['4.2'],
      cedVersion: V,
      title: 'Matched Pairs Intervals',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'Ten students take a quiz, study with a new method, then take a similar quiz. Their before and after scores are **linked**: same student, two scores. Treating them as two separate groups throws away that link.',
        },
        {
          kind: 'concept',
          title: 'Turn pairs into one sample of differences',
          body: 'For a **matched pairs** design (two dependent samples), compute the **difference** for each pair. Now you have **one sample** of differences.\n\nProcedure: **one-sample t-interval for a population mean difference**, μ_{d}.\n\nState the **order of subtraction** in the parameter: "μ_{d} = the mean of (after − before) quiz scores for all such students."',
        },
        {
          kind: 'concept',
          title: 'Interval and conditions',
          body: '**x̄_{d} ± t^{∗} · s_{d}/√n**, df = n − 1 (n = number of **pairs**)\n\nConditions apply to the **differences**: random sample or randomized experiment; 10% (if sampling); **n ≥ 30 differences**, or the differences show no strong skewness or outliers.',
        },
        {
          kind: 'example',
          title: 'Study method',
          problem: 'Differences (after − before) for 10 randomly chosen students: 4, 7, −1, 3, 5, 6, 2, 8, 3, 3. A dotplot of the differences shows no strong skew or outliers. Build a 90% interval for μ_{d}.',
          steps: [
            'x̄_{d} = 40 ÷ 10 = **4.0** points; s_{d} ≈ **2.62** points',
            'df = 9 → t^{∗} ≈ **1.833**; SE = 2.62 ÷ √10 ≈ 0.828',
            '4.0 ± 1.833(0.828) = (**2.48**, **5.52**) points',
            'All positive: convincing evidence that the mean score after the new method is higher than before, for all such students. With no comparison group, this alone doesn\'t show the method **caused** the gain.',
          ],
          answer: '(2.48, 5.52) points',
          verify: [
            { stated: 4, compute: () => mean(DIFFS) },
            { stated: 2.62, compute: () => sd(DIFFS), tol: 0.003 },
            { stated: 1.833, compute: () => pairs.tStar, tol: 0.001 },
            { stated: 2.48, compute: () => pairs.lo, tol: 0.003 },
            { stated: 5.52, compute: () => pairs.hi, tol: 0.003 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's4.3-t1',
            type: 'mcq',
            prompt: 'Which situation calls for a **matched pairs** t-procedure?',
            choices: [
              'Comparing heights of a random sample of boys and a separate random sample of girls',
              'Measuring each runner\'s time with old shoes and with new shoes',
              'Comparing the proportions of two towns who recycle',
              'Estimating the mean income in one city',
            ],
            answer: 1,
            explain: 'Each runner gives **two linked measurements**: a matched pairs design.',
          },
        },
        {
          kind: 'hack',
          title: 'Spot the pairs',
          body: 'Ask: is each value in group 1 **naturally linked** to one value in group 2 (same person, twins, before/after, left/right)? Yes → matched pairs: analyze the differences.',
        },
        {
          kind: 'trap',
          body: 'Using a two-sample procedure on paired data ignores the pairing and usually gives a much wider interval. Paired data → **one sample of differences**.',
        },
        {
          kind: 'summary',
          points: ['Matched pairs: compute differences, then a one-sample t-interval on them.', 'Parameter μ_{d}, with the order of subtraction stated.', 'Conditions are checked on the differences; df = number of pairs − 1.'],
        },
      ],
      check: [
        {
          id: 's4.3-q1',
          type: 'num',
          prompt: 'Using the 10 differences (x̄_{d} = 4.0, s_{d} ≈ 2.62), find the standard error of x̄_{d}. (Round to 3 decimals.)',
          answer: 0.828,
          tolerance: 0.01,
          explain: 's_{d}/√n = 2.62/√10 ≈ **0.828**',
          compute: () => sd(DIFFS) / Math.sqrt(10),
        },
        {
          id: 's4.3-q2',
          type: 'mcq',
          prompt: 'In a matched pairs study of 25 sets of twins, what are the degrees of freedom for a t-interval?',
          choices: ['24', '48', '49', '50'],
          answer: 0,
          explain: 'One sample of **25 differences** → df = 25 − 1 = **24**.',
        },
      ],
      flashcards: [
        { front: 'Matched pairs analysis', back: 'Compute the difference for each pair; run a one-sample t procedure on the differences (parameter μ_{d}).' },
        { front: 'Why state the order of subtraction for μ_{d}?', back: 'The sign of the estimate and interval depends on it (after − before vs. before − after).' },
      ],
    },
    {
      id: 'stats-4.4',
      ced: ['4.3'],
      cedVersion: V,
      title: 'Interpreting t-Intervals',
      level: 'core',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'The interval (10.95, 12.65) hours is just numbers until you say what it means. Interpretations for means follow the same pattern as for proportions, with one twist for matched pairs.',
        },
        {
          kind: 'concept',
          title: 'Interpret the interval and the level',
          body: '**Interval**: "We are 95% confident that the interval from 10.95 to 12.65 hours captures the **mean battery life of all phones of this model**."\n\n**Confidence level**: "In repeated random sampling with the same sample size, about 95% of the intervals created would capture the population mean."\n\nAny one interval may or may not contain μ.',
        },
        {
          kind: 'concept',
          title: 'Using the interval to judge a claim',
          body: 'The interval gives plausible values of μ (or μ_{d}).\n\nThe maker claims a mean of **13 hours**. 13 is **above** (10.95, 12.65), so there is convincing evidence the true mean battery life is **less than 13 hours**.\n\nFor matched pairs: if the interval for μ_{d} doesn\'t contain **0**, there\'s convincing evidence of a mean difference.',
        },
        {
          kind: 'concept',
          title: 'Width relationships',
          body: '- Higher confidence → larger t^{∗} → larger margin of error → **wider**\n- Larger n → smaller SE → **narrower** (width ∝ 1/√n)',
        },
        {
          kind: 'try',
          question: {
            id: 's4.4-t1',
            type: 'mcq',
            prompt: 'A 95% interval for the mean commute distance of a city\'s workers is (12.4, 15.8) miles. Which is the correct interpretation of the 95% confidence **level**?',
            choices: [
              'About 95% of workers commute between 12.4 and 15.8 miles',
              'About 95% of random samples of this size would give a sample mean between 12.4 and 15.8 miles',
              'About 95% of random samples of this size would produce intervals that capture the true mean commute distance',
              'There is a 95% chance the sample mean is in the interval',
            ],
            answer: 2,
            explain: 'The confidence level describes how often the **method** captures the **population mean** over repeated samples.',
          },
        },
        {
          kind: 'hack',
          title: 'Use the language of the question',
          body: 'Copy the population and variable wording from the problem into your interpretation: "the mean battery life, in hours, of **all phones of this model**." Precise context earns the point.',
        },
        {
          kind: 'trap',
          body: 'A t-interval is about the **population mean**, not individual values. "95% of phones last between 10.95 and 12.65 hours" is wrong: individual phones vary far more than the mean does.',
        },
        {
          kind: 'summary',
          points: ['"We are C% confident (a, b) captures the mean [variable] of [population]."', 'Values outside the interval are implausible for μ; 0 outside a μ_{d} interval → evidence of a difference.', 'Higher confidence → wider; larger n → narrower.'],
        },
      ],
      check: [
        {
          id: 's4.4-q1',
          type: 'mcq',
          prompt: 'A 90% interval for μ_{d} (after − before blood pressure) is (−8.2, −1.5). What does it suggest?',
          choices: ['No evidence of change', 'Convincing evidence mean blood pressure decreased', 'Convincing evidence mean blood pressure increased', 'Every patient\'s pressure dropped'],
          answer: 1,
          explain: 'The interval is **entirely negative** (after − before < 0) and doesn\'t contain 0: evidence of a mean **decrease**.',
        },
        {
          id: 's4.4-q2',
          type: 'mcq',
          prompt: 'With the same data, which confidence level gives the narrowest t-interval?',
          choices: ['99%', '95%', '90%', 'They are all the same width'],
          answer: 2,
          explain: 'Lower confidence → smaller t^{∗} → **narrower** interval.',
        },
      ],
      flashcards: [
        { front: 'Interpret a t-interval', back: 'We are C% confident that the interval from a to b captures the mean [variable] of [population].' },
        { front: 'Interval for μ_{d} that excludes 0', back: 'Convincing evidence of a mean difference (direction from the sign of the interval).' },
      ],
    },
    {
      id: 'stats-4.5',
      ced: ['4.4'],
      cedVersion: V,
      title: 'Setting Up a t-Test',
      level: 'core',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Cups labeled 355 mL. An inspector suspects the coffee shop under-fills them. That suspicion is a hypothesis about a **mean**, and a t-test can weigh the evidence.',
        },
        {
          kind: 'concept',
          title: 'Procedure and hypotheses',
          body: 'With σ unknown: **one-sample t-test for a population mean**.\n- H₀: μ = μ₀\n- Hₐ: μ < μ₀, μ > μ₀ or μ ≠ μ₀\n\nFor a matched pairs design: **one-sample t-test for a population mean difference**.\n- H₀: μ_{d} = 0\n- Hₐ: μ_{d} < 0, μ_{d} > 0 or μ_{d} ≠ 0\n\nDefine the parameter: the population mean (or mean difference), the response variable and the population, in context.',
        },
        {
          kind: 'concept',
          title: 'Conditions',
          body: '1. **Randomization**: random sample or randomized experiment\n2. **10%**: n ≤ 10% of N\n3. **Sample data**: population approximately normal, or n ≥ 30, or (n < 30) sample data free of strong skewness and outliers. For matched pairs, check the **differences**.',
        },
        {
          kind: 'example',
          title: 'Coffee cups',
          problem: 'Write hypotheses for the inspector\'s suspicion about cups labeled 355 mL.',
          steps: ['μ = the mean amount of coffee, in mL, in **all** of this shop\'s 355-mL cups', 'H₀: μ = 355', 'Hₐ: μ < 355 (suspected under-filling)'],
          answer: 'H₀: μ = 355, Hₐ: μ < 355',
        },
        {
          kind: 'try',
          question: {
            id: 's4.5-t1',
            type: 'mcq',
            prompt: 'Each of 20 drivers is tested for reaction time with and without a phone call (random order). Researchers think phones **slow** reactions. With d = (phone − no phone), which hypotheses fit?',
            choices: ['H₀: μ_{d} = 0, Hₐ: μ_{d} > 0', 'H₀: μ_{d} = 0, Hₐ: μ_{d} < 0', 'H₀: μ₁ = μ₂, Hₐ: μ₁ ≠ μ₂', 'H₀: x̄_{d} = 0, Hₐ: x̄_{d} > 0'],
            answer: 0,
            explain: 'Slower with a phone → (phone − no phone) times are larger → **Hₐ: μ_{d} > 0**.',
          },
        },
        {
          kind: 'hack',
          title: 'Proportion or mean?',
          body: 'Is the response **categorical** (yes/no, success/failure)? → proportion, z. Is it **quantitative** (mL, minutes, points)? → mean, t.',
        },
        {
          kind: 'trap',
          body: 'Hypotheses use μ (or μ_{d}), never x̄. And watch the direction for differences: it depends on your order of subtraction.',
        },
        {
          kind: 'summary',
          points: ['One-sample t-test: H₀: μ = μ₀. Matched pairs: H₀: μ_{d} = 0.', 'Define the parameter in context; state the order of subtraction for μ_{d}.', 'Conditions: random, 10%, sample data condition.'],
        },
      ],
      check: [
        {
          id: 's4.5-q1',
          type: 'mcq',
          prompt: 'A random sample of 50 adults is taken to test whether their mean sleep differs from 8 hours. Which procedure?',
          choices: ['One-sample z-test for p', 'One-sample t-test for μ', 'Two-sample t-test', 'Chi-square test'],
          answer: 1,
          explain: 'One sample, quantitative response, σ unknown → **one-sample t-test for a population mean**.',
        },
        {
          id: 's4.5-q2',
          type: 'mcq',
          prompt: 'A random sample of 40 has a strongly skewed distribution. Is the sample data condition met?',
          choices: ['No, the data are skewed', 'Yes, because n = 40 ≥ 30', 'Only if σ is known', 'Only if there are no outliers'],
          answer: 1,
          explain: 'n ≥ 30 satisfies the sample data condition (unless the population is extremely skewed, which may need a larger n).',
        },
      ],
      flashcards: [
        { front: 'Hypotheses for a matched pairs t-test', back: 'H₀: μ_{d} = 0; Hₐ: μ_{d} > 0, < 0 or ≠ 0 (order of subtraction stated).' },
        { front: 'Means vs. proportions', back: 'Quantitative response → mean → t procedures. Categorical response → proportion → z procedures.' },
      ],
    },
    {
      id: 'stats-4.6',
      ced: ['4.5'],
      cedVersion: V,
      title: 'Carrying Out a t-Test',
      level: 'core',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'The inspector measures 20 random cups: mean 351.8 mL, SD 6.2 mL. That\'s 3.2 mL short. Is that a real shortfall or normal cup-to-cup variation?',
        },
        {
          kind: 'concept',
          title: 'Test statistic and p-value',
          body: '**t = (x̄ − μ₀) / (s/√n)**, with **df = n − 1**\n\nUnder H₀ it has a t-distribution with n − 1 df. Find the p-value from Table B (approximately) or technology, in the direction of Hₐ.\n\nInterpret the p-value **assuming the population mean equals μ₀**.',
        },
        {
          kind: 'example',
          title: 'Coffee cups',
          problem: 'H₀: μ = 355, Hₐ: μ < 355, α = 0.05. Random sample of 20 cups: x̄ = 351.8 mL, s = 6.2 mL; a dotplot shows no strong skew or outliers.',
          steps: [
            'Conditions: random ✓; 20 cups ≤ 10% of all cups ✓; n < 30 but no strong skew/outliers ✓. One-sample t-test.',
            'SE = 6.2 ÷ √20 ≈ 1.386; t = (351.8 − 355) ÷ 1.386 ≈ **−2.31**, df = 19',
            'p-value = P(T ≤ −2.31) ≈ **0.016**',
            '0.016 < 0.05 → **reject H₀**. There is convincing evidence that the mean amount in all of this shop\'s 355-mL cups is less than 355 mL.',
          ],
          answer: 't ≈ −2.31, df = 19, p ≈ 0.016, reject H₀.',
          verify: [
            { stated: 1.386, compute: () => 6.2 / Math.sqrt(20), tol: 0.001 },
            { stated: -2.31, compute: () => cups.t, tol: 0.003 },
            { stated: 0.016, compute: () => cups.p, tol: 0.03 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's4.6-t1',
            type: 'num',
            prompt: 'H₀: μ = 50, Hₐ: μ ≠ 50. Random sample: n = 25, x̄ = 52.4, s = 5. Find t. (Round to 2 decimals.)',
            answer: 2.4,
            tolerance: 0.01,
            explain: 't = (52.4 − 50) ÷ (5/√25) = 2.4 ÷ 1 = **2.40**',
            compute: () => tTest(52.4, 5, 25, 50, 'two').t,
          },
        },
        {
          kind: 'hack',
          title: 'Same four steps as for proportions',
          body: '1. State: hypotheses + parameter + α. 2. Plan: name the test, check conditions. 3. Do: t, df, p-value. 4. Conclude: compare p-value to α, decision, context. Only the formula changes.',
        },
        {
          kind: 'trap',
          body: 'Use **df = n − 1** for a one-sample t. Using the normal table instead of t gives p-values that are too small for small samples.',
        },
        {
          kind: 'summary',
          points: ['t = (x̄ − μ₀)/(s/√n), df = n − 1.', 'p-value in the direction of Hₐ, from Table B or technology.', 'Conclude in context, linking p-value and α; never "prove" H₀.'],
        },
      ],
      check: [
        {
          id: 's4.6-q1',
          type: 'num',
          prompt: 'For t = 2.40 with df = 24 and a two-sided Hₐ, find the p-value. (Round to 3 decimals.)',
          answer: 0.0245,
          tolerance: 0.02,
          explain: '2 × P(T ≥ 2.40) with df 24 ≈ **0.0245**',
          compute: () => tTest(52.4, 5, 25, 50, 'two').p,
        },
        {
          id: 's4.6-q2',
          type: 'mcq',
          prompt: 'A dietitian tests H₀: μ = 2.0 vs. Hₐ: μ < 2.0 for the mean daily water intake (liters) of a city\'s adults at α = 0.05 and gets p = 0.018. Which conclusion is correct?',
          choices: [
            'Reject H₀; there is convincing evidence the mean daily water intake is less than 2.0 liters',
            'Reject H₀; there is not convincing evidence the mean is less than 2.0 liters',
            'Reject H₀; this proves the mean is less than 2.0 liters',
            'Fail to reject H₀',
          ],
          answer: 0,
          explain: '0.018 < 0.05 → reject H₀ → convincing evidence for Hₐ. Statistics never "proves".',
        },
      ],
      flashcards: [
        { front: 'One-sample t statistic', back: 't = (x̄ − μ₀) / (s/√n), df = n − 1' },
        { front: 'Interpreting the p-value of a t-test', back: 'Assuming the population mean equals μ₀, the probability of a sample mean as extreme or more extreme than observed.' },
      ],
    },
    // ---------------- ADVANCED ----------------
    {
      id: 'stats-4.7',
      ced: ['4.6'],
      cedVersion: V,
      title: 'Sampling Distribution of x̄₁ − x̄₂',
      level: 'advanced',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Do students at School A sleep more than students at School B? Two samples, two means, and their difference x̄₁ − x̄₂ varies from sample to sample. Here\'s how much.',
        },
        {
          kind: 'concept',
          title: 'Center and spread',
          body: 'For independent populations with means μ₁, μ₂ and SDs σ₁, σ₂:\n\n- **μ_{x̄₁−x̄₂} = μ₁ − μ₂**\n- **σ_{x̄₁−x̄₂} = √( σ₁²/n₁ + σ₂²/n₂ )**',
        },
        {
          kind: 'concept',
          title: 'Conditions and shape',
          body: '- **Randomization**: two independent random samples (for an experiment: random assignment of treatments, the only condition needed)\n- **10%**: n₁ ≤ 10%N₁ and n₂ ≤ 10%N₂\n- **Normal** if both populations are normal; **approximately normal** if not, provided **n₁ ≥ 30 and n₂ ≥ 30**',
        },
        {
          kind: 'example',
          title: 'Two schools',
          problem: 'Nightly sleep: School A μ = 7.0 h, σ = 1.2 h; School B μ = 6.6 h, σ = 1.4 h. Random samples n₁ = 40, n₂ = 35. Describe the sampling distribution of x̄₁ − x̄₂.',
          steps: [
            'Mean: 7.0 − 6.6 = **0.4 hours**',
            'SD: √(1.2² ÷ 40 + 1.4² ÷ 35) = √(0.036 + 0.056) ≈ **0.303 hours**',
            'Both samples ≥ 30 → approximately normal',
          ],
          answer: 'Approximately normal, mean 0.4 h, SD ≈ 0.303 h',
          verify: [
            { stated: 0.4, compute: () => 7.0 - 6.6, tol: 1e-6 },
            { stated: 0.303, compute: () => Math.sqrt(1.2 ** 2 / 40 + 1.4 ** 2 / 35), tol: 0.002 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's4.7-t1',
            type: 'num',
            prompt: 'Using the two schools (mean 0.4, SD 0.303), find P(x̄₁ − x̄₂ > 1). (Round to 3 decimals.)',
            answer: 0.024,
            tolerance: 0.05,
            explain: 'z = (1 − 0.4) ÷ 0.303 ≈ 1.98 → P ≈ **0.024**',
            compute: () => normalcdf(1, Infinity, 0.4, Math.sqrt(1.2 ** 2 / 40 + 1.4 ** 2 / 35)),
          },
        },
        {
          kind: 'hack',
          title: 'Variances add, always',
          body: 'For a difference of independent means, add σ²/n for each group inside one square root, just like for proportions.',
        },
        {
          kind: 'trap',
          body: 'If either sample is under 30 and the population shape is unknown, you can\'t assume normality of x̄₁ − x̄₂ from the CLT.',
        },
        {
          kind: 'summary',
          points: ['Mean μ₁ − μ₂; SD √(σ₁²/n₁ + σ₂²/n₂).', 'Two independent random samples (or random assignment); 10% for each.', 'Normal if both populations normal; otherwise need n₁, n₂ ≥ 30.'],
        },
      ],
      check: [
        {
          id: 's4.7-q1',
          type: 'num',
          prompt: 'σ₁ = 10, n₁ = 25, σ₂ = 15, n₂ = 25. Find σ_{x̄₁−x̄₂}. (Round to 2 decimals.)',
          answer: 3.61,
          tolerance: 0.01,
          explain: '√(100/25 + 225/25) = √13 ≈ **3.61**',
          compute: () => Math.sqrt(100 / 25 + 225 / 25),
        },
        {
          id: 's4.7-q2',
          type: 'mcq',
          prompt: 'Both populations are strongly skewed; n₁ = 20 and n₂ = 45. Can we treat x̄₁ − x̄₂ as approximately normal?',
          choices: ['Yes, because n₂ ≥ 30', 'No, because n₁ < 30 and the populations aren\'t normal', 'Yes, always', 'Only if σ₁ = σ₂'],
          answer: 1,
          explain: 'Both sample sizes must be at least 30 when the populations aren\'t normal.',
        },
      ],
      flashcards: [
        { front: 'SD of x̄₁ − x̄₂', back: '√(σ₁²/n₁ + σ₂²/n₂)' },
        { front: 'Normality of x̄₁ − x̄₂', back: 'Normal if both populations are normal; approximately normal if n₁ ≥ 30 and n₂ ≥ 30.' },
      ],
    },
    {
      id: 'stats-4.8',
      ced: ['4.7', '4.8'],
      cedVersion: V,
      title: 'Two-Sample t-Interval',
      level: 'advanced',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'Random samples: 40 School A students average 7.1 hours of sleep; 35 School B students average 6.6. How big is the real difference in the mean sleep of all students at the two schools?',
        },
        {
          kind: 'concept',
          title: 'Procedure, parameter, conditions',
          body: 'Procedure: **two-sample t-interval for the difference between population means**.\n\nParameter: μ₁ − μ₂, the difference in means, with the response and both populations in context.\n\nConditions:\n1. Two independent random samples **or** a randomized experiment\n2. 10% for each sample (not needed for an experiment)\n3. **Sample data**: both n ≥ 30, or both populations approximately normal; if either n < 30, **both** samples must be free of strong skewness and outliers',
        },
        {
          kind: 'concept',
          title: 'The interval',
          body: '**(x̄₁ − x̄₂) ± t^{∗} √( s₁²/n₁ + s₂²/n₂ )**\n\nTechnology finds the degrees of freedom; they fall **between the smaller of n₁ − 1 and n₂ − 1, and n₁ + n₂ − 2**. Using df = the smaller of n₁ − 1 and n₂ − 1 gives a slightly wider, safe interval if you only have a table.',
        },
        {
          kind: 'example',
          title: 'Sleep at two schools',
          problem: 'School A: n = 40, x̄ = 7.1 h, s = 1.2 h. School B: n = 35, x̄ = 6.6 h, s = 1.4 h. Independent random samples. Build a 95% interval for μ_{A} − μ_{B}.',
          steps: [
            'Point estimate: 7.1 − 6.6 = **0.5 h**; SE = √(1.2²/40 + 1.4²/35) ≈ **0.303 h**',
            'Technology: df ≈ **67.4**, t^{∗} ≈ **1.996**',
            '0.5 ± 1.996(0.303) = (**−0.105**, **1.105**) hours',
            'The interval contains 0, so there is **not** convincing evidence of a difference in mean sleep between the schools.',
          ],
          answer: '(−0.105, 1.105) hours',
          verify: [
            { stated: 0.303, compute: () => sleep.se, tol: 0.002 },
            { stated: 67.4, compute: () => sleep.df, tol: 0.002 },
            { stated: 1.996, compute: () => sleep.tStar, tol: 0.001 },
            { stated: -0.105, compute: () => sleep.lo, tol: 0.02 },
            { stated: 1.105, compute: () => sleep.hi, tol: 0.002 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's4.8-t1',
            type: 'mcq',
            prompt: 'A 90% interval for μ_{new} − μ_{old} (battery hours) is (1.2, 3.8). Which conclusion is supported?',
            choices: ['No difference', 'Convincing evidence the new batteries last longer on average', 'The old batteries last longer', 'Every new battery lasts 1.2 to 3.8 hours longer'],
            answer: 1,
            explain: 'The interval is entirely **positive** (new − old > 0) and excludes 0.',
          },
        },
        {
          kind: 'hack',
          title: 'Interpretation template',
          body: '"We are 95% confident that the interval from −0.105 to 1.105 hours captures the **difference in mean nightly sleep (School A − School B)** for **all students** at the two schools."',
        },
        {
          kind: 'trap',
          body: 'Two-sample procedures are for **independent** groups. If the same people are measured twice, use matched pairs instead.',
        },
        {
          kind: 'summary',
          points: ['(x̄₁ − x̄₂) ± t^{∗}√(s₁²/n₁ + s₂²/n₂), df from technology.', 'Conditions: independent random samples or randomized experiment; 10%; sample data for both groups.', 'Contains 0 → no convincing evidence of a difference.'],
        },
      ],
      check: [
        {
          id: 's4.8-q1',
          type: 'num',
          prompt: 'Group 1: n = 30, s = 4. Group 2: n = 30, s = 3. Find the SE of x̄₁ − x̄₂. (Round to 3 decimals.)',
          answer: 0.913,
          tolerance: 0.01,
          explain: '√(16/30 + 9/30) = √(25/30) ≈ **0.913**',
          compute: () => Math.sqrt(16 / 30 + 9 / 30),
        },
        {
          id: 's4.8-q2',
          type: 'mcq',
          prompt: 'For two samples with n₁ = 12 and n₂ = 20, technology\'s degrees of freedom must fall between…',
          choices: ['11 and 30', '12 and 32', '11 and 19', '19 and 30'],
          answer: 0,
          explain: 'Between min(n₁ − 1, n₂ − 1) = **11** and n₁ + n₂ − 2 = **30**.',
        },
      ],
      flashcards: [
        { front: 'Two-sample t-interval', back: '(x̄₁ − x̄₂) ± t^{∗}√(s₁²/n₁ + s₂²/n₂), df from technology' },
        { front: 'Range of df for two-sample t', back: 'Between the smaller of n₁ − 1 and n₂ − 1, and n₁ + n₂ − 2.' },
      ],
    },
    {
      id: 'stats-4.9',
      ced: ['4.9', '4.10'],
      cedVersion: V,
      title: 'Two-Sample t-Test',
      level: 'advanced',
      minutes: 10,
      cards: [
        {
          kind: 'hook',
          body: '30 seedlings are randomly split: 15 get a new fertilizer, 15 get plain water. After a month, the fertilized plants average 2.7 cm taller. Real effect, or just which seedlings landed in which group?',
        },
        {
          kind: 'concept',
          title: 'Hypotheses and conditions',
          body: 'Procedure: **two-sample t-test for a difference between two population means**.\n\n- H₀: μ₁ − μ₂ = 0 (or μ₁ = μ₂)\n- Hₐ: μ₁ − μ₂ > 0, < 0 or ≠ 0\n\nConditions: two independent random samples or a randomized experiment; 10% for each sample (not for experiments); sample data condition for **both** groups.',
        },
        {
          kind: 'concept',
          title: 'Test statistic',
          body: '**t = ((x̄₁ − x̄₂) − 0) / √( s₁²/n₁ + s₂²/n₂ )**\n\nUnder H₀, t has a t-distribution; technology gives the df (between the smaller of n₁ − 1, n₂ − 1 and n₁ + n₂ − 2) and the p-value.',
        },
        {
          kind: 'example',
          title: 'Fertilizer experiment',
          problem: 'Fertilizer: n = 15, x̄ = 24.2 cm, s = 3.1 cm. Water: n = 15, x̄ = 21.5 cm, s = 3.8 cm. Random assignment; dotplots show no strong skew or outliers. Test at α = 0.05 whether fertilizer increases mean growth.',
          steps: [
            'H₀: μ_{F} − μ_{W} = 0, Hₐ: μ_{F} − μ_{W} > 0, where μ is the mean growth (cm) of seedlings like these under each treatment.',
            'Conditions: random assignment ✓; both samples show no strong skew/outliers ✓',
            't = (24.2 − 21.5) ÷ √(3.1²/15 + 3.8²/15) ≈ **2.13**; technology: df ≈ **26.9**, p-value ≈ **0.021**',
            '0.021 < 0.05 → **reject H₀**. There is convincing evidence that the fertilizer increases mean growth for seedlings like these. Random assignment allows a cause-and-effect conclusion.',
          ],
          answer: 't ≈ 2.13, p ≈ 0.021, reject H₀.',
          verify: [
            { stated: 2.13, compute: () => plants.t, tol: 0.003 },
            { stated: 26.9, compute: () => plants.df, tol: 0.003 },
            { stated: 0.021, compute: () => plants.p, tol: 0.03 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's4.9-t1',
            type: 'num',
            prompt: 'Group 1: x̄ = 80, s = 10, n = 50. Group 2: x̄ = 76, s = 12, n = 60. Find the two-sample t statistic. (Round to 2 decimals.)',
            answer: 1.91,
            tolerance: 0.01,
            explain: 'SE = √(100/50 + 144/60) = √4.4 ≈ 2.098; t = 4 ÷ 2.098 ≈ **1.91**',
            compute: () => twoTTest(80, 10, 50, 76, 12, 60, 'two').t,
          },
        },
        {
          kind: 'hack',
          title: 'Interpret the p-value with "equal means"',
          body: '"**Assuming the true mean growths are equal**, there is about a 0.021 probability of getting a difference in sample means of 2.7 cm or more by chance (from the random assignment) alone."',
        },
        {
          kind: 'trap',
          body: 'Questions asking whether data give **convincing evidence** want a **significance test**, not just a comparison of the two sample means.',
        },
        {
          kind: 'summary',
          points: ['H₀: μ₁ − μ₂ = 0; Hₐ: >, < or ≠ 0.', 't = (x̄₁ − x̄₂)/√(s₁²/n₁ + s₂²/n₂), df and p-value from technology.', 'Randomized experiment → cause and effect; random samples → generalize.'],
        },
      ],
      check: [
        {
          id: 's4.9-q1',
          type: 'num',
          prompt: 'For the groups above (t ≈ 1.91, two-sided), find the p-value with technology df. (Round to 3 decimals.)',
          answer: 0.0592,
          tolerance: 0.03,
          explain: 'Technology df ≈ 108 → two-sided p ≈ **0.059**',
          compute: () => twoTTest(80, 10, 50, 76, 12, 60, 'two').p,
        },
        {
          id: 's4.9-q2',
          type: 'mcq',
          prompt: 'Which hypotheses fit "Is there a difference in mean commute time between City A and City B?"',
          choices: ['H₀: μ_{A} = μ_{B}, Hₐ: μ_{A} ≠ μ_{B}', 'H₀: μ_{A} ≠ μ_{B}, Hₐ: μ_{A} = μ_{B}', 'H₀: x̄_{A} = x̄_{B}, Hₐ: x̄_{A} ≠ x̄_{B}', 'H₀: p_{A} = p_{B}, Hₐ: p_{A} ≠ p_{B}'],
          answer: 0,
          explain: '"A difference" → two-sided, about population **means** μ.',
        },
      ],
      flashcards: [
        { front: 'Two-sample t statistic', back: 't = (x̄₁ − x̄₂) / √(s₁²/n₁ + s₂²/n₂)' },
        { front: 'Null hypothesis for a two-sample t-test', back: 'H₀: μ₁ − μ₂ = 0 (or μ₁ = μ₂)' },
      ],
    },
    {
      id: 'stats-4.10',
      ced: ['3.3', '3.5', '3.10', '3.12', '3.14', '4.2', '4.4', '4.7', '4.9'],
      cedVersion: V,
      title: 'Which Procedure?',
      level: 'advanced',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'On the exam, choosing the right procedure is half the battle, and it earns its own point. Three questions sort every situation in Units 3 and 4.',
        },
        {
          kind: 'concept',
          title: 'Three sorting questions',
          body: '1. **Estimate or test?** "Estimate…", "how much…", "interval" → **confidence interval**. "Is there convincing evidence…", "test the claim…" → **significance test**.\n2. **Proportion or mean?** Categorical response → **z** (proportions) or **χ²** (several categories). Quantitative response → **t** (means).\n3. **How many groups, and are they paired?** One group, two independent groups, matched pairs, or a whole two-way table.',
        },
        {
          kind: 'concept',
          title: 'The menu',
          body: '| Situation | Procedure |\n| one proportion | one-sample z-interval / z-test for p |\n| two independent proportions | two-sample z-interval / z-test for p₁ − p₂ |\n| one categorical variable across several groups | χ² test for homogeneity |\n| two categorical variables, one sample | χ² test for independence |\n| one mean | one-sample t-interval / t-test for μ |\n| matched pairs | one-sample t on differences (μ_{d}) |\n| two independent means | two-sample t-interval / t-test for μ₁ − μ₂ |',
        },
        {
          kind: 'example',
          title: 'Name the procedure',
          problem: 'A random sample of 200 voters is asked whether they support a bill, and the pollster wants to estimate the support level. Then 100 voters from each of two cities are asked, to see if support differs.',
          steps: ['Part 1: categorical (support yes/no), one group, estimate → **one-sample z-interval for p**.', 'Part 2: categorical, two independent groups, "differs" → **two-sample z-test for p₁ − p₂**.'],
          answer: '1-sample z-interval for p; 2-sample z-test for p₁ − p₂',
        },
        {
          kind: 'try',
          question: {
            id: 's4.10-t1',
            type: 'mcq',
            prompt: 'Researchers record the resting heart rate of 30 athletes before and after a 6-week training plan to see if mean heart rate dropped. Which procedure?',
            choices: ['Two-sample t-test', 'Matched pairs t-test (one-sample t on differences)', 'Two-sample z-test', 'Chi-square test for homogeneity'],
            answer: 1,
            explain: 'Quantitative response, the **same athletes** measured twice → **matched pairs t-test** on the differences.',
          },
        },
        {
          kind: 'hack',
          title: 'Name it fully',
          body: 'Write the whole name: "**two-sample t-test for a difference between two population means**". Vague names like "t-test" may not earn the identification point.',
        },
        {
          kind: 'trap',
          body: 'Comparing the **mean** of a 0/1 variable is still a **proportion** problem. If the response is yes/no, it\'s z (or χ²), even if someone calls it an "average".',
        },
        {
          kind: 'summary',
          points: ['Interval or test? Proportion or mean? How many groups, paired or not?', 'Categorical → z or χ²; quantitative → t.', 'Name the procedure completely.'],
        },
      ],
      check: [
        {
          id: 's4.10-q1',
          type: 'mcq',
          prompt: 'Independent random samples of 80 dog owners and 80 cat owners report weekly hours of exercise. Is there a difference in the mean? Procedure:',
          choices: ['Two-sample t-test for μ₁ − μ₂', 'Matched pairs t-test', 'Two-sample z-test for p₁ − p₂', 'Chi-square test for independence'],
          answer: 0,
          explain: 'Quantitative response, two **independent** groups, test → **two-sample t-test**.',
        },
        {
          id: 's4.10-q2',
          type: 'mcq',
          prompt: 'A random sample of 400 adults is classified by age group (4 levels) and preferred news source (5 levels). Procedure to test for an association:',
          choices: ['Chi-square test for homogeneity', 'Chi-square test for independence', 'Two-sample z-test', 'One-sample t-test'],
          answer: 1,
          explain: 'One sample, two categorical variables → **independence**.',
        },
        {
          id: 's4.10-q3',
          type: 'mcq',
          prompt: 'A company wants to estimate the mean delivery time of its orders using a random sample of 60 orders. Procedure:',
          choices: ['One-sample t-interval for μ', 'One-sample z-interval for p', 'One-sample t-test for μ', 'Two-sample t-interval'],
          answer: 0,
          explain: 'Quantitative, one group, **estimate** → **one-sample t-interval** for a population mean.',
        },
      ],
      flashcards: [
        { front: 'Three questions to choose an inference procedure', back: '(1) Interval or test? (2) Proportion (categorical) or mean (quantitative)? (3) One group, two independent groups, paired, or a two-way table?' },
        { front: 'Paired quantitative data', back: 'One-sample t procedure on the differences (μ_{d}).' },
      ],
    },
  ],
  checkpoint: [
    {
      id: 's4-cp1',
      type: 'num',
      prompt: 'Find t^{∗} for a 99% confidence interval with n = 20. (3 decimals)',
      answer: 2.861,
      tolerance: 0.001,
      explain: 'df = 19; 0.5% in each tail → t^{∗} ≈ **2.861**',
      compute: () => invT(0.995, 19),
    },
    {
      id: 's4-cp2',
      type: 'mcq',
      prompt: 'Why do we use t instead of z for inference about a mean?',
      choices: ['Means are always skewed', 'σ is usually unknown and s is used instead, adding variability', 'n is always small', 't is easier to compute'],
      answer: 1,
      explain: 'Replacing σ with s adds uncertainty, which the fatter-tailed t-distribution accounts for.',
    },
    {
      id: 's4-cp3',
      type: 'num',
      prompt: 'A random sample of 36 has x̄ = 105 and s = 12. Find the 95% confidence interval\'s **upper** limit for μ. (Round to 2 decimals.)',
      answer: 109.06,
      tolerance: 0.001,
      explain: 'df = 35, t^{∗} ≈ 2.030; SE = 2; 105 + 2.030(2) ≈ **109.06**',
      compute: () => tInterval(105, 12, 36, 0.95).hi,
    },
    {
      id: 's4-cp4',
      type: 'mcq',
      prompt: 'A 95% interval for μ is (42.1, 47.9). A claim says μ = 48. What do you conclude?',
      choices: ['The claim is plausible', 'There is convincing evidence μ is not 48 (it\'s below)', 'μ = 45 exactly', '95% of values are between 42.1 and 47.9'],
      answer: 1,
      explain: '48 is outside the interval of plausible values.',
    },
    {
      id: 's4-cp5',
      type: 'mcq',
      prompt: 'Twins are randomly assigned, one to each of two reading programs, and their scores compared. Which analysis?',
      choices: ['Two-sample t', 'Matched pairs t on the differences', 'Chi-square', 'Two-sample z'],
      answer: 1,
      explain: 'Each pair of twins forms a natural pair → **matched pairs**.',
    },
    {
      id: 's4-cp6',
      type: 'num',
      prompt: 'One-sample t-test: H₀: μ = 12, n = 16, x̄ = 12.9, s = 1.8. Find t.',
      answer: 2,
      explain: 't = (12.9 − 12) ÷ (1.8/4) = 0.9 ÷ 0.45 = **2.0**',
      compute: () => tTest(12.9, 1.8, 16, 12, 'greater').t,
    },
    {
      id: 's4-cp7',
      type: 'mcq',
      prompt: 'A two-sample t-test yields p = 0.27. Which conclusion is correct at α = 0.05?',
      choices: [
        'The means are equal',
        'There is not convincing evidence of a difference between the population means',
        'Reject H₀',
        'The test proves no difference',
      ],
      answer: 1,
      explain: 'p > α → fail to reject H₀: not convincing evidence of a difference (not proof of equality).',
    },
    {
      id: 's4-cp8',
      type: 'num',
      prompt: 'σ = 20 and n = 64. Find σ_{x̄}.',
      answer: 2.5,
      explain: '20 ÷ √64 = 20 ÷ 8 = **2.5**',
      compute: () => 20 / Math.sqrt(64),
    },
  ],
}
