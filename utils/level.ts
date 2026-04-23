import { Record } from '@/type/record';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// XP thresholds for each level (index = level - 1)
const LEVEL_THRESHOLDS = [0, 100, 300, 700, 1500, 3000, 5500, 9000, 14000, 21000];

export function calculateXP(records: Record[]): number {
  if (records.length === 0) return 0;

  const studyDates = [
    ...new Set(records.map((r) => new Date(r.year, r.month, r.day).setHours(0, 0, 0, 0))),
  ].sort((a, b) => a - b);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  let xp = 0;
  let streak = 0;
  let prevMs: number | null = null;

  for (const dateMs of studyDates) {
    if (prevMs === null) {
      streak = 1;
    } else {
      const dayDiff = Math.round((dateMs - prevMs) / MS_PER_DAY);
      if (dayDiff === 1) {
        streak++;
      } else {
        // 空白日分だけペナルティ
        xp = Math.max(0, xp - (dayDiff - 1) * 5);
        streak = 1;
      }
    }
    // 基本10XP + ストリークボーナス3XP/日
    xp += 10 + streak * 3;
    prevMs = dateMs;
  }

  // 最終記録日〜昨日までのペナルティ（今日はまだ学習できるので対象外）
  if (prevMs !== null && prevMs < todayMs) {
    const missed = Math.round((todayMs - prevMs) / MS_PER_DAY) - 1;
    if (missed > 0) xp = Math.max(0, xp - missed * 5);
  }

  return xp;
}

export function xpToLevel(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

export type LevelInfo = {
  level: number;
  xp: number;
  xpInLevel: number;
  xpToNext: number | null;
};

// Lv.1-2: 緑トマト、Lv.3-4: 普通のトマト、Lv.5+: 冠トマト
export function getTomatoImage(level: number) {
  if (level >= 5) return require('@/assets/images/tomato_crown.jpg');
  if (level >= 3) return require('@/assets/images/tomato.jpg');
  return require('@/assets/images/tomato_green.jpg');
}

export function getLevelInfo(xp: number): LevelInfo {
  const level = xpToLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? null;
  return {
    level,
    xp,
    xpInLevel: xp - currentThreshold,
    xpToNext: nextThreshold !== null ? nextThreshold - currentThreshold : null,
  };
}
