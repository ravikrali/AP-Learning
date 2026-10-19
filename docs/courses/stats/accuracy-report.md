# AP Statistics: accuracy report

Source: AP Statistics CED, effective Fall 2026 (`source/`, downloaded 2026-10-17).

## What the tests guarantee (`cd app && npm test`)

- `app/src/lib/stats.ts` matches the CED's printed tables: Table A (z), Table B (t, including the z\* row) and
  Table C (χ²) at sampled entries, and reproduces the CED sample-question answers (MC 9, 10, 12, 17, 19, 24;
  FRQ 2 fences; FRQ 3 z = 2.91, p = 0.0036; FRQ 4 E(X) = 2.79 and the 90% interval (−0.365, −0.015) using
  technology (Welch) degrees of freedom).
- Every numeric answer, worked-example number and FRQ model-answer number is recomputed by code (`compute` / `verify`).
  Worked examples use the data sets in `app/src/content/stats/data.ts`, so figures and lessons share one source.
- Every one of the 55 CED topics is taught; only real topic numbers are used; unit titles and weights equal the CED.
- Each FRQ is worth exactly 10 points; two FRQs per exam question type.
- Every glossary term appears in the lesson it links to; every lesson has two well-formed YouTube links.
- Markup: no stray `*` (critical values are written t^{∗} / z^{∗} with the asterisk-operator character, because a plain
  `*` breaks bold text in the renderer).

## Wording decisions taken from the CED

- CI for p: normality uses **observed** successes and failures ≥ 10 (3.3.B.1.iii). Test for p: **expected** np₀ and
  n(1 − p₀) ≥ 10 (3.5.C.1.iii). Two-proportion test: pooled p̂_c counts ≥ 10 (3.12.C.1.iii).
- 10% condition is stated as "not needed for a randomized experiment" where the CED says so (3.10, 3.12, 3.14, 4.7, 4.9).
- Sample data condition for t procedures, including the matched-pairs version (4.2.C.1.iii, 4.4.C.1.iii).
- Outlier rules: 1.5 × IQR and the 2-standard-deviation rule (1.7.D.1).
- Slope, intercept and r are "calculated using technology" (5.5.A); the lessons do not teach b = r·s_y/s_x because the
  new formula sheet no longer includes it.
- Two-sample t df: "between the smaller of n₁ − 1 and n₂ − 1 and n₁ + n₂ − 2" (4.7.C.2, 4.10.A.1); numbers use Welch df.

## Known CED inconsistency

- Expected counts for chi-square: topic page 3.14.D.1.iii says all expected counts "greater than 5"; the unit guide
  (p. 82) says "at least 5". Lesson 3.13 says "at least 5 (the AP topic page says 'greater than 5')".

## Copyright

All lessons, questions and FRQs are original. Early drafts that reused contexts from the CED's sample questions
(library patrons, newborn scale, rec-center ages, penguins, left-handed students, vitamin intake, farm sizes, the
dash-time model) were rewritten with new contexts and numbers on 2026-10-17.

## Independent review pass, 2026-10-19

I checked every lesson in units 0–5, the 8 FRQs, the glossary, the shared data sets, the figures in `diagrams.tsx` and
`lib/stats.ts` against the topic pages of the Fall 2026 CED (`source/ced-compact.txt`). I did not write the course.

**Scope.** Every lesson maps to a real topic number, and its title matches `ced.ts`. Nothing outside the 2026 scope is
taught: no inference for slopes, no geometric distribution, no chi-square goodness-of-fit, no combining or transforming
random variables, no s (residual SD), and no leverage or influential points. Where a lesson mentions "until the first
success", it is only an example of a variable that is *not* binomial (2.10.A). The FRQ question types and their order
match the exam section (pp. 156–158): Q1 Practices 1–2, Q2 Practices 3–4, Q3 Inference, Q4 Practices 2–4.

**Checked against the CED and found correct:** conditions for every procedure (randomization, 10% with the experiment
exemption, observed vs. expected vs. pooled counts, the sample data condition including matched pairs and the
two-sample version), hypotheses and parameter wording, p-value and confidence interval/level interpretations, Type I/II
error and power factors (3.8.C.1), t- and χ²-distribution descriptions, CLT and n ≥ 30 (4.1.B.3), two-sample df range
(4.7.C.2), regression vocabulary (5.1–5.5), experimental design and sampling definitions (1.10–1.13), and the formulas in
`lib/stats.ts` (sd with n − 1, quartiles, Welch df, pooled z, χ², binomial). I also spot-checked numbers that `verify`
doesn't cover: the Class A SD (10.445, quoted as 10.4 / 10.45), the long-jump line (240.03 − 19.00x, r = −0.942, no
residual larger than 4.2 in, so "no unusual points" holds), the figure values (boxplot fences, p ≈ 0.036 at z = 1.8,
P(Z < 1.2) ≈ 0.885, one of 20 intervals missing) and the 10-point rubric totals for all 8 FRQs.

**Fixed:**

| Where | Problem | Fix | CED |
|---|---|---|---|
| Lesson 4.3 (matched pairs), example step 4 | A one-group before/after study was said to show the method "raises mean scores", which is a causal claim with no comparison group | Now concludes that the mean after is higher than before, and notes that without a comparison group this doesn't show the method caused the gain | 1.13.A.1.i, 1.13.D.1 |
| FRQ "Streaming Subscriptions", intro and part C | The given sample SD (1.15) contradicted the given distribution of the 250 households, whose SD is 1.119 | Sample SD now 1.12; interval recomputed: ME 0.117, (1.833, 2.067); rubric and part D/E numbers updated | 1.7.B.4, 4.2.D.2 |
| FRQ "Temperature and Cold-Drink Sales" | Parts were labeled A, B, C, D, F, E | Relabeled in order (E = intercept, F = normal probability) | (presentation) |
| Lesson 1.12 trap | "A cluster sample gives each person an equal chance" is true only when the clusters are the same size | Now says "a cluster sample of equal-size clusters" | 1.11.A.3, 1.11.A.5 |
| Lesson 5.5, intercept | The 0-hours interpretation didn't note that x = 0 lies outside the 1–8 hour data | Adds that x = 0 is a small extrapolation | 5.5.B.3 |
| `diagrams.tsx` NormalArea | The code comment described a second shaded region that isn't drawn | Comment corrected (no visible change) | n/a |

**Left as is (owner decision):** the expected-counts wording. The topic page (3.14.D.1.iii) says "greater than 5" and
the Unit 3 guide (p. 82) says "at least 5". Lesson 3.13 teaches "at least 5" and quotes the topic page. If the owner
wants to follow the topic page strictly, change lesson 3.13's text, its flashcard and the glossary entry to "greater
than 5".

`cd app && npm test`: 8 files, 147 tests passed (2026-10-19, after the fixes).
