// Textbook prose for the printed Statistics course book (scripts/books). Same markup as lesson cards.
// It deepens each lesson without adding topics: everything here stays inside the CED (effective Fall 2026).
import type { CourseBook } from '../types'

export const BOOK: CourseBook = {
  units: {
    'stats-u0': {
      overview: `Statistics is a way of reasoning about data, but it borrows a few tools from algebra: proportions and percents, square roots and the summation sign Σ, and the equation of a line. This short chapter reviews exactly those tools, the way the rest of the course uses them.

If you are already comfortable with them, skim the worked examples and try the review questions. If any of them feel shaky, spend an evening here first. Almost every formula on the AP® Statistics formula sheet is built from these pieces, and fluency with them frees your attention for the statistical thinking that the exam actually rewards.`,
    },
    'stats-u1': {
      overview: `Every statistical investigation starts with a question and ends with a conclusion about the world. This unit covers both ends of that journey for a single variable.

The first half is about **exploring data**: identifying the kind of variable you have, choosing a graph that shows its distribution, and describing that distribution with the four features readers always look for (shape, center, variability and unusual features). You will compute and interpret the mean, median, quartiles, interquartile range and standard deviation, learn which of them resist outliers, and use z-scores to compare values from different distributions.

The second half is about **collecting data**: how to write a good investigative question, how random sampling lets us generalize from a sample to a population, how bias creeps in, especially when chance does not choose the sample, and how a well-designed experiment with random assignment lets us conclude cause and effect. These ideas return in every later unit, because the way data were collected decides what any conclusion is allowed to say.`,
    },
    'stats-u2': {
      overview: `Statistics depends on probability, because random sampling and random assignment make the results of a study uncertain in predictable ways. This unit builds the probability tools that inference relies on.

It begins with two categorical variables: two-way tables, joint, marginal and conditional relative frequencies, and what it means for two variables to be associated. Those same tables then become a natural way into probability: the rules for complements, "and", "or" and "given", mutually exclusive and independent events, and simulation as a way to estimate probabilities when the math is hard.

The second half introduces **random variables**: their distributions, means and standard deviations; the binomial distribution for counts of successes; and the normal distribution for continuous measurements. The unit closes with the most important idea for the rest of the course, the **sampling distribution**: how a statistic varies from sample to sample, and why, by the central limit theorem, sample means are approximately normal.`,
    },
    'stats-u3': {
      overview: `This unit is where statistics starts drawing conclusions about populations from samples. Everything is built on one sampling distribution, that of the sample proportion p̂, and two questions you can ask with it.

The first question is **"What is the value of the parameter?"** It is answered with a confidence interval: an estimate plus or minus a margin of error, with a confidence level that describes how often the method captures the truth. The second question is **"Is there convincing evidence for a claim?"** It is answered with a significance test: assume a null hypothesis, measure how surprising the data would be if it were true (the p-value), and decide.

You will carry out both procedures for one proportion and for the difference between two proportions, learn the two ways a test can go wrong (Type I and Type II errors) and what increases a test's power, and finish with chi-square tests, which extend the comparison of proportions to whole two-way tables. The four-step structure practiced here (state, plan, do, conclude) is used again for means in Unit 4.`,
    },
    'stats-u4': {
      overview: `Unit 3 built inference for categorical data. This unit does the same for quantitative data, where the parameter of interest is a population mean.

The big change is the t-distribution. When we estimate a mean, the population standard deviation σ is almost never known, so we substitute the sample standard deviation s. That substitution adds uncertainty, and t-distributions, with their slightly heavier tails, account for it. Otherwise the reasoning is unchanged: confidence intervals are estimate ± margin of error, and significance tests compare a standardized test statistic with its distribution under the null hypothesis.

You will build intervals and carry out tests for one mean, for the mean difference in a matched pairs design, and for the difference between two independent means. The unit ends with a guide to choosing the right procedure, a skill that the exam rewards directly and that ties together everything in Units 3 and 4.`,
    },
    'stats-u5': {
      overview: `The final unit returns to data exploration, now with two quantitative variables measured on the same individuals. The questions are: is there a relationship, what form does it take, and how well can one variable predict the other?

You will describe scatterplots by form, direction, strength and unusual features; summarize linear association with the correlation r; and fit the least-squares regression line, which gives predictions ŷ = a + bx. Residuals, the differences between observed and predicted values, tell you both how far off individual predictions are and, through a residual plot, whether a line is the right model at all. Finally, r² measures how much of the variation in the response the linear model explains.

Regression in this course is descriptive: the slope, intercept, r and r² describe the data at hand. Interpreting them correctly, in context and with the word "predicted", is the core skill the exam tests.`,
    },
  },
  lessons: {
    // ---------------- Unit 0 ----------------
    'stats-0.1': {
      intro: `A proportion, a percent and a fraction are three ways of describing the same thing: a part compared with a whole. Statistics uses proportions most of all, because probabilities and sample proportions are numbers between 0 and 1.`,
      deeper: [
        {
          title: 'Why the whole matters',
          body: `Every proportion is "part out of whole", and changing the whole changes the meaning. Suppose a school has 200 seniors, 80 of whom play a sport, and 150 athletes in total. Then:

- the proportion of **seniors who play a sport** is 80 ÷ 200 = 0.40;
- the proportion of **athletes who are seniors** is 80 ÷ 150 ≈ 0.533.

Both use the same 80 students in the numerator, but they answer different questions. In Unit 2 this idea becomes conditional probability, where "given that" tells you which whole to divide by. Training yourself to ask "out of which group?" now will save points later.`,
        },
        {
          title: 'Rounding like a statistician',
          body: `Carry full precision through every step and round only the final answer. A good default is three or four decimal places for proportions and probabilities, and a sensible number of digits (with units) for measurements.

When a question gives counts, report proportions as decimals or percents, and when it asks for a count, convert back with part = proportion × whole. An expected count does not have to be a whole number: in an expected-count calculation, 0.275 × 2,000 = 550 is fine, and 0.275 × 30 = 8.25 is fine too, because it describes a long-run average rather than one actual group.`,
        },
      ],
    },
    'stats-0.2': {
      intro: `Two symbols appear in almost every statistics formula: the square root and the capital Greek letter sigma, Σ, which means "add up". Reading them fluently turns long formulas into short recipes.`,
      deeper: [
        {
          title: 'Reading a formula from the inside out',
          body: `Treat a formula like a set of nested instructions. For the sample standard deviation

s = √( Σ(x_{i} − x̄)² / (n − 1) )

work from the innermost parentheses outward:

1. For each value x_{i}, subtract the mean x̄ (a deviation).
2. Square each deviation.
3. Add the squared deviations (the Σ).
4. Divide by n − 1.
5. Take the square root.

Every standard error in this course follows the same pattern: something is computed inside the root first, and only then is the root taken.`,
        },
        {
          title: 'Calculator habits that prevent errors',
          body: `Most wrong answers on numeric questions come from the keyboard, not from the statistics. Three habits help:

- Put the entire expression under a root in parentheses, and check that the closing parenthesis is where you meant it to be.
- Store intermediate results in memory instead of retyping rounded values.
- Estimate first. If p̂ = 0.4 and n = 96, then √(0.4 × 0.6 / 96) must be a small number (here 0.05); a result like 5 or 0.5 signals a misplaced parenthesis.`,
        },
      ],
    },
    'stats-0.3': {
      intro: `Lines are the simplest models of how one quantity changes with another. In Unit 5 you will fit lines to data; here you review how to read and build one.`,
      deeper: [
        {
          title: 'Slope as a rate, intercept as a starting value',
          body: `In y = a + bx the slope b is a **rate**: the change in y for each one-unit increase in x, measured in "y units per x unit". The intercept a is the value of y when x = 0.

Always attach units. "The slope is 2" says little; "each additional mile adds $2 to the fare" says everything. In statistics the intercept may or may not have a sensible meaning: if x = 0 is far outside the values you have, as with a height of 0 cm, the intercept is just a number that positions the line.`,
        },
        {
          title: 'From two points to an equation',
          body: `Given two points (x_{1}, y_{1}) and (x_{2}, y_{2}):

1. slope b = (y_{2} − y_{1}) ÷ (x_{2} − x_{1});
2. intercept a = y_{1} − b·x_{1} (use either point);
3. check with the other point.

The same algebra reappears in regression: the least-squares line always passes through the point (x̄, ȳ), so once you know the slope you can find the intercept with a = ȳ − b·x̄.`,
        },
      ],
    },

    // ---------------- Unit 1 ----------------
    'stats-1.1': {
      intro: `Statistics is the science of learning from data in the presence of variability. Its central move is to study a part (a sample) in order to say something trustworthy about a whole (a population).`,
      deeper: [
        {
          title: 'The statistical problem-solving process',
          body: `Every investigation in this course follows the same four stages:

1. **Ask** an investigative question about a population.
2. **Collect** data in a way that can answer it (a sample survey, an experiment or an observational study).
3. **Analyze** the data with graphs and summary statistics, and with probability-based methods when you draw inferences.
4. **Interpret** the results and answer the original question, in context.

Exam questions often focus on one stage, but they expect the stages to fit together: the conclusion must answer the question that was asked, about the population that was actually sampled.`,
        },
        {
          title: 'Variability is the reason statistics exists',
          body: `If every individual were identical, a sample of one would tell you everything. Real populations vary, and different samples from the same population give different results. This sample-to-sample variability is not a mistake; it is predictable, and much of the course is about measuring it. Later units will turn it into margins of error and p-values. For now, remember that a statistic from one sample is an estimate, not the exact value for the population.`,
        },
      ],
    },
    'stats-1.2': {
      intro: `Before choosing a graph or a summary, identify what each piece of data describes and what kind of variable it is. That one decision determines almost every method that follows.`,
      deeper: [
        {
          title: 'Choosing tools by variable type',
          body: `| Variable type | Graphs | Summaries |
| Categorical | bar chart, pie chart | counts, proportions (relative frequencies) |
| Quantitative | dotplot, stem-and-leaf, histogram, boxplot | mean, median, quartiles, SD, IQR, range |

The same characteristic can sometimes be recorded either way. Age in years is quantitative; age group ("13–15", "16–18") is categorical. The question you want to answer should decide how you record it.`,
        },
        {
          title: 'Parameters, statistics and notation',
          body: `Greek letters usually stand for parameters and Roman letters for statistics:

| | Population (parameter) | Sample (statistic) |
| Mean | μ | x̄ |
| Standard deviation | σ | s |
| Proportion | p | p̂ |

A parameter is a fixed number, usually unknown. A statistic is known once you have the data, but it changes from sample to sample. Inference (Units 3 and 4) uses statistics to estimate parameters and to test claims about them.`,
        },
      ],
    },
    'stats-1.3': {
      intro: `A categorical variable is summarized by how often each category occurs. Tables organize the counts; bar charts and pie charts make them visible at a glance.`,
      deeper: [
        {
          title: 'Reading and building relative frequency tables',
          body: `A relative frequency is a count divided by the total, so the relative frequencies of all categories add to 1 (up to rounding). Relative frequencies let you compare groups of different sizes and convert easily between proportions and percents.

When you build a bar chart, label both axes, keep the bars the same width, and leave gaps between them to show that the categories are separate. The order of the categories is a choice; ordering bars from tallest to shortest often makes the most common categories easiest to see.`,
        },
        {
          title: 'Bar charts or pie charts?',
          body: `Both display one categorical variable, but they emphasize different things. A pie chart shows how a whole is split into parts, and works only when the categories cover the whole and do not overlap. A bar chart works for any set of counts or proportions, and it makes comparisons between categories easier, because judging the heights of bars is easier than judging the angles of slices. When the question asks you to compare categories, a bar chart is usually the better choice.`,
        },
      ],
    },
    'stats-1.4': {
      intro: `The distribution of a quantitative variable tells you what values it takes and how often. Dotplots, stem-and-leaf plots and histograms each show a distribution, with different levels of detail.`,
      deeper: [
        {
          title: 'Choosing a bin width',
          body: `A histogram groups values into bins, and the choice of bin width shapes the picture. Bins that are too wide hide the detail: a bimodal distribution can look unimodal. Bins that are too narrow show noise: random bumps can look like real features. A useful habit is to try two or three widths and check that the overall shape stays the same. On the exam, read the bin labels carefully before counting values in a bin.`,
        },
        {
          title: 'Split stems and back-to-back plots',
          body: `If a stem-and-leaf plot puts too many leaves on each stem, split each stem in two: the first copy holds leaves 0–4 and the second 5–9. A back-to-back stem-and-leaf plot shares one column of stems between two groups, with one group's leaves to the left and the other's to the right, which makes it easy to compare two small data sets. Whatever the layout, include a key such as "6 | 2 means 62 points".`,
        },
      ],
    },
    'stats-1.5': {
      intro: `Describing a distribution is a core AP skill. A complete description covers shape, center, variability and unusual features, and ties each one to the context of the data.`,
      deeper: [
        {
          title: 'A model description',
          body: `Here is the kind of answer that earns full credit:

"The distribution of the number of rainy days per month is roughly symmetric and unimodal, with a center of about 6 days. The number of rainy days varies from 3 to 12, with most months between 3 and 10. The month with 12 rainy days appears to be an outlier; apart from it, there are no gaps or clusters."

Notice that it names the variable, gives numbers for center and spread, and explicitly addresses unusual features, even if only to say there are none.`,
        },
        {
          title: 'Words to use, and words to avoid',
          body: `Use the precise shape words: skewed right, skewed left, approximately symmetric, unimodal, bimodal, approximately uniform. Avoid "normal" when describing a sample's graph; a histogram can look approximately normal, but "normal" is the name of a specific model (Unit 2). Avoid "even" or "average" as shape words. And keep descriptions about the distribution, not individuals: say "most months had 4 to 8 rainy days", not "the months had a lot of rain".`,
        },
      ],
    },
    'stats-1.6': {
      intro: `How data are collected decides what a study can conclude. This lesson sets out the three components of an investigative question and the main types of studies.`,
      deeper: [
        {
          title: 'Writing an investigative question',
          body: `A strong investigative question can be answered with data and names everything needed to plan the analysis. Compare:

- Weak: "Do students sleep enough?"
- Strong: "Is there convincing evidence that the mean nightly sleep time of all students at North High is less than 8 hours?"

The strong version names the variable (nightly sleep time), the parameter (the mean), the direction (less than 8 hours) and the population (all students at North High). Writing the question before looking at the data protects you from tailoring the question to fit a pattern that might be due to chance.`,
        },
        {
          title: 'Observational studies are still useful',
          body: `Observational studies cannot establish cause and effect, but they are often the only ethical or practical option. You cannot assign people to smoke, or randomly assign students to schools. Observational studies can show associations, suggest hypotheses, and describe populations accurately when the sample is random. Prospective studies, which follow individuals forward in time, avoid relying on memory or old records, while retrospective studies can answer questions quickly using data that already exist.`,
        },
      ],
    },
    'stats-1.7': {
      intro: `Measures of center describe a typical value; measures of position describe where a value sits within the distribution. The mean, median, quartiles and percentiles are the main tools.`,
      deeper: [
        {
          title: 'Mean as balance point, median as halfway point',
          body: `The mean is the balance point of the distribution: if each value were a weight on a number line, the line would balance at x̄. Because every value contributes, one extreme value can move the mean a long way. The median is the halfway point: half of the ordered values are at or below it and half at or above. Moving the largest value even further out does not change the median at all.

This difference is why the mean and median can tell different stories about the same data, and why comparing them hints at the shape of the distribution (Lesson 1.10).`,
        },
        {
          title: 'Finding quartiles by hand',
          body: `To find Q1 and Q3:

1. Order the data and find the median.
2. Split the data into a lower half and an upper half. If n is odd, leave the median out of both halves.
3. Q1 is the median of the lower half and Q3 is the median of the upper half.

Calculators and software may use slightly different conventions, so their quartiles can differ a little from the hand method. Either is accepted on the exam, as long as your work is consistent.`,
        },
      ],
    },
    'stats-1.8': {
      intro: `Two data sets can share the same center and still be very different. Measures of variability (the range, the interquartile range and the standard deviation) describe how spread out the values are.`,
      deeper: [
        {
          title: 'What the standard deviation measures',
          body: `The standard deviation is built from deviations, x_{i} − x̄, the distances of the values from their mean. The deviations always add to zero, so they are squared before being added, then averaged (dividing by n − 1), and finally the square root returns the result to the original units.

The resulting s can be read as a typical distance of the values from the mean. Larger s means more spread. s = 0 only when all the values are identical, and s has the same units as the data, so always report it with units.`,
        },
        {
          title: 'Why divide by n − 1?',
          body: `The sample mean is, on average, closer to the data than the population mean is, so squared deviations measured from x̄ tend to be a little too small. Dividing by n − 1 instead of n corrects for this, so s² does not systematically underestimate the population variance σ². The number n − 1 is called the **degrees of freedom**: once x̄ is known, only n − 1 of the deviations are free to vary, because they must add to zero. Degrees of freedom return in Unit 4 with the t-distributions.`,
        },
      ],
    },
    'stats-1.9': {
      intro: `Outliers can change some summaries dramatically and others hardly at all. This lesson gives two rules for identifying outliers, explains resistance, and shows how summaries respond when units change.`,
      deeper: [
        {
          title: 'Choosing summaries that fit the data',
          body: `Because the median and IQR are resistant, they are the better summaries for strongly skewed distributions or distributions with outliers. The mean and standard deviation use every value, which makes them efficient summaries for roughly symmetric distributions without outliers, and they are the basis of the normal model and of the inference methods in later units.

When a question asks you to justify a choice of summary, connect it to the shape: "Because the distribution is strongly skewed right with a high outlier, the median and IQR describe a typical value and spread better than the mean and standard deviation."`,
        },
        {
          title: 'Linear transformations in practice',
          body: `If every value is transformed by y = a + bx, the summaries change predictably:

- centers and positions (mean, median, quartiles) become a + b × (old value);
- spreads (range, IQR, standard deviation) become |b| × (old value), and adding a does not change them;
- shape does not change when b is positive.

Example: temperatures with mean 20 °C and SD 5 °C convert to Fahrenheit with F = 32 + 1.8C. The mean becomes 32 + 1.8(20) = 68 °F and the SD becomes 1.8(5) = 9 °F.`,
        },
      ],
    },
    'stats-1.10': {
      intro: `A boxplot draws the five-number summary. It is especially useful for comparing groups and for spotting skew and outliers quickly.`,
      deeper: [
        {
          title: 'Drawing a boxplot step by step',
          body: `1. Find the five-number summary.
2. Compute the fences, Q1 − 1.5·IQR and Q3 + 1.5·IQR, to check for outliers.
3. Draw a scaled, labeled number line.
4. Draw the box from Q1 to Q3 with a line at the median.
5. Extend each whisker to the most extreme value that is not an outlier.
6. Mark each outlier with a separate symbol.

A boxplot without a labeled scale cannot be read, so the axis is part of the graph, not decoration.`,
        },
        {
          title: 'What a boxplot can and cannot show',
          body: `Each of the four sections of a boxplot (lower whisker, two halves of the box, upper whisker) contains about a quarter of the data. A long section means those values are spread out, not that there are more of them, which is one of the most common misreadings. A boxplot also cannot show the number of values, gaps, clusters or more than one peak, so a dotplot or histogram is better when you need those details.`,
        },
      ],
    },
    'stats-1.11': {
      intro: `Comparing distributions means making explicit comparisons, not writing two separate descriptions. Good comparisons use comparative language and numbers for each feature.`,
      deeper: [
        {
          title: 'A complete comparison',
          body: `"The median score for Class A (77 points) is greater than the median score for Class B (71 points). The IQR for Class A (14 points) is slightly less than for Class B (15 points), so Class A's middle 50% of scores is a little less spread out. Both distributions are roughly symmetric, and neither has outliers."

The words "greater than" and "less than" are what make this a comparison. Two parallel descriptions, one per class, do not earn credit for comparing even if every number is correct.`,
        },
        {
          title: 'Comparisons are descriptive, not inferential',
          body: `When you compare two samples, you are describing those data. Whether a difference is large enough to be convincing evidence of a difference between the populations is an inference question, answered with the methods of Units 3 and 4. Until then, avoid words like "significantly" and claims about all students; stick to what the data in front of you show.`,
        },
      ],
    },
    'stats-1.12': {
      intro: `Random sampling lets chance, not people, choose the sample. That is what makes a sample representative on average, and what allows probability to describe how far a statistic is likely to be from the parameter.`,
      deeper: [
        {
          title: 'Describing how to take a random sample',
          body: `A complete description of a sampling method is specific enough that someone else could carry it out. For an SRS of 50 students from a school of 1,200:

1. Obtain a list of all 1,200 students and number them 1 to 1,200.
2. Use a random number generator to select 50 different integers from 1 to 1,200, ignoring repeats.
3. Survey the 50 students whose numbers were selected.

For stratified and cluster samples, say what the strata or clusters are, how many units are randomly selected from each stratum (or how many clusters are selected), and how.`,
        },
        {
          title: 'Precision and cost',
          body: `Stratifying helps when the strata differ from one another on the response, because each stratum is then represented in the right proportion and the estimate varies less from sample to sample. Cluster sampling usually gives less precise estimates than an SRS of the same size, since individuals within a cluster tend to be alike, but it can be far cheaper and easier. In practice, choosing a method is a trade-off between precision, cost and convenience.`,
        },
      ],
    },
    'stats-1.13': {
      intro: `Bias is a systematic error: a sampling method that tends to overestimate or underestimate the parameter every time it is used. Recognizing bias and its likely direction is a frequent exam task.`,
      deeper: [
        {
          title: 'Bias versus variability',
          body: `Think of an archery target. **Bias** is aiming at the wrong spot: the arrows cluster away from the bullseye. **Variability** is the scatter of the arrows around wherever they cluster. A larger sample reduces variability, so the estimates cluster more tightly, but it does nothing to move the cluster toward the bullseye. A huge biased sample simply gives a very precise wrong answer.`,
        },
        {
          title: 'Explaining bias in context',
          body: `A full-credit explanation names the bias, describes the mechanism in context, and states the direction:

"This is voluntary response bias. People who feel strongly that school should start later are more likely to call the station, so the 92% figure probably overestimates the proportion of all town residents who support a later start."

Wording of questions matters too. A question such as "Don't you agree that…" invites agreement and creates response bias toward "yes".`,
        },
      ],
    },
    'stats-1.14': {
      intro: `An experiment deliberately imposes treatments in order to observe their effect. Its design (comparison, random assignment, replication and control) is what allows a cause-and-effect conclusion.`,
      deeper: [
        {
          title: 'Describing a completely randomized experiment',
          body: `A complete description includes how treatments are assigned and what is measured:

1. Number the 40 volunteers 1 to 40.
2. Use a random number generator to select 20 different numbers; those volunteers use the sleep app, and the other 20 use a placebo app that looks the same.
3. Keep other conditions the same for both groups (same instructions, same bedtime routine, same length of study).
4. Measure each volunteer's time to fall asleep, and compare the mean times of the two groups.

Writing names on identical slips and drawing 20 without replacement is an equally valid random mechanism.`,
        },
        {
          title: 'Statistically significant differences',
          body: `Even if a treatment has no effect, random assignment produces groups whose responses differ a little by chance. A difference between treatment groups is called statistically significant when it is too large to be plausibly explained by random assignment alone. Units 3 and 4 make this precise with hypothesis tests. For now, the key idea is that random assignment is what allows us to judge the role of chance at all.`,
        },
      ],
    },
    'stats-1.15': {
      intro: `A z-score converts a value into "standard deviations from the mean", giving a common scale for comparing values from different distributions.`,
      deeper: [
        {
          title: 'What standardizing does to a distribution',
          body: `If you convert every value in a distribution to a z-score, the new distribution has mean 0 and standard deviation 1, and the same shape as before. Standardizing subtracts the mean (a shift) and divides by the standard deviation (a rescaling), exactly the linear transformation from Lesson 1.9.

In Unit 2, z-scores become the key to normal distribution calculations: for an approximately normal distribution, a z-score tells you what proportion of values lies below a given value.`,
        },
        {
          title: 'Working backward from a z-score',
          body: `Rearranging z = (x − μ) ÷ σ gives x = μ + zσ. If a class's mean is 74 with SD 4, a score with z = −1.5 is 74 + (−1.5)(4) = 68 points. Questions of the form "what score is 2 standard deviations above the mean?" use this rearrangement, and so do the percentile calculations in Unit 2.`,
        },
      ],
    },
    'stats-1.16': {
      intro: `What a study can claim depends on two features of its design: whether units were randomly selected, and whether treatments were randomly assigned.`,
      deeper: [
        {
          title: 'The scope of inference',
          body: `**Random selection** supports generalizing to the population that was sampled, and only that population. A random sample of students at one school says nothing reliable about students at other schools.

**Random assignment** supports cause-and-effect conclusions, but only for units like those in the experiment. Most experiments use volunteers, so their causal conclusions apply to people like the volunteers. A study with both random selection and random assignment supports both kinds of conclusion; such studies are rare but ideal.`,
        },
        {
          title: 'Spotting a confounding variable',
          body: `To propose a confounding variable, look for something that plausibly influences the response and that differs between the groups being compared. Then describe both links. A complete answer for the breakfast study might read:

"Students from households with more structured morning routines may be more likely to eat breakfast, and those routines may also be linked to better study habits and higher grades. So the difference in grades might be due to household routines rather than breakfast."`,
        },
      ],
    },
    'stats-1.17': {
      intro: `Some sources of variation are known in advance. Blocking groups similar experimental units so that this variation does not obscure the treatment effect.`,
      deeper: [
        {
          title: 'Why blocking makes comparisons sharper',
          body: `In a completely randomized design, differences among units (fast and slow runners, younger and older students) add noise to the comparison of treatments. In a block design, treatments are compared within blocks of similar units, so the variation between blocks is separated out. The treatment effect then stands out more clearly against a smaller amount of unexplained variation.

The trade-off is that blocking only helps when the blocking variable is associated with the response.`,
        },
        {
          title: 'Matched pairs in practice',
          body: `There are two versions of the matched pairs design. In the first, units are paired by similarity (twins, or students with similar prior scores) and a coin flip decides which member of each pair gets each treatment. In the second, every unit gets both treatments in a random order, so each unit acts as its own control. The analysis of matched pairs data uses the differences within each pair, which you will meet again in Unit 4 (paired t-procedures).`,
        },
      ],
    },

    // ---------------- Unit 2 ----------------
    'stats-2.1': {
      intro: `When a study records two categorical variables for each individual, the natural question is whether they are related. A two-way table organizes the data so that question can be answered.`,
      deeper: [
        {
          title: 'Reading association from a segmented bar chart',
          body: `In a segmented bar chart every bar represents 100% of one group, divided into the categories of the other variable. If the segments are about the same size in every bar, the conditional distributions match and there is little or no association. If the segments change noticeably from bar to bar, the variables are associated.

In the smartwatch data the "yes" segment shrinks from 60% in 9th grade to 40% in 11th grade, so grade and smartwatch ownership are associated in this sample. A mosaic plot shows the same information but also makes each bar's width proportional to the size of its group.`,
        },
        {
          title: 'Which variable goes where?',
          body: `When one variable might help explain the other, compute the conditional distributions of the response within each category of the explanatory variable. For grade and smartwatch ownership, grade is the natural explanatory variable, so compare the proportion of owners **within each grade**. Conditioning the other way, the distribution of grade within owners and non-owners, is also legitimate, but it answers a different question. State clearly which distribution you are comparing.`,
        },
      ],
    },
    'stats-2.2': {
      intro: `A two-way table supports three kinds of relative frequency. Each one answers a different question, and the difference lies entirely in the denominator.`,
      deeper: [
        {
          title: 'Marginal and conditional distributions',
          body: `The **marginal distribution** of a variable comes from the totals in the margins of the table: it describes one variable while ignoring the other. A **conditional distribution** describes one variable within a single category of the other.

For the smartwatch table, the marginal distribution of ownership is 50% yes, 50% no. The conditional distribution of ownership for 9th graders is 60% yes, 40% no. Comparing conditional distributions across groups is how association is detected, and those comparisons become the basis for the chi-square tests of Unit 3.`,
        },
        {
          title: 'From relative frequencies to probabilities',
          body: `If one individual is chosen at random from the table, every relative frequency becomes a probability: a joint relative frequency is P(A and B), a marginal relative frequency is P(A), and a conditional relative frequency is P(A | B). This is why two-way tables are the most useful tool for probability questions involving "given that": restrict to the row or column you are given, and the denominator takes care of itself.`,
        },
      ],
    },
    'stats-2.3': {
      intro: `Probability describes the long-run behavior of random processes. When the exact calculation is difficult, a simulation can estimate a probability by imitating the process many times.`,
      deeper: [
        {
          title: 'A complete simulation design',
          body: `Here is a full design for estimating the probability that a 70% free-throw shooter makes at least 4 of 5 shots:

1. **Assign:** let the digits 0–6 represent a made shot and 7–9 a miss, so each shot has a 0.7 chance of being made.
2. **Trial:** read five random digits (one per shot) and record whether at least four are made shots.
3. **Repeat and estimate:** perform many trials (say 200). The estimated probability is the number of trials with at least four made shots divided by the number of trials.

The assignment must match the real probabilities exactly, and each trial must imitate one complete repetition of the real process.`,
        },
        {
          title: 'How many trials are enough?',
          body: `By the law of large numbers, estimates from simulations improve as the number of trials grows, but the improvement is gradual. Quadrupling the number of trials roughly halves the typical size of the error. A simulation with 50 trials gives a rough idea; one with tens of thousands, which is easy on a computer, gives an estimate good to about two decimal places. When interpreting a simulation, remember that a different set of random numbers would give a slightly different estimate.`,
        },
      ],
    },
    'stats-2.4': {
      intro: `The basic rules of probability follow from one idea: the probabilities of all possible outcomes must add to 1. The complement rule is the first and most useful consequence.`,
      deeper: [
        {
          title: 'Why the complement rule works',
          body: `An event and its complement split the sample space into two non-overlapping parts, so P(E) + P(not E) = 1. Rearranging gives P(not E) = 1 − P(E).

For "at least one 6 in four rolls", the complement is "no 6 in any of the four rolls". Each roll misses 6 with probability 5/6, and the rolls are independent, so P(no 6) = (5/6)^{4} ≈ 0.482 and P(at least one 6) ≈ 1 − 0.482 = 0.518. Listing all the ways to get one, two, three or four 6s would take much longer and invite mistakes.`,
        },
        {
          title: 'Probabilities from counts',
          body: `When all outcomes are equally likely, a probability is a count: favorable outcomes divided by total outcomes. Use this only when "equally likely" is justified by the situation: a fair die, a well-shuffled deck, or a random selection from a list. For real-world events such as rain or a team winning, probabilities come from long-run relative frequencies (data) or from models, not from counting possibilities.`,
        },
      ],
    },
    'stats-2.5': {
      intro: `Two events are mutually exclusive when they cannot occur together. Recognizing this property simplifies the addition rule, and distinguishing it from independence avoids a classic mistake.`,
      deeper: [
        {
          title: 'Mutually exclusive versus independent',
          body: `These two ideas sound similar but are almost opposites:

| | Mutually exclusive | Independent |
| Meaning | A and B cannot both happen | knowing A happened doesn't change the chance of B |
| Test | P(A ∩ B) = 0 | P(B given A) = P(B), or P(A ∩ B) = P(A)·P(B) |
| Example | one card is a heart and a club | two separate coin flips are both heads |

If A and B are mutually exclusive and each has a positive probability, then learning that A happened tells you that B did not, so they cannot be independent.`,
        },
        {
          title: 'Justifying your answer',
          body: `Exam questions usually ask you to justify, not just state. For mutually exclusive events, give the joint probability and a reason in context: "P(heart and club) = 0, because a single card cannot be both suits, so the events are mutually exclusive." For events that are not mutually exclusive, give an example outcome in both: "The king of hearts is both a heart and a king, so P(heart and king) = 1/52 ≠ 0."`,
        },
      ],
    },
    'stats-2.6': {
      intro: `Conditional probability updates a probability using new information. Restricting attention to the cases where the condition holds is the whole idea.`,
      deeper: [
        {
          title: 'Tree diagrams step by step',
          body: `Tree diagrams are ideal for processes that happen in stages. For drawing two cards without replacement:

- The first branch splits into red (26/52) and black (26/52).
- From "red", the second branch splits into red (25/51) and black (26/51), because one red card is gone.

Multiply along a path to get the probability of that sequence: P(red, red) = (26/52)(25/51) ≈ 0.245. Add the probabilities of all paths that lead to the event you want. The probabilities on each set of branches must add to 1, which is a quick check on your tree.`,
        },
        {
          title: 'Reversing a conditional',
          body: `Questions such as "given a positive test, what is the probability of the disease?" reverse the direction of the information you are given. Build a tree (or a two-way table of a hypothetical 10,000 people), find P(positive) by adding every path that ends in a positive result, and then divide:

P(disease | positive) = P(disease and positive) ÷ P(positive).

When the condition is rare, this probability can be surprisingly small even for an accurate test, because most positive results come from the much larger group without the condition.`,
        },
      ],
    },
    'stats-2.7': {
      intro: `Independence means that one event carries no information about another. When events are independent, "and" probabilities simplify to products.`,
      deeper: [
        {
          title: 'Checking independence from data',
          body: `To check whether two events are independent using a two-way table, compare a conditional probability with the corresponding unconditional one. For the smartwatch data, P(owns | 9th) = 0.60 but P(owns) = 0.50. Since these differ, the events are not independent: knowing a student is a 9th grader changes the chance that they own a smartwatch.

With sample data, small differences can arise by chance even when there is no association in the population. Deciding whether a difference is large enough to be convincing is a question for the chi-square tests of Unit 3.`,
        },
        {
          title: 'Using the addition rule',
          body: `The general addition rule, P(A ∪ B) = P(A) + P(B) − P(A ∩ B), works for all events. Adding P(A) and P(B) counts the outcomes in both events twice, so the overlap is subtracted once. For the smartwatch table:

P(9th or owner) = 50/150 + 75/150 − 30/150 = 95/150 ≈ 0.633.

Check with a direct count: 50 ninth graders plus the 45 owners in other grades make 95 students.`,
        },
      ],
    },
    'stats-2.8': {
      intro: `A random variable assigns a number to each outcome of a random process, and its probability distribution tells you how likely each value is.`,
      deeper: [
        {
          title: 'Checking a probability distribution',
          body: `A table is a valid probability distribution for a discrete random variable only if every probability is between 0 and 1 and the probabilities add to exactly 1. A common exam question gives a table with one missing probability: find it by subtracting the sum of the others from 1.

Graph a discrete distribution as a probability histogram, with the values of X on the horizontal axis and bars whose heights are the probabilities. Its shape (symmetric, skewed) is described in the same words you used for data in Unit 1.`,
        },
        {
          title: 'Discrete and continuous random variables',
          body: `A discrete random variable takes separate values that can be listed, such as counts. A continuous random variable takes any value in an interval, such as a time or a weight. For a continuous variable, probabilities are areas under a density curve, and the probability of any single exact value is 0, so P(X < 5) and P(X ≤ 5) are equal. For a discrete variable they usually differ, which is why the wording "less than" and "at most" must be read carefully.`,
        },
      ],
    },
    'stats-2.9': {
      intro: `The mean (expected value) and standard deviation of a random variable summarize its long-run behavior, just as x̄ and s summarize a set of data.`,
      deeper: [
        {
          title: 'Expected value as a weighted average',
          body: `The expected value weights each possible value by its probability. For the club-meeting example:

μ_{X} = 0(0.1) + 1(0.3) + 2(0.4) + 3(0.2) = 1.7 meetings.

If a member's weeks follow this distribution over a long period, their average number of meetings per week will settle near 1.7. Expected value is the basis for decisions about games and insurance: a raffle whose expected net gain is negative will, in the long run, cost each buyer money on average.`,
        },
        {
          title: 'Computing the standard deviation',
          body: `For the same distribution, find each squared deviation from the mean, weight it by its probability, add, and take the square root:

σ_{X}² = (0 − 1.7)²(0.1) + (1 − 1.7)²(0.3) + (2 − 1.7)²(0.4) + (3 − 1.7)²(0.2) = 0.289 + 0.147 + 0.036 + 0.338 = 0.81,

so σ_{X} = √0.81 = 0.9 meetings. Like the sample SD, σ_{X} measures a typical distance from the mean, but it describes the random process itself rather than one set of observations.`,
        },
      ],
    },
    'stats-2.10': {
      intro: `Many random variables count successes in a fixed number of independent trials. When the probability of success is the same on every trial, that count has a binomial distribution.`,
      deeper: [
        {
          title: 'Checking the binomial conditions in context',
          body: `On the exam, state each condition in the language of the problem:

- **Binary:** each bulb is either defective (success) or not.
- **Independent:** whether one bulb is defective does not affect another (reasonable if the box is a random sample from a very large production run).
- **Number:** there are n = 25 bulbs.
- **Same probability:** each bulb has p = 0.08 of being defective.

"Success" just means the outcome being counted; it does not have to be a good thing.`,
        },
        {
          title: 'Sampling without replacement',
          body: `Strictly, sampling without replacement makes trials dependent, because each selection changes what remains. But when the sample is a small part of the population, the change is tiny. The standard guideline is the **10% condition**: if the sample size is at most 10% of the population size, the trials can be treated as independent. Drawing 25 bulbs from a production run of thousands easily meets it; drawing 10 cards from a 52-card deck does not.`,
        },
      ],
    },
    'stats-2.11': {
      intro: `The binomial probability formula gives the exact probability of any number of successes. Technology makes the calculations quick, but the reasoning must still be shown.`,
      deeper: [
        {
          title: 'Where the formula comes from',
          body: `Any particular sequence of 4 made shots and 1 miss, such as make-make-make-make-miss, has probability (0.7)^{4}(0.3)^{1} because the shots are independent. There are (5 choose 4) = 5 such sequences, depending on which shot is missed, and they cannot happen together, so their probabilities add:

P(X = 4) = 5(0.7)^{4}(0.3) ≈ 0.360.

The coefficient (n choose x) counts the arrangements, and the powers give the probability of each arrangement.`,
        },
        {
          title: 'Shape of a binomial distribution',
          body: `A binomial distribution is symmetric when p = 0.5, skewed right when p is small, and skewed left when p is large. As n increases, the distribution becomes more symmetric and bell-shaped for any p that is not extremely close to 0 or 1. This is the first glimpse of a pattern that returns in Unit 3: the sampling distribution of a sample proportion is approximately normal when the expected numbers of successes and failures are both large enough.`,
        },
      ],
    },
    'stats-2.12': {
      intro: `The normal distribution is a model for many continuous variables. It is completely determined by its mean and standard deviation, and its shape gives exact rules for how values are spread around the center.`,
      deeper: [
        {
          title: 'Models, not data',
          body: `A normal distribution is an idealized model. Real data are never perfectly normal, but many distributions (heights, measurement errors, many test scores) are close enough for the model to give useful answers. Before using a normal model, check that the data are roughly symmetric and unimodal, with no strong skew or outliers. A histogram, dotplot or boxplot is usually enough for that check.`,
        },
        {
          title: 'Using the empirical rule',
          body: `Draw the curve and label the mean and one, two and three standard deviations on each side. For apple weights with μ = 150 g and σ = 10 g:

- about 68% weigh between 140 g and 160 g;
- about 95% weigh between 130 g and 170 g;
- so about 5% are outside 130–170 g, half on each side, and about 2.5% weigh more than 170 g.

Answers from the empirical rule are approximations; use a table or technology when a question needs more precision or involves a value that is not a whole number of standard deviations from the mean.`,
        },
      ],
    },
    'stats-2.13': {
      intro: `For any normal distribution, the area under the curve over an interval is the probability of a value in that interval. Standardizing turns every normal calculation into one with the standard normal distribution.`,
      deeper: [
        {
          title: 'A full area calculation',
          body: `For dog weights with μ = 30.4 kg and σ = 3.6 kg, find P(27 < X < 33):

1. Standardize: z = (27 − 30.4) ÷ 3.6 ≈ −0.94 and z = (33 − 30.4) ÷ 3.6 ≈ 0.72.
2. From Table A, the area to the left of 0.72 is 0.7642, and to the left of −0.94 is 0.1736.
3. Subtract: 0.7642 − 0.1736 = 0.5906.

About 59% of dogs of this breed weigh between 27 and 33 kg. Technology gives a very slightly different answer because it does not round z, and either is accepted.`,
        },
        {
          title: 'A full cutoff calculation',
          body: `To find the weight that separates the heaviest 10%:

1. The area to the left of the cutoff is 0.90.
2. In Table A, the z-value with area closest to 0.90 is about 1.28.
3. Convert back: x = μ + zσ = 30.4 + 1.28(3.6) ≈ 35.0 kg.

Dogs heavier than about 35.0 kg are in the heaviest 10%. When a question gives a percentile instead of a value, you are always working backward like this.`,
        },
      ],
    },
    'stats-2.14': {
      intro: `A statistic varies from sample to sample. Its sampling distribution describes that variation, and it is the foundation of every inference method in the rest of the course.`,
      deeper: [
        {
          title: 'Center and spread of the sampling distribution of x̄',
          body: `For random samples of size n from a population with mean μ and standard deviation σ, the sample mean x̄ has a sampling distribution with

- mean μ_{x̄} = μ (sample means are centered on the population mean), and
- standard deviation σ_{x̄} = σ/√n (both are on the formula sheet).

For the clinic data, σ_{x̄} = 6/√36 = 1 minute. Larger samples give less variable sample means, but the standard deviation only shrinks with the square root of n: to halve it, you need four times as many observations.`,
        },
        {
          title: 'Unbiased statistics',
          body: `A statistic is **unbiased** if the mean of its sampling distribution equals the parameter it estimates. The sample mean and the sample proportion are both unbiased: on average over all random samples, they hit the target. Unbiasedness says nothing about how far a single estimate may be from the parameter; that is described by the spread of the sampling distribution, which shrinks as the sample size grows. A good estimator is both unbiased and has small variability.`,
        },
      ],
    },

    // ---------------- Unit 3 ----------------
    'stats-3.1': {
      intro: `Inference begins with an estimator: a statistic whose value estimates a parameter. Good estimators aim at the truth on average and do not scatter too far from it.`,
      deeper: [
        {
          title: 'Two properties of a good estimator',
          body: `Judge an estimator by its sampling distribution:

- **Center:** an unbiased estimator has a sampling distribution centered at the parameter. For random samples, p̂ is unbiased for p and x̄ is unbiased for μ.
- **Spread:** the less the sampling distribution varies, the closer a typical estimate is to the parameter. For both p̂ and x̄, the spread decreases as the sample size increases.

Bias is a property of the method, so it cannot be fixed after the data are collected, while variability is controlled mostly by the sample size.`,
        },
        {
          title: 'Estimates need context',
          body: `"p̂ = 0.33" is a number; "33% of the 400 sampled teens volunteer regularly, so our estimate of the proportion of all teens in the state who volunteer is 0.33" is an estimate. Always say which population the estimate is about. If the sample was random, that is the population sampled. If it was a convenience or voluntary-response sample, the estimate may be biased, and no amount of calculation will repair it.`,
        },
      ],
    },
    'stats-3.2': {
      intro: `To judge whether a sample proportion is surprising, you need to know how p̂ varies from sample to sample. Its sampling distribution has a known center, a known spread, and, for large enough samples, an approximately normal shape.`,
      deeper: [
        {
          title: 'A complete probability calculation',
          body: `With p = 0.30 and n = 100, the sampling distribution of p̂ has mean 0.30 and standard deviation √(0.30 × 0.70/100) ≈ 0.0458. It is approximately normal because np = 30 and n(1 − p) = 70 are both at least 10. Then

P(p̂ > 0.36): z = (0.36 − 0.30) ÷ 0.0458 ≈ 1.31, and the area to the right is about 0.095.

So a sample with 36% bikers would happen in roughly 1 out of 10 samples even if exactly 30% of all adults bike. That is not particularly unusual.`,
        },
        {
          title: 'Why the conditions matter',
          body: `Each condition supports a different part of the description. **Randomization** makes p̂ unbiased. The **10% condition** justifies the formula for the standard deviation, which assumes independent observations; sampling without replacement from a small population makes p̂ vary less than the formula says. The **normality** (large counts) condition (np ≥ 10 and n(1 − p) ≥ 10) justifies the normal shape; when p is close to 0 or 1 and n is small, the sampling distribution is noticeably skewed.`,
        },
      ],
    },
    'stats-3.3': {
      intro: `A confidence interval gives a range of plausible values for a parameter, together with a measure of how reliable the method is. Before computing one, name the procedure, define the parameter and check the conditions.`,
      deeper: [
        {
          title: 'The four-step structure',
          body: `Every inference question in this course can be answered in four steps:

1. **State:** the parameter (in context) and the confidence level.
2. **Plan:** name the procedure and check its conditions.
3. **Do:** perform the calculations.
4. **Conclude:** interpret the result in context.

Readers score each step. A correct interval with no parameter definition, or with conditions only listed as "random, 10%, large counts", loses credit even when the numbers are right.`,
        },
        {
          title: 'Defining the parameter well',
          body: `A good definition names three things: the kind of parameter, the response, and the population. "p = the proportion" is incomplete. "p = the proportion of all teens in the state who volunteer regularly" is complete. Notice that it refers to the population, not the sample: a confidence interval is never "for p̂", since p̂ is already known exactly.`,
        },
      ],
    },
    'stats-3.4': {
      intro: `A confidence interval for a proportion is the estimate plus or minus a margin of error. The margin of error combines the critical value for the chosen confidence level with the standard error of p̂.`,
      deeper: [
        {
          title: 'Where z∗ comes from',
          body: `For a C% confidence level, z∗ is the value that captures the middle C% of the standard normal distribution, leaving (100 − C)/2 percent in each tail. For 95%, each tail holds 2.5%, so z∗ is the value with area 0.975 to its left, which is 1.96. For 90%, z∗ has area 0.95 to its left, which is about 1.645. Higher confidence requires a larger z∗, and so a wider interval.`,
        },
        {
          title: 'Standard deviation versus standard error',
          body: `The standard deviation of p̂, √(p(1 − p)/n), uses the true proportion p, which we do not know when building an interval. The standard error replaces p with the sample proportion p̂: SE = √(p̂(1 − p̂)/n). It estimates how far p̂ typically is from p. Interpret it in context: "In repeated random samples of 400 teens, the sample proportion who volunteer would typically be about 0.024 from the true proportion."`,
        },
      ],
    },
    'stats-3.5': {
      intro: `A confidence interval is only useful if it is interpreted correctly. Two interpretations are needed: one for the interval you computed, and one for the confidence level of the method.`,
      deeper: [
        {
          title: 'Why "95% confident" and not "95% probability"',
          body: `Before a sample is taken, there is a 95% probability that the interval you are about to compute will capture p. After the interval is computed, p is either in it or not, and nothing random is left; we just do not know which. "Confident" expresses trust in the method that produced the interval, without claiming a probability about this one interval. This is why the confidence level is interpreted as a statement about many intervals from repeated samples.`,
        },
        {
          title: 'Margin of error covers only sampling variability',
          body: `The margin of error accounts for the random variation from one random sample to the next, and nothing else. It does not account for bias from undercoverage, nonresponse, response bias or a poorly worded question. A large, carefully computed interval from a biased sample can miss the true value entirely. Always consider how the data were collected before trusting an interval.`,
        },
      ],
    },
    'stats-3.6': {
      intro: `A significance test weighs evidence against a claim. It starts by writing two competing hypotheses about a parameter and checking that a test procedure is appropriate.`,
      deeper: [
        {
          title: 'The logic of a significance test',
          body: `A significance test works like a trial with a presumption of innocence. The null hypothesis is the presumption: nothing unusual is going on. The test asks whether the data would be surprising if the null hypothesis were true. If they would be very surprising, that is evidence against H₀ and in favor of Hₐ. If not, the evidence is insufficient, which is not the same as proving H₀. The burden of proof is always on the alternative.`,
        },
        {
          title: 'One-sided or two-sided?',
          body: `Choose the direction of Hₐ from the research question, before looking at the data. Use a one-sided alternative only when the question is explicitly about one direction ("more than half", "has decreased"). Use a two-sided alternative when any difference matters ("has changed", "is different"). Choosing the direction after seeing which way the data point would make the p-value misleadingly small.`,
        },
      ],
    },
    'stats-3.7': {
      intro: `The p-value measures how surprising the observed result would be if the null hypothesis were true. It is the bridge between data and decision.`,
      deeper: [
        {
          title: 'Reading a p-value',
          body: `A simulated p-value of 0.023 for the exercise study (as in this lesson) means: if exactly half of all students exercised at least 3.5 hours a week, a random sample of 150 students would show a sample proportion of 0.58 or more only about 2.3% of the time. That is unusual enough to doubt the null hypothesis.

Notice what the p-value is not. It is not the probability that H₀ is true, not the probability that the result happened "by chance", and not the probability of making an error.`,
        },
        {
          title: 'Two-sided p-values',
          body: `For a two-sided alternative, "as extreme or more extreme" means far from the null value in either direction. For a z-statistic, the p-value is the area beyond |z| in both tails, which is twice the one-tail area. A result that is borderline for a one-sided test can therefore fail to be convincing for a two-sided one, which is why the direction must be fixed before the data are seen.`,
        },
      ],
    },
    'stats-3.8': {
      intro: `With the hypotheses, conditions and the meaning of a p-value in place, a complete one-proportion z-test can be carried out from start to finish.`,
      deeper: [
        {
          title: 'A model solution',
          body: `**State:** H₀: p = 0.5, Hₐ: p > 0.5, where p is the proportion of all students at the school who exercise at least 3.5 hours per week; α = 0.05.

**Plan:** one-sample z-test for a population proportion. The 150 students were randomly selected; 150 is less than 10% of the 1,800 students; np₀ = n(1 − p₀) = 75, both at least 10.

**Do:** p̂ = 87/150 = 0.58, z = (0.58 − 0.5) ÷ √(0.5 × 0.5/150) ≈ 1.96, and the p-value is about 0.025.

**Conclude:** because 0.025 < 0.05, reject H₀. There is convincing evidence that more than half of all students at the school exercise at least 3.5 hours per week.`,
        },
        {
          title: 'Statistical significance and practical importance',
          body: `A statistically significant result is one that is unlikely to be due to chance alone. It is not necessarily large or important. With a very large sample, a difference of half a percentage point can be statistically significant while being of no practical interest. With a small sample, an important difference may fail to reach significance. Pair every test with an estimate of the size of the effect, such as a confidence interval, whenever you can.`,
        },
      ],
    },
    'stats-3.9': {
      intro: `Because tests are based on samples, they can reach the wrong decision. Understanding the two kinds of errors, and the power of a test, helps you design better studies.`,
      deeper: [
        {
          title: 'Describing errors in context',
          body: `For the tax example (H₀: p = 0.5, Hₐ: p < 0.5):

- **Type I error:** finding convincing evidence that fewer than half of the town's voters support the tax when in fact half do. A possible consequence: the council drops a proposal that actually has the support of half the voters.
- **Type II error:** not finding convincing evidence that fewer than half support it when in fact fewer than half do. A possible consequence: the council goes ahead with a proposal most voters oppose.

Describe the error in terms of the conclusion and the truth, in context, and then give a realistic consequence.`,
        },
        {
          title: 'Why α and power trade off',
          body: `Lowering α makes it harder to reject H₀, which reduces the chance of a Type I error, but it also makes it harder to reject a false H₀, which reduces power and increases the chance of a Type II error. The only way to reduce both at once is to collect more information: a larger sample shrinks the standard error, so a real difference stands out more clearly. That is why sample size planning is part of designing a good study.`,
        },
      ],
    },
    'stats-3.10': {
      intro: `Comparing two groups means studying a difference of two sample proportions. Its sampling distribution has a mean, a standard deviation and a shape that follow directly from the one-sample case.`,
      deeper: [
        {
          title: 'Why the variances add',
          body: `Each sample proportion varies from sample to sample. When you subtract two independent quantities, their variability does not cancel: a high p̂₁ and a low p̂₂ make the difference even larger. Mathematically, for independent random quantities the variance of a difference is the sum of the variances, so

σ²_{p̂₁−p̂₂} = p₁(1 − p₁)/n₁ + p₂(1 − p₂)/n₂.

Take the square root only at the end.`,
        },
        {
          title: 'Using the sampling distribution',
          body: `For the two towns, the difference p̂₁ − p̂₂ is approximately normal with mean 0.10 and standard deviation about 0.051. So a difference of 0 or less would be about (0 − 0.10)/0.051 ≈ −1.96 standard deviations below the mean, which happens in only about 2.5% of pairs of samples. Calculations like this one are exactly how the tests in Lesson 3.12 judge whether an observed difference is surprising.`,
        },
      ],
    },
    'stats-3.11': {
      intro: `A two-proportion z-interval estimates the difference between two population proportions, or between the success rates of two treatments in an experiment.`,
      deeper: [
        {
          title: 'A model calculation',
          body: `For the fan data, p̂_{teens} = 84/240 = 0.35 and p̂_{adults} = 63/300 = 0.21, so the difference is 0.14. The standard error is

√(0.35 × 0.65/240 + 0.21 × 0.79/300) ≈ √(0.000948 + 0.000553) ≈ 0.0387,

and the 95% interval is 0.14 ± 1.96(0.0387) = 0.14 ± 0.076, or about (0.064, 0.216). Check the conditions first: the successes and failures 84, 156, 63 and 237 are all at least 10.`,
        },
        {
          title: 'Intervals in experiments',
          body: `In a randomized experiment there are no populations being sampled, only treatment groups formed by random assignment. The interval then estimates the difference in the success rates of the two treatments for subjects like those in the experiment. The 10% condition is not needed, because random assignment rather than sampling from a population is the source of the randomness.`,
        },
      ],
    },
    'stats-3.12': {
      intro: `A two-proportion z-test asks whether the difference between two sample proportions is large enough to be convincing evidence of a difference between the populations or treatments.`,
      deeper: [
        {
          title: 'A model solution',
          body: `**State:** H₀: p_{R} = p_{N}, Hₐ: p_{R} > p_{N}, where p_{R} and p_{N} are the proportions of volunteers like these who would finish the course with and without reminders; α = 0.05.

**Plan:** two-sample z-test for a difference in proportions. Treatments were randomly assigned. The combined proportion is p̂_{c} = 116/300 ≈ 0.387, and 150(0.387) ≈ 58 and 150(0.613) ≈ 92 are at least 10.

**Do:** z = (0.453 − 0.320) ÷ √(0.387 × 0.613 × (1/150 + 1/150)) ≈ 2.37, p-value ≈ 0.009.

**Conclude:** because 0.009 < 0.05, reject H₀. There is convincing evidence that reminders increase the proportion of volunteers like these who finish the course.`,
        },
        {
          title: 'Why the test pools and the interval does not',
          body: `A significance test calculates everything assuming H₀ is true. If p₁ = p₂, both samples estimate the same proportion, so the best estimate of it uses all the data at once: the combined proportion. A confidence interval makes no such assumption; its whole purpose is to estimate how different the proportions are, so each sample's own proportion is used in the standard error.`,
        },
      ],
    },
    'stats-3.13': {
      intro: `Chi-square tests compare a whole table of observed counts with the counts expected if there were no difference or no association. Choosing between the two chi-square tests depends on how the data were collected.`,
      deeper: [
        {
          title: 'How the chi-square statistic works',
          body: `For each cell, (Observed − Expected)²/Expected measures how far the observed count is from what H₀ predicts, relative to the size of the expected count. Squaring makes every contribution positive, so χ² can only be 0 or larger. χ² = 0 means the observed table matches the expected table exactly; larger values mean bigger departures from H₀. A large enough χ² gives a small p-value and convincing evidence against H₀.`,
        },
        {
          title: 'Writing hypotheses in words',
          body: `Chi-square hypotheses are written in words because they concern whole distributions:

- **Homogeneity:** "H₀: The distribution of favorite music genre is the same for all three towns. Hₐ: The distributions are not all the same."
- **Independence:** "H₀: Grade level and smartwatch ownership are independent for students at this school. Hₐ: They are associated."

Name the variables and the population(s) every time.`,
        },
      ],
    },
    'stats-3.14': {
      intro: `Carrying out a chi-square test means computing expected counts, the chi-square statistic, its degrees of freedom and the p-value, then concluding in context.`,
      deeper: [
        {
          title: 'Computing the statistic for the smartwatch table',
          body: `Every row total is 50 and every column total is 75, so each expected count is 50 × 75 ÷ 150 = 25. The contributions are

| Grade | Owns: (O − E)²/E | Doesn't own: (O − E)²/E |
| 9th | (30 − 25)²/25 = 1 | (20 − 25)²/25 = 1 |
| 10th | 0 | 0 |
| 11th | (20 − 25)²/25 = 1 | (30 − 25)²/25 = 1 |

so χ² = 4 with df = (3 − 1)(2 − 1) = 2, giving a p-value of about 0.135. Because 0.135 > 0.05, we fail to reject H₀: these data do not give convincing evidence of an association between grade and smartwatch ownership at this school.`,
        },
        {
          title: 'Wording the conclusion',
          body: `The conclusion of a chi-square test is about the populations, in words, and matches the test you chose. For a test of independence: "There is (or is not) convincing evidence of an association between grade level and smartwatch ownership for students at this school." For a test of homogeneity: "There is (or is not) convincing evidence that the distribution of favorite music genre differs among the three towns." Link the p-value to α first, and never conclude that the variables are independent or that the distributions are the same: a large p-value means only that the evidence is not convincing.`,
        },
      ],
    },

    // ---------------- Unit 4 ----------------
    'stats-4.1': {
      intro: `Means of samples are less variable than individual values. The sampling distribution of x̄ quantifies exactly how much less, and tells you when it is approximately normal.`,
      deeper: [
        {
          title: 'A complete probability calculation',
          body: `Clinic wait times have μ = 24 minutes and σ = 6 minutes. For random samples of 36 patients, x̄ has mean 24 and standard deviation 6/√36 = 1 minute, and because n = 36 ≥ 30, its distribution is approximately normal by the central limit theorem, even though the population's shape is unknown. Then

P(x̄ > 25.5): z = (25.5 − 24) ÷ 1 = 1.5, and the area to the right is about 0.0668.

The chance that one randomly chosen patient waits more than 25.5 minutes cannot be found this way: the population's shape is unknown, so no normal calculation is justified for an individual.`,
        },
        {
          title: 'How large is "large enough"?',
          body: `The guideline n ≥ 30 is a rule of thumb, not a law. When the population is roughly symmetric, x̄ is close to normal for much smaller samples, and when the population is normal, x̄ is exactly normal for any n. When the population is strongly skewed or has extreme outliers, the sampling distribution of x̄ may still be noticeably skewed at n = 30, and larger samples are needed before a normal model is reasonable.`,
        },
      ],
    },
    'stats-4.2': {
      intro: `When σ is unknown, intervals for a mean use the sample standard deviation and a t critical value. The result is the one-sample t-interval, the most widely used confidence interval in practice.`,
      deeper: [
        {
          title: 'Reading Table B',
          body: `Table B lists critical values t∗ by degrees of freedom (rows) and tail probability or confidence level (columns). For a 95% interval with n = 16, use the row df = 15 and the column for 95% confidence (upper-tail probability 0.025): t∗ = 2.131.

If the exact df is not in the table, use the next smaller df, which gives a slightly larger t∗ and a slightly wider, conservative interval. Technology gives the exact value for any df.`,
        },
        {
          title: 'Checking the sample data condition',
          body: `With fewer than 30 observations and no information about the population's shape, look at a graph of the sample: a dotplot, stem-and-leaf plot, histogram or boxplot. If it shows no strong skewness and no outliers, it is reasonable to use t-procedures. On the exam, say what you looked at and what you saw: "A dotplot of the 16 battery lives shows no strong skew and no outliers." Simply stating "the data are normal" does not earn credit.`,
        },
      ],
    },
    'stats-4.3': {
      intro: `In a matched pairs design each observation in one group is linked to one in the other. Analyzing the differences within pairs turns two linked samples into one sample.`,
      deeper: [
        {
          title: 'Working through the example',
          body: `For the ten study-method differences (after − before), x̄_{d} = 4.0 points and s_{d} ≈ 2.62 points. With df = 9 and 90% confidence, t∗ = 1.833, so the interval is

4.0 ± 1.833 × 2.62/√10 = 4.0 ± 1.52, or about (2.48, 5.52) points.

Because the entire interval is above 0, it suggests that, for students like these, scores after the new study method are higher on average. Notice that n is the number of pairs, not the total number of scores.`,
        },
        {
          title: 'Why pairing helps',
          body: `Students differ a lot in their quiz scores, but each student's before and after scores are strongly related. Taking differences removes the student-to-student variation, leaving only the variation in how much each student changed. Because that variation is usually much smaller, s_{d} is small, the standard error is small, and the interval is narrow. This is the same idea as blocking in experimental design: compare treatments within similar units.`,
        },
      ],
    },
    'stats-4.4': {
      intro: `A t-interval is interpreted the same way as an interval for a proportion: confidence describes the method, and the interval gives plausible values for the population mean.`,
      deeper: [
        {
          title: 'Plausible values and claims',
          body: `An interval is a set of plausible values for the parameter. If a claimed value lies outside it, the data give convincing evidence against the claim at the matching significance level (a 95% interval matches a two-sided test at α = 0.05). If the claimed value lies inside, the data are consistent with it, but they do not prove it: many other values are plausible too.`,
        },
        {
          title: 'Intervals for individuals versus means',
          body: `A confidence interval for μ describes where the average lies, not where individual values lie. Individual phones vary with a standard deviation of about s = 1.6 hours, while the sample mean varies with a standard error of only s/√n = 0.4 hours. So many individual phones fall outside the interval for the mean. Mixing these up is one of the most common interpretation errors on the exam.`,
        },
      ],
    },
    'stats-4.5': {
      intro: `A significance test for a mean follows the same logic as one for a proportion: state hypotheses about the parameter, check conditions, and measure how surprising the data would be if H₀ were true.`,
      deeper: [
        {
          title: 'Matched pairs hypotheses',
          body: `For paired data, the null hypothesis is usually that the mean difference is 0: on average, the two treatments (or the before and after measurements) give the same response. State the order of subtraction in the parameter's definition, then write the alternative in that direction. If μ_{d} = mean of (after − before) and the question asks whether scores improved, then Hₐ: μ_{d} > 0. With before − after the same question gives Hₐ: μ_{d} < 0.`,
        },
        {
          title: 'Conditions for experiments',
          body: `When the data come from a randomized experiment rather than a random sample, the randomization condition is met by random assignment, and the 10% condition does not apply, because no sample is drawn from a population. The sample data condition is still checked, since t-procedures need the sampling distribution of the statistic to be approximately normal.`,
        },
      ],
    },
    'stats-4.6': {
      intro: `With the test statistic t and its degrees of freedom, the p-value comes from a t-distribution. The decision and conclusion follow the same pattern as for proportions.`,
      deeper: [
        {
          title: 'A model solution',
          body: `**State:** H₀: μ = 355, Hₐ: μ < 355, where μ is the mean volume (mL) of all coffees served in cups labeled 355 mL at this shop; α = 0.05.

**Plan:** one-sample t-test for a population mean. The 20 cups were randomly selected, 20 is less than 10% of all cups served, and a dotplot of the sample shows no strong skew or outliers.

**Do:** t = (351.8 − 355) ÷ (6.2/√20) ≈ −2.31 with df = 19; the p-value is about 0.016.

**Conclude:** because 0.016 < 0.05, reject H₀. There is convincing evidence that the mean volume of coffee in this shop's 355 mL cups is less than 355 mL.`,
        },
        {
          title: 'Estimating p-values from Table B',
          body: `Table B gives only a few tail areas per row, so it brackets the p-value. For t = −2.31 with df = 19, look up |t| = 2.31 in the df = 19 row: it lies between 2.093 (tail area 0.025) and 2.539 (tail area 0.01), so 0.01 < p-value < 0.025. That is enough to decide at α = 0.05. Technology gives the exact value, about 0.016.`,
        },
      ],
    },
    'stats-4.7': {
      intro: `Comparing two independent groups on a quantitative variable means studying the difference of two sample means. Its sampling distribution parallels the one for two proportions.`,
      deeper: [
        {
          title: 'Using the sampling distribution',
          body: `For the two schools, x̄₁ − x̄₂ is approximately normal with mean 0.4 hours and standard deviation √(1.2²/40 + 1.4²/35) ≈ 0.303 hours, because both samples have at least 30 students. The probability that School B's sample mean comes out higher, x̄₁ − x̄₂ < 0, is the area below z = (0 − 0.4)/0.303 ≈ −1.32, about 0.09. Even with a real difference of 0.4 hours, random samples would reverse the order roughly 9% of the time.`,
        },
        {
          title: 'Independent samples',
          body: `These formulas require two independent groups: knowing who is in one sample tells you nothing about who is in the other. Two separate random samples from two schools are independent. Measurements on the same students before and after, or on twins, are not, and need the matched pairs approach from Lessons 4.3 and 4.5.`,
        },
      ],
    },
    'stats-4.8': {
      intro: `A two-sample t-interval estimates the difference between two population means, or between the mean responses to two treatments in an experiment.`,
      deeper: [
        {
          title: 'A model calculation',
          body: `For sleep at the two schools, the difference in sample means is 7.1 − 6.6 = 0.5 hours, and the standard error is √(1.2²/40 + 1.4²/35) ≈ 0.303 hours. Technology gives about 67 degrees of freedom and t∗ ≈ 1.996, so the 95% interval is

0.5 ± 1.996(0.303) = 0.5 ± 0.605, or about (−0.105, 1.105) hours.

Because the interval contains 0, these data do not give convincing evidence of a difference in mean nightly sleep between all students at the two schools.`,
        },
        {
          title: 'Why the degrees of freedom are unusual',
          body: `With two samples, the standard error combines two sample variances, and its distribution is not exactly a t-distribution. A very good approximation uses a t-distribution with a degrees-of-freedom value calculated from both samples, which technology provides and which is usually not a whole number. Using the smaller of n₁ − 1 and n₂ − 1 is a conservative alternative when only a table is available: the interval is a little wider, and test p-values a little larger, than they need to be.`,
        },
      ],
    },
    'stats-4.9': {
      intro: `A two-sample t-test asks whether the difference between two sample means is large enough to be convincing evidence of a difference between the population (or treatment) means.`,
      deeper: [
        {
          title: 'A model solution',
          body: `**State:** H₀: μ_{F} − μ_{W} = 0, Hₐ: μ_{F} − μ_{W} > 0, where μ_{F} and μ_{W} are the mean one-month growths (cm) of seedlings like these given fertilizer and plain water; α = 0.05.

**Plan:** two-sample t-test for a difference in means. Treatments were randomly assigned, and dotplots of both groups show no strong skew or outliers.

**Do:** t = (24.2 − 21.5) ÷ √(3.1²/15 + 3.8²/15) ≈ 2.13; technology gives p ≈ 0.021.

**Conclude:** because 0.021 < 0.05, reject H₀. There is convincing evidence that the fertilizer increases mean growth for seedlings like these. Because treatments were randomly assigned, a cause-and-effect conclusion is justified.`,
        },
        {
          title: 'Tests and intervals together',
          body: `A test answers "is there a difference?"; an interval answers "how big is it?". After rejecting H₀, follow up with a confidence interval to estimate the size of the effect. A two-sided test at significance level α and a (1 − α) confidence interval for the same difference agree: the test rejects H₀: μ₁ − μ₂ = 0 exactly when the interval does not contain 0.`,
        },
      ],
    },
    'stats-4.10': {
      intro: `Choosing the right inference procedure depends on three features of the situation: the goal, the type of response variable, and the structure of the groups.`,
      deeper: [
        {
          title: 'Practice reading the clues',
          body: `- "Estimate the mean number of hours…" → quantitative, one group, estimate: one-sample t-interval for μ.
- "Is there convincing evidence that the proportion who prefer… differs between juniors and seniors?" → categorical, two independent groups, test: two-sample z-test for p₁ − p₂.
- "Each runner ran with both shoe types in random order…" → quantitative, paired: one-sample t on the differences.
- "Is there an association between region and preferred streaming service?" with one random sample → two categorical variables: chi-square test for independence.`,
        },
        {
          title: 'The common thread',
          body: `Every z and t procedure in Units 3 and 4 uses the same two templates:

- **Confidence interval:** statistic ± (critical value) × (standard error of the statistic)
- **Test statistic:** (statistic − parameter) ÷ (standard error of the statistic)

Both appear on the formula sheet. What changes from procedure to procedure is only the statistic, its standard error, and whether the critical value comes from z or t. Chi-square tests are the exception: they use χ² = Σ(Observed − Expected)²/Expected, also on the formula sheet. Once you see the common structure, the "menu" is much less to remember.`,
        },
      ],
    },

    // ---------------- Unit 5 ----------------
    'stats-5.1': {
      intro: `A scatterplot shows the relationship between two quantitative variables measured on the same individuals. Describing it carefully is the first step of any regression analysis.`,
      deeper: [
        {
          title: 'A model description',
          body: `"There is a strong, negative, linear association between 60-meter dash time and long-jump distance for these 12 club runners: runners with faster (lower) dash times tend to jump farther. There are no unusual points."

Each of the four features is present (form, direction, strength, unusual features), and the description names both variables and the individuals. On the exam, a description that leaves out any feature, or gives no context, earns partial credit at best.`,
        },
        {
          title: 'Choosing the explanatory variable',
          body: `The explanatory variable is the one you would use to explain or predict the other, and it goes on the x-axis. Sometimes the choice is natural: hours studied explains test score, not the other way round. Sometimes it depends on the question: to predict jump distance from dash time, dash time is explanatory. Calling a variable "explanatory" does not mean it causes changes in the response; that requires an experiment.`,
        },
      ],
    },
    'stats-5.2': {
      intro: `The correlation r is a single number that measures the direction and strength of a linear association. It is useful, but only when read together with a scatterplot.`,
      deeper: [
        {
          title: 'What r does and does not measure',
          body: `r measures only linear association. A strong curved relationship can have r close to 0, and a curved relationship can also have r close to ±1, so a large r does not prove that a line is the right model. r is also not resistant: one point far from the others can make r much stronger or much weaker. Always look at the scatterplot before reporting r.`,
        },
        {
          title: 'Association, correlation and causation',
          body: `Two variables can be associated because one causes changes in the other, because a third variable influences both (a confounding variable, such as hot weather for ice cream sales and shark attacks), or by coincidence in a small data set. Only a well-designed experiment with random assignment can show causation. In an observational study, even a correlation of 0.95 allows only a statement about association.`,
        },
      ],
    },
    'stats-5.3': {
      intro: `A regression line turns an association into a prediction rule. Used within the range of the data, it gives reasonable predictions; used far outside, it can give nonsense.`,
      deeper: [
        {
          title: 'Defining the variables',
          body: `A regression equation is incomplete without definitions: "ŷ = 59.12 + 4.00x, where x is the number of hours studied and ŷ is the predicted test score (points)." Alternatively, write the variable names into the equation: predicted score = 59.12 + 4.00 (hours studied). Readers on the exam look for the hat (or the word "predicted") and for clear definitions.`,
        },
        {
          title: 'Why extrapolation is risky',
          body: `The data show how the response behaves for x-values between 1 and 8 hours. Nothing in them says whether the same straight-line pattern continues beyond that range, and real relationships often level off or change direction. Test scores cannot exceed 100, so the linear pattern must break down somewhere above 8 hours. Predictions inside the data's range rest on evidence; predictions outside rest on an assumption.`,
        },
      ],
    },
    'stats-5.4': {
      intro: `A residual measures how far an observed value is from its prediction. Residuals describe the accuracy of individual predictions and, plotted together, reveal whether a linear model is appropriate.`,
      deeper: [
        {
          title: 'Interpreting a residual in context',
          body: `For the student who studied 6 hours, the line predicts about 83.1 points, and the residual is about 85 − 83.1 ≈ 1.9 points. A complete interpretation: "This student's actual score was about 1.9 points higher than the score predicted by the regression line for a student who studied 6 hours." Name the direction (higher or lower than predicted), the size, the units and the x-value.`,
        },
        {
          title: 'Reading a residual plot',
          body: `A residual plot removes the linear trend so that what is left is easier to see.

- **Random scatter** around the horizontal line at 0: the linear model captures the pattern.
- **A curve** (residuals positive, then negative, then positive): the relationship is not linear, and a line systematically over- and underpredicts.

Because the least-squares line balances its errors, the residuals always add to 0, so a residual plot is centered on the horizontal axis.`,
        },
      ],
    },
    'stats-5.5': {
      intro: `Among all lines, the least-squares regression line makes the sum of squared residuals as small as possible. Its slope, intercept and r² each have a precise interpretation.`,
      deeper: [
        {
          title: 'Why squared residuals?',
          body: `Positive and negative residuals would cancel if simply added, so the residuals are squared first. Minimizing the sum of squared residuals gives a single, well-defined best line that technology can compute exactly. Because each residual is squared, points far from the pattern count heavily, so always look at the scatterplot before trusting the line.`,
        },
        {
          title: 'Reading computer output',
          body: `Exam questions often give regression output instead of the equation. In a typical table, the row labeled "Constant" or "Intercept" gives a, and the row labeled with the explanatory variable's name gives b (in the "Coef" or "Estimate" column). Output usually also reports r² (often as "R-sq"). From the output, write the equation with the hat and defined variables, and interpret b and r² in context, always with the word "predicted" for the slope.`,
        },
      ],
    },
  },
}
