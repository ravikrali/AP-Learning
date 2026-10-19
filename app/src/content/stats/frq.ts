// Original free-response practice in the format of the AP Statistics exam (CED effective Fall 2026):
// four question types, each worth 10 points, scored analytically (1 point per rubric item).
//   q1 Multi-Focus on Practices 1 and 2 · q2 Multi-Focus on Practices 3 and 4
//   q3 Inference · q4 Multi-Focus on Practices 2, 3, and 4
// Every number in a model answer is re-checked by the test suite via `verify`.
import type { Frq } from '../types'
import { normalcdf, rvMean, rvSd, tInterval, tTest, twoPropInterval } from '../../lib/stats'

const bars = tTest(11.6, 0.9, 25, 12, 'less')
const stream = twoPropInterval(232, 400, 161, 350, 0.95)
const SUB_X = [0, 1, 2, 3, 4]
const SUB_P = [0.1, 0.25, 0.35, 0.2, 0.1]
const subCi = tInterval(1.95, 1.12, 250, 0.9)
const drinks = (x: number) => -45.2 + 2.1 * x
const pHot = normalcdf(160, Infinity, 144, 12)

export const STATS_FRQS: Frq[] = [
  // ---------------- Question 1 type ----------------
  {
    id: 'sfrq-library',
    title: 'Library Hours Survey',
    kind: 'q1',
    units: [1],
    intro:
      'A city\'s library board wants to know whether residents would use the main library more if it stayed open until 10 p.m. The city has 12 neighborhoods, and each neighborhood has a similar mix of residents.\n\n- **Plan X**: Put a link to an online survey on the library\'s website; anyone may answer.\n- **Plan Y**: Randomly select 3 of the 12 neighborhoods and survey every adult who lives in those 3 neighborhoods.',
    parts: [
      {
        label: 'A',
        prompt: '(i) Identify the sampling method in Plan Y. (ii) Identify the type of bias most likely in Plan X.',
        answer: '(i) **Cluster random sampling**: neighborhoods (clusters) are randomly chosen and everyone in them is surveyed.\n(ii) **Voluntary response bias**: people choose themselves to respond.',
        rubric: ['Identifies Plan Y as a cluster random sample', 'Identifies voluntary response bias for Plan X'],
      },
      {
        label: 'B',
        prompt: 'Explain how the bias in Plan X would likely affect the estimate of the proportion of residents who would use later hours.',
        answer:
          'People who visit the library website, and who feel strongly about library hours, are the ones most likely to answer. They are probably **more** likely than typical residents to want later hours, so Plan X would likely **overestimate** the proportion of residents who would use them.',
        rubric: ['States the direction (overestimate) with a reason tied to who chooses to respond'],
      },
      {
        label: 'C',
        prompt: 'Explain why the results of Plan Y can be generalized to all adults in the city.',
        answer: 'The 3 neighborhoods were **randomly selected**, and the neighborhoods have similar mixes of residents, so the surveyed adults should represent all adults in the city.',
        rubric: ['Cites random selection of neighborhoods and that neighborhoods are similar to each other'],
      },
      {
        label: 'D',
        prompt:
          'The board also wants to know whether sending residents a text reminder about events increases library visits. Describe an experiment using 400 volunteer library-card holders, including how treatments would be assigned.',
        answer:
          'Number the volunteers 1–400. Use a random number generator to select 200 different numbers; those volunteers get text reminders and the other 200 get none (the control group). Keep everything else the same for both groups. After two months, compare the mean number of library visits in the two groups.',
        rubric: ['Describes two groups to compare (reminder vs. no reminder) and a response to measure', 'Describes a valid random assignment method'],
      },
      {
        label: 'E',
        prompt: 'For the experiment in part D, determine a valid investigative question. Include all three components.',
        answer:
          'Is there convincing statistical evidence that the **mean number of library visits** for **library-card holders like those who volunteered** is **greater** with text reminders than without, so that the reminders **cause** an increase?',
        rubric: ['Names the variable and parameter (mean number of visits) and the direction (greater with reminders)', 'Names the population (card holders like the volunteers) and the cause-and-effect conclusion'],
      },
      {
        label: 'F',
        prompt: 'Explain why a census of all adults in the city might not be practical for this board.',
        answer: 'A census means getting data from **every** adult in the city. That would be too costly and time-consuming, and many people would not respond; a well-designed random sample can give a trustworthy estimate.',
        rubric: ['Explains that collecting data from every adult is too difficult or costly'],
      },
      {
        label: 'G',
        prompt: 'In Plan Y, about 40% of the surveyed adults did not return the survey. Identify this kind of bias.',
        answer: '**Nonresponse bias**: selected individuals did not respond, and they may differ from those who did.',
        rubric: ['Identifies nonresponse bias'],
      },
    ],
  },
  {
    id: 'sfrq-energy',
    title: 'Energy Drinks and Reaction Time',
    kind: 'q1',
    units: [1],
    intro:
      'A sports scientist wants to know whether an energy drink improves reaction time. She has 60 college athletes who volunteered: 30 are sprinters and 30 are distance runners. Reaction time (in milliseconds) is measured with a computer test 30 minutes after drinking either the energy drink or a flavored water that looks and tastes the same.',
    parts: [
      {
        label: 'A',
        prompt: 'Identify (i) the experimental units, (ii) the explanatory variable and (iii) the response variable.',
        answer: '(i) The **60 athletes**. (ii) **Type of drink** (energy drink or flavored water). (iii) **Reaction time** in milliseconds.',
        rubric: ['Identifies the experimental units as the 60 athletes', 'Identifies the explanatory variable (type of drink)', 'Identifies the response variable (reaction time)'],
      },
      {
        label: 'B',
        prompt: 'Explain the purpose of giving the flavored water instead of nothing.',
        answer: 'The flavored water is a **placebo**: athletes don\'t know which drink they got, so any difference in reaction time can\'t be explained by athletes\' expectations (the placebo effect).',
        rubric: ['Explains the placebo (blinding) prevents expectations from affecting the response'],
      },
      {
        label: 'C',
        prompt: 'Sprinters may react faster than distance runners regardless of the drink. Describe a randomized block design for this study.',
        answer:
          'Block by **type of athlete**: 30 sprinters in one block, 30 distance runners in the other. Within each block, randomly assign 15 athletes to the energy drink and 15 to the flavored water (e.g. draw 15 names from a hat). Compare reaction times between drinks **within each block**.',
        rubric: ['Forms blocks by athlete type', 'Randomly assigns both treatments within each block'],
      },
      {
        label: 'D',
        prompt: 'Explain why blocking is useful here.',
        answer: 'Athlete type affects reaction time. Blocking separates that variation from the comparison of drinks, so the comparison of treatments is **more precise**.',
        rubric: ['Explains that blocking removes variation due to athlete type, giving a more precise comparison'],
      },
      {
        label: 'E',
        prompt: 'The energy drink group had a statistically significantly lower mean reaction time. To what population can the conclusion be applied, and can it be stated as cause and effect? Explain.',
        answer:
          'Because treatments were **randomly assigned**, we can conclude the energy drink **caused** the lower mean reaction time. Because the athletes were **volunteers** (not randomly selected), the conclusion applies only to **athletes similar to those in the study**.',
        rubric: ['Cause and effect justified by random assignment', 'Generalization limited to athletes like the volunteers, because there was no random selection'],
      },
      {
        label: 'F',
        prompt: 'Describe how the study could be made double-blind.',
        answer: 'Neither the athletes nor the researchers who give the drinks and run the reaction tests know which athlete got which drink (e.g. drinks are coded by a third person).',
        rubric: ['States that neither the athletes nor the researchers interacting with them know the treatments'],
      },
    ],
  },
  // ---------------- Question 2 type ----------------
  {
    id: 'sfrq-delivery',
    title: 'Delivery Times for Two Services',
    kind: 'q2',
    units: [1],
    intro:
      'A restaurant compares delivery times, in minutes, for two delivery services using random samples of orders.\n\n| Service | n | Mean | Min | Q1 | Median | Q3 | Max |\n| A | 120 | 34 | 12 | 24 | 31 | 41 | 88 |\n| B | 110 | 29 | 15 | 25 | 29 | 33 | 45 |',
    parts: [
      {
        label: 'A',
        prompt: 'Use the 1.5 × IQR rule to determine whether there are outliers for (i) Service A and (ii) Service B. Show your work.',
        answer:
          '(i) A: IQR = 41 − 24 = 17; 1.5 × 17 = 25.5. Fences: 24 − 25.5 = −1.5 and 41 + 25.5 = **66.5**. The maximum, 88, is above 66.5, so **A has at least one high outlier**; the minimum 12 is not below −1.5.\n(ii) B: IQR = 33 − 25 = 8; 1.5 × 8 = 12. Fences: 25 − 12 = **13** and 33 + 12 = **45**. Min 15 ≥ 13 and max 45 is not greater than 45, so **B has no outliers**.',
        rubric: ['Correct fences and conclusion for Service A (outlier: 88 > 66.5)', 'Correct fences and conclusion for Service B (no outliers)'],
        verify: [
          { stated: 66.5, compute: () => 41 + 1.5 * (41 - 24) },
          { stated: 13, compute: () => 25 - 1.5 * (33 - 25) },
          { stated: 45, compute: () => 33 + 1.5 * (33 - 25) },
        ],
      },
      {
        label: 'B',
        prompt: 'For Service A, compare the distance from Q1 to the median with the distance from the median to Q3, and compare the mean with the median. What do these suggest about the shape?',
        answer: 'Q1 → median = 31 − 24 = **7**; median → Q3 = 41 − 31 = **10**. The upper half of the middle 50% is more spread out, and the mean (34) is greater than the median (31). Both suggest Service A\'s times are **skewed right**.',
        rubric: ['Computes and compares the two distances (7 vs. 10)', 'Concludes skewed right, supported by mean > median'],
        verify: [
          { stated: 7, compute: () => 31 - 24 },
          { stated: 10, compute: () => 41 - 31 },
        ],
      },
      {
        label: 'C',
        prompt: 'Which measures of center and variability should be used to compare the two services? Justify your choice.',
        answer: 'The **median and IQR**, because Service A\'s distribution is skewed right with an outlier, and the median and IQR are resistant to skew and outliers.',
        rubric: ['Chooses median and IQR', 'Justifies with skewness/outliers and resistance'],
      },
      {
        label: 'D',
        prompt: 'Compare the distributions of delivery times for the two services.',
        answer:
          'Service A\'s median delivery time (31 min) is **greater** than Service B\'s (29 min). Service A is much **more variable** (IQR 17 min vs. 8 min; range 76 vs. 30 min). A is skewed right with a high outlier; B is roughly symmetric (mean = median = 29) with no outliers.',
        rubric: ['Compares centers with values and a comparative word', 'Compares variability with values and a comparative word'],
        verify: [
          { stated: 76, compute: () => 88 - 12 },
          { stated: 30, compute: () => 45 - 15 },
        ],
      },
      {
        label: 'E',
        prompt: 'Identify an appropriate graph for comparing the two services using only the table, and identify the population for an investigative question about Service B.',
        answer: '**Side-by-side boxplots**, because the table gives each service\'s five-number summary. Population for Service B: **all orders delivered by Service B** for this restaurant.',
        rubric: ['Identifies boxplots (five-number summaries are given)', 'Identifies the population as all of the restaurant\'s orders delivered by Service B'],
      },
    ],
  },
  {
    id: 'sfrq-sleep-table',
    title: 'Exercise and Sleep Quality',
    kind: 'q2',
    units: [2],
    intro:
      'A random sample of 500 adults in a city reported how often they exercise and whether their sleep quality is good or poor.\n\n| Sleep | Rarely | Sometimes | Often | Total |\n| Good | 60 | 110 | 130 | 300 |\n| Poor | 90 | 70 | 40 | 200 |\n| Total | 150 | 180 | 170 | 500 |',
    parts: [
      {
        label: 'A',
        prompt: 'For a randomly selected adult from the sample, find (i) P(exercises often and has good sleep), (ii) P(good sleep) and (iii) P(good sleep | exercises often).',
        answer: '(i) 130/500 = **0.26** (ii) 300/500 = **0.60** (iii) 130/170 ≈ **0.765**',
        rubric: ['Joint probability 0.26', 'Marginal probability 0.60', 'Conditional probability ≈ 0.765'],
        verify: [
          { stated: 0.26, compute: () => 130 / 500 },
          { stated: 0.6, compute: () => 300 / 500 },
          { stated: 0.765, compute: () => 130 / 170, tol: 0.002 },
        ],
      },
      {
        label: 'B',
        prompt: 'Do the data suggest an association between exercise frequency and sleep quality? Justify with appropriate proportions.',
        answer:
          'Proportion with good sleep: rarely 60/150 = **0.40**, sometimes 110/180 ≈ **0.611**, often 130/170 ≈ **0.765**. The proportions differ (they rise with exercise), so the data suggest the variables are **associated**.',
        rubric: ['Computes conditional proportions of good sleep for each exercise group', 'Concludes association because the conditional proportions differ'],
        verify: [
          { stated: 0.4, compute: () => 60 / 150 },
          { stated: 0.611, compute: () => 110 / 180, tol: 0.002 },
        ],
      },
      {
        label: 'C',
        prompt: 'Are the events "good sleep" and "exercises often" independent? Justify.',
        answer: 'No. P(good | often) ≈ 0.765 is not equal to P(good) = 0.60, so knowing someone exercises often changes the probability of good sleep.',
        rubric: ['Not independent, comparing P(good | often) with P(good)'],
      },
      {
        label: 'D',
        prompt: 'Find P(exercises often or has good sleep).',
        answer: 'P(often ∪ good) = (170 + 300 − 130)/500 = 340/500 = **0.68**',
        rubric: ['Uses the addition rule correctly: 0.68'],
        verify: [{ stated: 0.68, compute: () => (170 + 300 - 130) / 500 }],
      },
      {
        label: 'E',
        prompt: 'Assume 60% of all adults in the city have good sleep. If 3 adults are randomly selected, find the probability that all 3 have good sleep.',
        answer: 'With independent selections: 0.6 × 0.6 × 0.6 = **0.216**',
        rubric: ['Correct probability 0.216 with work shown'],
        verify: [{ stated: 0.216, compute: () => 0.6 ** 3 }],
      },
      {
        label: 'F',
        prompt: 'Identify a graph that would display the relationship in this table.',
        answer: 'A **segmented bar chart** (or side-by-side bar chart, or mosaic plot) of sleep quality for each exercise group.',
        rubric: ['Identifies a segmented bar chart, side-by-side bar chart or mosaic plot'],
      },
      {
        label: 'G',
        prompt: 'Identify the population for a valid investigative question about these data, and explain why the association cannot be called cause and effect.',
        answer: 'Population: **all adults in the city**. This is an observational study (no treatments were assigned), so a confounding variable such as overall health or work schedule could explain the association.',
        rubric: ['Identifies the population (all adults in the city) and explains no causation from an observational study'],
      },
    ],
  },
  // ---------------- Question 3 type ----------------
  {
    id: 'sfrq-granola',
    title: 'Protein in Granola Bars',
    kind: 'q3',
    units: [1, 4],
    intro:
      'A company claims its granola bars contain an average of 12 grams of protein. A consumer group suspects the mean is lower. It tests a random sample of 25 bars: mean 11.6 g, standard deviation 0.9 g. A dotplot of the 25 amounts shows no strong skewness and no outliers. At the α = 0.05 level, is there convincing evidence that the mean protein content of all the company\'s bars is less than 12 grams?',
    parts: [
      {
        label: 'A',
        prompt: 'Identify and classify the variable of interest.',
        answer: 'The amount of protein, in grams, in a granola bar. It is a **quantitative** variable.',
        rubric: ['Identifies the variable (protein, in grams, per bar)', 'Classifies it as quantitative'],
      },
      {
        label: 'B',
        prompt: 'Identify the appropriate inference procedure.',
        answer: 'A **one-sample t-test for a population mean**.',
        rubric: ['Identifies the one-sample t-test for a population mean'],
      },
      {
        label: 'C',
        prompt: 'Complete the inference procedure: state hypotheses, check conditions, and calculate the test statistic and p-value.',
        answer:
          'Let μ = the mean protein content, in grams, of **all** the company\'s granola bars. H₀: μ = 12, Hₐ: μ < 12.\n\nConditions: the bars were **randomly selected**; 25 bars is less than 10% of all bars the company makes; n = 25 < 30 but the dotplot shows **no strong skewness or outliers**.\n\nt = (11.6 − 12) ÷ (0.9/√25) = −0.4 ÷ 0.18 ≈ **−2.22**, df = 24, p-value ≈ **0.018**.',
        rubric: ['Correct hypotheses with μ defined in context', 'Randomization condition stated in context', 'Sample data condition (and 10%) checked in context', 'Correct test statistic t ≈ −2.22 with df = 24', 'Correct p-value ≈ 0.018'],
        verify: [
          { stated: -2.22, compute: () => bars.t, tol: 0.003 },
          { stated: 0.018, compute: () => bars.p, tol: 0.03 },
        ],
      },
      {
        label: 'D',
        prompt: 'Justify a conclusion in context.',
        answer:
          'Because the p-value ≈ 0.018 is less than α = 0.05, we **reject H₀**. There is convincing statistical evidence that the mean protein content of all the company\'s granola bars is less than 12 grams.',
        rubric: ['Compares p-value to α, makes the correct decision and states the conclusion in context about μ'],
      },
      {
        label: 'E',
        prompt: 'Describe a Type I error in the context of this test.',
        answer: 'Concluding that the mean protein content of all the company\'s bars is less than 12 grams when it really is 12 grams.',
        rubric: ['Describes rejecting H₀ when μ = 12 is true, in context'],
      },
    ],
  },
  {
    id: 'sfrq-streaming',
    title: 'Daily Streaming by Age Group',
    kind: 'q3',
    units: [3],
    intro:
      'A streaming service took independent random samples of its subscribers: 232 of 400 subscribers under age 30 and 161 of 350 subscribers age 30 or older said they stream every day. Construct and interpret a 95% confidence interval for the difference in the proportions of all subscribers in the two age groups who stream every day.',
    parts: [
      {
        label: 'A',
        prompt: 'Identify the variables in the study and classify each.',
        answer: 'Age group (under 30 or 30+): **categorical**. Whether the subscriber streams every day (yes/no): **categorical**.',
        rubric: ['Identifies both variables', 'Classifies both as categorical'],
      },
      {
        label: 'B',
        prompt: 'Identify the appropriate inference procedure and define the parameter.',
        answer:
          'A **two-sample z-interval for a difference between population proportions**. Parameter: p₁ − p₂, where p₁ = the proportion of **all** subscribers under 30 who stream every day and p₂ = the proportion of all subscribers 30 or older who stream every day.',
        rubric: ['Identifies the two-sample z-interval for p₁ − p₂', 'Defines the parameter in context'],
      },
      {
        label: 'C',
        prompt: 'Check the conditions and calculate the interval.',
        answer:
          'Independent random samples ✓; 400 and 350 are each less than 10% of the subscribers in their age groups ✓; observed successes and failures 232, 168, 161, 189 are all at least 10 ✓.\n\np̂₁ = 0.58, p̂₂ = 0.46. SE = √(0.58(0.42)/400 + 0.46(0.54)/350) ≈ 0.0363.\n0.12 ± 1.96(0.0363) = (**0.049**, **0.191**).',
        rubric: ['Conditions checked in context (random, 10%, observed counts ≥ 10)', 'Correct point estimate and standard error', 'Correct interval (0.049, 0.191)'],
        verify: [
          { stated: 0.0363, compute: () => stream.se, tol: 0.002 },
          { stated: 0.049, compute: () => stream.lo, tol: 0.01 },
          { stated: 0.191, compute: () => stream.hi, tol: 0.003 },
        ],
      },
      {
        label: 'D',
        prompt: 'Interpret the interval in context.',
        answer: 'We are 95% confident that the interval from 0.049 to 0.191 captures the difference (under 30 minus 30+) in the proportions of all subscribers in these age groups who stream every day.',
        rubric: ['Correct interpretation with the parameter in context'],
      },
      {
        label: 'E',
        prompt: 'A manager claims daily streaming is 20 percentage points higher for subscribers under 30. Does the interval support this claim? Explain.',
        answer: 'No. 0.20 is **not** in the interval (0.049, 0.191); every plausible value is below 0.20. The interval does give convincing evidence that the under-30 proportion is higher, but by less than 20 points.',
        rubric: ['Concludes the claim is not supported because 0.20 is outside the interval'],
      },
      {
        label: 'F',
        prompt: 'How would a 99% confidence interval from the same data compare with the 95% interval? Explain.',
        answer: 'It would be **wider**: a higher confidence level uses a larger critical value (2.576 instead of 1.96), so the margin of error is larger.',
        rubric: ['Wider, because the critical value and margin of error increase'],
      },
    ],
  },
  // ---------------- Question 4 type ----------------
  {
    id: 'sfrq-subscriptions',
    title: 'Streaming Subscriptions per Household',
    kind: 'q4',
    units: [2, 4],
    intro:
      'Let X = the number of streaming subscriptions in a randomly selected household in a town. Last year\'s town survey suggested the mean was 1.70 subscriptions. This year, a random sample of 250 households gave this distribution:\n\n| Subscriptions, X | 0 | 1 | 2 | 3 | 4 |\n| Proportion of households | 0.10 | 0.25 | 0.35 | 0.20 | 0.10 |\n\nThe sample standard deviation is 1.12 subscriptions.',
    parts: [
      {
        label: 'A',
        prompt: 'Treating the table as the distribution of X, (i) find P(X ≥ 2) and (ii) find the mean of X. Show your work.',
        answer: '(i) P(X ≥ 2) = 0.35 + 0.20 + 0.10 = **0.65**\n(ii) E(X) = 0(0.10) + 1(0.25) + 2(0.35) + 3(0.20) + 4(0.10) = **1.95** subscriptions',
        rubric: ['P(X ≥ 2) = 0.65 with work shown', 'E(X) = 1.95 with work shown'],
        verify: [
          { stated: 0.65, compute: () => SUB_P[2] + SUB_P[3] + SUB_P[4] },
          { stated: 1.95, compute: () => rvMean(SUB_X, SUB_P) },
        ],
      },
      {
        label: 'B',
        prompt: 'Find the standard deviation of X and interpret the mean in context.',
        answer: 'σ_{X} = √(Σ(x − 1.95)²·P(x)) = √1.2475 ≈ **1.117** subscriptions. Interpretation of the mean: over many randomly selected households, the average number of streaming subscriptions is about 1.95.',
        rubric: ['Standard deviation ≈ 1.117', 'Interprets the mean as a long-run average in context'],
        verify: [
          { stated: 1.2475, compute: () => rvSd(SUB_X, SUB_P) ** 2, tol: 0.001 },
          { stated: 1.117, compute: () => rvSd(SUB_X, SUB_P), tol: 0.001 },
        ],
      },
      {
        label: 'C',
        prompt: 'Identify an inference procedure to estimate this year\'s mean number of subscriptions for all households in the town, and calculate a 90% interval. Assume conditions are met.',
        answer: 'A **one-sample t-interval for a population mean**. 1.95 ± t^{∗}(1.12/√250), with df = 249 and t^{∗} ≈ 1.651: 1.95 ± 0.117 = (**1.833**, **2.067**) subscriptions.',
        rubric: ['Identifies the one-sample t-interval for a population mean', 'Correct margin of error ≈ 0.117', 'Correct interval (1.833, 2.067)'],
        verify: [
          { stated: 1.651, compute: () => subCi.tStar, tol: 0.001 },
          { stated: 0.117, compute: () => subCi.me, tol: 0.003 },
          { stated: 1.833, compute: () => subCi.lo, tol: 0.001 },
          { stated: 2.067, compute: () => subCi.hi, tol: 0.001 },
        ],
      },
      {
        label: 'D',
        prompt: 'Interpret the interval in context.',
        answer: 'We are 90% confident that the interval from 1.833 to 2.067 subscriptions captures the mean number of streaming subscriptions for all households in the town this year.',
        rubric: ['Correct interpretation with the parameter in context'],
      },
      {
        label: 'E',
        prompt: 'Is there convincing evidence that the mean has changed from last year\'s 1.70? Explain using the interval.',
        answer: 'Yes. 1.70 is **not** in the interval (1.833, 2.067); all plausible values are higher, so there is convincing evidence the mean number of subscriptions per household has increased.',
        rubric: ['Concludes yes because 1.70 is outside the interval'],
      },
      {
        label: 'F',
        prompt: 'The distribution of X is not normal. Explain why the sample data condition for the t-interval is still met.',
        answer: 'The sample size is n = 250, which is at least 30, so the sampling distribution of the sample mean is approximately normal (central limit theorem) even though X itself is not normal.',
        rubric: ['Cites n = 250 ≥ 30 (central limit theorem)'],
      },
    ],
  },
  {
    id: 'sfrq-lemonade',
    title: 'Temperature and Cold-Drink Sales',
    kind: 'q4',
    units: [2, 5],
    intro:
      'A beach stand recorded the high temperature (°F) and the number of cold drinks sold on 40 summer days with highs from 65 °F to 95 °F. Technology gives the least-squares regression line ŷ = −45.2 + 2.1x, where x is the high temperature and ŷ is the predicted number of drinks sold, with r = 0.91. The residual plot shows random scatter with no pattern.',
    parts: [
      {
        label: 'A',
        prompt: 'Describe the association between temperature and drinks sold, and interpret the slope in context.',
        answer:
          'There is a **strong, positive, linear** association: hotter days tend to have more drinks sold (r = 0.91). Slope: for each additional 1 °F in high temperature, the **predicted** number of drinks sold increases by about **2.1 drinks**.',
        rubric: ['Describes direction, form and strength in context', 'Interprets the slope as a predicted change in context'],
      },
      {
        label: 'B',
        prompt: 'On an 80 °F day the stand sold 130 drinks. Find the residual and interpret it.',
        answer: 'ŷ = −45.2 + 2.1(80) = **122.8** drinks. Residual = 130 − 122.8 = **7.2** drinks: the stand sold about 7.2 more drinks than the model predicted for an 80 °F day.',
        rubric: ['Correct prediction and residual (7.2)', 'Interprets the residual (sold more than predicted)'],
        verify: [
          { stated: 122.8, compute: () => drinks(80) },
          { stated: 7.2, compute: () => 130 - drinks(80) },
        ],
      },
      {
        label: 'C',
        prompt: 'Calculate and interpret r².',
        answer: 'r² = 0.91² ≈ **0.828**. About 82.8% of the variation in the number of drinks sold is explained by the linear relationship with high temperature.',
        rubric: ['r² ≈ 0.828 with a correct interpretation in context'],
        verify: [{ stated: 0.828, compute: () => 0.91 ** 2, tol: 0.001 }],
      },
      {
        label: 'D',
        prompt: 'Is a linear model appropriate? And should the stand use the model to predict sales on a 40 °F day? Explain both.',
        answer:
          'Yes, a linear model is appropriate because the residual plot shows **random scatter** with no curved pattern. No for 40 °F: that is far outside the 65–95 °F range of the data, so the prediction (ŷ = 38.8 drinks) would be unreliable **extrapolation**.',
        rubric: ['Linear model appropriate, citing the random residual plot', 'Identifies 40 °F as extrapolation outside the data\'s range'],
        verify: [{ stated: 38.8, compute: () => drinks(40) }],
      },
      {
        label: 'E',
        prompt: 'Interpret the y-intercept, or explain why it has no reasonable interpretation.',
        answer: 'The intercept −45.2 would be the predicted drinks sold on a 0 °F day. It has no reasonable interpretation: 0 °F is far outside the 65–95 °F data (extrapolation), and a negative number of drinks is impossible.',
        rubric: ['Explains that the intercept is not meaningful (x = 0 far outside the data and a negative count is impossible)'],
      },
      {
        label: 'F',
        prompt: 'On 90 °F days, sales are approximately normal with mean 144 drinks and standard deviation 12 drinks. (i) Find the probability of selling more than 160 drinks on a 90 °F day. (ii) Over 5 independent 90 °F days, find the probability that sales exceed 160 drinks on at least one day.',
        answer:
          '(i) z = (160 − 144) ÷ 12 ≈ 1.33; P(X > 160) ≈ **0.091**.\n(ii) P(at least one) = 1 − (1 − 0.091)^{5} ≈ **0.380**.',
        rubric: ['Normal probability ≈ 0.091 with the distribution and boundary shown', 'Complement rule for at least one ≈ 0.380'],
        verify: [
          { stated: 0.091, compute: () => pHot, tol: 0.005 },
          { stated: 0.38, compute: () => 1 - (1 - pHot) ** 5, tol: 0.005 },
        ],
      },
    ],
  },
]
