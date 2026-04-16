export const BASE_POINTS = 100;
export const MAX_TIME_BONUS = 50;
export const TIMER_SECONDS = 10;
export const QUESTIONS_PER_SESSION = 3;

export function calculatePoints(isCorrect: boolean, timeLeft: number): number {
  if (!isCorrect) return 0;
  const timeBonus = Math.round((timeLeft / TIMER_SECONDS) * MAX_TIME_BONUS);
  return BASE_POINTS + timeBonus;
}

export function calculateTimeBonus(timeLeft: number): number {
  return Math.round((timeLeft / TIMER_SECONDS) * MAX_TIME_BONUS);
}

export const MAX_POSSIBLE_SCORE =
  QUESTIONS_PER_SESSION * (BASE_POINTS + MAX_TIME_BONUS);
