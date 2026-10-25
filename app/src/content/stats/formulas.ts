// The formulas given on the AP Statistics exam (CED effective Fall 2026, appendix), written out in the app's markup.
export const STATS_SHEET: { title: string; body: string }[] = [
  {
    title: 'I. Descriptive statistics',
    body: 'x̄ = (1/n)·Σx_{i} = Σx_{i} / n\n\ns = √( Σ(x_{i} − x̄)² / (n − 1) )\n\nŷ = a + bx',
  },
  {
    title: 'II. Probability and distributions',
    body:
      'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)\n\nP(A | B) = P(A ∩ B) / P(B)\n\n| Distribution | Mean | Standard deviation |\n| Discrete random variable X | μ_{X} = E(X) = Σx_{i}·P(x_{i}) | σ_{X} = √( Σ(x_{i} − μ_{X})²·P(x_{i}) ) |\n| Binomial, parameters n and p | μ_{X} = np | σ_{X} = √( np(1 − p) ) |\n\nBinomial: P(X = x) = (n choose x)·p^{x}(1 − p)^{n−x}, for x = 0, 1, 2, …, n',
  },
  {
    title: 'III. Sampling distributions and inference',
    body:
      'Standardized test statistic = (statistic − parameter) / (standard error of the statistic)\n\nConfidence interval: statistic ± (critical value)·(standard error of the statistic)\n\nChi-square statistic: χ² = Σ (Observed − Expected)² / Expected',
  },
  {
    title: 'Proportions',
    body:
      '| Statistic | Mean | Standard deviation | Standard error |\n| p̂ | μ_{p̂} = p | σ_{p̂} = √( p(1 − p)/n ) | SE_{p̂} = √( p̂(1 − p̂)/n ) |\n| p̂_{1} − p̂_{2} | p_{1} − p_{2} | √( p_{1}(1 − p_{1})/n_{1} + p_{2}(1 − p_{2})/n_{2} ) | √( p̂_{1}(1 − p̂_{1})/n_{1} + p̂_{2}(1 − p̂_{2})/n_{2} ) |\n\nWhen p_{1} = p_{2} is assumed: SE = √( p̂_{c}(1 − p̂_{c})(1/n_{1} + 1/n_{2}) ), where p̂_{c} = (n_{1}p̂_{1} + n_{2}p̂_{2}) / (n_{1} + n_{2})',
  },
  {
    title: 'Means',
    body:
      '| Statistic | Mean | Standard deviation | Standard error |\n| x̄ | μ_{x̄} = μ | σ_{x̄} = σ/√n | SE_{x̄} = s/√n |\n| x̄_{1} − x̄_{2} | μ_{1} − μ_{2} | √( σ_{1}²/n_{1} + σ_{2}²/n_{2} ) | √( s_{1}²/n_{1} + s_{2}²/n_{2} ) |',
  },
]
