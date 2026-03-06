import { View, Text, StyleSheet } from 'react-native';

type Genre = {
  id: string;
  name: string;
  color: string;
};

type Record = {
  year: number;
  month: number;
  day: number;
  title: string;
  genreId: string;
};

type Props = {
  records: Record[];
  genres: Genre[];
  year: number;
  month: number;
  selectedDay: number | null;
};

export default function RecordList({
  records,
  genres,
  year,
  month,
  selectedDay,
}: Props) {
  if (!selectedDay) return null;

  const dayRecords = records.filter(
    (r) => r.year === year && r.month === month && r.day === selectedDay
  );

  return (
    <View style={styles.log}>
      <Text style={styles.logTitle}>{selectedDay}日のログ</Text>

      {dayRecords.map((r, i) => {
        const genre = genres.find((g) => g.id === r.genreId);

        return (
          <View key={i} style={styles.recordCard}>
            <View
              style={[
                styles.genreTag,
                { backgroundColor: genre?.color || '#ccc' },
              ]}
            >
              <Text style={styles.genreText}>{genre?.name}</Text>
            </View>

            <Text style={styles.recordTitle}>{r.title}</Text>
          </View>
        );
      })}
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
});
