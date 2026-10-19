import type { Unit } from '../types'
import { binomCdf, binomPdf, invNorm, normalcdf, rvMean, rvSd } from '../../lib/stats'

const V = 'Fall 2026'

// Smartwatch survey: rows = grade, columns = owns a smartwatch (yes, no)
const WATCH = { g9: [30, 20], g10: [25, 25], g11: [20, 30] }
const W_TOTAL = 150
// Number of club meetings a member attends per week
const MEET_X = [0, 1, 2, 3]
const MEET_P = [0.1, 0.3, 0.4, 0.2]

export const unit2: Unit = {
  id: 'stats-u2',
  number: 2,
  title: 'Probability, Random Variables, and Probability Distributions',
  weight: '15–25%',
  blurb:
    'Two-way tables and association, simulation, the rules of probability, discrete random variables, the binomial and normal distributions, and sampling distributions with the central limit theorem.',
  badge: { name: 'Chance Champion', emoji: '🎲' },
  lessons: [
    // ---------------- FOUNDATION ----------------
    {
      id: 'stats-2.1',
      ced: ['2.1'],
      cedVersion: V,
      title: 'Two-Way Tables & Graphs',
      level: 'foundation',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Do older students own smartwatches more, or less, than younger ones? With **two** categorical variables (grade and smartwatch), the question becomes: are they **associated**?',
        },
        {
          kind: 'concept',
          title: 'Two-way (contingency) tables',
          body: 'A **two-way table** summarizes two categorical variables. Cells can hold counts or proportions.\n\n| Grade | Smartwatch: yes | No | Total |\n| 9th | 30 | 20 | 50 |\n| 10th | 25 | 25 | 50 |\n| 11th | 20 | 30 | 50 |\n| Total | 75 | 75 | 150 |',
        },
        {
          kind: 'concept',
          title: 'Graphs for two categorical variables',
          body: '**Side-by-side bar charts**, **segmented bar charts** and **mosaic plots** show, for each category of one variable, the distribution of the other.\n\nIf the distributions **differ** across groups, the variables are **associated**. If they are about the same, there is little or no association.',
          diagram: 'st-segmented',
        },
        {
          kind: 'example',
          title: 'Is there an association?',
          problem: 'Using the table, compare the proportion of smartwatch owners in each grade.',
          steps: ['9th: 30 ÷ 50 = **0.60**', '10th: 25 ÷ 50 = **0.50**', '11th: 20 ÷ 50 = **0.40**', 'The proportions differ (they drop with grade), so grade and smartwatch ownership **appear to be associated** in this sample.'],
          answer: 'Yes: 60%, 50%, 40% owners by grade.',
          verify: [
            { stated: 0.6, compute: () => WATCH.g9[0] / 50 },
            { stated: 0.5, compute: () => WATCH.g10[0] / 50 },
            { stated: 0.4, compute: () => WATCH.g11[0] / 50 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's2.1-t1',
            type: 'mcq',
            prompt: 'In a segmented bar chart of "pet owned" by "type of home", every bar is split into the same percentages. What does this suggest?',
            choices: ['A strong association', 'Little or no association', 'The sample was biased', 'One variable is quantitative'],
            answer: 1,
            explain: 'If the distribution of pets is **the same for every type of home**, knowing the home type tells you nothing about the pet: **no association**.',
          },
        },
        {
          kind: 'hack',
          title: 'Compare proportions, not counts',
          body: 'Groups often have different totals. Turn each row (or column) into **percentages within that group** before comparing. Segmented bars do exactly this: every bar is 100%.',
        },
        {
          kind: 'trap',
          body: 'An association in a sample is not proof of cause and effect. It only says the distributions differ (and from an observational study, a confounder could explain it).',
        },
        {
          kind: 'summary',
          points: ['Two-way tables summarize two categorical variables.', 'Side-by-side bars, segmented bars and mosaic plots compare distributions across groups.', 'Different distributions across groups suggest association.'],
        },
      ],
      check: [
        {
          id: 's2.1-q1',
          type: 'mcq',
          prompt: 'Which graph is designed to show the relationship between **two categorical** variables?',
          choices: ['Histogram', 'Scatterplot', 'Segmented bar chart', 'Boxplot'],
          answer: 2,
          explain: 'A **segmented bar chart** shows the distribution of one categorical variable within each category of another.',
        },
        {
          id: 's2.1-q2',
          type: 'mcq',
          prompt: 'In a survey, 70% of adults who exercise and 70% of adults who don\'t exercise prefer mornings. Based on this, exercise and time preference…',
          choices: ['are strongly associated', 'show no association in this sample', 'are causally related', 'can\'t be compared'],
          answer: 1,
          explain: 'The distribution of preference is **identical** in both groups, so there is no association in this sample.',
        },
      ],
      flashcards: [
        { front: 'Two-way table', back: 'A table summarizing two categorical variables; cells hold counts or proportions.' },
        { front: 'How do you see association between two categorical variables?', back: 'Compare conditional distributions (e.g. segmented bars). Different distributions → association.' },
      ],
    },
    {
      id: 'stats-2.2',
      ced: ['2.2'],
      cedVersion: V,
      title: 'Joint, Marginal & Conditional',
      level: 'foundation',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: '"What fraction of students are 9th graders with a smartwatch?" and "What fraction of 9th graders have a smartwatch?" sound alike but have different answers. The difference is **what you divide by**.',
        },
        {
          kind: 'concept',
          title: 'Three kinds of relative frequency',
          body: '- **Joint**: a **cell** ÷ the **table total**. P(9th and yes) = 30 ÷ 150\n- **Marginal**: a **row or column total** ÷ the **table total**. P(yes) = 75 ÷ 150\n- **Conditional**: a cell ÷ the total of **its row or column**, restricting to one category. P(yes given 9th) = 30 ÷ 50',
        },
        {
          kind: 'example',
          title: 'Smartwatch table',
          problem: 'Using the smartwatch table (total 150), find the joint relative frequency of "9th and yes", the marginal relative frequency of "yes", and the conditional relative frequency of "9th" among owners.',
          steps: [
            'Joint: 30 ÷ 150 = **0.20**',
            'Marginal: 75 ÷ 150 = **0.50**',
            'Conditional, among owners only (column total 75): 30 ÷ 75 = **0.40**',
          ],
          answer: '0.20, 0.50, 0.40',
          verify: [
            { stated: 0.2, compute: () => WATCH.g9[0] / W_TOTAL },
            { stated: 0.5, compute: () => (WATCH.g9[0] + WATCH.g10[0] + WATCH.g11[0]) / W_TOTAL },
            { stated: 0.4, compute: () => WATCH.g9[0] / (WATCH.g9[0] + WATCH.g10[0] + WATCH.g11[0]) },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's2.2-t1',
            type: 'num',
            prompt: 'Among the **11th graders** (row total 50), what proportion do **not** own a smartwatch?',
            answer: 0.6,
            explain: '30 ÷ 50 = **0.60**, a conditional relative frequency (restricted to 11th graders).',
            compute: () => WATCH.g11[1] / 50,
          },
        },
        {
          kind: 'hack',
          title: '"Of", "among", "given" → shrink the denominator',
          body: 'Words like **of the…**, **among…**, **given…**, **who are…** mean a **conditional**: divide by that group\'s total, not the grand total.',
        },
        {
          kind: 'trap',
          body: 'P(9th given yes) = 30/75 = 0.40, but P(yes given 9th) = 30/50 = 0.60. Swapping the condition changes the answer.',
        },
        {
          kind: 'summary',
          points: ['Joint = cell ÷ table total.', 'Marginal = row or column total ÷ table total.', 'Conditional = cell ÷ its row or column total.'],
        },
      ],
      check: [
        {
          id: 's2.2-q1',
          type: 'num',
          prompt: 'A cafe sold 50 drinks in an hour: 40 hot and 10 cold. Of the hot drinks, 14 were tea. What proportion of the **hot** drinks were tea?',
          answer: 0.35,
          explain: 'Restrict to hot drinks: 14 ÷ 40 = **0.35**.',
          compute: () => 14 / 40,
        },
        {
          id: 's2.2-q2',
          type: 'mcq',
          prompt: 'In the smartwatch table, 75/150 is a…',
          choices: ['joint relative frequency', 'marginal relative frequency', 'conditional relative frequency', 'cell count'],
          answer: 1,
          explain: 'A **column total** (75 owners) ÷ the **table total** (150) is a **marginal** relative frequency.',
        },
      ],
      flashcards: [
        { front: 'Conditional relative frequency', back: 'A cell divided by the total of its row (or column): the proportion within one category.' },
        { front: 'Marginal relative frequency', back: 'A row or column total divided by the table total.' },
      ],
    },
    {
      id: 'stats-2.3',
      ced: ['2.3'],
      cedVersion: V,
      title: 'Simulation & the Law of Large Numbers',
      level: 'foundation',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'A cereal box holds one of 5 equally likely prizes. How many boxes until you collect them all? The math is hard, but you can **simulate** it: roll a die-like random number many times and count.',
        },
        {
          kind: 'concept',
          title: 'The words of chance',
          body: '- **Random process**: results are determined by chance.\n- **Outcome**: the result of one trial.\n- **Event**: a collection of outcomes.\n- **Probability**: the **long-run relative frequency** of an outcome or event over a large number of trials.',
        },
        {
          kind: 'concept',
          title: 'Simulation',
          body: '**Simulation** models a random process so simulated outcomes match real-world outcomes:\n\n1. Assign values to outcomes so chance picks them correctly (e.g. random digits 0–9: 0–2 = "rain" for a 30% chance).\n2. Run many trials.\n3. Record the counts of each outcome and the total.\n4. Estimate the probability = count ÷ number of trials.',
        },
        {
          kind: 'concept',
          title: 'Law of large numbers',
          body: 'For **independent** trials, as the number of trials increases, the relative frequency of an outcome gets **closer and closer to a single value**, the true probability.\n\nIn the short run, results bounce around a lot. In the long run, they settle down.',
        },
        {
          kind: 'example',
          title: 'Estimate from a simulation',
          problem: 'To estimate the chance a 70% free-throw shooter makes at least 4 of 5 shots, a student runs **200** simulated sets of 5 shots and gets "at least 4" in **105** of them. Estimate the probability.',
          steps: ['Estimate = 105 ÷ 200 = **0.525**', 'Check later with the binomial distribution (Topic 2.10): the exact value is about **0.528**, so the simulation is close.'],
          answer: '≈ 0.525',
          verify: [
            { stated: 0.525, compute: () => 105 / 200 },
            { stated: 0.528, compute: () => 1 - binomCdf(5, 0.7, 3), tol: 0.002 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's2.3-t1',
            type: 'mcq',
            prompt: 'To simulate a 30% chance of rain with random digits 0–9, which assignment works?',
            choices: ['0–3 = rain', '0–2 = rain', '0–6 = rain', '7 = rain'],
            answer: 1,
            explain: 'Three digits out of ten (0, 1, 2) give a **3/10 = 30%** chance.',
          },
        },
        {
          kind: 'hack',
          title: 'Describe a simulation in 3 parts',
          body: '1. **Assign**: what each random value means. 2. **Trial**: what one repetition is and what you record. 3. **Repeat and estimate**: many trials, probability ≈ count ÷ trials.',
        },
        {
          kind: 'trap',
          body: 'The law of large numbers does **not** mean chance "evens out" in the short run. After 5 heads in a row, the next flip is still 50/50. Coins have no memory.',
        },
        {
          kind: 'summary',
          points: ['Probability = long-run relative frequency.', 'Simulation: assign, run many trials, record counts, estimate.', 'Law of large numbers: relative frequency settles toward the true probability as trials increase.'],
        },
      ],
      check: [
        {
          id: 's2.3-q1',
          type: 'mcq',
          prompt: 'A coin is flipped 10 times and lands heads 7 times. Then it is flipped 10,000 times. What does the law of large numbers predict?',
          choices: ['Exactly 5,000 heads', 'About 70% heads', 'The proportion of heads will be close to the true probability of heads', 'More tails to make up for the early heads'],
          answer: 2,
          explain: 'Over many independent trials the relative frequency gets close to the **true probability** (0.5 for a fair coin). It does not "make up" for past results.',
        },
        {
          id: 's2.3-q2',
          type: 'num',
          prompt: 'In 400 simulated trials, an event happened 62 times. Estimate its probability.',
          answer: 0.155,
          explain: '62 ÷ 400 = **0.155**',
          compute: () => 62 / 400,
        },
      ],
      flashcards: [
        { front: 'Probability (long-run view)', back: 'The relative frequency of an outcome over a very large number of trials.' },
        { front: 'Law of large numbers', back: 'For independent trials, the relative frequency approaches a single value (the true probability) as the number of trials grows.' },
      ],
    },
    {
      id: 'stats-2.4',
      ced: ['2.4'],
      cedVersion: V,
      title: 'Probability Basics & Complements',
      level: 'foundation',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: 'What is the chance of rolling **at least one 6** in four rolls of a die? Counting every way is a pain. Counting the way it does **not** happen is easy. That is the complement rule.',
        },
        {
          kind: 'concept',
          title: 'The basics',
          body: '- **Sample space**: all possible non-overlapping outcomes. P(sample space) = **1**.\n- If all outcomes are **equally likely**: P(E) = (outcomes in E) ÷ (total outcomes).\n- Every probability is between **0 and 1**, inclusive.',
        },
        {
          kind: 'concept',
          title: 'Complements',
          body: 'The **complement** of E ("not E", written E′, Ē or E^{C}) is everything in the sample space that is not in E.\n\n**P(not E) = 1 − P(E)**',
        },
        {
          kind: 'example',
          title: 'At least one 6 in four rolls',
          problem: 'Find P(at least one 6) in four rolls of a fair die.',
          steps: ['Complement: **no** 6 in four rolls. Each roll: P(not 6) = 5/6.', 'Rolls are independent: P(no 6) = (5/6)^{4} ≈ **0.482**', 'P(at least one 6) = 1 − 0.482 ≈ **0.518**'],
          answer: '≈ 0.518',
          verify: [
            { stated: 0.482, compute: () => (5 / 6) ** 4, tol: 0.002 },
            { stated: 0.518, compute: () => 1 - (5 / 6) ** 4, tol: 0.002 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's2.4-t1',
            type: 'num',
            prompt: 'A spinner has 8 equal sections numbered 1–8. What is P(the number is greater than 5)?',
            answer: 0.375,
            explain: 'Outcomes 6, 7, 8 → 3 of 8 equally likely outcomes: 3 ÷ 8 = **0.375**',
            compute: () => 3 / 8,
          },
        },
        {
          kind: 'hack',
          title: '"At least one" → use the complement',
          body: 'P(at least one) = 1 − P(none). It turns a messy problem into one multiplication.',
        },
        {
          kind: 'trap',
          body: 'Equally likely is a requirement, not a default. "Either it rains or it doesn\'t, so P(rain) = 1/2" is wrong: those two outcomes are not equally likely.',
        },
        {
          kind: 'summary',
          points: ['P(sample space) = 1, and 0 ≤ P(E) ≤ 1.', 'Equally likely outcomes: P(E) = favorable ÷ total.', 'P(not E) = 1 − P(E); "at least one" = 1 − P(none).'],
        },
      ],
      check: [
        {
          id: 's2.4-q1',
          type: 'num',
          prompt: 'The probability that a randomly chosen phone has a cracked screen is 0.18. What is the probability it does **not**?',
          answer: 0.82,
          explain: '1 − 0.18 = **0.82**',
          compute: () => 1 - 0.18,
        },
        {
          id: 's2.4-q2',
          type: 'mcq',
          prompt: 'Which value can NOT be a probability?',
          choices: ['0', '0.999', '1', '1.2'],
          answer: 3,
          explain: 'Probabilities are between 0 and 1 inclusive, so **1.2** is impossible.',
        },
        {
          id: 's2.4-q3',
          type: 'num',
          prompt: 'Each of 3 independent traffic lights is green with probability 0.4. What is P(at least one green)?',
          answer: 0.784,
          explain: 'P(none green) = 0.6^{3} = 0.216 → 1 − 0.216 = **0.784**',
          compute: () => 1 - 0.6 ** 3,
        },
      ],
      flashcards: [
        { front: 'Complement rule', back: 'P(not E) = 1 − P(E)' },
        { front: 'Equally likely outcomes', back: 'P(E) = (number of outcomes in E) ÷ (total number of outcomes)' },
      ],
    },
    // ---------------- CORE ----------------
    {
      id: 'stats-2.5',
      ced: ['2.5'],
      cedVersion: V,
      title: 'Mutually Exclusive Events',
      level: 'core',
      minutes: 5,
      cards: [
        {
          kind: 'hook',
          body: 'Can a student be a 9th grader **and** a 10th grader at once? No. Can a student play soccer **and** be in band? Sure. That is the difference between events that can\'t overlap and events that can.',
        },
        {
          kind: 'concept',
          title: 'Joint probability and disjoint events',
          body: 'The **joint probability** P(A ∩ B) ("A and B", the **intersection**) is the chance that **both** happen.\n\nEvents are **mutually exclusive** (**disjoint**) if they **cannot happen at the same time**:\n\n**P(A ∩ B) = 0**',
        },
        {
          kind: 'example',
          title: 'Justify with a joint probability',
          problem: 'One card is drawn from a standard 52-card deck. Are "the card is a heart" and "the card is a club" mutually exclusive? Are "heart" and "king"?',
          steps: ['Heart and club: no card is both, so P(heart ∩ club) = **0** → mutually exclusive.', 'Heart and king: the king of hearts is both, so P(heart ∩ king) = 1/52 ≈ **0.019** ≠ 0 → **not** mutually exclusive.'],
          answer: 'Heart/club: yes. Heart/king: no.',
          verify: [{ stated: 0.019, compute: () => 1 / 52, tol: 0.02 }],
        },
        {
          kind: 'try',
          question: {
            id: 's2.5-t1',
            type: 'mcq',
            prompt: 'In a two-way table, the cell for "owns a car and is under 16" contains 0. What does this show?',
            choices: ['The events are independent', 'The events are mutually exclusive in this data', 'P(owns a car) = 0', 'P(under 16) = 0'],
            answer: 1,
            explain: 'A joint count of 0 means P(A ∩ B) = 0: the events **can\'t happen together** here, so they are mutually exclusive.',
          },
        },
        {
          kind: 'hack',
          title: 'The justification sentence',
          body: '"The events are mutually exclusive because P(A and B) = 0: [explain in context why both can\'t happen]."',
        },
        {
          kind: 'trap',
          body: '**Mutually exclusive is not the same as independent.** If A and B are disjoint (and each can happen), knowing A happened tells you B did **not**, so they are actually **dependent**.',
        },
        {
          kind: 'summary',
          points: ['P(A ∩ B) is the joint probability ("A and B").', 'Mutually exclusive (disjoint): can\'t happen together, P(A ∩ B) = 0.', 'Disjoint events with positive probabilities are not independent.'],
        },
      ],
      check: [
        {
          id: 's2.5-q1',
          type: 'mcq',
          prompt: 'Rolling one die, which pair of events is mutually exclusive?',
          choices: ['"Even" and "greater than 3"', '"Odd" and "less than 3"', '"Roll a 2" and "roll a 5"', '"Even" and "prime"'],
          answer: 2,
          explain: 'One roll can\'t be both 2 and 5, so P(2 ∩ 5) = 0. The others overlap (4 or 6; 1; 2).',
        },
        {
          id: 's2.5-q2',
          type: 'mcq',
          prompt: 'If A and B are mutually exclusive, P(A ∩ B) equals…',
          choices: ['P(A) · P(B)', 'P(A) + P(B)', '0', '1'],
          answer: 2,
          explain: 'They can\'t both happen: **P(A ∩ B) = 0**.',
        },
      ],
      flashcards: [
        { front: 'Mutually exclusive (disjoint)', back: 'Events that cannot happen at the same time: P(A ∩ B) = 0.' },
        { front: 'Joint probability', back: 'P(A ∩ B): the probability that both A and B happen.' },
      ],
    },
    {
      id: 'stats-2.6',
      ced: ['2.6'],
      cedVersion: V,
      title: 'Conditional Probability',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'The chance a random student owns a smartwatch is 50%. But if you **already know** the student is a 9th grader, the chance is 60%. New information changes probabilities.',
        },
        {
          kind: 'concept',
          title: 'Conditional probability',
          body: 'The probability that A happens **given that** B has happened:\n\n**P(A | B) = P(A ∩ B) ÷ P(B)**\n\nIn a two-way table: restrict to the B row or column, then find the fraction that is also A.',
        },
        {
          kind: 'concept',
          title: 'General multiplication rule',
          body: 'Rearranging the formula gives the chance both happen:\n\n**P(A ∩ B) = P(A) · P(B | A)**\n\nUse it for step-by-step situations, like drawing without replacement.',
        },
        {
          kind: 'example',
          title: 'Two reds without replacement',
          problem: 'Two cards are drawn **without replacement** from a standard deck (26 red, 26 black). Find P(both red).',
          steps: ['P(1st red) = 26/52 = 0.5', 'P(2nd red | 1st red) = 25/51 (one red card is gone)', 'P(both red) = (26/52)(25/51) ≈ **0.245**'],
          answer: '≈ 0.245',
          verify: [{ stated: 0.245, compute: () => (26 / 52) * (25 / 51), tol: 0.002 }],
        },
        {
          kind: 'try',
          question: {
            id: 's2.6-t1',
            type: 'num',
            prompt: 'P(A ∩ B) = 0.12 and P(B) = 0.40. Find P(A | B).',
            answer: 0.3,
            explain: 'P(A | B) = 0.12 ÷ 0.40 = **0.30**',
            compute: () => 0.12 / 0.4,
          },
        },
        {
          kind: 'concept',
          title: 'From a two-way table',
          body: 'Smartwatch table: P(yes | 9th) = 30/50 = **0.60**. Using the formula: P(yes ∩ 9th) ÷ P(9th) = (30/150) ÷ (50/150) = 0.20 ÷ 0.333… = 0.60. Same answer: the "÷ 150"s cancel.',
        },
        {
          kind: 'hack',
          title: 'Tree diagrams for multi-step chance',
          body: 'Draw branches for the first event, then conditional branches for the second. **Multiply along** a path to get "and"; **add paths** to combine ways an event can happen.',
        },
        {
          kind: 'trap',
          body: 'P(A | B) ≠ P(B | A). The probability a person who tests positive has a disease is usually very different from the probability a person with the disease tests positive.',
        },
        {
          kind: 'summary',
          points: ['P(A | B) = P(A ∩ B) ÷ P(B).', 'P(A ∩ B) = P(A) · P(B | A).', 'Order matters: P(A | B) and P(B | A) are different.'],
        },
      ],
      check: [
        {
          id: 's2.6-q1',
          type: 'num',
          prompt: 'A bag has 5 green and 3 yellow marbles. Two are drawn without replacement. Find P(both yellow). (Round to 3 decimals.)',
          answer: 0.107,
          tolerance: 0.01,
          explain: '(3/8)(2/7) = 6/56 ≈ **0.107**',
          compute: () => (3 / 8) * (2 / 7),
        },
        {
          id: 's2.6-q2',
          type: 'num',
          prompt: '40% of a school\'s students take Spanish; of those, 25% also take art. What is P(Spanish and art)?',
          answer: 0.1,
          explain: 'P(S ∩ A) = P(S) · P(A | S) = 0.40 × 0.25 = **0.10**',
          compute: () => 0.4 * 0.25,
        },
      ],
      flashcards: [
        { front: 'Conditional probability formula', back: 'P(A | B) = P(A ∩ B) ÷ P(B)' },
        { front: 'General multiplication rule', back: 'P(A ∩ B) = P(A) · P(B | A)' },
      ],
    },
    {
      id: 'stats-2.7',
      ced: ['2.7'],
      cedVersion: V,
      title: 'Independence & "Or"',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'Does knowing it\'s raining change the chance your bus is late? If yes, the events are dependent. If knowing one tells you nothing about the other, they are **independent**, and the math gets simpler.',
        },
        {
          kind: 'concept',
          title: 'Independent events',
          body: 'A and B are **independent** if knowing whether A happened does **not change** the probability of B. Then:\n\n- P(A | B) = P(A) and P(B | A) = P(B)\n- **P(A ∩ B) = P(A) · P(B)**\n\nTo **check** independence, test whether P(A | B) = P(A) (or P(A ∩ B) = P(A)·P(B)).',
        },
        {
          kind: 'concept',
          title: 'The addition rule ("or")',
          body: 'P(A ∪ B) is the chance that A **or** B (or both) happens, the **union**:\n\n**P(A ∪ B) = P(A) + P(B) − P(A ∩ B)**\n\nSubtract the overlap so it isn\'t counted twice. If A and B are mutually exclusive, the overlap is 0.',
        },
        {
          kind: 'example',
          title: 'Is ownership independent of grade?',
          problem: 'Smartwatch table: P(yes) = 75/150 = 0.50 and P(yes | 9th) = 30/50 = 0.60. Are "owns a smartwatch" and "is a 9th grader" independent? Then find P(9th ∪ yes).',
          steps: [
            '0.60 ≠ 0.50 → knowing the grade changes the probability → **not independent**.',
            'P(9th) = 50/150, P(yes) = 75/150, P(9th ∩ yes) = 30/150',
            'P(9th ∪ yes) = (50 + 75 − 30) ÷ 150 = 95/150 ≈ **0.633**',
          ],
          answer: 'Not independent; P(9th or yes) ≈ 0.633',
          verify: [{ stated: 0.633, compute: () => (50 + 75 - 30) / 150, tol: 0.002 }],
        },
        {
          kind: 'try',
          question: {
            id: 's2.7-t1',
            type: 'num',
            prompt: 'P(A) = 0.5, P(B) = 0.3 and A and B are independent. Find P(A ∪ B).',
            answer: 0.65,
            hint: 'First find P(A ∩ B) = P(A)·P(B).',
            explain: 'P(A ∩ B) = 0.5 × 0.3 = 0.15 → P(A ∪ B) = 0.5 + 0.3 − 0.15 = **0.65**',
            compute: () => 0.5 + 0.3 - 0.5 * 0.3,
          },
        },
        {
          kind: 'hack',
          title: '"And" multiplies, "or" adds (minus overlap)',
          body: '**And**: P(A)·P(B | A), or P(A)·P(B) if independent. **Or**: P(A) + P(B) − P(A and B).',
        },
        {
          kind: 'trap',
          body: 'Only multiply P(A)·P(B) for "and" if the events are **independent**. Drawing without replacement usually makes events dependent.',
        },
        {
          kind: 'summary',
          points: ['Independent: P(A | B) = P(A); then P(A ∩ B) = P(A)·P(B).', 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B).', 'Check independence by comparing P(A | B) with P(A).'],
        },
      ],
      check: [
        {
          id: 's2.7-q1',
          type: 'num',
          prompt: 'P(A) = 0.6, P(B) = 0.5, P(A ∩ B) = 0.2. Find P(A ∪ B).',
          answer: 0.9,
          explain: '0.6 + 0.5 − 0.2 = **0.9**',
          compute: () => 0.6 + 0.5 - 0.2,
        },
        {
          id: 's2.7-q2',
          type: 'mcq',
          prompt: 'P(A) = 0.4, P(B) = 0.5, P(A ∩ B) = 0.2. Are A and B independent?',
          choices: ['Yes, because P(A)·P(B) = 0.2 = P(A ∩ B)', 'No, because P(A ∩ B) ≠ 0', 'No, because P(A) ≠ P(B)', 'Can\'t tell'],
          answer: 0,
          explain: '0.4 × 0.5 = 0.2, which equals P(A ∩ B), so the events are **independent**.',
        },
      ],
      flashcards: [
        { front: 'Test for independence', back: 'A and B are independent if P(A | B) = P(A) (equivalently P(A ∩ B) = P(A)·P(B)).' },
        { front: 'Addition rule', back: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)' },
      ],
    },
    {
      id: 'stats-2.8',
      ced: ['2.8'],
      cedVersion: V,
      title: 'Random Variables & Distributions',
      level: 'core',
      minutes: 6,
      cards: [
        {
          kind: 'hook',
          body: 'Flip 3 coins and count heads. The count could be 0, 1, 2 or 3, and each has its own chance. A **random variable** turns chance outcomes into numbers you can graph and average.',
        },
        {
          kind: 'concept',
          title: 'Random variables and their distributions',
          body: 'A **random variable** has numerical values that come from a random process (written with capital letters like X).\n\nA **probability distribution** for a **discrete** random variable gives the probability of **every** possible value. The probabilities **add to 1**. It can be a table, a graph or a formula, and it can come from probability rules or be estimated by simulation.',
        },
        {
          kind: 'example',
          title: 'Three coin flips',
          problem: 'X = number of heads in 3 fair coin flips. Build the probability distribution.',
          steps: [
            '8 equally likely outcomes: HHH, HHT, HTH, THH, HTT, THT, TTH, TTT',
            '| X | 0 | 1 | 2 | 3 |\n| P(X) | 1/8 | 3/8 | 3/8 | 1/8 |',
            'Check: 1/8 + 3/8 + 3/8 + 1/8 = **1** ✓',
          ],
          answer: 'P(0) = 0.125, P(1) = 0.375, P(2) = 0.375, P(3) = 0.125',
          verify: [
            { stated: 0.375, compute: () => binomPdf(3, 0.5, 1) },
            { stated: 1, compute: () => [0, 1, 2, 3].reduce((t, k) => t + binomPdf(3, 0.5, k), 0) },
          ],
        },
        {
          kind: 'concept',
          title: 'Cumulative distribution',
          body: 'A **cumulative** probability distribution gives P(X ≤ x) for each value.\n\n| x | 0 | 1 | 2 | 3 |\n| P(X ≤ x) | 0.125 | 0.5 | 0.875 | 1 |',
        },
        {
          kind: 'try',
          question: {
            id: 's2.8-t1',
            type: 'num',
            prompt: 'A distribution has P(X = 0) = 0.1, P(X = 1) = 0.3, P(X = 2) = 0.4 and P(X = 3) = ?. Find the missing probability.',
            answer: 0.2,
            explain: 'Probabilities add to 1: 1 − (0.1 + 0.3 + 0.4) = **0.2**',
            compute: () => 1 - (0.1 + 0.3 + 0.4),
          },
        },
        {
          kind: 'hack',
          title: '"At least" and "at most" from a table',
          body: 'P(X ≥ 2) = add the probabilities of 2 and above. P(X ≤ 1) = add 0 and 1. If there are many values, use the complement.',
        },
        {
          kind: 'trap',
          body: 'P(X > 2) and P(X ≥ 2) are different for discrete variables. "More than 2" leaves out 2 itself.',
        },
        {
          kind: 'summary',
          points: ['A random variable gives numbers to chance outcomes.', 'A discrete distribution lists every value with its probability; they add to 1.', 'Cumulative distribution: P(X ≤ x).'],
        },
      ],
      check: [
        {
          id: 's2.8-q1',
          type: 'num',
          prompt: 'Club meetings attended per week: P(0) = 0.1, P(1) = 0.3, P(2) = 0.4, P(3) = 0.2. Find P(X ≥ 2).',
          answer: 0.6,
          explain: '0.4 + 0.2 = **0.6**',
          compute: () => MEET_P[2] + MEET_P[3],
        },
        {
          id: 's2.8-q2',
          type: 'mcq',
          prompt: 'Which could be a probability distribution for X = 1, 2, 3?',
          choices: ['0.2, 0.3, 0.4', '0.5, 0.5, 0.5', '0.1, 0.6, 0.3', '0.7, −0.1, 0.4'],
          answer: 2,
          explain: 'Only **0.1, 0.6, 0.3** are all between 0 and 1 **and** add to 1.',
        },
      ],
      flashcards: [
        { front: 'Discrete probability distribution', back: 'Every possible value of the random variable with its probability; the probabilities sum to 1.' },
        { front: 'Cumulative distribution', back: 'Gives P(X ≤ x) for each value x.' },
      ],
    },
    {
      id: 'stats-2.9',
      ced: ['2.9'],
      cedVersion: V,
      title: 'Mean & SD of a Random Variable',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'A raffle ticket costs $2. On average, do buyers win or lose money? The **expected value** answers that: the long-run average outcome if you played again and again.',
        },
        {
          kind: 'concept',
          title: 'Expected value (mean)',
          body: '**μ_{X} = E(X) = Σ x_{i} · P(x_{i})**\n\nMultiply each value by its probability, then add. It is a **parameter**: a single fixed value describing the distribution. Interpret it as the **long-run average** outcome.',
        },
        {
          kind: 'concept',
          title: 'Standard deviation',
          body: '**σ_{X} = √( Σ (x_{i} − μ_{X})² · P(x_{i}) )**\n\nThe typical distance of the values of X from its mean, over the long run. Its square, σ_{X}², is the **variance**, V(X).',
        },
        {
          kind: 'example',
          title: 'Club meetings per week',
          problem: 'X = meetings attended per week: P(0) = 0.1, P(1) = 0.3, P(2) = 0.4, P(3) = 0.2. Find μ_{X} and σ_{X}.',
          steps: [
            'μ = 0(0.1) + 1(0.3) + 2(0.4) + 3(0.2) = 0 + 0.3 + 0.8 + 0.6 = **1.7**',
            'Squared deviations × P: (0 − 1.7)²(0.1) + (1 − 1.7)²(0.3) + (2 − 1.7)²(0.4) + (3 − 1.7)²(0.2) = 0.289 + 0.147 + 0.036 + 0.338 = **0.81**',
            'σ = √0.81 = **0.9**',
          ],
          answer: 'μ = 1.7 meetings, σ = 0.9 meetings',
          verify: [
            { stated: 1.7, compute: () => rvMean(MEET_X, MEET_P) },
            { stated: 0.81, compute: () => rvSd(MEET_X, MEET_P) ** 2 },
            { stated: 0.9, compute: () => rvSd(MEET_X, MEET_P) },
          ],
        },
        {
          kind: 'concept',
          title: 'Interpret in context',
          body: '- **Mean**: "Over many weeks, a member attends **1.7 meetings per week on average**."\n- **SD**: "The number of meetings a member attends **typically varies by about 0.9 meetings** from the mean of 1.7."',
        },
        {
          kind: 'try',
          question: {
            id: 's2.9-t1',
            type: 'num',
            prompt: 'A game pays $10 with probability 0.2 and $0 otherwise. What is the expected payout?',
            answer: 2,
            unit: 'dollars',
            explain: 'E(X) = 10(0.2) + 0(0.8) = **$2**',
            compute: () => rvMean([10, 0], [0.2, 0.8]),
          },
        },
        {
          kind: 'hack',
          title: 'Let your calculator do Σ',
          body: 'Put the values in one list and the probabilities in another, then run one-variable statistics with the probability list as the frequency. You get μ and σ at once. Still show the formula with your numbers on free response.',
        },
        {
          kind: 'trap',
          body: 'The expected value need not be a possible value. You will never attend 1.7 meetings in one week; it is a long-run average.',
        },
        {
          kind: 'summary',
          points: ['μ_{X} = Σ x·P(x): the long-run average.', 'σ_{X} = √(Σ (x − μ)²·P(x)): typical deviation from the mean.', 'Both are parameters; interpret in context with units.'],
        },
      ],
      check: [
        {
          id: 's2.9-q1',
          type: 'num',
          prompt: 'X takes values 1, 2, 5 with probabilities 0.5, 0.3, 0.2. Find E(X).',
          answer: 2.1,
          explain: '1(0.5) + 2(0.3) + 5(0.2) = 0.5 + 0.6 + 1.0 = **2.1**',
          compute: () => rvMean([1, 2, 5], [0.5, 0.3, 0.2]),
        },
        {
          id: 's2.9-q2',
          type: 'mcq',
          prompt: 'The expected number of phone calls a help desk gets per minute is 2.4. Which is the correct interpretation?',
          choices: ['Every minute the desk gets 2.4 calls', 'Over many minutes, the average number of calls per minute is 2.4', 'Most minutes have 2 calls', 'The desk will get 24 calls in 10 minutes'],
          answer: 1,
          explain: 'The expected value is a **long-run average** over many minutes, not a guarantee for any single minute.',
        },
      ],
      flashcards: [
        { front: 'Expected value of a discrete random variable', back: 'μ_{X} = Σ x_{i}·P(x_{i}): the long-run average outcome.' },
        { front: 'Standard deviation of a discrete random variable', back: 'σ_{X} = √(Σ (x_{i} − μ_{X})²·P(x_{i}))' },
      ],
    },
    {
      id: 'stats-2.10',
      ced: ['2.10'],
      cedVersion: V,
      title: 'Binomial Setting, Mean & SD',
      level: 'core',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'A factory says 8% of its light bulbs are defective. In a random box of 25 bulbs, how many defective bulbs do you expect, and how much would that number vary from box to box? A **binomial** model answers both.',
        },
        {
          kind: 'concept',
          title: 'When is X binomial?',
          body: 'X is **binomial** when it **counts the number of successes** in:\n\n- a **fixed number n** of trials,\n- that are **independent**,\n- each with only **two outcomes** (success or failure),\n- with the **same probability of success p** on every trial (failure: 1 − p).',
        },
        {
          kind: 'concept',
          title: 'Mean and standard deviation',
          body: '**μ_{X} = np**\n\n**σ_{X} = √( np(1 − p) )**\n\nBoth are on the formula sheet.',
        },
        {
          kind: 'example',
          title: 'Defective bulbs in a box of 25',
          problem: 'X = number of defective bulbs in a random box of 25, with p = 0.08. Find and interpret the mean and SD.',
          steps: [
            'Binomial: n = 25 fixed, independent bulbs, defective or not, p = 0.08 each.',
            'μ = 25(0.08) = **2** defective bulbs',
            'σ = √(25 × 0.08 × 0.92) = √1.84 ≈ **1.356**',
            'Over many random boxes of 25, the average number of defective bulbs is 2, and the count typically varies by about 1.36 bulbs from that average.',
          ],
          answer: 'μ = 2, σ ≈ 1.356',
          verify: [
            { stated: 2, compute: () => 25 * 0.08 },
            { stated: 1.356, compute: () => Math.sqrt(25 * 0.08 * 0.92), tol: 0.001 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's2.10-t1',
            type: 'mcq',
            prompt: 'Which random variable is binomial?',
            choices: [
              'Number of rolls of a die until you get a 6',
              'Number of heads in 15 flips of a fair coin',
              'Total of two dice',
              'Time until a bus arrives',
            ],
            answer: 1,
            explain: '15 flips is a **fixed n**, flips are independent, each is heads or not, with p = 0.5: **binomial**. "Until you get a 6" has no fixed n.',
          },
        },
        {
          kind: 'hack',
          title: 'BINS',
          body: '**B**inary outcomes, **I**ndependent trials, **N** fixed, **S**ame p. If any letter fails, it is not binomial.',
        },
        {
          kind: 'trap',
          body: 'Counting until the first success (no fixed n) is **not** binomial. Neither is drawing without replacement from a small group, where p changes each draw.',
        },
        {
          kind: 'summary',
          points: ['Binomial X counts successes in n independent two-outcome trials with constant p.', 'μ = np, σ = √(np(1 − p)).', 'Interpret mean and SD in context.'],
        },
      ],
      check: [
        {
          id: 's2.10-q1',
          type: 'num',
          prompt: 'A basketball player makes 80% of free throws. In 50 independent shots, what is the **mean** number made?',
          answer: 40,
          explain: 'μ = np = 50(0.8) = **40**',
          compute: () => 50 * 0.8,
        },
        {
          id: 's2.10-q2',
          type: 'num',
          prompt: 'For n = 50 and p = 0.8, find the standard deviation of the number of successes. (Round to 2 decimals.)',
          answer: 2.83,
          tolerance: 0.01,
          explain: 'σ = √(50 × 0.8 × 0.2) = √8 ≈ **2.83**',
          compute: () => Math.sqrt(50 * 0.8 * 0.2),
        },
      ],
      flashcards: [
        { front: 'Conditions for a binomial random variable', back: 'Fixed n, independent trials, two outcomes, same p each trial (BINS).' },
        { front: 'Binomial mean and SD', back: 'μ = np; σ = √(np(1 − p))' },
      ],
    },
    // ---------------- ADVANCED ----------------
    {
      id: 'stats-2.11',
      ced: ['2.10'],
      cedVersion: V,
      title: 'Binomial Probabilities',
      level: 'advanced',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'Your favorite free-throw shooter makes 70% of shots. What is the chance she makes **exactly 4 of 5**? **At least 4**? The binomial probability formula handles it.',
        },
        {
          kind: 'concept',
          title: 'The binomial probability function',
          body: 'P(X = x) = (n choose x) · p^{x} · (1 − p)^{n − x}, for x = 0, 1, 2, …, n\n\n- (n choose x) counts the ways to arrange x successes among n trials\n- p^{x}: the x successes; (1 − p)^{n − x}: the failures',
        },
        {
          kind: 'example',
          title: 'Free throws',
          problem: 'n = 5, p = 0.7. Find P(X = 4) and P(X ≥ 4).',
          steps: [
            'P(X = 4) = (5 choose 4)(0.7)^{4}(0.3)^{1} = 5 × 0.2401 × 0.3 ≈ **0.360**',
            'P(X = 5) = (0.7)^{5} ≈ **0.168**',
            'P(X ≥ 4) = 0.360 + 0.168 ≈ **0.528**',
          ],
          answer: 'P(X = 4) ≈ 0.360; P(X ≥ 4) ≈ 0.528',
          verify: [
            { stated: 0.36, compute: () => binomPdf(5, 0.7, 4), tol: 0.002 },
            { stated: 0.168, compute: () => binomPdf(5, 0.7, 5), tol: 0.002 },
            { stated: 0.528, compute: () => 1 - binomCdf(5, 0.7, 3), tol: 0.002 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's2.11-t1',
            type: 'num',
            prompt: 'With n = 25 and p = 0.08, find P(X ≥ 4), the chance of **at least 4** defective bulbs in a random box of 25. (Round to 3 decimals.)',
            answer: 0.135,
            tolerance: 0.01,
            hint: 'Use the complement: 1 − P(X ≤ 3).',
            explain: 'P(X ≥ 4) = 1 − P(X ≤ 3) = 1 − 0.865 ≈ **0.135**',
            compute: () => 1 - binomCdf(25, 0.08, 3),
          },
        },
        {
          kind: 'concept',
          title: 'Technology and the shape',
          body: 'On a calculator: binompdf(n, p, x) gives P(X = x); binomcdf(n, p, x) gives P(X ≤ x). So P(X ≥ 4) = 1 − binomcdf(25, 0.08, 3).\n\nA binomial distribution with small p is skewed right; with p = 0.5 it is symmetric.',
          diagram: 'st-binomial',
        },
        {
          kind: 'hack',
          title: 'Translate the inequality first',
          body: '| Words | Means | Calculator |\n| at most 3 | X ≤ 3 | cdf(3) |\n| fewer than 3 | X ≤ 2 | cdf(2) |\n| at least 3 | X ≥ 3 | 1 − cdf(2) |\n| more than 3 | X ≥ 4 | 1 − cdf(3) |',
        },
        {
          kind: 'trap',
          body: 'On free response, "binomcdf(25, 0.08, 3)" alone is calculator-speak and may not earn credit. Name the distribution and parameters: "X is binomial with n = 25, p = 0.08; P(X ≥ 4) = 1 − P(X ≤ 3) = 0.135."',
        },
        {
          kind: 'frq',
          body: 'Show **the distribution** (binomial), **the parameters** (n, p), **the event** (X ≥ 4), and **the answer**. That is what earns the calculation point.',
        },
        {
          kind: 'summary',
          points: ['P(X = x) = (n choose x) p^{x}(1 − p)^{n − x}.', 'Use the complement for "at least".', 'On free response, label the distribution, parameters and event.'],
        },
      ],
      check: [
        {
          id: 's2.11-q1',
          type: 'num',
          prompt: 'A quiz has 10 multiple-choice questions with 4 choices each. Guessing on all, find P(exactly 3 correct). (Round to 3 decimals.)',
          answer: 0.25,
          tolerance: 0.01,
          explain: 'n = 10, p = 0.25: (10 choose 3)(0.25)^{3}(0.75)^{7} = 120 × 0.015625 × 0.1335 ≈ **0.250**',
          compute: () => binomPdf(10, 0.25, 3),
        },
        {
          id: 's2.11-q2',
          type: 'num',
          prompt: 'For n = 10, p = 0.25, find P(X ≤ 1). (Round to 3 decimals.)',
          answer: 0.244,
          tolerance: 0.01,
          explain: 'P(0) + P(1) = 0.0563 + 0.1877 ≈ **0.244**',
          compute: () => binomCdf(10, 0.25, 1),
        },
      ],
      flashcards: [
        { front: 'Binomial probability formula', back: 'P(X = x) = (n choose x) · p^{x} · (1 − p)^{n−x}' },
        { front: 'P(X ≥ k) for a binomial X', back: '1 − P(X ≤ k − 1)' },
      ],
    },
    {
      id: 'stats-2.12',
      ced: ['2.11'],
      cedVersion: V,
      title: 'The Normal Curve & the Empirical Rule',
      level: 'advanced',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Heights, test scores, the weights of apples: plot thousands of them and you often see the same smooth bell. That bell, the **normal distribution**, lets you find probabilities from just a mean and a standard deviation.',
        },
        {
          kind: 'concept',
          title: 'Continuous random variables and the normal curve',
          body: 'A **continuous random variable** can take any value in an interval; every interval has a probability.\n\nA **normal distribution** is a continuous, **unimodal, bell-shaped, symmetric** curve, set by two parameters: the **mean μ** (center) and **standard deviation σ** (spread). Smaller σ → taller and more concentrated; larger σ → shorter and more spread out.\n\nThe **standard normal** distribution has μ = 0 and σ = 1.',
        },
        {
          kind: 'concept',
          title: 'The empirical rule (68–95–99.7)',
          body: 'In a normal distribution, approximately:\n\n- **68%** of values are within **1σ** of the mean\n- **95%** within **2σ**\n- **99.7%** within **3σ**',
          diagram: 'st-normal-rule',
        },
        {
          kind: 'example',
          title: 'Apple weights',
          problem: 'Apple weights are approximately normal with μ = 150 g and σ = 10 g. About what percent of apples weigh more than 170 g?',
          steps: [
            '170 g is (170 − 150) ÷ 10 = **2 SDs** above the mean.',
            'About 95% are within 2 SDs, so about 5% are outside, split equally between the two tails.',
            'Above 170 g: 5% ÷ 2 = **2.5%**',
          ],
          answer: 'About 2.5%',
          verify: [
            { stated: 2, compute: () => (170 - 150) / 10 },
            { stated: 2.5, compute: () => (100 - 95) / 2 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's2.12-t1',
            type: 'num',
            prompt: 'Using the empirical rule, about what percent of apples (μ = 150 g, σ = 10 g) weigh **between 140 and 160 g**?',
            answer: 68,
            unit: '%',
            explain: '140 and 160 are 1 SD below and above the mean: about **68%**.',
            compute: () => 68,
          },
        },
        {
          kind: 'hack',
          title: 'Draw it every time',
          body: 'Sketch a bell, mark μ in the middle and μ ± 1σ, 2σ, 3σ, then shade the region you want. Half of each "leftover" percent goes in each tail.',
        },
        {
          kind: 'trap',
          body: 'The empirical rule only works for distributions that are **approximately normal**. Don\'t apply it to strongly skewed data.',
        },
        {
          kind: 'summary',
          points: ['Normal: symmetric, unimodal, bell-shaped, set by μ and σ.', '68–95–99.7% within 1, 2, 3 SDs.', 'Standard normal: μ = 0, σ = 1.'],
        },
      ],
      check: [
        {
          id: 's2.12-q1',
          type: 'num',
          prompt: 'A normal distribution has μ = 50, σ = 4. About what percent of values are **below 42**?',
          answer: 2.5,
          unit: '%',
          explain: '42 is 2 SDs below the mean. 95% are within 2 SDs, so (100 − 95) ÷ 2 = **2.5%** are below.',
          compute: () => (100 - 95) / 2,
        },
        {
          id: 's2.12-q2',
          type: 'mcq',
          prompt: 'Two normal curves have the same mean. Curve A is taller and narrower than Curve B. Which is true?',
          choices: ['A has the larger SD', 'A has the smaller SD', 'They have the same SD', 'A has a larger mean'],
          answer: 1,
          explain: 'A smaller σ makes the curve **taller and more concentrated** around the mean.',
        },
      ],
      flashcards: [
        { front: 'Empirical rule', back: 'For a normal distribution: about 68% within 1σ, 95% within 2σ, 99.7% within 3σ of the mean.' },
        { front: 'Standard normal distribution', back: 'A normal distribution with mean 0 and standard deviation 1.' },
      ],
    },
    {
      id: 'stats-2.13',
      ced: ['2.11'],
      cedVersion: V,
      title: 'Normal Calculations: Areas & Cutoffs',
      level: 'advanced',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'The empirical rule only works at whole SDs. What about the chance a dog of some breed weighs between 27 and 33 kg? Or the weight that marks the heaviest 10%? For those you need z-scores and a table or technology.',
        },
        {
          kind: 'concept',
          title: 'Area = probability',
          body: 'For an approximately normal variable, the probability of a value in an interval is the **area under the curve** over that interval. The total area is 1.\n\nSteps:\n1. Draw and shade.\n2. Standardize: z = (x − μ) ÷ σ.\n3. Find the area with Table A (area **to the left** of z) or technology (normalcdf).',
          diagram: 'st-normal-area',
        },
        {
          kind: 'example',
          title: 'Dog weights (area between two values)',
          problem: 'Weights of a dog breed are approximately normal, μ = 30.4 kg and σ = 3.6 kg. Find P(27 < X < 33).',
          steps: [
            'z for 27: (27 − 30.4) ÷ 3.6 ≈ **−0.94**; z for 33: (33 − 30.4) ÷ 3.6 ≈ **0.72**',
            'Area left of 0.72 ≈ 0.765; area left of −0.94 ≈ 0.173',
            'P(27 < X < 33) ≈ 0.765 − 0.173 ≈ **0.592**',
          ],
          answer: '≈ 0.59',
          verify: [
            { stated: -0.94, compute: () => (27 - 30.4) / 3.6, tol: 0.01 },
            { stated: 0.72, compute: () => (33 - 30.4) / 3.6, tol: 0.01 },
            { stated: 0.592, compute: () => normalcdf(27, 33, 30.4, 3.6), tol: 0.002 },
          ],
        },
        {
          kind: 'concept',
          title: 'Working backward: from area to cutoff',
          body: '- **Lowest p%**: find x with area p/100 to its left.\n- **Highest p%**: find x with area p/100 to its **right** (area 1 − p/100 to its left).\n- **Middle p%** or **most extreme p%**: split the leftover area equally into two tails.\n\nThen x = μ + zσ, or use invNorm with μ and σ.',
        },
        {
          kind: 'example',
          title: 'The heaviest 10% of dogs',
          problem: 'What weight separates the heaviest 10% of these dogs (μ = 30.4 kg, σ = 3.6 kg)?',
          steps: ['Area to the left = 0.90 → z ≈ **1.282**', 'x = 30.4 + 1.282(3.6) ≈ **35.0 kg**'],
          answer: '≈ 35.0 kg',
          verify: [
            { stated: 1.282, compute: () => invNorm(0.9), tol: 0.001 },
            { stated: 35.0, compute: () => invNorm(0.9, 30.4, 3.6), tol: 0.002 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's2.13-t1',
            type: 'num',
            prompt: 'SAT-style scores are approximately normal with μ = 500, σ = 100. What proportion score **above 650**? (Round to 4 decimals.)',
            answer: 0.0668,
            tolerance: 0.01,
            explain: 'z = (650 − 500) ÷ 100 = 1.5. Area to the left = 0.9332, so the area above = 1 − 0.9332 = **0.0668**.',
            compute: () => normalcdf(650, Infinity, 500, 100),
          },
        },
        {
          kind: 'hack',
          title: 'Percentiles compare positions',
          body: 'A value at the 90th percentile of one normal distribution and a value at the 85th percentile of another can be compared directly: the first is higher **relative to its group**.',
        },
        {
          kind: 'trap',
          body: 'Table A gives the area to the **left** of z. For "greater than", subtract from 1. Forgetting this is the #1 normal-calculation error.',
        },
        {
          kind: 'frq',
          body: 'Show: **Normal(μ, σ)** named, the boundary value(s), the **direction** (shading or an inequality like P(X > 650)), and the answer. "normalcdf(650, 1000, 500, 100)" with no labels may not earn full credit.',
        },
        {
          kind: 'summary',
          points: ['Probability = area under the normal curve.', 'z = (x − μ) ÷ σ; Table A gives area to the left.', 'Cutoff from area: x = μ + zσ (or invNorm).'],
        },
      ],
      check: [
        {
          id: 's2.13-q1',
          type: 'num',
          prompt: 'Battery life is approximately normal, μ = 40 hours, σ = 5 hours. Find P(life < 33 hours). (Round to 4 decimals.)',
          answer: 0.0808,
          tolerance: 0.01,
          explain: 'z = (33 − 40) ÷ 5 = −1.4 → area to the left ≈ **0.0808**',
          compute: () => normalcdf(-Infinity, 33, 40, 5),
        },
        {
          id: 's2.13-q2',
          type: 'num',
          prompt: 'For battery life (μ = 40, σ = 5), what life marks the **lowest 5%**? (Round to 1 decimal.)',
          answer: 31.8,
          tolerance: 0.005,
          explain: 'z with 0.05 to the left ≈ −1.645 → x = 40 − 1.645(5) ≈ **31.8 hours**',
          compute: () => invNorm(0.05, 40, 5),
        },
        {
          id: 's2.13-q3',
          type: 'mcq',
          prompt: 'To find the values bounding the **most extreme 10%** of a normal distribution (both tails together), what area goes in each tail?',
          choices: ['10%', '5%', '20%', '90%'],
          answer: 1,
          explain: 'Split the extreme 10% equally: **5% in each tail**.',
        },
      ],
      flashcards: [
        { front: 'Steps for a normal probability', back: 'Draw and shade, standardize z = (x − μ)/σ, find the area (Table A gives area to the left).' },
        { front: 'Cutoff for the top p%', back: 'Find z with area 1 − p/100 to its left, then x = μ + zσ.' },
      ],
    },
    {
      id: 'stats-2.14',
      ced: ['2.12'],
      cedVersion: V,
      title: 'Sampling Distributions & the CLT',
      level: 'advanced',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'Take a random sample of 30 people and compute their mean age. Take another sample: a different mean. Do it thousands of times and the means form their own distribution. That distribution is the key to all of inference in Units 3 and 4.',
        },
        {
          kind: 'concept',
          title: 'Sampling distribution of a statistic',
          body: 'The **sampling distribution** of a statistic is the distribution of its values for **all possible samples** of a given size from a population.\n\nYou can **simulate** it: assume a value for the parameter, generate many random samples, compute the statistic for each and record it. The collected statistics approximate the sampling distribution.',
        },
        {
          kind: 'concept',
          title: 'Randomization distributions',
          body: 'In an experiment, a **randomization distribution** comes from **repeatedly re-randomizing** (reassigning) the observed response values to the treatment groups and recomputing the statistic each time (e.g. the difference in group means). It shows what differences happen **by chance alone**.',
        },
        {
          kind: 'concept',
          title: 'Central limit theorem (CLT)',
          body: 'The **central limit theorem** says the sampling distribution of a **sample mean** from a random sample has a shape that can be approximated by a **normal distribution**, and the **larger the sample**, the better the approximation.\n\nThis works even when the population itself is skewed.',
          diagram: 'st-clt',
        },
        {
          kind: 'example',
          title: 'Mean wait times from repeated samples',
          problem: 'Wait times at a clinic are unimodal and roughly symmetric, μ = 24 minutes, σ = 6 minutes. A simulation draws 500 random samples of 36 patients and records each sample\'s mean wait. Describe the distribution of the 500 means.',
          steps: [
            'Shape: approximately **normal** (CLT, and the population is roughly symmetric).',
            'Center: about **24 minutes** (sample means center on μ).',
            'Spread: about σ ÷ √n = 6 ÷ √36 = **1 minute**, much less than 6 (Topic 4.1 explains why).',
          ],
          answer: 'Approximately normal, mean ≈ 24, SD ≈ 1 minute',
          verify: [{ stated: 1, compute: () => 6 / Math.sqrt(36) }],
        },
        {
          kind: 'try',
          question: {
            id: 's2.14-t1',
            type: 'mcq',
            prompt: 'A population of household incomes is strongly skewed right. As the sample size increases, the sampling distribution of the sample mean becomes…',
            choices: ['more skewed right', 'more like a normal distribution', 'uniform', 'identical to the population distribution'],
            answer: 1,
            explain: 'By the **central limit theorem**, the sampling distribution of x̄ gets closer to **normal** as n grows.',
          },
        },
        {
          kind: 'hack',
          title: 'Three distributions, three names',
          body: '- **Population** distribution: values for every individual\n- **Sample** distribution: the values in **one** sample\n- **Sampling** distribution: the values of a **statistic** over many samples\n\nSay which one you mean every time. "It gets less variable" is ambiguous.',
        },
        {
          kind: 'trap',
          body: 'The CLT is about the distribution of **sample means**, not the data. A bigger sample does not make the **sample\'s data** look more normal; it looks more like the population.',
        },
        {
          kind: 'summary',
          points: ['Sampling distribution = distribution of a statistic over all samples of size n.', 'Simulate it by repeated random samples; randomization distributions re-randomize treatment groups.', 'CLT: sample means are approximately normal, better as n grows.'],
        },
      ],
      check: [
        {
          id: 's2.14-q1',
          type: 'mcq',
          prompt: 'An experiment found a 6-point difference in mean scores. Researchers shuffle the 40 scores into two random groups 1,000 times and record the difference each time. This produces…',
          choices: ['the population distribution', 'a randomization distribution', 'a binomial distribution', 'the sample distribution'],
          answer: 1,
          explain: 'Repeatedly **reassigning** responses to treatment groups produces a **randomization distribution**, showing differences that arise by chance alone.',
        },
        {
          id: 's2.14-q2',
          type: 'mcq',
          prompt: 'Which statement about the central limit theorem is correct?',
          choices: [
            'Every population becomes normal when n is large',
            'The sampling distribution of x̄ is approximately normal, and the approximation improves as n increases',
            'The CLT applies only to normal populations',
            'Large samples have less variability within the sample',
          ],
          answer: 1,
          explain: 'The CLT is about the **sampling distribution of x̄**, which approaches normal as n increases.',
        },
      ],
      flashcards: [
        { front: 'Sampling distribution', back: 'The distribution of a statistic\'s values over all possible samples of a given size.' },
        { front: 'Central limit theorem', back: 'The sampling distribution of a sample mean is approximately normal; the larger n, the better.' },
        { front: 'Randomization distribution', back: 'Distribution of a statistic from repeatedly reassigning the responses to treatment groups at random.' },
      ],
    },
  ],
  checkpoint: [
    {
      id: 's2-cp1',
      type: 'num',
      prompt: 'Of 120 survey respondents, 45 prefer cats. Of the 45, 18 are teenagers. Find P(teenager | prefers cats).',
      answer: 0.4,
      explain: 'Restrict to cat-lovers: 18 ÷ 45 = **0.40**',
      compute: () => 18 / 45,
    },
    {
      id: 's2-cp2',
      type: 'num',
      prompt: 'A probability distribution: X = 0, 1, 2 with probabilities 0.25, 0.5, 0.25. Find σ_{X}. (Round to 3 decimals.)',
      answer: 0.707,
      tolerance: 0.01,
      explain: 'μ = 1; σ² = (1)(0.25) + 0(0.5) + (1)(0.25) = 0.5 → σ = √0.5 ≈ **0.707**',
      compute: () => rvSd([0, 1, 2], [0.25, 0.5, 0.25]),
    },
    {
      id: 's2-cp3',
      type: 'mcq',
      prompt: 'About 15% of a large city\'s residents walk to work. For random samples of 40 residents, which describes the mean number who walk?',
      choices: [
        'For all possible random samples of 40 residents, the average number who walk is 6',
        'Every sample of 40 residents has exactly 6 walkers',
        'For all residents, the average is 6',
        'At least 6 of every 40 residents walk',
      ],
      answer: 0,
      explain: 'μ = np = 40(0.15) = 6 is the long-run average over **many samples of 40**, not a guarantee for each sample.',
    },
    {
      id: 's2-cp4',
      type: 'num',
      prompt: 'Lengths are approximately normal, μ = 22 cm, σ = 3 cm. Find P(20 < X < 26). (Round to 3 decimals.)',
      answer: 0.656,
      tolerance: 0.01,
      explain: 'z = −0.67 and 1.33 → 0.9088 − 0.2525 ≈ **0.656**',
      compute: () => normalcdf(20, 26, 22, 3),
    },
    {
      id: 's2-cp5',
      type: 'mcq',
      prompt: 'P(A) = 0.3 and P(B) = 0.4. If A and B are mutually exclusive, what is P(A ∪ B)?',
      choices: ['0.12', '0.58', '0.7', '1.0'],
      answer: 2,
      explain: 'Disjoint → P(A ∩ B) = 0, so P(A ∪ B) = 0.3 + 0.4 = **0.7**.',
    },
    {
      id: 's2-cp6',
      type: 'num',
      prompt: 'A test is passed by 60% of takers. In a random group of 8 takers, find P(exactly 6 pass). (Round to 3 decimals.)',
      answer: 0.209,
      tolerance: 0.01,
      explain: '(8 choose 6)(0.6)^{6}(0.4)^{2} = 28 × 0.046656 × 0.16 ≈ **0.209**',
      compute: () => binomPdf(8, 0.6, 6),
    },
    {
      id: 's2-cp7',
      type: 'mcq',
      prompt: 'Why is "the number of cards drawn until the first ace" NOT a binomial random variable?',
      choices: ['There are more than two outcomes', 'There is no fixed number of trials', 'Aces are rare', 'The cards are shuffled'],
      answer: 1,
      explain: 'Binomial requires a **fixed n**. "Until the first ace" has no fixed number of trials.',
    },
    {
      id: 's2-cp8',
      type: 'num',
      prompt: 'What value marks the top 2.5% of a normal distribution with μ = 70 and σ = 6? (Round to 1 decimal.)',
      answer: 81.8,
      tolerance: 0.005,
      explain: 'z ≈ 1.96 → 70 + 1.96(6) ≈ **81.8**',
      compute: () => invNorm(0.975, 70, 6),
    },
  ],
}
