import AdBanner from '@/components/Ads/BannerAd';
import ShareCard from '@/components/Share/ShareCard';
import GenreBarChart from '@/components/Stats/GenreBarChart';
import PieChart, { GenreStat } from '@/components/Stats/PieChart';
import WeeklyView from '@/components/Stats/WeeklyView';
import { useAppContext } from '@/context/AppContext';
import { useShare } from '@/hooks/useShare';
import { calculateLongestStreak } from '@/utils/stats';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ViewShot from 'react-native-view-shot';

export default function StatsScreen() {
  const { records, genres, streak } = useAppContext();
  const { cardRef, shareCard } = useShare(streak);
  const [showPieModal, setShowPieModal] = useState(false);
  const [summaryTab, setSummaryTab] = useState<'month' | 'all'>('month');

  const today = useMemo(() => new Date(), []);

  const monthRecords = useMemo(
    () => records.filter((r) => r.year === today.getFullYear() && r.month === today.getMonth()),
    [records, today]
  );

  const studyDays = useMemo(() => new Set(monthRecords.map((r) => r.day)).size, [monthRecords]);

  const longestStreak = useMemo(() => calculateLongestStreak(records), [records]);

  const totalStudyDays = useMemo(
    () => new Set(records.map((r) => `${r.year}-${r.month}-${r.day}`)).size,
    [records]
  );

  const activeGenres = useMemo(
    () => genres.filter((g) => records.some((r) => r.genreId === g.id)).length,
    [genres, records]
  );

  const genreStats: GenreStat[] = useMemo(
    () =>
      genres
        .map((g) => ({ genre: g, count: records.filter((r) => r.genreId === g.id).length }))
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count),
    [genres, records]
  );

  const last7 = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - 6 + i);
        const hasStudy = records.some(
          (r) => r.year === d.getFullYear() && r.month === d.getMonth() && r.day === d.getDate()
        );
        return { date: d, hasStudy, isToday: i === 6 };
      }),
    [records, today]
  );

  return (
    <View style={styles.root}>
      <View style={styles.offscreen} pointerEvents="none">
        <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }}>
          <ShareCard streak={streak} longestStreak={longestStreak} totalRecords={records.length} />
        </ViewShot>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* まとめ */}
        <View style={styles.tabBar}>
          {(['month', 'all'] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabItem, summaryTab === tab && styles.tabItemActive]}
              onPress={() => setSummaryTab(tab)}
            >
              <Text style={[styles.tabText, summaryTab === tab && styles.tabTextActive]}>
                {tab === 'month' ? '今月' : '今まで'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          {summaryTab === 'month' ? (
            <>
              <StatRow label="学習日数" value={studyDays} unit="日" />
              <Divider />
              <StatRow label="記録数" value={monthRecords.length} unit="件" />
              <Divider />
              <StatRow label="現在の連続" value={streak} unit="日" accent />
              <Divider />
              <StatRow label="最長連続" value={longestStreak} unit="日" />
            </>
          ) : (
            <>
              <StatRow label="総学習日数" value={totalStudyDays} unit="日" />
              <Divider />
              <StatRow label="総記録数" value={records.length} unit="件" />
              <Divider />
              <StatRow label="最長連続" value={longestStreak} unit="日" />
              <Divider />
              <StatRow label="ジャンル数" value={activeGenres} unit="個" />
            </>
          )}
        </View>

        {/* シェア */}
        <Pressable style={styles.shareButton} onPress={shareCard}>
          <Ionicons name="share-social-outline" size={18} color="white" />
          <Text style={styles.shareButtonText}>記録をシェア</Text>
        </Pressable>

        {/* 最近7日間 */}
        <Text style={styles.sectionTitle}>最近7日間</Text>
        <View style={styles.card}>
          <WeeklyView days={last7} />
        </View>

        {/* ジャンル別 */}
        <Text style={styles.sectionTitle}>ジャンル別（全期間）</Text>
        <Pressable style={styles.card} onPress={() => genreStats.length > 0 && setShowPieModal(true)}>
          {genreStats.length === 0 ? (
            <Text style={styles.emptyText}>まだ記録がありません</Text>
          ) : (
            <GenreBarChart data={genreStats} />
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

function StatRow({ label, value, unit, accent }: { label: string; value: number; unit: string; accent?: boolean }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, accent && styles.accentValue]}>
        {value}<Text style={[styles.statUnit, accent && styles.accentValue]}>{unit}</Text>
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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
  root: { flex: 1 },

  offscreen: { position: 'absolute', top: -9999, left: -9999 },

  container: { flex: 1, backgroundColor: '#f5f5f5' },

  content: { padding: 16, paddingBottom: 40 },

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
  tabItem: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabItemActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: '#999' },
  tabTextActive: { color: '#1a1a1a' },

  card: { ...card, marginBottom: 8 },

  statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  divider: { height: 1, backgroundColor: '#f0f0f0' },
  statLabel: { fontSize: 15, fontWeight: '600', color: '#444' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
  statUnit: { fontSize: 13, fontWeight: '600', color: '#888' },
  accentValue: { color: '#ff6347' },

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
  shareButtonText: { color: 'white', fontSize: 15, fontWeight: '700' },

  emptyText: { textAlign: 'center', color: '#bbb', fontSize: 13, paddingVertical: 12 },

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
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
});
