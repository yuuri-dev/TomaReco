import ShareCard from '@/components/Share/ShareCard';
import { useAppContext } from '@/context/AppContext';
import { useShare } from '@/hooks/useShare';
import { Record } from '@/type/record';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ViewShot from 'react-native-view-shot';

function calculateLongestStreak(records: Record[]): number {
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

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

export default function StatsScreen() {
  const { records, genres, streak } = useAppContext();
  const { cardRef, shareCard } = useShare();

  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth();

  const monthRecords = records.filter(
    (r) => r.year === thisYear && r.month === thisMonth
  );
  const studyDays = new Set(monthRecords.map((r) => r.day)).size;
  const longestStreak = calculateLongestStreak(records);

  const genreStats = genres
    .map((g) => ({
      genre: g,
      count: records.filter((r) => r.genreId === g.id).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const maxCount = genreStats[0]?.count ?? 1;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 6 + i);
    const hasStudy = records.some(
      (r) =>
        r.year === d.getFullYear() &&
        r.month === d.getMonth() &&
        r.day === d.getDate()
    );
    return { date: d, hasStudy, isToday: i === 6 };
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* シェアカード（オフスクリーン描画用） */}
      <Modal visible={false} transparent>
        <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }}>
          <ShareCard
            streak={streak}
            longestStreak={longestStreak}
            totalRecords={records.length}
          />
        </ViewShot>
      </Modal>

      {/* シェアボタン */}
      <Pressable style={styles.shareButton} onPress={shareCard}>
        <Ionicons name="share-social-outline" size={18} color="white" />
        <Text style={styles.shareButtonText}>記録をシェア</Text>
      </Pressable>

      {/* 今月のまとめ */}
      <Text style={styles.sectionTitle}>今月のまとめ</Text>
      <View style={styles.cardGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{studyDays}</Text>
          <Text style={styles.statLabel}>学習日数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{monthRecords.length}</Text>
          <Text style={styles.statLabel}>総記録数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.accentValue]}>{streak}</Text>
          <Text style={styles.statLabel}>現在の連続</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>最長連続</Text>
        </View>
      </View>

      {/* 最近7日間 */}
      <Text style={styles.sectionTitle}>最近7日間</Text>
      <View style={styles.card}>
        <View style={styles.weekRow}>
          {last7.map(({ date, hasStudy, isToday }, i) => (
            <View key={i} style={styles.dayItem}>
              <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                {DAY_LABELS[date.getDay()]}
              </Text>
              <View
                style={[
                  styles.dayDot,
                  hasStudy ? styles.dayDotStudied : styles.dayDotEmpty,
                  isToday && styles.dayDotToday,
                ]}
              />
              <Text style={[styles.dayDate, isToday && styles.dayDateToday]}>
                {date.getDate()}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ジャンル別 */}
      <Text style={styles.sectionTitle}>ジャンル別（全期間）</Text>
      <View style={styles.card}>
        {genreStats.length === 0 ? (
          <Text style={styles.emptyText}>まだ記録がありません</Text>
        ) : (
          genreStats.map(({ genre, count }) => (
            <View key={genre.id} style={styles.genreRow}>
              <View style={styles.genreNameRow}>
                <View
                  style={[styles.genreDot, { backgroundColor: genre.color }]}
                />
                <Text style={styles.genreName}>{genre.name}</Text>
              </View>
              <View style={styles.barRow}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: genre.color,
                        width: `${(count / maxCount) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.genreCount}>{count}件</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const card = {
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
} as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ff6347',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: '#ff6347',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  shareButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 8,
  },

  // --- 今月のまとめ ---
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },

  statCard: {
    ...card,
    width: '47.5%',
    alignItems: 'center',
    paddingVertical: 20,
  },

  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 38,
  },

  accentValue: {
    color: '#ff6347',
  },

  statLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginTop: 4,
  },

  // --- 最近7日間 ---
  card: {
    ...card,
    marginBottom: 8,
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dayItem: {
    alignItems: 'center',
    gap: 6,
  },

  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa',
  },

  dayLabelToday: {
    color: '#ff6347',
  },

  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  dayDotStudied: {
    backgroundColor: '#ff6347',
  },

  dayDotEmpty: {
    backgroundColor: '#f0f0f0',
  },

  dayDotToday: {
    borderWidth: 2,
    borderColor: '#ff6347',
  },

  dayDate: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },

  dayDateToday: {
    color: '#ff6347',
    fontWeight: '700',
  },

  // --- ジャンル別 ---
  emptyText: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 13,
    paddingVertical: 12,
  },

  genreRow: {
    marginBottom: 14,
  },

  genreNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },

  genreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  genreName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    borderRadius: 4,
  },

  genreCount: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    width: 30,
    textAlign: 'right',
  },
});
