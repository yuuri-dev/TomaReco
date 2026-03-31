import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function RecordList() {
  const { records, genres, year, month, selectedDay, deleteRecord } = useAppContext();
  if (!selectedDay) return null;

  const dayRecords = records.filter(
    (r) => r.year === year && r.month === month && r.day === selectedDay
  );

  return (
    <View style={styles.container}>
      <Text style={styles.logTitle}>
        {month + 1}月{selectedDay}日の学習
      </Text>

      {dayRecords.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="book-outline" size={28} color="#ccc" />
          <Text style={styles.emptyText}>記録がありません</Text>
        </View>
      ) : (
        dayRecords.map((r) => {
          const genre = genres.find((g) => g.id === r.genreId);

          return (
            <Pressable
              key={r.id}
              style={[styles.recordCard, { borderLeftColor: genre?.color || '#ddd' }]}
              onLongPress={() => deleteRecord(r)}
            >
              <Text style={styles.recordTitle}>{r.title}</Text>
              {genre && (
                <Text style={[styles.genreLabel, { color: genre.color }]}>
                  {genre.name}
                </Text>
              )}
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  logTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  recordCard: {
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },

  recordTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },

  genreLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },

  emptyText: {
    color: '#bbb',
    fontSize: 13,
  },
});
