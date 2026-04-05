import AdBanner from '@/components/Ads/BannerAd';
import ShareCard from '@/components/Share/ShareCard';
import { useAppContext } from '@/context/AppContext';
import { useShare } from '@/hooks/useShare';
import { Record } from '@/type/record';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const tomatoImg = require('@/assets/images/tomato.jpg');
const naegiImg = require('@/assets/images/naegi.jpg');
import { G, Path, Svg, Text as SvgText } from 'react-native-svg';
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

type GenreStat = { genre: { id: string; name: string; color: string }; count: number };

function PieChart({ data }: { data: GenreStat[] }) {
  const SIZE = 200;
  const R = 80;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const total = data.reduce((s, d) => s + d.count, 0);

  let cumAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.count / total) * 2 * Math.PI;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, start, end: cumAngle, angle };
  });

  function arcPath(start: number, end: number, r: number) {
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  return (
    <View style={pieStyles.wrapper}>
      <Svg width={SIZE} height={SIZE}>
        <G>
          {slices.map((s) => (
            <Path
              key={s.genre.id}
              d={arcPath(s.start, s.end, R)}
              fill={s.genre.color}
              stroke="white"
              strokeWidth={2}
            />
          ))}
          {slices.map((s) => {
            if (s.angle < 0.3) return null;
            const mid = s.start + s.angle / 2;
            const labelR = R * 0.65;
            return (
              <SvgText
                key={s.genre.id}
                x={cx + labelR * Math.cos(mid)}
                y={cy + labelR * Math.sin(mid)}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize={11}
                fontWeight="700"
              >
                {Math.round((s.count / total) * 100)}%
              </SvgText>
            );
          })}
        </G>
      </Svg>
      <View style={pieStyles.legend}>
        {data.map((d) => (
          <View key={d.genre.id} style={pieStyles.legendItem}>
            <View style={[pieStyles.legendDot, { backgroundColor: d.genre.color }]} />
            <Text style={pieStyles.legendLabel}>{d.genre.name}</Text>
            <Text style={pieStyles.legendCount}>{d.count}件</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const pieStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  legend: {
    width: '100%',
    gap: 8,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  legendCount: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
});

export default function StatsScreen() {
  const { records, genres, streak } = useAppContext();
  const { cardRef, shareCard } = useShare(streak);
  const [showPieModal, setShowPieModal] = useState(false);
  const [summaryTab, setSummaryTab] = useState<'month' | 'all'>('month');

  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth();

  const monthRecords = records.filter(
    (r) => r.year === thisYear && r.month === thisMonth
  );
  const studyDays = new Set(monthRecords.map((r) => r.day)).size;
  const longestStreak = calculateLongestStreak(records);

  const totalStudyDays = new Set(
    records.map((r) => `${r.year}-${r.month}-${r.day}`)
  ).size;
  const activeGenres = genres.filter((g) =>
    records.some((r) => r.genreId === g.id)
  ).length;

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
    <View style={{ flex: 1 }}>
      <View style={styles.offscreen} pointerEvents="none">
        <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }}>
          <ShareCard
            streak={streak}
            longestStreak={longestStreak}
            totalRecords={records.length}
          />
        </ViewShot>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* まとめ タブ切り替え */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabItem, summaryTab === 'month' && styles.tabItemActive]}
            onPress={() => setSummaryTab('month')}
          >
            <Text style={[styles.tabText, summaryTab === 'month' && styles.tabTextActive]}>今月</Text>
          </Pressable>
          <Pressable
            style={[styles.tabItem, summaryTab === 'all' && styles.tabItemActive]}
            onPress={() => setSummaryTab('all')}
          >
            <Text style={[styles.tabText, summaryTab === 'all' && styles.tabTextActive]}>今まで</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {summaryTab === 'month' ? (
            <>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>学習日数</Text>
                <Text style={styles.statValue}>{studyDays}<Text style={styles.statUnit}>日</Text></Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>記録数</Text>
                <Text style={styles.statValue}>{monthRecords.length}<Text style={styles.statUnit}>件</Text></Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>現在の連続</Text>
                <Text style={[styles.statValue, styles.accentValue]}>{streak}<Text style={[styles.statUnit, styles.accentValue]}>日</Text></Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>最長連続</Text>
                <Text style={styles.statValue}>{longestStreak}<Text style={styles.statUnit}>日</Text></Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>総学習日数</Text>
                <Text style={styles.statValue}>{totalStudyDays}<Text style={styles.statUnit}>日</Text></Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>総記録数</Text>
                <Text style={styles.statValue}>{records.length}<Text style={styles.statUnit}>件</Text></Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>最長連続</Text>
                <Text style={styles.statValue}>{longestStreak}<Text style={styles.statUnit}>日</Text></Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>ジャンル数</Text>
                <Text style={styles.statValue}>{activeGenres}<Text style={styles.statUnit}>個</Text></Text>
              </View>
            </>
          )}
        </View>

        {/* シェアボタン */}
        <Pressable style={styles.shareButton} onPress={shareCard}>
          <Ionicons name="share-social-outline" size={18} color="white" />
          <Text style={styles.shareButtonText}>記録をシェア</Text>
        </Pressable>

        {/* 最近7日間 */}
        <Text style={styles.sectionTitle}>最近7日間</Text>
        <View style={styles.card}>
          <View style={styles.weekRow}>
            {last7.map(({ date, hasStudy, isToday }, i) => (
              <View key={i} style={styles.dayItem}>
                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                  {DAY_LABELS[date.getDay()]}
                </Text>
                <Image
                  source={hasStudy ? tomatoImg : naegiImg}
                  style={[styles.dayImg, !hasStudy && styles.dayImgNaegi]}
                />
                <Text style={[styles.dayDate, isToday && styles.dayDateToday]}>
                  {date.getDate()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ジャンル別（タップで円グラフ表示） */}
        <Text style={styles.sectionTitle}>ジャンル別（全期間）</Text>
        <Pressable style={styles.card} onPress={() => genreStats.length > 0 && setShowPieModal(true)}>
          {genreStats.length === 0 ? (
            <Text style={styles.emptyText}>まだ記録がありません</Text>
          ) : (
            <>
              {genreStats.map(({ genre, count }) => (
                <View key={genre.id} style={styles.genreRow}>
                  <View style={styles.genreNameRow}>
                    <View style={[styles.genreDot, { backgroundColor: genre.color }]} />
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
              ))}
              <View style={styles.tapHint}>
                <Ionicons name="pie-chart-outline" size={13} color="#ccc" />
                <Text style={styles.tapHintText}>タップで円グラフ</Text>
              </View>
            </>
          )}
        </Pressable>
      </ScrollView>

      <AdBanner />

      {/* 円グラフモーダル */}
      <Modal visible={showPieModal} transparent animationType="fade" onRequestClose={() => setShowPieModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowPieModal(false)} />
          <View style={styles.modalDialog}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ジャンル別（全期間）</Text>
              <Pressable onPress={() => setShowPieModal(false)} hitSlop={12}>
                <Ionicons name="close" size={22} color="#aaa" />
              </Pressable>
            </View>
            <PieChart data={genreStats} />
          </View>
        </View>
      </Modal>
    </View>
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

  offscreen: {
    position: 'absolute',
    top: -9999,
    left: -9999,
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

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#efefef',
    borderRadius: 12,
    padding: 3,
    marginBottom: 10,
  },

  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },

  tabItemActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },

  tabTextActive: {
    color: '#1a1a1a',
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },

  statLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },

  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
  },

  statUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },

  accentValue: {
    color: '#ff6347',
  },

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

  dayImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  dayImgNaegi: {
    opacity: 0.5,
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

  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
  },

  tapHintText: {
    fontSize: 11,
    color: '#ccc',
    fontWeight: '500',
  },

  // --- 円グラフモーダル ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  modalDialog: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
});
