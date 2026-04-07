import { Record } from '@/type/record';

export function calculateLongestStreak(records: Record[]): number {
  if (records.length === 0) return 0;
  const unique = [
    ...new Set(records.map((r) => new Date(r.year, r.month, r.day).getTime())),
  ].sort((a, b) => a - b);

  let max = 1;
  let current = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = (unique[i] - unique[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      if (current > max) max = current;
    } else {
      current = 1;
    }
  }
  return max;
}
