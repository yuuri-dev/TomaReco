import EditGenreModal from '@/components/Modal/EditGenreModal';
import ActionRow from '@/components/Settings/ActionRow';
import { useAppContext } from '@/context/AppContext';
import { Genre } from '@/type/genre';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const {
    genres,
    deleteAllData,
    deleteGenre,
    notificationEnabled,
    notificationTime,
    toggleNotification,
    updateNotificationTime,
  } = useAppContext();

  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  const handleReview = () => {
    const url = Platform.OS === 'ios'
      ? 'itms-apps://itunes.apple.com/app/id6760455427?action=write-review'
      : 'https://apps.apple.com/jp/app/tomareco/id6760455427';
    Linking.openURL(url);
  };

  const notifDate = new Date();
  notifDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* アプリについて */}
      <Text style={styles.sectionTitle}>アプリについて</Text>
      <View style={styles.card}>
        <ActionRow icon="timer-outline" iconColor="#ff6347" label="TomaReco" value="学習記録アプリ" />
        <Divider />
        <ActionRow icon="code-slash-outline" iconColor="#4a8fe8" label="バージョン" value="1.3" />
      </View>

      {/* ジャンル */}
      <Text style={styles.sectionTitle}>ジャンル</Text>
      <View style={[styles.card, styles.genreCard]}>
        {genres.length === 0 ? (
          <Text style={styles.emptyText}>ジャンルがありません</Text>
        ) : (
          genres.map((g, i) => (
            <View key={g.id}>
              <GenreRow genre={g} onEdit={() => setEditingGenre(g)} onDelete={() => deleteGenre(g.id)} />
              {i < genres.length - 1 && <Divider />}
            </View>
          ))
        )}
      </View>

      <EditGenreModal genre={editingGenre} onClose={() => setEditingGenre(null)} />

      {/* リマインダー */}
      <Text style={styles.sectionTitle}>リマインダー</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: '#ff634718' }]}>
            <Ionicons name="notifications-outline" size={18} color="#ff6347" />
          </View>
          <Text style={styles.rowLabel}>毎日リマインダー</Text>
          <Switch
            value={notificationEnabled}
            onValueChange={toggleNotification}
            trackColor={{ false: '#e0e0e0', true: '#ff6347' }}
            thumbColor="white"
          />
        </View>
        {notificationEnabled && (
          <>
            <Divider />
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#4a8fe818' }]}>
                <Ionicons name="time-outline" size={18} color="#4a8fe8" />
              </View>
              <Text style={styles.rowLabel}>通知時刻</Text>
              <DateTimePicker
                value={notifDate}
                mode="time"
                display="compact"
                onChange={(_, date) => { if (date) updateNotificationTime(date.getHours(), date.getMinutes()); }}
              />
            </View>
          </>
        )}
      </View>

      {/* ヘルプ */}
      <Text style={styles.sectionTitle}>ヘルプ</Text>
      <View style={styles.card}>
        <ActionRow icon="information-circle-outline" iconColor="#ff6347" label="初めての方へ" onPress={() => router.push('/onboarding?from=settings')} />
        <Divider />
        <ActionRow icon="star-outline" iconColor="#FFCC00" label="レビューを書く" onPress={handleReview} />
        <Divider />
        <ActionRow icon="mail-outline" iconColor="#4a8fe8" label="お問い合わせ" onPress={() => Linking.openURL('https://yuuri-dev.github.io/tomareco-lp/support')} />
      </View>

      {/* データ管理 */}
      <Text style={styles.sectionTitle}>データ管理</Text>
      <View style={styles.card}>
        <ActionRow icon="trash-outline" iconColor="#e05555" label="すべてのデータを削除" onPress={deleteAllData} danger />
      </View>

      <Text style={styles.footer}>記録はすべて端末内に保存されています</Text>

    </ScrollView>
  );
}

function GenreRow({ genre, onEdit, onDelete }: { genre: Genre; onEdit: () => void; onDelete: () => void }) {
  return (
    <View style={styles.genreRow}>
      <View style={[styles.genreColor, { backgroundColor: genre.color }]} />
      <Text style={styles.genreName}>{genre.name}</Text>
      <View style={styles.genreActions}>
        <Pressable style={styles.genreActionBtn} onPress={onEdit} hitSlop={8}>
          <Ionicons name="pencil-outline" size={16} color="#888" />
        </Pressable>
        <Pressable style={styles.genreActionBtn} onPress={onDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={16} color="#e05555" />
        </Pressable>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
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

  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  genreCard: { overflow: 'visible' },

  divider: { height: 1, backgroundColor: '#f5f5f5', marginLeft: 52 },

  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  rowLabel: { flex: 1, fontSize: 15, color: '#1a1a1a', fontWeight: '500' },

  genreRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  genreColor: { width: 32, height: 32, borderRadius: 8 },
  genreName: { flex: 1, fontSize: 15, color: '#1a1a1a', fontWeight: '500' },
  genreActions: { flexDirection: 'row', gap: 4 },
  genreActionBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },

  emptyText: { textAlign: 'center', color: '#bbb', fontSize: 13, paddingVertical: 16 },
  footer: { textAlign: 'center', fontSize: 12, color: '#bbb', marginTop: 8 },
});
