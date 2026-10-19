# AP Statistics: course outline

Source: **AP Statistics Course and Exam Description, effective Fall 2026** (College Board), downloaded 2026-10-17 from
https://apcentral.collegeboard.org/media/pdf/ap-statistics-course-and-exam-description.pdf into `source/` (not committed; `source` is gitignored).
Page numbers below are the CED's printed page numbers.

> The course was **redesigned for 2026–27**. The old 9-unit course (one- and two-variable data, collecting data, probability,
> sampling distributions, proportions, means, chi-square, slopes) is gone. Do not reuse old-CED knowledge without checking
> the new topic pages. Notable changes for us: 5 units; exam = 42 MC + 4 FRQs (each 10 points); combining random variables,
> the geometric distribution, chi-square goodness-of-fit, inference for slopes and transformations are **not** in the new CED;
> new "investigative question" learning objectives (1.1, 1.10); randomization distributions (2.12); the formula sheet no longer
> gives b = r·s_y/s_x (slope, intercept and r are "calculated using technology", 5.5.A).

## 1. Course facts

**Prerequisite:** first-year algebra (p. 7).

| Unit | Title | MC weighting (p. 14) | Topics |
|---|---|---|---|
| 1 | Exploring One-Variable Data and Collecting Data | 20–30% | 1.1–1.13 |
| 2 | Probability, Random Variables, and Probability Distributions | 15–25% | 2.1–2.12 |
| 3 | Inference for Categorical Data: Proportions | 15–25% | 3.1–3.15 |
| 4 | Inference for Quantitative Data: Means | 10–20% | 4.1–4.10 |
| 5 | Regression Analysis | 10–20% | 5.1–5.5 |

55 topics in all (exact names in `app/src/content/stats/ced.ts`).

**Exam (p. 156):** 3 hours. Section I: 42 multiple-choice questions, 90 min, 50%. Section II: 4 free-response questions,
90 min, 50%, each 10 points, scored analytically (1 point per criterion in the sample scoring guidelines):
1. Multi-Focus on Practices 1 and 2 (formulate questions, collect data)
2. Multi-Focus on Practices 3 and 4 (analyze data, interpret results)
3. Inference (hypothesis test or confidence interval)
4. Multi-Focus on Practices 2, 3, and 4 (several content areas)

A graphing calculator with statistical capabilities is expected on both sections; formulas and tables (z, t, χ²) are provided (appendix, pp. 227–236).

**Practices (MC weighting, p. 157):** 1 Formulate Questions 5–10%, 2 Collect Data 20–30%, 3 Analyze Data 25–35%, 4 Interpret Results 25–35%.

**Exam date:** Tuesday, May 11, 2027 (College Board 2027 calendar), matches `shared/catalog.ts`.

## 2. Toolkit unit (u0)

Algebra-1 skills the course leans on:
- `stats-0.1` Percents, proportions and rounding
- `stats-0.2` Square roots, order of operations and Σ (sum) notation
- `stats-0.3` Lines: slope and intercept (ready for regression)

## 3. Lessons (Foundation → Core → Advanced within each unit)

### Unit 1: Exploring One-Variable Data and Collecting Data (17 lessons)
| id | title | CED | level |
|---|---|---|---|
| stats-1.1 | What Can We Learn from Data? | 1.1 | F |
| stats-1.2 | Variables, Parameters and Statistics | 1.2 | F |
| stats-1.3 | One Categorical Variable: Tables and Graphs | 1.3, 1.4 | F |
| stats-1.4 | Graphing One Quantitative Variable | 1.5 | F |
| stats-1.5 | Describing a Distribution | 1.6 | F |
| stats-1.6 | Investigative Questions and Types of Studies | 1.10 | F |
| stats-1.7 | Center and Position | 1.7 | C |
| stats-1.8 | Measuring Spread | 1.7 | C |
| stats-1.9 | Outliers, Resistance and Changing Units | 1.7 | C |
| stats-1.10 | Boxplots, Mean vs. Median and Skew | 1.8 | C |
| stats-1.11 | Comparing Distributions | 1.9 | C |
| stats-1.12 | Random Sampling Methods | 1.11 | C |
| stats-1.13 | Bias in Sampling | 1.12 | C |
| stats-1.14 | Well-Designed Experiments | 1.13 | C |
| stats-1.15 | z-Scores and Relative Position | 1.9 | A |
| stats-1.16 | Generalizing and Confounding | 1.10 | A |
| stats-1.17 | Experimental Designs: Blocks and Matched Pairs | 1.13 | A |

### Unit 2: Probability, Random Variables, and Probability Distributions (14 lessons)
| id | title | CED | level |
|---|---|---|---|
| stats-2.1 | Two-Way Tables and Graphs | 2.1 | F |
| stats-2.2 | Joint, Marginal and Conditional | 2.2 | F |
| stats-2.3 | Simulation and the Law of Large Numbers | 2.3 | F |
| stats-2.4 | Probability Basics and Complements | 2.4 | F |
| stats-2.5 | Mutually Exclusive Events | 2.5 | C |
| stats-2.6 | Conditional Probability | 2.6 | C |
| stats-2.7 | Independence and "Or" | 2.7 | C |
| stats-2.8 | Random Variables and Distributions | 2.8 | C |
| stats-2.9 | Mean and SD of a Random Variable | 2.9 | C |
| stats-2.10 | Binomial Setting, Mean and SD | 2.10 | C |
| stats-2.11 | Binomial Probabilities | 2.10 | A |
| stats-2.12 | The Normal Curve and the Empirical Rule | 2.11 | A |
| stats-2.13 | Normal Calculations: Areas and Cutoffs | 2.11 | A |
| stats-2.14 | Sampling Distributions and the CLT | 2.12 | A |

### Unit 3: Inference for Categorical Data: Proportions (14 lessons)
| id | title | CED | level |
|---|---|---|---|
| stats-3.1 | Estimators and Bias | 3.1 | F |
| stats-3.2 | The Sampling Distribution of p̂ | 3.2 | F |
| stats-3.3 | Confidence Intervals for p: Setup | 3.3 | F |
| stats-3.4 | Building the Interval, SE and Sample Size | 3.3 | C |
| stats-3.5 | Interpreting Confidence Intervals | 3.4 | C |
| stats-3.6 | Setting Up a Test for p | 3.5 | C |
| stats-3.7 | What a p-Value Means | 3.6 | C |
| stats-3.8 | Carrying Out a One-Proportion z-Test | 3.7 | C |
| stats-3.9 | Type I and Type II Errors, Power | 3.8 | C |
| stats-3.10 | Sampling Distribution of p̂₁ − p̂₂ | 3.9 | A |
| stats-3.11 | Two-Proportion z-Interval | 3.10, 3.11 | A |
| stats-3.12 | Two-Proportion z-Test | 3.12, 3.13 | A |
| stats-3.13 | Chi-Square: Homogeneity or Independence? | 3.14 | A |
| stats-3.14 | Carrying Out a Chi-Square Test | 3.15 | A |

### Unit 4: Inference for Quantitative Data: Means (10 lessons)
| id | title | CED | level |
|---|---|---|---|
| stats-4.1 | The Sampling Distribution of x̄ | 4.1 | F |
| stats-4.2 | t-Distributions and the One-Sample t-Interval | 4.2 | F |
| stats-4.3 | Matched Pairs Intervals | 4.2 | C |
| stats-4.4 | Interpreting t-Intervals | 4.3 | C |
| stats-4.5 | Setting Up a t-Test | 4.4 | C |
| stats-4.6 | Carrying Out a t-Test | 4.5 | C |
| stats-4.7 | Sampling Distribution of x̄₁ − x̄₂ | 4.6 | A |
| stats-4.8 | Two-Sample t-Interval | 4.7, 4.8 | A |
| stats-4.9 | Two-Sample t-Test | 4.9, 4.10 | A |
| stats-4.10 | Which Procedure? | 3.3, 3.5, 3.10, 3.12, 3.14, 4.2, 4.4, 4.7, 4.9 | A |

### Unit 5: Regression Analysis (5 lessons)
| id | title | CED | level |
|---|---|---|---|
| stats-5.1 | Scatterplots | 5.1 | F |
| stats-5.2 | Correlation | 5.2 | F |
| stats-5.3 | Linear Models and Extrapolation | 5.3 | C |
| stats-5.4 | Residuals and Residual Plots | 5.4 | C |
| stats-5.5 | Least-Squares Regression and r² | 5.5 | A |

**63 lessons**, every one of the 55 topics taught at least once.

## 4. Assessment plan

- Each lesson: one "your turn" question, 2–4 quick-check questions, 2–3 flashcards (same as Chem).
- Each unit: 6–10 extra checkpoint questions (mixed), so the MC bank is large enough for a 42-question practice exam weighted by the CED midpoints.
- Practice exams: Quick mix (14 questions, ~30 min), Half section (21, ~45 min), Full Section I (42, 90 min).
- FRQs: 8 original questions, two of each exam type (Q1–Q4), 10 one-point rubric items each, self-scored like Chem.

## 5. Accuracy-check plan

- New `app/src/lib/stats.ts`: mean, SD, quartiles (CED method: median of each half), normal cdf/inverse, t cdf/inverse,
  χ² cdf/inverse, binomial pdf/cdf, Welch df, least-squares line and r.
- `app/tests/stats.test.ts` checks that library against values printed in the CED's own tables (Table A z, Table B t, Table C χ²)
  and against the CED sample answers (MC 9, 10, 12, 17, 24; FRQ 3 z = 2.91, p = 0.0036; FRQ 4 E(X) = 2.79, CI (−0.365, −0.015)).
- Every number a student sees goes through `compute` / `verify`, as in Chem (data sets are written into the content so the
  tests recompute summaries from raw data).
- Coverage tests generalized to every course: only real CED topic numbers; every topic taught.
- FRQ test: every stats FRQ is worth exactly 10 points.
- Conditions are worded exactly as the CED states them (e.g. CI normality uses *observed* successes/failures ≥ 10; tests use
  *expected* np₀ ≥ 10; two-proportion tests use the pooled p̂_c; χ² expected counts condition).

## 6. Reference tools

- **Formulas & tables** page (More → for Stats, in place of the periodic table): the CED formula sheet, plus a normal, t and χ²
  calculator (area ↔ cutoff) computed by `lib/stats.ts`.
- Glossary of about 100 terms, each linked to the lesson that teaches it.
- 2 YouTube links per lesson, checked to exist (outside videos, may follow the older course order).

## 7. Risks

- Most outside prep material still follows the old 9-unit course: never copy topic structure or "conditions" wording from it.
- CED inconsistency: topic page 3.14.D.1.iii says expected counts "greater than 5" while the unit guide (p. 82) says "at least 5".
  Lessons say "all expected counts are at least 5" and note the AP wording.
- Two-sample t uses technology df (Welch); lessons give the df range from the CED (between min(n₁−1, n₂−1) and n₁+n₂−2).
- Text markup: `*` makes italics, so critical values are written t^{*} / z^{*}.
