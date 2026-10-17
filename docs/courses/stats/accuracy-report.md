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

## Not yet done

- An independent review pass (the Chemistry course had two). Recommended before publishing.
