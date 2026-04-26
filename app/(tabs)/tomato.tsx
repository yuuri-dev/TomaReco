import { useAppContext } from '@/context/AppContext';
import { getTomatoImage } from '@/utils/level';
import { Image, StyleSheet, Text, View } from 'react-native';

const LEVEL_MESSAGES: Record<number, { title: string; sub: string }> = {
  1: { title: 'まだ青いトマト', sub: 'まずは記録を始めよう！' },
  2: { title: '色づき始めた', sub: '続けることが大事！' },
  3: { title: 'りっぱなトマト', sub: '習慣になってきたね！' },
  4: { title: '熟れたトマト', sub: 'すごい！この調子で！' },
  5: { title: 'トマト王', sub: '伝説の学習者！' },
};

function getMessage(level: number) {
  return LEVEL_MESSAGES[Math.min(level, 5)] ?? LEVEL_MESSAGES[5];
}

export default function TomatoScreen() {
  const { levelInfo } = useAppContext();
  const { level, xpInLevel, xpToNext, xp } = levelInfo;
  const { title, sub } = getMessage(level);
  const progress = xpToNext ? xpInLevel / xpToNext : 1;
  const isMaxLevel = xpToNext === null;

  return (
    <View style={styles.container}>
      <Image source={getTomatoImage(level)} style={styles.tomato} resizeMode="contain" />

      <Text style={styles.levelLabel}>Lv.{level}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>{sub}</Text>

      <View style={styles.xpBlock}>
        <View style={styles.xpRow}>
          <Text style={styles.xpText}>
            {isMaxLevel ? `${xp} XP（MAX）` : `${xpInLevel} / ${xpToNext} XP`}
          </Text>
        </View>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%` as `${number}%` }]} />
        </View>
        {!isMaxLevel && (
          <Text style={styles.nextLabel}>次のレベルまで {(xpToNext ?? 0) - xpInLevel} XP</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  tomato: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff6347',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  sub: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  xpBlock: {
    width: '100%',
    gap: 8,
  },
  xpRow: {
    alignItems: 'flex-end',
  },
  xpText: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: '600',
  },
  barBg: {
    height: 10,
    backgroundColor: '#e8e8e8',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#ff6347',
    borderRadius: 5,
  },
  nextLabel: {
    fontSize: 11,
    color: '#bbb',
    textAlign: 'right',
  },
});
