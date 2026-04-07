import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { GenreStat } from './PieChart';

export default function GenreBarChart({ data }: { data: GenreStat[] }) {
  const maxCount = data[0]?.count ?? 1;

  return (
    <>
      {data.map(({ genre, count }) => (
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
                  { backgroundColor: genre.color, width: `${(count / maxCount) * 100}%` },
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
  );
}

const styles = StyleSheet.create({
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
});
