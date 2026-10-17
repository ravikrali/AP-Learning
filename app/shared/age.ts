// The age question asked at sign-up. Shared by the app (the form) and the Worker (the decision).
// Only the birth year is ever saved; the month is used once, to work out the age, and dropped.

/** Students younger than this cannot have an account yet. */
export const MIN_AGE = 13

/** Is this a birth month and year a living person could have? */
export function validBirth(year: unknown, month: unknown, now = new Date()): boolean {
  return (
    Number.isInteger(year) && Number.isInteger(month) &&
    (month as number) >= 1 && (month as number) <= 12 &&
    (year as number) >= now.getUTCFullYear() - 110 &&
    ((year as number) < now.getUTCFullYear() || ((year as number) === now.getUTCFullYear() && (month as number) <= now.getUTCMonth() + 1))
  )
}

/**
 * Age in whole years, counted the careful way: in the birthday month the birthday is assumed
 * not to have happened yet, so nobody is ever counted as older than they are.
 */
export function ageFrom(year: number, month: number, now = new Date()): number {
  const years = now.getUTCFullYear() - year
  return now.getUTCMonth() + 1 > month ? years : years - 1
}

export const oldEnough = (year: number, month: number, now = new Date()) => ageFrom(year, month, now) >= MIN_AGE
