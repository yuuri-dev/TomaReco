import { Genre } from '@/type/genre';
import { Record } from '@/type/record';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  records: Record[];
  genres: Genre[];
  year: number;
  month: number;
  selectedDay: number | null;
  deleteRecord: (r:Record) => void;
};

export default function RecordList({
  records,
  genres,
  year,
  month,
  selectedDay,
  deleteRecord,
}: Props) {
  if (!selectedDay) return null;

  const dayRecords = records.filter(
    (r) => r.year === year && r.month === month && r.day === selectedDay
  );

  return (
    <View style={styles.log}>
      <Text style={styles.logTitle}>{year}年{month+1}月{selectedDay}日の学習</Text>

      {dayRecords.length === 0 ? (
        <Text style={styles.emptyText}>まだ記録がありません </Text>
      ) : (
        dayRecords.map((r) => {
          const genre = genres.find((g) => g.id === r.genreId);

          return (
            <Pressable
              key={r.id}
              style={styles.recordCard}
              onLongPress={() => deleteRecord(r)}
            >
              <View
                style={[
                  styles.genreTag,
                  { backgroundColor: genre?.color || '#ccc' },
                ]}
              >
                <Text style={styles.genreText}>{genre?.name}</Text>
              </View>

              <Text style={styles.recordTitle}>{r.title}</Text>
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  log: {
    marginTop: 20,
    width: '90%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  logTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  recordCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  genreTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },

  genreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  recordTitle: {
    fontSize: 14,
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
});
