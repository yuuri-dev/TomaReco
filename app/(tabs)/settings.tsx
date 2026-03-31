import { useAppContext } from '@/context/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

type RowProps = {
  label: string;
  value?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
  onPress?: () => void;
  danger?: boolean;
};

function SettingRow({ label, value, icon, iconColor = '#888', onPress, danger }: RowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && onPress && styles.rowPressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.rowIconBox, { backgroundColor: `${iconColor}18` }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={[styles.rowLabel, danger && styles.dangerText]}>{label}</Text>
      {value ? (
        <Text style={styles.rowValue}>{value}</Text>
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={16} color="#ccc" />
      ) : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const {
    genres,
    deleteAllData,
    notificationEnabled,
    notificationTime,
    toggleNotification,
    updateNotificationTime,
  } = useAppContext();

  const notifDate = new Date();
  notifDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* アプリについて */}
      <Text style={styles.sectionTitle}>アプリについて</Text>
      <View style={styles.card}>
        <SettingRow
          icon="timer-outline"
          iconColor="#ff6347"
          label="TomaReco"
          value="学習記録アプリ"
        />
        <View style={styles.divider} />
        <SettingRow
          icon="code-slash-outline"
          iconColor="#4a8fe8"
          label="バージョン"
          value="1.0.0"
        />
      </View>

      {/* ジャンル */}
      <Text style={styles.sectionTitle}>ジャンル</Text>
      <View style={styles.card}>
        {genres.map((g, i) => (
          <View key={g.id}>
            <View style={styles.genreRow}>
              <View style={[styles.genreColor, { backgroundColor: g.color }]} />
              <Text style={styles.genreName}>{g.name}</Text>
            </View>
            {i < genres.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
        {genres.length === 0 && (
          <Text style={styles.emptyText}>ジャンルがありません</Text>
        )}
      </View>

      {/* リマインダー */}
      <Text style={styles.sectionTitle}>リマインダー</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.rowIconBox, { backgroundColor: '#ff634718' }]}>
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
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={[styles.rowIconBox, { backgroundColor: '#4a8fe818' }]}>
                <Ionicons name="time-outline" size={18} color="#4a8fe8" />
              </View>
              <Text style={styles.rowLabel}>通知時刻</Text>
              <DateTimePicker
                value={notifDate}
                mode="time"
                display="compact"
                onChange={(_, date) => {
                  if (date) {
                    updateNotificationTime(date.getHours(), date.getMinutes());
                  }
                }}
              />
            </View>
          </>
        )}
      </View>

      {/* データ管理 */}
      <Text style={styles.sectionTitle}>データ管理</Text>
      <View style={styles.card}>
        <SettingRow
          icon="trash-outline"
          iconColor="#e05555"
          label="すべてのデータを削除"
          onPress={deleteAllData}
          danger
        />
      </View>

      <Text style={styles.footer}>
        記録はすべて端末内に保存されています
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
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

  divider: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginLeft: 52,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },

  rowPressed: {
    backgroundColor: '#fafafa',
  },

  rowIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },

  rowValue: {
    fontSize: 14,
    color: '#aaa',
  },

  dangerText: {
    color: '#e05555',
  },

  genreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },

  genreColor: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },

  genreName: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },

  emptyText: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 13,
    paddingVertical: 16,
  },

  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#bbb',
    marginTop: 8,
  },
});
