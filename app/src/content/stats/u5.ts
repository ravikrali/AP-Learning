import type { Unit } from '../types'
import { correlation, lsrl, mean } from '../../lib/stats'
import { LONG_JUMP, STUDY_HOURS, STUDY_SCORES } from './data'

const V = 'Fall 2026'

const study = lsrl(STUDY_HOURS, STUDY_SCORES) // ŷ ≈ 59.12 + 4.00x
const jumpX = LONG_JUMP.map((p) => p[0])
const jumpY = LONG_JUMP.map((p) => p[1])
const jump = lsrl(jumpX, jumpY) // ŷ ≈ 240.0 − 19.0x
const predict = (x: number) => study.a + study.b * x

export const unit5: Unit = {
  id: 'stats-u5',
  number: 5,
  title: 'Regression Analysis',
  weight: '10–20%',
  blurb: 'Scatterplots and correlation, linear regression models and predictions, residuals and residual plots, and the least-squares regression line with r².',
  badge: { name: 'Trend Spotter', emoji: '📈' },
  lessons: [
    // ---------------- FOUNDATION ----------------
    {
      id: 'stats-5.1',
      ced: ['5.1'],
      cedVersion: V,
      title: 'Scatterplots',
      level: 'foundation',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Do faster sprinters jump farther? Each runner gives **two** numbers: dash time and jump distance. Plot them as points and the relationship appears at a glance.',
        },
        {
          kind: 'concept',
          title: 'Building a scatterplot',
          body: 'A **bivariate quantitative** data set has ordered pairs of two quantitative variables measured on the same individuals. A **scatterplot** shows one point per individual.\n\n- **Explanatory variable** (x-axis): used to explain or predict.\n- **Response variable** (y-axis): the outcome being predicted.',
          diagram: 'st-long-jump',
        },
        {
          kind: 'concept',
          title: 'Describing an association',
          body: 'Describe **form, direction, strength and unusual features**, in context:\n\n- **Form**: linear or non-linear\n- **Direction**: **positive** (as x increases, y **tends** to increase) or **negative** (y tends to decrease)\n- **Strength**: how closely points follow the pattern: strong, moderate or weak\n- **Unusual features**: clusters, or points that don\'t fit the general pattern',
          diagram: 'st-scatter-forms',
        },
        {
          kind: 'example',
          title: 'Dash time and long jump',
          problem: 'Describe the scatterplot of 60-meter dash time (s) and long-jump distance (in) for 12 club runners.',
          steps: [
            '**Form**: linear',
            '**Direction**: negative: runners with **longer** (slower) dash times **tend to** jump **shorter** distances',
            '**Strength**: strong (r ≈ −0.94)',
            '**Unusual features**: no clusters or points far from the pattern',
          ],
          answer: 'A strong, negative, linear association with no unusual points.',
          verify: [{ stated: -0.94, compute: () => correlation(jumpX, jumpY), tol: 0.005 }],
        },
        {
          kind: 'try',
          question: {
            id: 's5.1-t1',
            type: 'mcq',
            prompt: 'A researcher wants to predict a car\'s fuel efficiency (mpg) from its weight (pounds). Which goes on the x-axis?',
            choices: ['Fuel efficiency', 'Weight', 'Either; it doesn\'t matter', 'Neither'],
            answer: 1,
            explain: 'Weight is used to **predict**, so it is the **explanatory variable** (x-axis). Fuel efficiency is the response (y-axis).',
          },
        },
        {
          kind: 'hack',
          title: 'Direction in context, with "tend to"',
          body: 'Not just "negative". Write: "**Cars that weigh more tend to have lower fuel efficiency.**" "Tend to" shows it\'s a pattern, not a rule for every car.',
        },
        {
          kind: 'trap',
          body: 'Don\'t call a relationship linear because "the points make a line" or "it has a line of best fit". Linear means the points follow a **straight-line pattern**; any data can have a line drawn through them.',
        },
        {
          kind: 'summary',
          points: ['Explanatory on x, response on y.', 'Describe form, direction, strength, unusual features, in context.', 'Use "tend to" for direction.'],
        },
      ],
      check: [
        {
          id: 's5.1-q1',
          type: 'mcq',
          prompt: 'In a scatterplot of hours of TV watched (x) and test score (y), the points drift downward from left to right and are fairly scattered. The best description is…',
          choices: ['strong positive', 'weak to moderate negative', 'strong negative', 'no association'],
          answer: 1,
          explain: 'Downward → **negative**; fairly scattered → **weak to moderate**.',
        },
        {
          id: 's5.1-q2',
          type: 'mcq',
          prompt: 'Which pair of variables would make a bivariate quantitative data set?',
          choices: ['Eye color and hair color', 'Height and arm span of each student', 'Grade level and favorite subject', 'Car brand and color'],
          answer: 1,
          explain: 'Height and arm span are both **quantitative**, measured on the same individuals.',
        },
      ],
      flashcards: [
        { front: 'Describe a scatterplot', back: 'Form (linear or not), direction (positive or negative), strength (strong/moderate/weak), unusual features, in context.' },
        { front: 'Explanatory vs. response variable', back: 'Explanatory (x) explains or predicts; response (y) is the outcome.' },
      ],
    },
    {
      id: 'stats-5.2',
      ced: ['5.2'],
      cedVersion: V,
      title: 'Correlation',
      level: 'foundation',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'Ice cream sales and shark attacks rise together every summer. The correlation is real. But does ice cream cause shark attacks? Of course not. Correlation is a useful number, with important limits.',
        },
        {
          kind: 'concept',
          title: 'The correlation coefficient r',
          body: '**r** summarizes the **strength and direction** of the **linear** association between two quantitative variables.\n\n- r has **no units** and is always between **−1 and 1**.\n- r > 0: positive association; r < 0: negative.\n- The closer r is to −1 or 1, the stronger the linear association. r = 0: no **linear** association. r = ±1: a perfect line.',
        },
        {
          kind: 'concept',
          title: 'Limits of r',
          body: '- An r close to ±1 does **not** by itself mean a linear model is appropriate: curved data can have a large r. Look at the scatterplot and residuals too.\n- **Correlation does not imply causation.** A relationship between two variables doesn\'t mean changes in one cause changes in the other (a confounder like summer heat may drive both).',
        },
        {
          kind: 'example',
          title: 'Interpret r',
          problem: 'For hours studied and test score (10 students), r ≈ 0.968. Interpret it.',
          steps: ['Sign: positive → students who study more **tend to** score higher.', 'Size: 0.968 is close to 1 → a **strong** linear association.', '"There is a strong, positive, linear association between hours studied and test score for these students."'],
          answer: 'Strong, positive, linear association.',
          verify: [{ stated: 0.968, compute: () => study.r, tol: 0.002 }],
        },
        {
          kind: 'try',
          question: {
            id: 's5.2-t1',
            type: 'mcq',
            prompt: 'For a group of drivers, the correlation between hours of sleep and reaction time is r = −0.52. Which interpretation is correct?',
            choices: [
              'There is no linear relationship',
              'The linear relationship is moderate and negative',
              'The linear relationship is perfect',
              'The linear relationship is moderate and positive',
            ],
            answer: 1,
            explain: 'Negative sign → negative direction (more sleep tends to go with faster reactions); 0.52 is in the middle → **moderate**.',
          },
        },
        {
          kind: 'hack',
          title: 'Units don\'t change r',
          body: 'Converting inches to centimeters or seconds to minutes doesn\'t change r, and neither does swapping x and y. It is unit-free.',
        },
        {
          kind: 'trap',
          body: 'Reserve **correlation** for two **quantitative** variables. "Gender is correlated with favorite sport" misuses the word; say "associated".',
        },
        {
          kind: 'summary',
          points: ['r: strength and direction of a linear association, −1 ≤ r ≤ 1, unit-free.', 'r near ±1 doesn\'t guarantee a linear model fits.', 'Correlation doesn\'t imply causation.'],
        },
      ],
      check: [
        {
          id: 's5.2-q1',
          type: 'mcq',
          prompt: 'Which correlation indicates the strongest linear association?',
          choices: ['r = 0.62', 'r = −0.85', 'r = 0.80', 'r = −0.10'],
          answer: 1,
          explain: 'Strength depends on **closeness to ±1**: |−0.85| is the largest.',
        },
        {
          id: 's5.2-q2',
          type: 'mcq',
          prompt: 'A scatterplot shows a clear U-shaped pattern, and r ≈ 0. What can you conclude?',
          choices: ['There is no relationship', 'There is no linear relationship, but there is a non-linear one', 'r was computed incorrectly', 'The variables are independent'],
          answer: 1,
          explain: 'r measures only **linear** association. A strong curved pattern can have r near 0.',
        },
      ],
      flashcards: [
        { front: 'Correlation coefficient r', back: 'Measures the strength and direction of a linear association; unit-free, between −1 and 1.' },
        { front: 'Does a strong correlation show causation?', back: 'No. Correlation does not imply causation.' },
      ],
    },
    // ---------------- CORE ----------------
    {
      id: 'stats-5.3',
      ced: ['5.3'],
      cedVersion: V,
      title: 'Linear Models & Extrapolation',
      level: 'core',
      minutes: 7,
      cards: [
        {
          kind: 'hook',
          body: 'If studying 5 hours predicts about 79 points, what does 20 hours predict? The equation happily says 139, on a test out of 100. Models have a range where they make sense.',
        },
        {
          kind: 'concept',
          title: 'The linear regression model',
          body: 'If the form looks **linear**, model it with a line:\n\n**ŷ = a + bx**\n\n- ŷ ("y-hat") = **predicted** response\n- a = y-intercept, b = slope, x = explanatory variable\n\nStudy data: **ŷ = 59.12 + 4.00x** (x = hours studied, ŷ = predicted score).',
          diagram: 'st-lsrl',
        },
        {
          kind: 'example',
          title: 'Make a prediction',
          problem: 'Using ŷ = 59.12 + 4.00x, predict the score of a student who studies 5 hours.',
          steps: ['ŷ = 59.12 + 4.00(5) ≈ **79.1** points', 'This is a prediction for a typical student who studies 5 hours, not a guarantee for every such student.'],
          answer: '≈ 79.1 points',
          verify: [
            { stated: 59.12, compute: () => study.a, tol: 0.001 },
            { stated: 4.0, compute: () => study.b, tol: 0.002 },
            { stated: 79.1, compute: () => predict(5), tol: 0.002 },
          ],
        },
        {
          kind: 'concept',
          title: 'Interpolation vs. extrapolation',
          body: '- **Interpolation**: predicting for an x **inside** the range of x-values used to fit the line (here 1 to 8 hours). Reasonable.\n- **Extrapolation**: predicting for an x **beyond** that range. The **farther** you go, the **less reliable** the prediction.\n\n20 hours is far beyond 8: ŷ = 59.12 + 4.00(20) ≈ 139, an impossible score.',
        },
        {
          kind: 'try',
          question: {
            id: 's5.3-t1',
            type: 'num',
            prompt: 'A model predicts a puppy\'s weight (kg) from its age (weeks): ŷ = 1.2 + 0.45x. Predict the weight at 10 weeks.',
            answer: 5.7,
            unit: 'kg',
            explain: '1.2 + 0.45(10) = **5.7 kg**',
            compute: () => 1.2 + 0.45 * 10,
          },
        },
        {
          kind: 'hack',
          title: 'Always write the hat',
          body: 'The model gives **ŷ** (predicted), not y (actual). Writing "y = 59.12 + 4.00x" or forgetting to define x and y can cost a point.',
        },
        {
          kind: 'trap',
          body: 'A model fit to ages 8–16 says nothing reliable about age 40. Don\'t trust predictions outside the data\'s x-range.',
        },
        {
          kind: 'summary',
          points: ['ŷ = a + bx gives predicted responses.', 'Interpolation (inside the x-range) is reasonable; extrapolation (outside) is unreliable.', 'Define x and ŷ in context.'],
        },
      ],
      check: [
        {
          id: 's5.3-q1',
          type: 'mcq',
          prompt: 'A line was fit to data with x from 10 to 50. Predicting y at x = 85 is an example of…',
          choices: ['interpolation', 'extrapolation', 'a residual', 'correlation'],
          answer: 1,
          explain: '85 is **beyond** the x-range used: **extrapolation**, which is unreliable.',
        },
        {
          id: 's5.3-q2',
          type: 'num',
          prompt: 'Using ŷ = 240.0 − 19.0x (x = dash time in s, ŷ = predicted long jump in inches), predict the jump for a dash time of 7.5 s.',
          answer: 97.5,
          unit: 'inches',
          explain: '240.0 − 19.0(7.5) = 240 − 142.5 = **97.5 inches**',
          compute: () => 240.0 - 19.0 * 7.5,
        },
      ],
      flashcards: [
        { front: 'Linear regression model', back: 'ŷ = a + bx, where ŷ is the predicted response, a the intercept, b the slope.' },
        { front: 'Extrapolation', back: 'Predicting for x outside the range used to fit the model; less reliable the farther out.' },
      ],
    },
    {
      id: 'stats-5.4',
      ced: ['5.4'],
      cedVersion: V,
      title: 'Residuals & Residual Plots',
      level: 'core',
      minutes: 8,
      cards: [
        {
          kind: 'hook',
          body: 'The model predicted 83.1 points for a student who studied 6 hours; she actually scored 85. The gap, 1.9 points, is a **residual**. Residuals tell you how well, and whether, a line fits.',
        },
        {
          kind: 'concept',
          title: 'Residuals',
          body: '**residual = y − ŷ = observed − predicted**\n\n- **Positive** residual: the point is above the line; the model **underpredicted** (underestimated).\n- **Negative** residual: the point is below the line; the model **overpredicted**.',
        },
        {
          kind: 'example',
          title: 'One student\'s residual',
          problem: 'A student studied 6 hours and scored 85. Using ŷ = 59.12 + 4.00x, find and interpret the residual.',
          steps: [
            'ŷ = 59.12 + 4.00(6) ≈ **83.09** points',
            'Residual = 85 − 83.09 ≈ **1.91** points',
            'Her actual score was about 1.91 points **higher** than the model predicted: the model underestimated her score.',
          ],
          answer: 'Residual ≈ 1.91 points',
          verify: [
            { stated: 83.09, compute: () => predict(6), tol: 0.001 },
            { stated: 1.91, compute: () => 85 - predict(6), tol: 0.003 },
          ],
        },
        {
          kind: 'concept',
          title: 'Residual plots',
          body: 'A **residual plot** graphs the residuals against x (or against ŷ).\n\n- **Random scatter**, no pattern → the linear model is **appropriate**.\n- **Curved pattern** → a linear model is **not** the most appropriate model.',
          diagram: 'st-residual-plots',
        },
        {
          kind: 'try',
          question: {
            id: 's5.4-t1',
            type: 'num',
            prompt: 'The dash-time model is ŷ = 240.0 − 19.0x. A runner with a dash time of x = 7.2 s has a residual of −5.0 inches. What was the runner\'s actual jump? (Round to 1 decimal.)',
            answer: 98.2,
            tolerance: 0.002,
            hint: 'Find ŷ, then actual = ŷ + residual.',
            explain: 'ŷ = 240.0 − 19.0(7.2) = 103.2; actual = 103.2 + (−5.0) = **98.2 inches**',
            compute: () => 240.0 - 19.0 * 7.2 - 5.0,
          },
        },
        {
          kind: 'hack',
          title: '"Residual" in one sentence',
          body: '"The actual [y] was [|residual|] [units] **higher/lower** than predicted by the model for [x = value]." Positive → higher than predicted.',
        },
        {
          kind: 'trap',
          body: 'It\'s **observed − predicted**, never the other way around. Swapping them flips the sign and the interpretation.',
        },
        {
          kind: 'summary',
          points: ['Residual = y − ŷ (observed − predicted).', 'Positive: model underpredicts; negative: model overpredicts.', 'Random residual plot → linear model appropriate; curve → not.'],
        },
      ],
      check: [
        {
          id: 's5.4-q1',
          type: 'mcq',
          prompt: 'A residual of −3.2 means…',
          choices: ['the actual value was 3.2 above the prediction', 'the actual value was 3.2 below the prediction', 'the slope is −3.2', 'the correlation is negative'],
          answer: 1,
          explain: 'Negative residual → observed **below** predicted (the model overpredicted).',
        },
        {
          id: 's5.4-q2',
          type: 'mcq',
          prompt: 'A residual plot shows a clear curved (U-shaped) pattern. What does this suggest?',
          choices: ['The linear model is appropriate', 'A linear model is not the most appropriate model', 'r = 0', 'There are no outliers'],
          answer: 1,
          explain: 'Curvature in residuals means the line misses a non-linear pattern.',
        },
        {
          id: 's5.4-q3',
          type: 'num',
          prompt: 'Using ŷ = 59.12 + 4.00x, find the residual for a student who studied 7 hours and scored 84. (Round to 2 decimals.)',
          answer: -3.09,
          tolerance: 0.01,
          explain: 'ŷ = 59.12 + 4.00(7) ≈ 87.09; residual = 84 − 87.09 ≈ **−3.09**',
          compute: () => 84 - predict(7),
        },
      ],
      flashcards: [
        { front: 'Residual', back: 'Observed y − predicted ŷ.' },
        { front: 'What does a residual plot with random scatter indicate?', back: 'A linear model is appropriate for the data.' },
      ],
    },
    // ---------------- ADVANCED ----------------
    {
      id: 'stats-5.5',
      ced: ['5.5'],
      cedVersion: V,
      title: 'Least-Squares Regression & r²',
      level: 'advanced',
      minutes: 9,
      cards: [
        {
          kind: 'hook',
          body: 'Many lines could go through a scatterplot. Which is "best"? Statisticians pick the one that makes the **squared residuals** as small as possible, and then ask how much of the variation that line explains.',
        },
        {
          kind: 'concept',
          title: 'The least-squares regression line (LSRL)',
          body: 'The **least-squares regression line** minimizes the **sum of the squared residuals**. Its slope b, intercept a and the correlation r are **calculated using technology**.\n\nThe LSRL always passes through the point **(x̄, ȳ)**.\n\nStudy data (from technology): **ŷ = 59.12 + 4.00x**, r ≈ 0.968.',
        },
        {
          kind: 'concept',
          title: 'Interpreting slope and intercept',
          body: '- **Slope b**: the **predicted** increase (or decrease) in y for each **one-unit increase** in x. "For each additional hour studied, the **predicted** score increases by about **4.00 points**."\n- **Intercept a**: the predicted y when **x = 0**. "A student who studies 0 hours has a predicted score of about **59.12 points**." (The data run from 1 to 8 hours, so x = 0 is a small extrapolation.)\n\nSometimes the intercept has **no reasonable meaning**: x = 0 may be far outside the data (extrapolation), or the predicted value may be impossible (like a negative height).',
        },
        {
          kind: 'concept',
          title: 'r², the coefficient of determination',
          body: '**r²** (the square of r) is the **proportion of the variation in the response** that is **explained by the linear relationship** with the explanatory variable.\n\nStudy data: r² ≈ 0.937 → "About **93.7%** of the variation in test scores is explained by the linear relationship with hours studied."',
        },
        {
          kind: 'example',
          title: 'Check the LSRL facts',
          problem: 'For the study data, x̄ = 4.2 hours and ȳ = 75.9 points. Verify the line passes through (x̄, ȳ), and give r².',
          steps: ['ŷ at x̄: 59.12 + 4.00(4.2) ≈ **75.9** ✓ (equals ȳ)', 'r² = 0.968² ≈ **0.937**'],
          answer: 'Passes through (4.2, 75.9); r² ≈ 0.937',
          verify: [
            { stated: 4.2, compute: () => mean(STUDY_HOURS) },
            { stated: 75.9, compute: () => mean(STUDY_SCORES) },
            { stated: 75.9, compute: () => predict(mean(STUDY_HOURS)) },
            { stated: 0.937, compute: () => study.r2, tol: 0.002 },
          ],
        },
        {
          kind: 'try',
          question: {
            id: 's5.5-t1',
            type: 'mcq',
            prompt: 'A model predicts a tomato plant\'s height from its daily hours of sunlight, with r = 0.72 and r² = 0.518. Which is the correct interpretation of r²?',
            choices: [
              'About 52% of the variation in sunlight is explained by plant height',
              'About 72% of the variation in plant height is explained by the linear relationship with sunlight',
              'About 52% of the variation in plant height is explained by the linear relationship with sunlight',
              'About 52% of the plants are predicted correctly',
            ],
            answer: 2,
            explain: 'r² = 0.518 → about **52%** of the variation in the **response** (plant height) is explained by the linear relationship with the explanatory variable (sunlight).',
          },
        },
        {
          kind: 'hack',
          title: 'Slope template: "predicted" is the magic word',
          body: '"For each additional **[1 x-unit]**, the **predicted** [y] **increases/decreases** by about **[|b|] [y-units]**." Leaving out "predicted" (or "on average") is a classic lost point.',
        },
        {
          kind: 'trap',
          body: 'r² is about the **response** variable\'s variation, and it measures how much the **linear model** explains. It isn\'t "the percent of points on the line" or "the percent of predictions that are correct".',
        },
        {
          kind: 'frq',
          body: 'Regression often shows up inside the multi-focus questions: expect to read technology output (slope, intercept, r, r²), predict, compute a residual, interpret slope or r² **in context**, and judge whether a linear model is appropriate from a residual plot.',
        },
        {
          kind: 'summary',
          points: ['LSRL minimizes the sum of squared residuals; it passes through (x̄, ȳ); a, b and r come from technology.', 'Slope: predicted change in y per 1-unit increase in x. Intercept: predicted y at x = 0 (may not make sense).', 'r²: proportion of variation in y explained by the linear relationship with x.'],
        },
      ],
      check: [
        {
          id: 's5.5-q1',
          type: 'mcq',
          prompt: 'The LSRL for predicting a tree\'s height (m) from its age (years) is ŷ = 0.8 + 0.35x. Which interpretation of the slope is correct?',
          choices: [
            'Each tree grows exactly 0.35 m per year',
            'For each additional year of age, the predicted height increases by about 0.35 m',
            'A tree of age 0 is 0.35 m tall',
            '35% of the variation in height is explained by age',
          ],
          answer: 1,
          explain: 'Slope = **predicted** change in height for each 1-year increase in age.',
        },
        {
          id: 's5.5-q2',
          type: 'num',
          prompt: 'For the dash-time model, r ≈ −0.942. What is r²? (Round to 3 decimals.)',
          answer: 0.887,
          tolerance: 0.005,
          explain: '(−0.942)² ≈ **0.887**: about 88.7% of the variation in jump distance is explained by the linear relationship with dash time.',
          compute: () => jump.r2,
        },
        {
          id: 's5.5-q3',
          type: 'mcq',
          prompt: 'A model predicts adult weight (kg) from height (cm): ŷ = −90 + 0.95x. Why doesn\'t the intercept have a reasonable interpretation?',
          choices: [
            'Because the slope is positive',
            'Because x = 0 cm is far outside the data and a weight of −90 kg is impossible',
            'Because r² is small',
            'Because weight and height are categorical',
          ],
          answer: 1,
          explain: 'Predicting at height 0 is extreme **extrapolation**, and the predicted weight is **negative**, which is impossible.',
        },
      ],
      flashcards: [
        { front: 'Least-squares regression line', back: 'The line that minimizes the sum of squared residuals; it passes through (x̄, ȳ).' },
        { front: 'Interpret the slope of an LSRL', back: 'For each 1-unit increase in x, the predicted y increases (or decreases) by about |b| units.' },
        { front: 'Interpret r²', back: 'The proportion of variation in the response explained by the linear relationship with the explanatory variable.' },
      ],
    },
  ],
  checkpoint: [
    {
      id: 's5-cp1',
      type: 'mcq',
      prompt: 'Which value of r is impossible?',
      choices: ['−0.99', '0', '0.5', '1.2'],
      answer: 3,
      explain: 'r is always between −1 and 1.',
    },
    {
      id: 's5-cp2',
      type: 'num',
      prompt: 'An LSRL is ŷ = 12 + 2.5x. An observation has x = 8 and y = 30. Find its residual.',
      answer: -2,
      explain: 'ŷ = 12 + 2.5(8) = 32; residual = 30 − 32 = **−2**',
      compute: () => 30 - (12 + 2.5 * 8),
    },
    {
      id: 's5-cp3',
      type: 'mcq',
      prompt: 'Countries with more TVs per person tend to have longer life expectancy. What is the best conclusion?',
      choices: ['Buying TVs increases life expectancy', 'There is an association, but wealth may be a confounding variable', 'There is no association', 'Life expectancy causes TV ownership'],
      answer: 1,
      explain: 'Correlation isn\'t causation; national wealth is linked to both TVs and health care.',
    },
    {
      id: 's5-cp4',
      type: 'mcq',
      prompt: 'r = 0.9 for a data set whose residual plot shows a strong curve. What should you conclude?',
      choices: ['A linear model is definitely appropriate', 'Despite the high r, a linear model may not be the best model', 'r must be wrong', 'There is no relationship'],
      answer: 1,
      explain: 'A large r doesn\'t guarantee a linear form; the curved residual plot says a non-linear model may fit better.',
    },
    {
      id: 's5-cp5',
      type: 'num',
      prompt: 'r² = 0.64 for a positive association. What is r?',
      answer: 0.8,
      explain: 'r = +√0.64 = **0.8** (positive because the association is positive)',
      compute: () => Math.sqrt(0.64),
    },
    {
      id: 's5-cp6',
      type: 'mcq',
      prompt: 'The LSRL always passes through which point?',
      choices: ['(0, 0)', '(x̄, ȳ)', '(0, b)', '(median x, median y)'],
      answer: 1,
      explain: 'The least-squares line always passes through **(x̄, ȳ)**.',
    },
  ],
}
